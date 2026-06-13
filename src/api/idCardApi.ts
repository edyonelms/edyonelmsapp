import apiClient from './apiClient';

// Unwrap the standard { success, message, data } envelope.
const unwrap = (data: any) => data?.data ?? data;

export type IdRole = 'student' | 'teacher';

export interface IdCardField {
  label: string;
  value: string;
}

// Normalized shape the IDCardScreen renders — keeps the existing card layout
// (school band, photo, grid, back rows) but filled from the live API.
export interface IdCardData {
  role: IdRole;
  name: string;
  photo: string;
  idNo: string;
  validUpto: string;
  school: {
    name: string;
    address: string;
    phone: string | null;
  };
  grid: IdCardField[];
  back: IdCardField[];
}

// ─── Formatting helpers ────────────────────────────────────────────────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const fmtDate = (iso?: string | null): string => {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const [, y, mo, d] = m;
  return `${d} ${MONTHS[Number(mo) - 1] ?? mo} ${y}`;
};

const cap = (v?: string | null): string =>
  v ? v.charAt(0).toUpperCase() + v.slice(1) : '';

// Build a [{label,value}] list, dropping any entry whose value is empty.
const fields = (entries: [string, string | null | undefined][]): IdCardField[] =>
  entries
    .filter(([, v]) => v != null && String(v).trim() !== '')
    .map(([label, v]) => ({ label, value: String(v) }));

// Fall back to an initials avatar when the backend has no photo.
const avatar = (name: string): string =>
  `https://ui-avatars.com/api/?background=4F46E5&color=fff&size=128&name=${encodeURIComponent(name || 'User')}`;

// ─── Mappers ───────────────────────────────────────────────────────────────────
const mapStudent = (d: any): IdCardData => {
  const st = d.student ?? {};
  const org = d.organization ?? {};
  const klass = [st.standard, st.section].filter(Boolean).join(' — ');

  return {
    role: 'student',
    name: st.full_name || 'Student',
    photo: st.image_url || avatar(st.full_name),
    idNo: d.card_number || '—',
    validUpto: fmtDate(d.expiry_date),
    school: {
      name: org.name || 'School',
      address: org.address || '',
      phone: org.phone ?? null,
    },
    grid: fields([
      ['Class', klass],
      ['Roll No', st.roll_no],
      ['Admission No', st.admission_no],
      ['Date of Birth', fmtDate(st.dob)],
      ['Gender', cap(st.gender)],
      ['Status', cap(d.status)],
    ]),
    back: fields([
      ['Email', st.email],
      ['Contact', st.contact_number],
      ['Issue Date', fmtDate(d.issue_date)],
      ['Valid Upto', fmtDate(d.expiry_date)],
      ['Card No', d.card_number],
    ]),
  };
};

const mapTeacher = (d: any): IdCardData => {
  const t = d.teacher ?? {};
  const org = d.organization ?? {};
  const classes = Array.isArray(t.assigned_classes)
    ? t.assigned_classes.map((c: any) => c.display).filter(Boolean).join(', ')
    : '';
  const address = [t.address, t.city, t.state, t.pincode].filter(Boolean).join(', ');

  return {
    role: 'teacher',
    name: t.full_name || 'Teacher',
    photo: t.image_url || avatar(t.full_name),
    idNo: d.card_number || '—',
    validUpto: fmtDate(d.expiry_date),
    school: {
      name: org.name || 'School',
      address: org.address || '',
      phone: org.phone ?? null,
    },
    grid: fields([
      ['Employee ID', t.employee_id],
      ['Qualification', t.qualification],
      ['Joining Date', fmtDate(t.date_of_joining)],
      ['Classes', classes],
      ['Phone', t.phone],
      ['Status', cap(d.status)],
    ]),
    back: fields([
      ['Email', t.email],
      ['Address', address],
      ['Issue Date', fmtDate(d.issue_date)],
      ['Valid Upto', fmtDate(d.expiry_date)],
      ['Card No', d.card_number],
    ]),
  };
};

// ─── Endpoints ─────────────────────────────────────────────────────────────────
export const getIdCard = async (role: IdRole): Promise<IdCardData> => {
  const { data } = await apiClient.get(`/id-card/${role}`);
  const d = unwrap(data);
  return role === 'teacher' ? mapTeacher(d) : mapStudent(d);
};

// ─── Error → friendly message ──────────────────────────────────────────────────
export const idCardErrorMessage = (e: any): string => {
  const status = e?.response?.status;
  const serverMsg = e?.response?.data?.message;
  if (status === 401) return 'Your session has expired. Please log in again.';
  if (status === 403) return serverMsg || 'You are not allowed to view this ID card.';
  if (status === 404) return serverMsg || 'No active ID card found for your account.';
  if (e?.message === 'Network Error' || !e?.response) {
    return 'No internet connection. Check your network and try again.';
  }
  if (status >= 500) return serverMsg || 'The server ran into a problem. Please try again.';
  return serverMsg || 'Something went wrong. Please try again.';
};
