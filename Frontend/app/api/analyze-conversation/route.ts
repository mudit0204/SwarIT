// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { NextRequest, NextResponse } from 'next/server';
// import { writeFile, mkdir } from 'fs/promises';
// import { join } from 'path';

// // Add here:
// function cleanRawAnalysis(raw: string) {
//   return raw.replace(/^```json\s*|\s*```$/g, '');
// }

// interface ConversationMessage {
//   id: string;
//   sender: 'user' | 'agent';
//   message: string;
//   timestamp: Date;
//   agentState?: string;
// }

// // Initialize Gemini AI
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { conversations, analysisType = 'complaint' }: { 
//       conversations: ConversationMessage[], 
//       analysisType?: 'complaint' | 'summary' 
//     } = body;

//     if (!process.env.GEMINI_API_KEY) {
//       return NextResponse.json(
//         { error: 'Gemini API key not configured' },
//         { status: 500 }
//       );
//     }

//     if (!conversations || conversations.length === 0) {
//       return NextResponse.json(
//         { error: 'No conversation data provided' },
//         { status: 400 }
//       );
//     }

//     // Format the conversation for analysis
//     const conversationText = conversations
//       .map((msg: any) => `${msg.sender.toUpperCase()}: ${msg.message}`)
//       .join('\n');

//     let prompt = '';
    
//     if (analysisType === 'complaint') {
//       prompt = `
// Analyze the following conversation briefly and return ONLY the required JSON.
// Keep responses short, precise, and to the point. 
// Do NOT include markdown, explanations, or extra commentary. 
// Use 1–2 short phrases per field only.
// Make Sure to include email and phone number in the summary

// Conversation:
// ${conversationText}

// Return JSON in this format:
// {
//   "summary": "Max 1–2 lines",
//   "complaints": [
//     {
//       "issue": "Short description",
//       "severity": "Low/Medium/High",
//       "category": "Technical/Service/Product/etc.",
//       "mentioned_at": "Approx position in conversation",
//       "resolution_status": "Resolved/Unresolved/Partially Resolved"
//     }
//   ],
//   "overall_sentiment": "Positive/Neutral/Negative",
//   "key_insights": ["3–4 short insights only"],
//   "recommended_actions": ["2–3 concise recommended actions"]
// }
// `;
//     } else if (analysisType === 'summary') {
//       prompt = `
// Summarize the following conversation very briefly. 
// Return ONLY valid JSON with a single key: "conversation_summary". 
// Do NOT include markdown, code blocks, raw_analysis, or any extra explanation. 
// Keep the summary to max 1–2 lines.

// Conversation:
// ${conversationText}

// Return JSON in this exact format:
// {
//   "conversation_summary": "Your short summary here"
// }
// `;
//     }

//     const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     // Try to parse as JSON, fallback to plain text if it fails
//     let analysisResult;
//     try {
//       analysisResult = JSON.parse(text);
//     } catch (parseError) {
//       analysisResult = {
//         raw_analysis: text,
//         error: 'Could not parse as JSON'
//       };
//     }

//     // Send raw_analysis to your backend API
//     if (analysisResult.raw_analysis) {
//       try {
//         await fetch('http://localhost:5000/api/summaries', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             raw_analysis: cleanRawAnalysis(
//               typeof analysisResult.raw_analysis === 'string'
//                 ? analysisResult.raw_analysis
//                 : JSON.stringify(analysisResult.raw_analysis)
//             ),
//             source: 'voice-assistant-app'
//           })
//         });
//       } catch (err) {
//         console.error('Failed to save summary to DB:', err);
//       }
//     }

//     // If this is a summary request, save it to a JSON file
//     if (analysisType === 'summary') {
//       try {
//         // Create summaries directory if it doesn't exist
//         const summariesDir = join(process.cwd(), 'public', 'summaries');
//         await mkdir(summariesDir, { recursive: true });

//         // Create filename with timestamp
//         const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//         const filename = `conversation-summary-${timestamp}.json`;
//         const filePath = join(summariesDir, filename);

//         // Prepare data to save
//         const summaryData = {
//           timestamp: new Date().toISOString(),
//           analysisType: 'summary',
//           conversationLength: conversations.length,
//           userMessages: conversations.filter(msg => msg.sender === 'user').length,
//           agentMessages: conversations.filter(msg => msg.sender === 'agent').length,
//           analysis: analysisResult,
//           originalConversation: conversations,
//           metadata: {
//             createdAt: new Date().toISOString(),
//             version: '1.0',
//             source: 'voice-assistant-app'
//           }
//         };

//         // Save to JSON file
//         await writeFile(filePath, JSON.stringify(summaryData, null, 2), 'utf8');
        
//         console.log(`📄 Summary saved to: ${filePath}`);
        
//         // Return response with file information
//         return NextResponse.json({
//           success: true,
//           analysis: analysisResult,
//           analysisType,
//           conversationLength: conversations.length,
//           timestamp: new Date().toISOString(),
//           savedToFile: {
//             filename,
//             path: `/summaries/${filename}`,
//             fullPath: filePath,
//             message: 'Summary has been saved to JSON file'
//           }
//         });

//       } catch (fileError) {
//         console.error('Failed to save summary to file:', fileError);
//         // Still return the analysis even if file saving fails
//         return NextResponse.json({
//           success: true,
//           analysis: analysisResult,
//           analysisType,
//           conversationLength: conversations.length,
//           timestamp: new Date().toISOString(),
//           fileError: 'Failed to save summary to file',
//           fileErrorDetails: fileError instanceof Error ? fileError.message : 'Unknown file error'
//         });
//       }
//     }

//     // For complaint analysis, return normally without saving to file
//     return NextResponse.json({
//       success: true,
//       analysis: analysisResult,
//       analysisType,
//       conversationLength: conversations.length,
//       timestamp: new Date().toISOString()
//     });

//   } catch (error) {
//     console.error('Error analyzing conversation:', error);
//     return NextResponse.json(
//       { 
//         error: 'Failed to analyze conversation',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     );
//   }
// }

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Helper: Clean markdown wrapping from AI response
function cleanRawAnalysis(raw: string) {
  return raw.replace(/^```json\s*|\s*```$/g, '');
}

interface ConversationMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: Date;
  agentState?: string;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversations, analysisType = 'complaint' }: { 
      conversations: ConversationMessage[], 
      analysisType?: 'complaint' | 'summary' 
    } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    if (!conversations || conversations.length === 0) {
      return NextResponse.json(
        { error: 'No conversation data provided' },
        { status: 400 }
      );
    }

    // Format the conversation for analysis
    const conversationText = conversations
      .map((msg: any) => `${msg.sender.toUpperCase()}: ${msg.message}`)
      .join('\n');

    let prompt = '';
    
    if (analysisType === 'complaint') {
      prompt = `
Analyze the following conversation and return ONLY the required JSON.
Do NOT include markdown, explanations, or extra commentary. 
Keep responses short, precise, and to the point. 

Conversation:
${conversationText}

Return JSON in this format:
{
  "summary": "Max 1–2 lines",
  "personal_info": {
    "name": "Extracted name if mentioned, else null",
    "email": "Extracted email if mentioned, else null",
    "phone": "Extracted phone if mentioned, else null",
    "location": "Extracted location if mentioned, else null"
  },
  "complaints": [
    {
      "issue": "Short description",
      "severity": "Low/Medium/High",
      "category": "Technical/Service/Product/etc.",
      "mentioned_at": "Approx position in conversation",
      "resolution_status": "Resolved/Unresolved/Partially Resolved"
    }
  ],
  "overall_sentiment": "Positive/Neutral/Negative",
  "key_insights": ["3–4 short insights only"],
  "recommended_actions": ["2–3 concise recommended actions"]
}
`;
    } else if (analysisType === 'summary') {
      prompt = `
Summarize the following conversation very briefly. 
The conversation is related to a complaint, so in addition to the summary, 
you MUST capture and return the user's personal information if mentioned. 

Mandatory fields to capture: email, phone number, address, and location. 
If a field is not explicitly mentioned, return null for that field.  

Return ONLY valid JSON in this format, no markdown, no explanations, no extra commentary:

{
  "conversation_summary": "Your short summary here (max 1–2 lines)",
  "personal_info": {
    "email": "Extracted email or null",
    "phone": "Extracted phone or null",
    "address": "Extracted address or null",
    "location": "Extracted location or null"
  }
}

Conversation:
${conversationText}
`;

    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse as JSON, fallback to plain text if it fails
    let analysisResult;
    try {
      analysisResult = JSON.parse(text);
    } catch (parseError) {
      analysisResult = {
        raw_analysis: text,
        error: 'Could not parse as JSON'
      };
    }

    // Send raw_analysis to your backend API
    if (analysisResult.raw_analysis) {
      try {
        await fetch('http://localhost:5000/api/summaries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            raw_analysis: cleanRawAnalysis(
              typeof analysisResult.raw_analysis === 'string'
                ? analysisResult.raw_analysis
                : JSON.stringify(analysisResult.raw_analysis)
            ),
            source: 'voice-assistant-app'
          })
        });
      } catch (err) {
        console.error('Failed to save summary to DB:', err);
      }
    }

    // If this is a summary request, save it to a JSON file
    if (analysisType === 'summary') {
      try {
        // Create summaries directory if it doesn't exist
        const summariesDir = join(process.cwd(), 'public', 'summaries');
        await mkdir(summariesDir, { recursive: true });

        // Create filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `conversation-summary-${timestamp}.json`;
        const filePath = join(summariesDir, filename);

        // Prepare data to save
        const summaryData = {
          timestamp: new Date().toISOString(),
          analysisType: 'summary',
          conversationLength: conversations.length,
          userMessages: conversations.filter(msg => msg.sender === 'user').length,
          agentMessages: conversations.filter(msg => msg.sender === 'agent').length,
          analysis: analysisResult,
          originalConversation: conversations,
          metadata: {
            createdAt: new Date().toISOString(),
            version: '1.0',
            source: 'voice-assistant-app'
          }
        };

        // Save to JSON file
        await writeFile(filePath, JSON.stringify(summaryData, null, 2), 'utf8');
        
        console.log(`📄 Summary saved to: ${filePath}`);
        
        // Return response with file information
        return NextResponse.json({
          success: true,
          analysis: analysisResult,
          analysisType,
          conversationLength: conversations.length,
          timestamp: new Date().toISOString(),
          savedToFile: {
            filename,
            path: `/summaries/${filename}`,
            fullPath: filePath,
            message: 'Summary has been saved to JSON file'
          }
        });

      } catch (fileError) {
        console.error('Failed to save summary to file:', fileError);
        // Still return the analysis even if file saving fails
        return NextResponse.json({
          success: true,
          analysis: analysisResult,
          analysisType,
          conversationLength: conversations.length,
          timestamp: new Date().toISOString(),
          fileError: 'Failed to save summary to file',
          fileErrorDetails: fileError instanceof Error ? fileError.message : 'Unknown file error'
        });
      }
    }

    // For complaint analysis, return normally without saving to file
    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      analysisType,
      conversationLength: conversations.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error analyzing conversation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze conversation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
