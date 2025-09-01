import type { Complaint, ComplaintFilters, ComplaintStats } from '@/types/complaint';

const API_BASE_URL = 'https://swarit-dashboard.onrender.com/api';

export const connectToMongoDB = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/test-connection`);
    const data = await response.json();
    return data.connected;
  } catch (error) {
    console.error("Backend connection failed:", error);
    throw error;
  }
};

export const getComplaints = async (filters?: ComplaintFilters): Promise<Complaint[]> => {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.departments?.length > 0) {
        params.append('departments', filters.departments.join(','));
      }
      if (filters.intents?.length > 0) {
        params.append('intents', filters.intents.join(','));
      }
      if (filters.severities?.length > 0) {
        params.append('severities', filters.severities.join(','));
      }
      if (filters.languages?.length > 0) {
        params.append('languages', filters.languages.join(','));
      }
      if (filters.dateRange?.from) {
        params.append('dateFrom', filters.dateRange.from.toISOString().split('T')[0]);
      }
      if (filters.dateRange?.to) {
        params.append('dateTo', filters.dateRange.to.toISOString().split('T')[0]);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
    }

    const url = `${API_BASE_URL}/complaints${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching complaints:", error);
    throw error;
  }
};

export const getComplaintStats = async (filters?: ComplaintFilters): Promise<ComplaintStats> => {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.departments?.length > 0) {
        params.append('departments', filters.departments.join(','));
      }
      if (filters.intents?.length > 0) {
        params.append('intents', filters.intents.join(','));
      }
      if (filters.severities?.length > 0) {
        params.append('severities', filters.severities.join(','));
      }
      if (filters.languages?.length > 0) {
        params.append('languages', filters.languages.join(','));
      }
      if (filters.dateRange?.from) {
        params.append('dateFrom', filters.dateRange.from.toISOString().split('T')[0]);
      }
      if (filters.dateRange?.to) {
        params.append('dateTo', filters.dateRange.to.toISOString().split('T')[0]);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
    }

    const url = `${API_BASE_URL}/stats${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};

export const isConnected = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
  } catch (error) {
    console.error("Backend not reachable:", error);
    return false;
  }
};

export const disconnect = async (): Promise<void> => {
  // No action needed for API version
  return Promise.resolve();
};
