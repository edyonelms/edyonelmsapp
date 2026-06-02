import apiClient from './apiClient';
import moment from 'moment';

// Types matching the API response
export interface ApiEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  is_all_day: boolean;
  event_type: string;
  color: string;
  location: string | null;
  academic_details: string | null;
  created_at: string;
  updated_at: string;
}

// Map API event type to your FilterType
export const mapEventType = (eventType: string): 'Holiday' | 'Exam' | 'Event' | 'Assignment' => {
  switch (eventType.toLowerCase()) {
    case 'holiday':
      return 'Holiday';
    case 'exam':
      return 'Exam';
    case 'assignment':
      return 'Assignment';
    default:
      return 'Event';
  }
};

// Map API event to your CalEvent format
export const mapApiEventToCalEvent = (apiEvent: ApiEvent): any => {
  console.log('[calendarApi] Mapping event:', apiEvent.id, apiEvent.title);
  
  let timeDisplay: string | undefined;
  if (apiEvent.is_all_day) {
    timeDisplay = 'All Day';
  } else if (apiEvent.start_time && apiEvent.end_time) {
    timeDisplay = `${apiEvent.start_time} - ${apiEvent.end_time}`;
  } else if (apiEvent.start_time) {
    timeDisplay = apiEvent.start_time;
  }

  return {
    id: String(apiEvent.id),
    date: apiEvent.date,
    title: apiEvent.title,
    description: apiEvent.description || 'No description available',
    type: mapEventType(apiEvent.event_type),
    time: timeDisplay,
    location: apiEvent.location,
    color: apiEvent.color,
    isAllDay: apiEvent.is_all_day,
  };
};

// POST /calendar/events - Use POST method instead of GET
export const getCalendarEvents = async (
  startDate?: string,
  endDate?: string,
  eventType?: string,
  perPage: number = 50
): Promise<ApiEvent[]> => {
  console.log('[getCalendarEvents] Fetching calendar events with POST...');
  
  try {
    // Create request body
    const requestBody: any = {
      per_page: perPage,
    };
    if (startDate) requestBody.start_date = startDate;
    if (endDate) requestBody.end_date = endDate;
    if (eventType) requestBody.event_type = eventType;
    
    console.log('[getCalendarEvents] Request body:', JSON.stringify(requestBody, null, 2));
    
    // Use POST method
    const { data } = await apiClient.post('/calendar/events', requestBody);
    
    console.log('[getCalendarEvents] Response status:', data?.status_code);
    console.log('[getCalendarEvents] Events count:', data?.data?.events?.length || 0);
    
    if (data?.data?.events && Array.isArray(data.data.events)) {
      return data.data.events;
    }
    return [];
  } catch (error: any) {
    console.error('[getCalendarEvents] Error:', error?.message);
    throw error;
  }
};

// POST /calendar/events/today - Use POST method
export const getTodayEvents = async (): Promise<ApiEvent[]> => {
  console.log('[getTodayEvents] Fetching today\'s events with POST...');
  
  try {
    const { data } = await apiClient.post('/calendar/events/today');
    console.log('[getTodayEvents] Response status:', data?.status_code);
    console.log('[getTodayEvents] Events count:', data?.data?.events?.length || 0);
    
    if (data?.data?.events && Array.isArray(data.data.events)) {
      return data.data.events;
    }
    return [];
  } catch (error: any) {
    console.error('[getTodayEvents] Error:', error?.message);
    throw error;
  }
};