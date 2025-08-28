'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  type AgentState,
  type ReceivedChatMessage,
  useRoomContext,
  useVoiceAssistant,
} from '@livekit/components-react';
import { toastAlert } from '@/components/alert-toast';
import { AgentControlBar } from '@/components/livekit/agent-control-bar/agent-control-bar';
import { ChatEntry } from '@/components/livekit/chat/chat-entry';
import { ChatMessageView } from '@/components/livekit/chat/chat-message-view';
import { MediaTiles } from '@/components/livekit/media-tiles';
import useChatAndTranscription from '@/hooks/useChatAndTranscription';
import { useDebugMode } from '@/hooks/useDebug';
import type { AppConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Bot, MessageSquare, Mic } from 'lucide-react';

function isAgentAvailable(agentState: AgentState) {
  return agentState == 'listening' || agentState == 'thinking' || agentState == 'speaking';
}

interface ConversationMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: Date;
  agentState?: AgentState;
}

interface SessionViewProps {
  appConfig: AppConfig;
  disabled: boolean;
  sessionStarted: boolean;
}

export const SessionView = ({
  appConfig,
  disabled,
  sessionStarted,
  ref,
}: React.ComponentProps<'div'> & SessionViewProps) => {
  const { state: agentState } = useVoiceAssistant();
  const [chatOpen, setChatOpen] = useState(false);
  const { messages, send } = useChatAndTranscription();
  const room = useRoomContext();
  
  // Store conversation in an array
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const [showMobileAnalysis, setShowMobileAnalysis] = useState(false);

  useDebugMode({
    enabled: process.env.NODE_END !== 'production',
  });

  async function handleSendMessage(message: string) {
    // Add user message to conversation history
    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      message: message,
      timestamp: new Date(),
    };
    
    setConversationHistory(prev => {
      const newHistory = [...prev, userMessage];
      console.log('💬 Updated Conversation History:', newHistory);
      return newHistory;
    });
    
    await send(message);
  }

  // Function to analyze conversation with Gemini
  const analyzeConversationWithGemini = async (analysisType: 'complaint' | 'summary' = 'complaint') => {
    if (conversationHistory.length === 0) {
      console.log('⚠️ No conversation to analyze');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      console.log('🔍 Starting Gemini analysis...');
      console.log('📊 Analyzing', conversationHistory.length, 'messages');
      
      const response = await fetch('/api/analyze-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversations: conversationHistory,
          analysisType
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Analysis completed successfully!');
        console.log('🎯 Analysis Type:', result.analysisType);
        console.log('📋 Analysis Result:', result.analysis);
        
        if (analysisType === 'complaint') {
          console.log('\n🚨 COMPLAINT ANALYSIS SUMMARY:');
          if (result.analysis.complaints && result.analysis.complaints.length > 0) {
            result.analysis.complaints.forEach((complaint: any, index: number) => {
              console.log(`${index + 1}. ${complaint.issue} [${complaint.severity}]`);
              console.log(`   Category: ${complaint.category}`);
              console.log(`   Status: ${complaint.resolution_status}`);
            });
          } else {
            console.log('✅ No complaints detected in the conversation');
          }
          
          console.log(`\n😊 Overall Sentiment: ${result.analysis.overall_sentiment}`);
          
        if (result.analysis.recommended_actions) {
          console.log('\n💡 Recommended Actions:');
          result.analysis.recommended_actions.forEach((action: string, index: number) => {
            console.log(`${index + 1}. ${action}`);
          });
        }
      } else if (analysisType === 'summary') {
        console.log('\n📊 CONVERSATION SUMMARY:');
        console.log('💬 Summary:', result.analysis.conversation_summary);
        console.log('🎯 Main Topics:', result.analysis.main_topics);
        console.log('🤔 User Intent:', result.analysis.user_intent);
        console.log('🤝 AI Helpfulness:', result.analysis.ai_helpfulness);
        console.log('✅ Outcome:', result.analysis.conversation_outcome);
        console.log('⏱️ Duration:', result.analysis.duration_estimate);
        
        // Show file save information
        if (result.savedToFile) {
          console.log('\n💾 SUMMARY SAVED TO FILE:');
          console.log('📄 Filename:', result.savedToFile.filename);
          console.log('🔗 Public URL:', result.savedToFile.path);
          console.log('📁 Full Path:', result.savedToFile.fullPath);
          console.log('✨ Message:', result.savedToFile.message);
        }
      }
      
      setLastAnalysis(result);        // Save analysis to localStorage
        try {
          const analysisData = {
            timestamp: new Date().toISOString(),
            conversationLength: conversationHistory.length,
            analysis: result.analysis,
            type: analysisType
          };
          localStorage.setItem(`conversation_analysis_${Date.now()}`, JSON.stringify(analysisData));
          console.log('💾 Analysis saved to localStorage');
        } catch (error) {
          console.error('❌ Failed to save analysis to localStorage:', error);
        }
        
      } else {
        console.error('❌ Analysis failed:', result.error);
        if (result.details) {
          console.error('Details:', result.details);
        }
      }
      
    } catch (error) {
      console.error('❌ Error during analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Track all messages and update conversation history
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      const isFromUser = latestMessage.from?.isLocal ?? false;
      
      // Only add if it's not already in our conversation history
      setConversationHistory(prev => {
        const messageExists = prev.some(msg => 
          msg.message === latestMessage.message && 
          msg.sender === (isFromUser ? 'user' : 'agent')
        );
        
        if (!messageExists) {
          const conversationMessage: ConversationMessage = {
            id: latestMessage.id || `msg-${Date.now()}`,
            sender: isFromUser ? 'user' : 'agent',
            message: latestMessage.message,
            timestamp: new Date(latestMessage.timestamp || Date.now()),
            agentState: !isFromUser ? agentState : undefined,
          };
          
          const newHistory = [...prev, conversationMessage];
          
          // Log the conversation updates
          console.log('💬 Updated Conversation History:', newHistory);
          console.log('📊 Total Messages:', newHistory.length);
          console.log('👤 User Messages:', newHistory.filter(m => m.sender === 'user').length);
          console.log('🤖 Agent Messages:', newHistory.filter(m => m.sender === 'agent').length);
          
          // Log the full conversation in a readable format
          console.log('\n🗣️ FULL CONVERSATION:');
          newHistory.forEach((msg, index) => {
            const icon = msg.sender === 'user' ? '👤' : '🤖';
            const time = msg.timestamp.toLocaleTimeString();
            console.log(`${index + 1}. ${icon} [${time}] ${msg.sender.toUpperCase()}: ${msg.message}`);
          });
          console.log('\n');
          
          return newHistory;
        }
        
        return prev;
      });
    }
  }, [messages, agentState]); // Removed conversationHistory from dependencies

  // Log conversation history whenever session starts/ends
  useEffect(() => {
    if (sessionStarted) {
      console.log('🚀 Session Started - Conversation tracking initialized');
      setConversationHistory([]);
    }
  }, [sessionStarted]); // Only depend on sessionStarted

  // Separate effect to log when conversation ends
  useEffect(() => {
    return () => {
      // This will run when component unmounts or session ends
      if (conversationHistory.length > 0) {
        console.log('🏁 Session Ended - Final conversation history:', conversationHistory);
      }
    };
  }, []); // Empty dependency array

    // Automatically analyze and save summary when session ends
    useEffect(() => {
      if (!sessionStarted && conversationHistory.length > 0) {
        // Only run once per session end
        (async () => {
          setIsAnalyzing(true);
          try {
            const response = await fetch('/api/analyze-conversation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                conversations: conversationHistory,
                analysisType: 'summary',
              }),
            });
            const result = await response.json();
            if (result.success) {
              setLastAnalysis(result);
              console.log('✅ Auto-summary saved:', result.savedToFile);
            } else {
              console.error('❌ Auto-summary failed:', result.error);
            }
          } catch (error) {
            console.error('❌ Error during auto-summary:', error);
          } finally {
            setIsAnalyzing(false);
          }
        })();
      }
    }, [sessionStarted, conversationHistory]);

  // Make export function available globally for debugging
  useEffect(() => {
    const exportConversation = () => {
      setConversationHistory(currentHistory => {
        const conversationData = {
          sessionId: `session-${Date.now()}`,
          startTime: sessionStarted ? new Date().toISOString() : null,
          totalMessages: currentHistory.length,
          userMessages: currentHistory.filter(m => m.sender === 'user').length,
          agentMessages: currentHistory.filter(m => m.sender === 'agent').length,
          messages: currentHistory,
        };
        
        console.log('📁 EXPORTED CONVERSATION DATA:', JSON.stringify(conversationData, null, 2));
        
        // Also save to localStorage for persistence
        try {
          localStorage.setItem('voiceAssistantConversation', JSON.stringify(conversationData));
          console.log('💾 Conversation saved to localStorage');
        } catch (error) {
          console.error('❌ Failed to save conversation to localStorage:', error);
        }
        
        return currentHistory; // Return the same history, don't modify it
      });
    };

    (window as any).exportConversation = exportConversation;
    console.log('🔧 Debug: Use window.exportConversation() to export current conversation');
    
    return () => {
      delete (window as any).exportConversation;
    };
  }, [sessionStarted]); // Only depend on sessionStarted

  useEffect(() => {
    if (sessionStarted) {
      const timeout = setTimeout(() => {
        if (!isAgentAvailable(agentState)) {
          const reason =
            agentState === 'connecting'
              ? 'Agent did not join the room. '
              : 'Agent connected but did not complete initializing. ';

          toastAlert({
            title: 'Session ended',
            description: (
              <p className="w-full">
                {reason}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://docs.livekit.io/agents/start/voice-ai/"
                  className="whitespace-nowrap underline"
                >
                  See quickstart guide
                </a>
                .
              </p>
            ),
          });
          room.disconnect();
        }
      }, 20_000);

      return () => clearTimeout(timeout);
    }
  }, [agentState, sessionStarted, room]);

  const { supportsChatInput, supportsVideoInput, supportsScreenShare } = appConfig;
  const capabilities = {
    supportsChatInput,
    supportsVideoInput,
    supportsScreenShare,
  };

  return (
    <section
      ref={ref}
      inert={disabled}
      className={cn(
        'opacity-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 min-h-screen relative overflow-hidden',
        !chatOpen && 'max-h-svh overflow-hidden'
      )}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="flex items-center justify-between h-16 px-4 md:px-6 max-w-7xl mx-auto">
          {/* AI Status */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                agentState === 'speaking' && "bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse",
                agentState === 'listening' && "bg-gradient-to-r from-green-500 to-emerald-600 animate-pulse",
                agentState === 'thinking' && "bg-gradient-to-r from-yellow-500 to-orange-600 animate-pulse",
                "bg-gradient-to-r from-gray-600 to-gray-700"
              )}>
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900",
                agentState === 'speaking' && "bg-blue-500",
                agentState === 'listening' && "bg-green-500",
                agentState === 'thinking' && "bg-yellow-500",
                "bg-gray-500"
              )}></div>
            </div>
            <div>
              <h2 className="text-white font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">SWARA</h2>
              <p className="text-gray-400 text-sm capitalize">
                {agentState === 'listening' && 'Listening...'}
                {agentState === 'thinking' && 'Processing...'}
                {agentState === 'speaking' && 'Speaking...'}
                {agentState === 'connecting' && 'Connecting...'}
              </p>
            </div>
          </div>

          {/* Analysis Controls */}
          

          {/* Call Timer/Status */}
          <div className="text-right">
            <div className="text-white text-sm font-mono">
              {/* {sessionStarted && "00:00:00"} */}
            </div>
            <div className="text-green-400 text-xs flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Connected
            </div>
          </div>
        </div>
        
        {/* Analysis Results Strip */}
        {lastAnalysis && (
          <div className="bg-slate-800/50 border-t border-slate-700/50 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-300">
                  Analysis: {lastAnalysis.analysisType === 'complaint' ? '🚨 Complaints' : '📊 Summary'}
                </span>
                
                {lastAnalysis.analysisType === 'complaint' && lastAnalysis.analysis.complaints && (
                  <div className="flex items-center gap-2">
                    {lastAnalysis.analysis.complaints.length > 0 ? (
                      <span className="text-xs text-red-200 bg-red-500/20 px-2 py-1 rounded">
                        {lastAnalysis.analysis.complaints.length} complaint(s) found
                      </span>
                    ) : (
                      <span className="text-xs text-green-200 bg-green-500/20 px-2 py-1 rounded">
                        No complaints detected
                      </span>
                    )}
                  </div>
                )}
                
                {lastAnalysis.analysisType === 'summary' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-200 bg-blue-500/20 px-2 py-1 rounded">
                      Summary generated
                    </span>
                    {lastAnalysis.savedToFile && (
                      <span className="text-xs text-green-200 bg-green-500/20 px-2 py-1 rounded">
                        💾 Saved: {lastAnalysis.savedToFile.filename}
                      </span>
                    )}
                    {lastAnalysis.fileError && (
                      <span className="text-xs text-yellow-200 bg-yellow-500/20 px-2 py-1 rounded">
                        ⚠️ File save failed
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              
              
              {/* View All Summaries Button */}
              {/* <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/summaries');
                    const data = await response.json();
                    
                    if (data.success) {
                      console.log('\n📚 ALL SAVED SUMMARIES:');
                      console.log(`Total summaries: ${data.totalCount}`);
                      
                      if (data.summaries.length > 0) {
                        data.summaries.forEach((summary: any, index: number) => {
                          console.log(`\n${index + 1}. ${summary.filename}`);
                          console.log(`   📅 Created: ${new Date(summary.createdAt).toLocaleString()}`);
                          console.log(`   💬 Messages: ${summary.conversationLength} (${summary.userMessages} user, ${summary.agentMessages} agent)`);
                          console.log(`   📝 Summary: ${summary.summary}`);
                          console.log(`   🔗 URL: ${window.location.origin}${summary.path}`);
                        });
                      } else {
                        console.log('No summaries found.');
                      }
                    } else {
                      console.error('Failed to fetch summaries:', data.error);
                    }
                  } catch (error) {
                    console.error('Error fetching summaries:', error);
                  }
                }}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors ml-3"
              >
                📚 All Summaries
              </button> */}
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile Analysis Dropdown */}
      {showMobileAnalysis && (
        <div className="fixed top-16 left-0 right-0 z-30 bg-slate-800/95 backdrop-blur-xl border-b border-slate-700/50 md:hidden">
          <div className="px-4 py-3">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  analyzeConversationWithGemini('complaint');
                  setShowMobileAnalysis(false);
                }}
                disabled={isAnalyzing || conversationHistory.length === 0}
                className="w-full px-3 py-2 text-sm bg-red-500/20 text-red-200 border border-red-500/30 
                         rounded-md hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? '🔍' : '🚨'} 
                {isAnalyzing ? 'Analyzing Complaints...' : 'Analyze Complaints'}
              </button>
              
              <button
                onClick={() => {
                  analyzeConversationWithGemini('summary');
                  setShowMobileAnalysis(false);
                }}
                disabled={isAnalyzing || conversationHistory.length === 0}
                className="w-full px-3 py-2 text-sm bg-blue-500/20 text-blue-200 border border-blue-500/30 
                         rounded-md hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? '🔍' : '📊'} 
                {isAnalyzing ? 'Creating Summary...' : 'Get Summary'}
              </button>
              
              <button
                onClick={() => {
                  console.log('💾 Current Conversation History:');
                  console.log(conversationHistory);
                  if (lastAnalysis) {
                    console.log('🎯 Last Analysis:');
                    console.log(lastAnalysis);
                  }
                  setShowMobileAnalysis(false);
                }}
                className="w-full px-3 py-2 text-sm bg-slate-500/20 text-slate-200 border border-slate-500/30 
                         rounded-md hover:bg-slate-500/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                📋 Export Data to Console
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={cn(
        "pb-32 min-h-screen flex flex-col transition-all duration-300",
        lastAnalysis ? "pt-24" : "pt-16",
        showMobileAnalysis && "pt-32 md:pt-16"
      )}>
        {/* Chat Messages */}
        {chatOpen && (
          <ChatMessageView
            className={cn(
              'flex-1 w-full max-w-4xl mx-auto px-4 py-6 transition-all duration-500 ease-out md:px-6',
              'transform',
              chatOpen ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-8 opacity-0'
            )}
          >
            <div className="space-y-6">
              <AnimatePresence>
                {messages.map((message: ReceivedChatMessage) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <ChatEntry hideName key={message.id} entry={message} />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-2">Start a conversation</h3>
                  <p className="text-gray-400">Your AI assistant is ready to help you with anything</p>
                </div>
              )}
            </div>
          </ChatMessageView>
        )}

        {/* Video Area - Center stage when chat is closed */}
        <div className={cn(
          'relative flex-1 flex items-center justify-center transition-all duration-500',
          chatOpen ? 'hidden' : 'block'
        )}>
          <MediaTiles chatOpen={chatOpen} />
          
          {/* Welcome Message When No Chat */}
          {!chatOpen && messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-center z-20 relative"
            >
              {/* <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-md mx-4">
                {appConfig.isPreConnectBufferEnabled && sessionStarted && messages.length === 0 && (
                  <>
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <Mic className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-3">I'm listening</h3>
                    <p className="text-gray-300">Ask me anything or start a conversation</p>
                  </>
                )}
              </div> */}
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Control Bar */}
      <div className="fixed right-0 bottom-0 left-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent pointer-events-none" />
        
        <div className="relative px-4 pt-8 pb-6 md:px-6 md:pb-8">
          <motion.div
            key="control-bar"
            initial={{ opacity: 0, translateY: '100%' }}
            animate={{
              opacity: sessionStarted ? 1 : 0,
              translateY: sessionStarted ? '0%' : '100%',
            }}
            transition={{ duration: 0.4, delay: sessionStarted ? 0.5 : 0, ease: 'easeOut' }}
          >
            <div className="relative z-10 mx-auto w-full max-w-lg">
              <AgentControlBar
                capabilities={capabilities}
                onChatOpenChange={setChatOpen}
                onSendMessage={handleSendMessage}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
