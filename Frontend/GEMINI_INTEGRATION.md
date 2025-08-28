# Voice Assistant - Gemini Integration

## Features Added

### 🤖 Gemini AI Analysis
- **Complaint Detection**: Analyzes conversations to detect user complaints, categorize them, and suggest actions
- **Conversation Summaries**: Generates comprehensive summaries of user-agent conversations
- **JSON File Storage**: Automatically saves summaries to JSON files for future reference

### 📁 File Structure
```
app/api/
├── analyze-conversation/route.ts  # Main Gemini analysis endpoint
└── summaries/route.ts            # List all saved summaries

components/
└── session-view.tsx              # Updated with analysis UI controls

public/summaries/                 # Auto-created directory for JSON files
└── conversation-summary-*.json   # Saved conversation summaries
```

### 🔧 Environment Variables
Make sure `.env.local` contains:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 🎯 Usage

#### During a Voice Session:
1. **Start a conversation** with the AI assistant
2. **Click "Analyze Complaints"** to detect issues in the conversation
3. **Click "Get Summary"** to generate and save a comprehensive summary
4. **Click "All Summaries"** to view all previously saved summaries in console

#### API Endpoints:

**POST /api/analyze-conversation**
```json
{
  "conversations": [
    {
      "id": "msg-1",
      "sender": "user",
      "message": "Hello",
      "timestamp": "2025-08-25T10:00:00Z"
    }
  ],
  "analysisType": "summary" // or "complaint"
}
```

**GET /api/summaries**
Returns list of all saved conversation summaries.

### 📊 Summary JSON Structure
```json
{
  "timestamp": "2025-08-25T10:00:00Z",
  "analysisType": "summary",
  "conversationLength": 10,
  "userMessages": 5,
  "agentMessages": 5,
  "analysis": {
    "conversation_summary": "Brief summary...",
    "main_topics": ["topic1", "topic2"],
    "user_intent": "What user wanted",
    "ai_helpfulness": "Assessment",
    "conversation_outcome": "Result",
    "duration_estimate": "5-10 minutes"
  },
  "originalConversation": [...],
  "metadata": {
    "createdAt": "2025-08-25T10:00:00Z",
    "version": "1.0",
    "source": "voice-assistant-app"
  }
}
```

### 🎨 UI Features
- **Real-time conversation tracking** with message counting
- **Analysis controls** in the header (desktop) and dropdown (mobile)
- **Visual feedback** showing analysis status and file save confirmation
- **Console logging** with detailed analysis results
- **File access information** with direct URLs to saved summaries

### 🔍 Console Output Examples

**Complaint Analysis:**
```
🚨 COMPLAINT ANALYSIS SUMMARY:
1. Poor audio quality [high]
   Category: technical
   Status: unresolved

😊 Overall Sentiment: frustrated

💡 Recommended Actions:
1. Check audio settings
2. Restart the application
```

**Summary Analysis:**
```
📊 CONVERSATION SUMMARY:
💬 Summary: User had technical issues...
🎯 Main Topics: ["audio", "troubleshooting"]
...

💾 SUMMARY SAVED TO FILE:
📄 Filename: conversation-summary-2025-08-25T10-00-00-000Z.json
🔗 Public URL: /summaries/conversation-summary-2025-08-25T10-00-00-000Z.json
```

### 🚀 Testing
1. Start the development server: `pnpm dev`
2. Open the application and start a voice session
3. Have a conversation with the AI
4. Use the analysis buttons to test the functionality
5. Check the console for detailed outputs
6. Verify JSON files are created in `public/summaries/`

### 🎯 Next Steps
- Add a dedicated summaries page to view saved analyses
- Implement summary search and filtering
- Add export functionality for multiple summaries
- Create analytics dashboard for conversation insights
