import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util';
import apiClient from './apiClient';

const unwrap = (data: any) => data?.data ?? data;
const unwrapList = (data: any): any[] => {
  const d = data?.data ?? data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.data)) return d.data;
  return [];
};

// ─── Types (mirror v1 ReportCardController) ─────────────────────────────────────
export interface ReportCardListItem {
  id: number;
  academic_year: string | null;
  class: string | null;
  issued_at: string | null;
  issued_by: string | null;
  status: string;
}

export interface ReportSubject {
  subject_id: number | null;
  subject: string | null;
  subject_code: string | null;
  obtained: number;
  total: number;
  percentage: number | null;
  grade: string | null;
}

export interface GradeBand {
  grade: string;
  min: number;
  max: number;
  remark: string;
}

export interface ReportCardDetail {
  id: number;
  title: string;
  academic_year: string | null;
  class: string | null;
  issued_at: string | null;
  issued_by: string | null;
  status: string;
  student: {
    full_name: string | null;
    roll_no: string | null;
    admission_no: string | null;
    image_url: string | null;
  };
  summary: {
    total_obtained: number;
    total_max: number;
    percentage: number | null;
    grade: string | null;
    grade_remark: string | null;
    rank: number | null;
    rank_total: number;
    result: string | null;
  };
  subjects: ReportSubject[];
  results: any[];
  grading_scale: GradeBand[];
  pdf_url: string;
}

// ─── Endpoints ──────────────────────────────────────────────────────────────────

/** GET /report-card — the student's report cards, latest first. */
export const getReportCards = async (): Promise<ReportCardListItem[]> => {
  const { data } = await apiClient.get('/report-card', { params: { per_page: 20 } });
  return unwrapList(data) as ReportCardListItem[];
};

/** GET /report-card/{id} — full annual report card with summary + grading. */
export const getReportCard = async (id: number | string): Promise<ReportCardDetail> => {
  const { data } = await apiClient.get(`/report-card/${id}`);
  return unwrap(data) as ReportCardDetail;
};

export const isReportCardMissing = (e: any): boolean => e?.response?.status === 404;

// Sanctum bearer header for the in-app PDF reader / downloader.
export const authHeader = async (): Promise<Record<string, string>> => {
  const token = await AsyncStorage.getItem('auth_token');
  return {
    Accept: 'application/pdf',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Download the report-card PDF to the device.
 *  • Android → system DownloadManager (shows in the notification tray)
 *  • iOS     → saves to the document dir and opens the share/preview sheet
 */
export const downloadReportCardPdf = async (
  pdfUrl: string,
  fileName: string,
): Promise<string> => {
  const headers = await authHeader();
  const { config, fs, ios } = ReactNativeBlobUtil;
  const safeName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;

  if (Platform.OS === 'android') {
    const res = await config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: safeName,
        description: 'Report card',
        mime: 'application/pdf',
        mediaScannable: true,
        path: `${fs.dirs.DownloadDir}/${safeName}`,
      },
    }).fetch('GET', pdfUrl, headers);
    return res.path();
  }

  const path = `${fs.dirs.DocumentDir}/${safeName}`;
  const res = await config({ fileCache: true, path }).fetch('GET', pdfUrl, headers);
  await ios.openDocument(res.path());
  return res.path();
};

// ─── Error → friendly message ───────────────────────────────────────────────────
export const reportCardErrorMessage = (e: any): string => {
  const status = e?.response?.status;
  const serverMsg = e?.response?.data?.message;
  if (status === 401) return 'Your session has expired. Please log in again.';
  if (status === 403) return serverMsg || 'Only students can view report cards.';
  if (status === 404) return serverMsg || 'No report card has been issued yet.';
  if (e?.message === 'Network Error' || !e?.response) {
    return 'No internet connection. Check your network and try again.';
  }
  if (status >= 500) return serverMsg || 'The server ran into a problem. Please try again.';
  return serverMsg || 'Something went wrong. Please try again.';
};
