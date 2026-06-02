import apiClient from './apiClient';

// Types
export interface Subject {
  id: number;
  name: string;
  code: string;
  image: string;
}

export interface Instructor {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  employee_id: string;
  subjects: Subject[];
}

export interface InstructorDetailResponse {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    employee_id: string;
    subjects: Subject[];
    qualification?: string;
    phone?: string;
    experience?: string;
    bio?: string;
  };
}

// GET /instructors - Fetch all instructors
export const getInstructors = async (per_page: number = 20): Promise<Instructor[]> => {
  console.log('[getInstructors] Fetching instructors with per_page:', per_page);
  
  const { data } = await apiClient.get('/instructors', {
    params: { per_page },
  });
  
  console.log('[getInstructors] Response:', JSON.stringify(data, null, 2));
  
  // Extract items from response
  if (data?.data?.items && Array.isArray(data.data.items)) {
    return data.data.items;
  } else if (data?.data && Array.isArray(data.data)) {
    return data.data;
  } else if (Array.isArray(data)) {
    return data;
  }
  
  return [];
};

// GET /instructors/{id} - Fetch single instructor details
export const getInstructorDetails = async (id: number): Promise<any> => {
  console.log('[getInstructorDetails] Fetching instructor details for id:', id);
  
  const { data } = await apiClient.get(`/instructors/${id}`);
  
  console.log('[getInstructorDetails] Response:', JSON.stringify(data, null, 2));
  
  return data;
};