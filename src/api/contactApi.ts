import apiClient from './apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ContactPayload {
  subject: string;
  message: string;
  attachment?: { name: string; uri: string; type?: string } | null;
}

export interface ContactQuery {
  id: string | number;
  subject: string;
  message: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  created_at: string;
  admin_reply?: string | null;
  replied_at?: string | null;
}

export interface ContactListResponse {
  data: ContactQuery[];
}

// ════════════════════════════════════════════════════════════════════════════
//  STUDENT APIs
// ════════════════════════════════════════════════════════════════════════════

// POST /user/admin/contact - Send as JSON with correct field names
export const studentContactAdmin = async (payload: ContactPayload) => {
  const requestData = {
    topic: payload.subject,
    student_query: payload.message,
  };
  
  console.log('[studentContactAdmin] Sending JSON:', JSON.stringify(requestData, null, 2));
  
  const { data } = await apiClient.post('/user/admin/contact', requestData, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  console.log('[studentContactAdmin] Response:', JSON.stringify(data, null, 2));
  return data;
};

// GET /user/admin/contact-list
export const getStudentContactList = async (): Promise<any> => {
  const { data } = await apiClient.get('/user/admin/contact-list');
  console.log('[getStudentContactList] Response received');
  return data;
};

// POST /user/admin/contact-reply - This is a POST API to get reply
export const getStudentContactReply = async (contact_id: string | number) => {
  const requestData = {
    contact_id: contact_id,
  };
  console.log('[getStudentContactReply] Sending:', requestData);
  
  const { data } = await apiClient.post('/user/admin/contact-reply', requestData, {
    headers: { 'Content-Type': 'application/json' },
  });
  console.log('[getStudentContactReply] Response:', JSON.stringify(data, null, 2));
  return data;
};

// ════════════════════════════════════════════════════════════════════════════
//  TEACHER APIs
// ════════════════════════════════════════════════════════════════════════════

// POST /teacher/admin/contact
export const teacherContactAdmin = async (payload: ContactPayload) => {
  const requestData = {
    topic: payload.subject,
    student_query: payload.message,
  };
  
  console.log('[teacherContactAdmin] Sending JSON:', JSON.stringify(requestData, null, 2));
  
  const { data } = await apiClient.post('/teacher/admin/contact', requestData, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  console.log('[teacherContactAdmin] Response:', JSON.stringify(data, null, 2));
  return data;
};

// GET /teacher/admin/contact-list
export const getTeacherContactList = async (): Promise<any> => {
  const { data } = await apiClient.get('/teacher/admin/contact-list');
  console.log('[getTeacherContactList] Response received');
  return data;
};

// POST /teacher/admin/contact-reply - This is a POST API to get reply
export const getTeacherContactReply = async (contact_id: string | number) => {
  const requestData = {
    contact_id: contact_id,
  };
  console.log('[getTeacherContactReply] Sending:', requestData);
  
  const { data } = await apiClient.post('/teacher/admin/contact-reply', requestData, {
    headers: { 'Content-Type': 'application/json' },
  });
  console.log('[getTeacherContactReply] Response:', JSON.stringify(data, null, 2));
  return data;
};