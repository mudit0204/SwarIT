import { MongoClient } from 'mongodb';
import type { Complaint, ComplaintFilters, ComplaintStats } from '@/types/complaint';
import { format } from 'date-fns';

interface MongoConfig {
  uri: string;
  database: string;
  collection: string;
}

// 🔹 Hardcoded Mongo config
const config: MongoConfig = {
  uri: "mongodb+srv://prakharpatni321:StrongPassword123@municipalcluster.tt4pe9t.mongodb.net/?retryWrites=true&w=majority&appName=MunicipalCluster",
  database: "municipal_ai",
  collection: "complaints",
};

let client: MongoClient | null = null;

const getClient = async (): Promise<MongoClient> => {
  if (!client) {
    client = new MongoClient(config.uri);
    await client.connect();
  }
  return client;
};

export const connectToMongoDB = async (): Promise<boolean> => {
  try {
    // Test connection
    const testClient = new MongoClient(config.uri);
    await testClient.connect();
    await testClient.db(config.database).collection(config.collection).findOne({});
    await testClient.close();

    // Reset cached client
    if (client) {
      await client.close();
      client = null;
    }

    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export const getComplaints = async (filters?: ComplaintFilters): Promise<Complaint[]> => {
  const client = await getClient();
  const db = client.db(config.database);
  const collection = db.collection<Complaint>(config.collection);

  const query: any = {};

  if (filters) {
    if (filters.departments?.length > 0) {
      query.department = { $in: filters.departments };
    }
    if (filters.intents?.length > 0) {
      query.intent = { $in: filters.intents };
    }
    if (filters.severities?.length > 0) {
      query.severity = { $in: filters.severities };
    }
    if (filters.languages?.length > 0) {
      query.language = { $in: filters.languages };
    }
    if (filters.dateRange?.from || filters.dateRange?.to) {
      query.date = {};
      if (filters.dateRange.from) {
        query.date.$gte = format(filters.dateRange.from, "yyyy-MM-dd");
      }
      if (filters.dateRange.to) {
        query.date.$lte = format(filters.dateRange.to, "yyyy-MM-dd");
      }
    }
    if (filters.search) {
      query.$or = [
        { summary: { $regex: filters.search, $options: "i" } },
        { final_summary: { $regex: filters.search, $options: "i" } },
        { location: { $regex: filters.search, $options: "i" } },
        { name: { $regex: filters.search, $options: "i" } },
      ];
    }
  }

  return await collection.find(query).toArray();
};

export const getComplaintStats = async (filters?: ComplaintFilters): Promise<ComplaintStats> => {
  const complaints = await getComplaints(filters);
  const today = format(new Date(), "yyyy-MM-dd");

  const totalComplaints = complaints.length;
  const complaintsToday = complaints.filter((c) => c.date === today).length;
  const complaintsWithMissingFields = complaints.filter((c) => c.missing_fields?.length > 0).length;

  const countByField = (field: keyof Complaint) =>
    complaints.reduce<Record<string, number>>((acc, c) => {
      const key = c[field] as string;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const confidenceRanges = [
    { range: "0.0-0.2", min: 0, max: 0.2 },
    { range: "0.2-0.4", min: 0.2, max: 0.4 },
    { range: "0.4-0.6", min: 0.4, max: 0.6 },
    { range: "0.6-0.8", min: 0.6, max: 0.8 },
    { range: "0.8-1.0", min: 0.8, max: 1.0 },
  ];

  const confidenceScoreDistribution = confidenceRanges.map((range) => ({
    range: range.range,
    count: complaints.filter(
      (c) => c.confidence_score >= range.min && c.confidence_score < range.max
    ).length,
  }));

  const dateCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    dateCounts[c.date] = (dateCounts[c.date] || 0) + 1;
  });

  const complaintsOverTime = Object.entries(dateCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalComplaints,
    complaintsToday,
    complaintsWithMissingFields,
    departmentCounts: countByField("department"),
    intentCounts: countByField("intent"),
    severityCounts: countByField("severity"),
    languageCounts: countByField("language"),
    confidenceScoreDistribution,
    complaintsOverTime,
    locationCounts: countByField("location"),
  };
};

export const isConnected = (): boolean => !!client;

export const disconnect = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
  }
};
