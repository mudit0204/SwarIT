import type { Complaint, ComplaintFilters, ComplaintStats } from '@/types/complaint';
import { format, subDays, startOfDay, endOfDay, isAfter, isBefore, parseISO } from 'date-fns';

// Mock data generator
const generateMockComplaints = (): Complaint[] => {
  const departments = ['Customer Service', 'Technical Support', 'Billing', 'Sales', 'General'];
  const intents = ['Complaint', 'Inquiry', 'Request', 'Feedback', 'Bug Report'];
  const severities: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Italian'];
  const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
  const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'];

  const complaints: Complaint[] = [];
  
  for (let i = 0; i < 100; i++) {
    const date = format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd');
    const department = departments[Math.floor(Math.random() * departments.length)];
    const intent = intents[Math.floor(Math.random() * intents.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const language = languages[Math.floor(Math.random() * languages.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const name = names[Math.floor(Math.random() * names.length)];

    complaints.push({
      _id: `complaint_${i + 1}`,
      department,
      intent,
      summary: `Sample complaint ${i + 1} regarding ${department.toLowerCase()} issues`,
      severity,
      location,
      name,
      date,
      language,
      confidence_score: Math.random(),
      missing_fields: Math.random() > 0.7 ? ['email'] : [],
      final_summary: `Final summary for complaint ${i + 1}`,
      raw_transcript: `Raw transcript for complaint ${i + 1}...`
    });
  }

  return complaints;
};

const mockComplaints = generateMockComplaints();

export const getComplaints = async (filters?: ComplaintFilters): Promise<Complaint[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  let filteredComplaints = mockComplaints;

  if (filters) {
    if (filters.departments.length > 0) {
      filteredComplaints = filteredComplaints.filter(c => filters.departments.includes(c.department));
    }
    
    if (filters.intents.length > 0) {
      filteredComplaints = filteredComplaints.filter(c => filters.intents.includes(c.intent));
    }
    
    if (filters.severities.length > 0) {
      filteredComplaints = filteredComplaints.filter(c => filters.severities.includes(c.severity));
    }
    
    if (filters.languages.length > 0) {
      filteredComplaints = filteredComplaints.filter(c => filters.languages.includes(c.language));
    }
    
    if (filters.dateRange.from || filters.dateRange.to) {
      filteredComplaints = filteredComplaints.filter(c => {
        const complaintDate = parseISO(c.date);
        let withinRange = true;
        
        if (filters.dateRange.from) {
          withinRange = withinRange && !isBefore(complaintDate, startOfDay(filters.dateRange.from));
        }
        
        if (filters.dateRange.to) {
          withinRange = withinRange && !isAfter(complaintDate, endOfDay(filters.dateRange.to));
        }
        
        return withinRange;
      });
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredComplaints = filteredComplaints.filter(c => 
        c.summary.toLowerCase().includes(searchLower) ||
        c.final_summary.toLowerCase().includes(searchLower) ||
        c.location.toLowerCase().includes(searchLower) ||
        c.name.toLowerCase().includes(searchLower)
      );
    }
  }

  return filteredComplaints;
};

export const getComplaintStats = async (filters?: ComplaintFilters): Promise<ComplaintStats> => {
  const complaints = await getComplaints(filters);
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Calculate stats
  const totalComplaints = complaints.length;
  const complaintsToday = complaints.filter(c => c.date === today).length;
  const complaintsWithMissingFields = complaints.filter(c => c.missing_fields.length > 0).length;
  
  // Department counts
  const departmentCounts: Record<string, number> = {};
  complaints.forEach(c => {
    departmentCounts[c.department] = (departmentCounts[c.department] || 0) + 1;
  });
  
  // Intent counts
  const intentCounts: Record<string, number> = {};
  complaints.forEach(c => {
    intentCounts[c.intent] = (intentCounts[c.intent] || 0) + 1;
  });
  
  // Severity counts
  const severityCounts: Record<string, number> = {};
  complaints.forEach(c => {
    severityCounts[c.severity] = (severityCounts[c.severity] || 0) + 1;
  });
  
  // Language counts
  const languageCounts: Record<string, number> = {};
  complaints.forEach(c => {
    languageCounts[c.language] = (languageCounts[c.language] || 0) + 1;
  });
  
  // Location counts
  const locationCounts: Record<string, number> = {};
  complaints.forEach(c => {
    locationCounts[c.location] = (locationCounts[c.location] || 0) + 1;
  });
  
  // Confidence score distribution
  const confidenceRanges = [
    { range: '0.0-0.2', min: 0, max: 0.2 },
    { range: '0.2-0.4', min: 0.2, max: 0.4 },
    { range: '0.4-0.6', min: 0.4, max: 0.6 },
    { range: '0.6-0.8', min: 0.6, max: 0.8 },
    { range: '0.8-1.0', min: 0.8, max: 1.0 }
  ];
  
  const confidenceScoreDistribution = confidenceRanges.map(range => ({
    range: range.range,
    count: complaints.filter(c => c.confidence_score >= range.min && c.confidence_score < range.max).length
  }));
  
  // Complaints over time
  const dateCounts: Record<string, number> = {};
  complaints.forEach(c => {
    dateCounts[c.date] = (dateCounts[c.date] || 0) + 1;
  });
  
  const complaintsOverTime = Object.entries(dateCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  return {
    totalComplaints,
    complaintsToday,
    complaintsWithMissingFields,
    departmentCounts,
    intentCounts,
    severityCounts,
    languageCounts,
    confidenceScoreDistribution,
    complaintsOverTime,
    locationCounts
  };
};

export const isConnected = (): boolean => {
  return true; // Always connected in mock mode
};

export const connectToMongoDB = async (uri: string, database: string, collection: string): Promise<boolean> => {
  // Simulate connection delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};

export const disconnect = async (): Promise<void> => {
  // Mock disconnect
};