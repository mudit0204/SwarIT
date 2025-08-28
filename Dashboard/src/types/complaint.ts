export interface Complaint {
  _id: string;
  department: string;
  intent: string;
  summary: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  location: string;
  name: string;
  date: string;
  language: string;
  confidence_score: number;
  missing_fields: string[];
  final_summary: string;
  raw_transcript: string;
}

export interface ComplaintFilters {
  departments: string[];
  intents: string[];
  severities: string[];
  languages: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  search: string;
}

export interface ComplaintStats {
  totalComplaints: number;
  complaintsToday: number;
  complaintsWithMissingFields: number;
  departmentCounts: Record<string, number>;
  intentCounts: Record<string, number>;
  severityCounts: Record<string, number>;
  languageCounts: Record<string, number>;
  confidenceScoreDistribution: { range: string; count: number }[];
  complaintsOverTime: { date: string; count: number }[];
  locationCounts: Record<string, number>;
}