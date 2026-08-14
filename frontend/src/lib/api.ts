const getApiBaseUrl = (): string => {
  let url = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').trim();
  if (url.startsWith('ttps://')) {
    url = 'h' + url;
  } else if (url.startsWith('ttp://')) {
    url = 'h' + url;
  } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url.replace(/^\/+/, '')}`;
  }
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  return url;
};

const API_BASE_URL = getApiBaseUrl();

export interface Participant {
  id: number;
  meeting_id: number;
  display_name: string;
  joined_at: string;
}

export interface Meeting {
  id: number;
  meeting_code: string;
  title: string;
  description?: string;
  host_id: number;
  type: 'instant' | 'scheduled';
  scheduled_time?: string;
  duration_mins?: number;
  invite_link: string;
  status: 'upcoming' | 'live' | 'ended';
  created_at: string;
  participants: Participant[];
}

export interface JoinResponse {
  message: string;
  participant: Participant;
  meeting: Meeting;
}

export async function fetchUpcomingMeetings(): Promise<Meeting[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/meetings/upcoming`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch upcoming meetings');
    return await res.json();
  } catch (error) {
    console.error('Error fetching upcoming meetings:', error);
    return [];
  }
}

export async function fetchRecentMeetings(): Promise<Meeting[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/meetings/recent`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch recent meetings');
    return await res.json();
  } catch (error) {
    console.error('Error fetching recent meetings:', error);
    return [];
  }
}

export async function fetchMeetingDetails(meetingCode: string): Promise<Meeting | null> {
  try {
    const cleanCode = meetingCode.trim();
    const res = await fetch(`${API_BASE_URL}/meetings/${cleanCode}`, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Error ${res.status}: Failed to fetch meeting`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching meeting details:', error);
    return null;
  }
}

export async function createInstantMeeting(title: string = "Instant Meeting"): Promise<Meeting> {
  const res = await fetch(`${API_BASE_URL}/meetings/instant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Failed to create instant meeting');
  return await res.json();
}

export async function createScheduledMeeting(payload: {
  title: string;
  description?: string;
  scheduled_time: string;
  duration_mins: number;
}): Promise<Meeting> {
  const res = await fetch(`${API_BASE_URL}/meetings/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: 'Failed to schedule meeting' }));
    throw new Error(errData.detail || 'Failed to schedule meeting');
  }
  return await res.json();
}

export async function joinMeeting(meetingCode: string, displayName: string): Promise<JoinResponse> {
  const cleanCode = meetingCode.trim();
  const res = await fetch(`${API_BASE_URL}/meetings/${cleanCode}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ display_name: displayName.trim() }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: 'Failed to join meeting' }));
    throw new Error(errData.detail || 'Failed to join meeting');
  }
  return await res.json();
}

export async function endMeeting(meetingCode: string): Promise<boolean> {
  try {
    const cleanCode = meetingCode.trim();
    const res = await fetch(`${API_BASE_URL}/meetings/${cleanCode}/end`, {
      method: 'POST',
    });
    return res.ok;
  } catch (error) {
    console.error('Error ending meeting:', error);
    return false;
  }
}

export async function cancelMeeting(meetingCode: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/meetings/${meetingCode}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return false;
  }
}
