const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { format } = require('date-fns');                                     

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB configuration
const config = {
  uri: "mongodb+srv://prakharpatni321:StrongPassword123@municipalcluster.tt4pe9t.mongodb.net/?retryWrites=true&w=majority&appName=MunicipalCluster",
  database: "municipal_ai",
  collection: "complaints",
};

let client = null;

const getClient = async () => {
  if (!client) {
    client = new MongoClient(config.uri);
    await client.connect();
  }
  return client;
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Test MongoDB connection
app.get('/api/test-connection', async (req, res) => {
  try {
    const testClient = new MongoClient(config.uri);
    await testClient.connect();
    await testClient.db(config.database).collection(config.collection).findOne({});
    await testClient.close();
    res.json({ connected: true, message: 'MongoDB connection successful' });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    res.status(500).json({ connected: false, error: error.message });
  }
});

// Get complaints with optional filters
app.get('/api/complaints', async (req, res) => {
  try {
    const client = await getClient();
    const db = client.db(config.database);
    const collection = db.collection(config.collection);

    const query = {};
    
    // Parse query parameters for filters
    const { departments, intents, severities, languages, dateFrom, dateTo, search } = req.query;

    if (departments) {
      const departmentArray = departments.split(',');
      query.department = { $in: departmentArray };
    }
    
    if (intents) {
      const intentArray = intents.split(',');
      query.intent = { $in: intentArray };
    }
    
    if (severities) {
      const severityArray = severities.split(',');
      query.severity = { $in: severityArray };
    }
    
    if (languages) {
      const languageArray = languages.split(',');
      query.language = { $in: languageArray };
    }
    
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) {
        query.date.$gte = dateFrom;
      }
      if (dateTo) {
        query.date.$lte = dateTo;
      }
    }
    
    if (search) {
      query.$or = [
        { summary: { $regex: search, $options: "i" } },
        { final_summary: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    const complaints = await collection.find(query).toArray();
    res.json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get complaint statistics
app.get('/api/stats', async (req, res) => {
  try {
    const client = await getClient();
    const db = client.db(config.database);
    const collection = db.collection(config.collection);

    // Apply same filters as complaints endpoint
    const query = {};
    const { departments, intents, severities, languages, dateFrom, dateTo, search } = req.query;

    if (departments) {
      const departmentArray = departments.split(',');
      query.department = { $in: departmentArray };
    }
    
    if (intents) {
      const intentArray = intents.split(',');
      query.intent = { $in: intentArray };
    }
    
    if (severities) {
      const severityArray = severities.split(',');
      query.severity = { $in: severityArray };
    }
    
    if (languages) {
      const languageArray = languages.split(',');
      query.language = { $in: languageArray };
    }
    
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) {
        query.date.$gte = dateFrom;
      }
      if (dateTo) {
        query.date.$lte = dateTo;
      }
    }
    
    if (search) {
      query.$or = [
        { summary: { $regex: search, $options: "i" } },
        { final_summary: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    const complaints = await collection.find(query).toArray();
    const today = format(new Date(), "yyyy-MM-dd");

    const totalComplaints = complaints.length;
    const complaintsToday = complaints.filter((c) => c.date === today).length;
    const complaintsWithMissingFields = complaints.filter((c) => c.missing_fields?.length > 0).length;

    const countByField = (field) =>
      complaints.reduce((acc, c) => {
        const key = c[field];
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

    const dateCounts = {};
    complaints.forEach((c) => {
      dateCounts[c.date] = (dateCounts[c.date] || 0) + 1;
    });

    const complaintsOverTime = Object.entries(dateCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const stats = {
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

    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});
