import apiClient from './apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────
// Mirror of /api/v1/books payload — see BookController::formatBook on backend.
// The API auto-scopes by Sanctum token:
//   • student → books for their class + section
//   • teacher → books for the (class, subject) pairs they teach (via timetable)

export interface ApiBookRef {
  id: number;
  name: string;
}

export interface ApiBook {
  id: number;
  title: string;
  cover_url: string | null;
  logo_url:  string | null; // back-compat alias of cover_url
  pdf_url:   string | null;
  standard:  ApiBookRef | null;
  section:   ApiBookRef | null;
  subject:   ApiBookRef | null;
}

export interface BooksPageMeta {
  current_page: number;
  per_page:     number;
  total:        number;
  last_page:    number;
}

export interface GetBooksParams {
  per_page?:    number;
  standard_id?: number;
  section_id?:  number;
  subject_id?:  number;
  search?:      string;
}

export const getBooks = async (
  params: GetBooksParams = {},
): Promise<{ items: ApiBook[]; meta: BooksPageMeta | null }> => {
  const { data } = await apiClient.get('/books', { params });
  console.log('[getBooks] count:', Array.isArray(data?.data) ? data.data.length : 'n/a');
  return {
    items: (data?.data ?? []) as ApiBook[],
    meta:  (data?.meta ?? null) as BooksPageMeta | null,
  };
};

export const getBook = async (id: number): Promise<ApiBook | null> => {
  const { data } = await apiClient.get(`/books/${id}`);
  return (data?.data ?? null) as ApiBook | null;
};
