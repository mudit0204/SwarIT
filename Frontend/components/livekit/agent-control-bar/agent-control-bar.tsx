// 'use client';

// import * as React from 'react';
// import { useCallback } from 'react';
// import { Track } from 'livekit-client';
// import { BarVisualizer, useRemoteParticipants } from '@livekit/components-react';
// import { PhoneDisconnectIcon } from '@phosphor-icons/react/dist/ssr';
// import { 
//   Mic, 
//   MicOff, 
//   Video, 
//   VideoOff, 
//   Monitor, 
//   MonitorOff, 
//   MessageCircle,
//   PhoneOff,
//   ChevronDown
// } from 'lucide-react';
// import { ChatInput } from '@/components/livekit/chat/chat-input';
// import { Button } from '@/components/ui/button';
// import { Toggle } from '@/components/ui/toggle';
// import { AppConfig } from '@/lib/types';
// import { cn } from '@/lib/utils';
// import { DeviceSelect } from '../device-select';
// import { TrackToggle } from '../track-toggle';
// import { UseAgentControlBarProps, useAgentControlBar } from './hooks/use-agent-control-bar';

// export interface AgentControlBarProps
//   extends React.HTMLAttributes<HTMLDivElement>,
//     UseAgentControlBarProps {
//   capabilities: Pick<AppConfig, 'supportsChatInput' | 'supportsVideoInput' | 'supportsScreenShare'>;
//   onChatOpenChange?: (open: boolean) => void;
//   onSendMessage?: (message: string) => Promise<void>;
//   onDisconnect?: () => void;
//   onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
// }

// /**
//  * A control bar specifically designed for voice assistant interfaces
//  */
// export function AgentControlBar({
//   controls,
//   saveUserChoices = true,
//   capabilities,
//   className,
//   onSendMessage,
//   onChatOpenChange,
//   onDisconnect,
//   onDeviceError,
//   ...props
// }: AgentControlBarProps) {
//   const participants = useRemoteParticipants();
//   const [chatOpen, setChatOpen] = React.useState(false);
//   const [isSendingMessage, setIsSendingMessage] = React.useState(false);

//   const isAgentAvailable = participants.some((p) => p.isAgent);
//   const isInputDisabled = !chatOpen || !isAgentAvailable || isSendingMessage;

//   const [isDisconnecting, setIsDisconnecting] = React.useState(false);

//   const {
//     micTrackRef,
//     visibleControls,
//     cameraToggle,
//     microphoneToggle,
//     screenShareToggle,
//     handleAudioDeviceChange,
//     handleVideoDeviceChange,
//     handleDisconnect,
//   } = useAgentControlBar({
//     controls,
//     saveUserChoices,
//   });

//   const handleSendMessage = async (message: string) => {
//     setIsSendingMessage(true);
//     try {
//       await onSendMessage?.(message);
//     } finally {
//       setIsSendingMessage(false);
//     }
//   };

//   const onLeave = async () => {
//     setIsDisconnecting(true);
//     await handleDisconnect();
//     setIsDisconnecting(false);
//     onDisconnect?.();
//   };

//   React.useEffect(() => {
//     onChatOpenChange?.(chatOpen);
//   }, [chatOpen, onChatOpenChange]);

//   const onMicrophoneDeviceSelectError = useCallback(
//     (error: Error) => {
//       onDeviceError?.({ source: Track.Source.Microphone, error });
//     },
//     [onDeviceError]
//   );
//   const onCameraDeviceSelectError = useCallback(
//     (error: Error) => {
//       onDeviceError?.({ source: Track.Source.Camera, error });
//     },
//     [onDeviceError]
//   );

//   return (
//     <div
//       aria-label="Voice assistant controls"
//       className={cn(
//         'bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 flex flex-col rounded-3xl p-6 shadow-2xl shadow-black/20',
//         className
//       )}
//       {...props}
//     >
//       {capabilities.supportsChatInput && (
//         <div
//           inert={!chatOpen}
//           className={cn(
//             'overflow-hidden transition-all duration-300 ease-out',
//             chatOpen ? 'h-16 mb-6' : 'h-0'
//           )}
//         >
//           <ChatInput onSend={handleSendMessage} disabled={isInputDisabled} className="w-full" />
//         </div>
//       )}

//       <div className="flex flex-row justify-center items-center gap-4">
//         {/* Microphone - Central and prominent */}
//         {visibleControls.microphone && (
//           <div className="relative flex items-center">
//             <TrackToggle
//               variant="primary"
//               source={Track.Source.Microphone}
//               pressed={microphoneToggle.enabled}
//               disabled={microphoneToggle.pending}
//               onPressedChange={microphoneToggle.toggle}
//               className={cn(
//                 "relative w-16 h-16 rounded-full p-0 border-2 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg",
//                 microphoneToggle.enabled 
//                   ? "bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-white shadow-green-500/25" 
//                   : "bg-gradient-to-r from-red-500 to-red-600 border-red-400 text-white shadow-red-500/25 hover:from-red-600 hover:to-red-700"
//               )}
//             >
//               {microphoneToggle.enabled ? (
//                 <div className="relative">
//                   <Mic className="w-7 h-7" />
//                   <BarVisualizer
//                     barCount={4}
//                     trackRef={micTrackRef}
//                     options={{ minHeight: 2, maxHeight: 6 }}
//                     className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-end justify-center gap-0.5"
//                   >
//                     <span className="w-0.5 bg-white/80 rounded-full animate-pulse"></span>
//                   </BarVisualizer>
//                 </div>
//               ) : (
//                 <MicOff className="w-7 h-7" />
//               )}
//             </TrackToggle>
            
//             {/* Device selector for desktop */}
//             <div className="absolute -bottom-2 -right-2 hidden md:block">
//               <DeviceSelect
//                 size="sm"
//                 kind="audioinput"
//                 onMediaDeviceError={onMicrophoneDeviceSelectError}
//                 onActiveDeviceChange={handleAudioDeviceChange}
//                 className="w-8 h-8 p-1 bg-slate-700/90 backdrop-blur-sm rounded-full hover:bg-slate-600/90 transition-colors border border-slate-500/50"
//               >
//                 <ChevronDown className="w-4 h-4 text-slate-300" />
//               </DeviceSelect>
//             </div>
//           </div>
//         )}

//         {/* Video Toggle */}
//         {capabilities.supportsVideoInput && visibleControls.camera && (
//           <div className="relative flex items-center">
//             <TrackToggle
//               variant="primary"
//               source={Track.Source.Camera}
//               pressed={cameraToggle.enabled}
//               pending={cameraToggle.pending}
//               disabled={cameraToggle.pending}
//               onPressedChange={cameraToggle.toggle}
//               className={cn(
//                 "relative w-14 h-14 rounded-full p-0 border-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg",
//                 cameraToggle.enabled 
//                   ? "bg-gradient-to-r from-blue-500 to-cyan-600 border-blue-400 text-white shadow-blue-500/25" 
//                   : "bg-slate-600 border-slate-500 text-slate-300 hover:bg-slate-500 shadow-slate-500/25"
//               )}
//             >
//               {cameraToggle.enabled ? (
//                 <Video className="w-6 h-6" />
//               ) : (
//                 <VideoOff className="w-6 h-6" />
//               )}
//             </TrackToggle>
            
//             <div className="absolute -bottom-1 -right-1 hidden md:block">
//               <DeviceSelect
//                 size="sm"
//                 kind="videoinput"
//                 onMediaDeviceError={onCameraDeviceSelectError}
//                 onActiveDeviceChange={handleVideoDeviceChange}
//                 className="w-6 h-6 p-1 bg-slate-700/90 backdrop-blur-sm rounded-full hover:bg-slate-600/90 transition-colors border border-slate-500/50"
//               >
//                 <ChevronDown className="w-3 h-3 text-slate-300" />
//               </DeviceSelect>
//             </div>
//           </div>
//         )}

//         {/* Screen Share */}
//         {capabilities.supportsScreenShare && visibleControls.screenShare && (
//           <TrackToggle
//             variant="secondary"
//             source={Track.Source.ScreenShare}
//             pressed={screenShareToggle.enabled}
//             disabled={screenShareToggle.pending}
//             onPressedChange={screenShareToggle.toggle}
//             className={cn(
//               "relative w-14 h-14 rounded-full p-0 border-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg",
//               screenShareToggle.enabled 
//                 ? "bg-gradient-to-r from-purple-500 to-indigo-600 border-purple-400 text-white shadow-purple-500/25" 
//                 : "bg-slate-600 border-slate-500 text-slate-300 hover:bg-slate-500 shadow-slate-500/25"
//             )}
//           >
//             {screenShareToggle.enabled ? (
//               <Monitor className="w-6 h-6" />
//             ) : (
//               <MonitorOff className="w-6 h-6" />
//             )}
//           </TrackToggle>
//         )}

//         {/* Chat Toggle */}
//         {visibleControls.chat && (
//           <Toggle
//             variant="secondary"
//             aria-label="Toggle chat"
//             pressed={chatOpen}
//             onPressedChange={setChatOpen}
//             disabled={!isAgentAvailable}
//             className={cn(
//               "relative w-14 h-14 rounded-full p-0 border-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg",
//               chatOpen 
//                 ? "bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-400 text-white shadow-indigo-500/25" 
//                 : "bg-slate-600 border-slate-500 text-slate-300 hover:bg-slate-500 shadow-slate-500/25 disabled:opacity-50"
//             )}
//           >
//             <MessageCircle className="w-6 h-6" />
//           </Toggle>
//         )}

//         {/* End Call Button */}
//         {visibleControls.leave && (
//           <Button
//             variant="destructive"
//             onClick={onLeave}
//             disabled={isDisconnecting}
//             className="w-14 h-14 rounded-full p-0 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-2 border-red-400 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-red-500/25 ml-2"
//           >
//             {isDisconnecting ? (
//               <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             ) : (
//               <PhoneOff className="w-6 h-6" />
//             )}
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }



'use client';

import * as React from 'react';
import { useCallback } from 'react';
import { Track } from 'livekit-client';
import { BarVisualizer, useRemoteParticipants } from '@livekit/components-react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorOff, 
  MessageCircle,
  PhoneOff,
  ChevronDown
} from 'lucide-react';
import { ChatInput } from '@/components/livekit/chat/chat-input';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { AppConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { DeviceSelect } from '../device-select';
import { TrackToggle } from '../track-toggle';
import { UseAgentControlBarProps, useAgentControlBar } from './hooks/use-agent-control-bar';

export interface AgentControlBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    UseAgentControlBarProps {
  capabilities: Pick<AppConfig, 'supportsChatInput' | 'supportsVideoInput' | 'supportsScreenShare'>;
  onChatOpenChange?: (open: boolean) => void;
  onSendMessage?: (message: string) => Promise<void>;
  onDisconnect?: () => void;
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
}

/**
 * A control bar specifically designed for voice assistant interfaces
 * with simplified Mic + Video buttons (single icon each).
 */
export function AgentControlBar({
  controls,
  saveUserChoices = true,
  capabilities,
  className,
  onSendMessage,
  onChatOpenChange,
  onDisconnect,
  onDeviceError,
  ...props
}: AgentControlBarProps) {
  const participants = useRemoteParticipants();
  const [chatOpen, setChatOpen] = React.useState(false);
  const [isSendingMessage, setIsSendingMessage] = React.useState(false);

  const isAgentAvailable = participants.some((p) => p.isAgent);
  const isInputDisabled = !chatOpen || !isAgentAvailable || isSendingMessage;

  const [isDisconnecting, setIsDisconnecting] = React.useState(false);

  const {
    micTrackRef,
    visibleControls,
    cameraToggle,
    microphoneToggle,
    screenShareToggle,
    handleAudioDeviceChange,
    handleVideoDeviceChange,
    handleDisconnect,
  } = useAgentControlBar({
    controls,
    saveUserChoices,
  });

  const handleSendMessage = async (message: string) => {
    setIsSendingMessage(true);
    try {
      await onSendMessage?.(message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const onLeave = async () => {
    setIsDisconnecting(true);
    await handleDisconnect();
    setIsDisconnecting(false);
    onDisconnect?.();
  };

  React.useEffect(() => {
    onChatOpenChange?.(chatOpen);
  }, [chatOpen, onChatOpenChange]);

  const onMicrophoneDeviceSelectError = useCallback(
    (error: Error) => {
      onDeviceError?.({ source: Track.Source.Microphone, error });
    },
    [onDeviceError]
  );
  const onCameraDeviceSelectError = useCallback(
    (error: Error) => {
      onDeviceError?.({ source: Track.Source.Camera, error });
    },
    [onDeviceError]
  );

  return (
    <div
      aria-label="Voice assistant controls"
      className={cn(
        'bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 flex flex-col rounded-3xl p-6 shadow-2xl shadow-black/20',
        className
      )}
      {...props}
    >
      {capabilities.supportsChatInput && (
        <div
          inert={!chatOpen}
          className={cn(
            'overflow-hidden transition-all duration-300 ease-out',
            chatOpen ? 'h-16 mb-6' : 'h-0'
          )}
        >
          <ChatInput onSend={handleSendMessage} disabled={isInputDisabled} className="w-full" />
        </div>
      )}

      <div className="flex flex-row justify-center items-center gap-4">
        {/* Microphone */}
        {visibleControls.microphone && (
          <div className="relative flex items-center">
            <TrackToggle
              variant="primary"
              source={Track.Source.Microphone}
              pressed={microphoneToggle.enabled}
              disabled={microphoneToggle.pending}
              onPressedChange={microphoneToggle.toggle}
              className={cn(
                "relative w-16 h-16 rounded-full p-0 border-2 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg",
                microphoneToggle.enabled 
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-white shadow-green-500/25" 
                  : "bg-gradient-to-r from-red-500 to-red-600 border-red-400 text-white shadow-red-500/25 hover:from-red-600 hover:to-red-700"
              )}
            />
            {/* Device selector */}
            <div className="absolute -bottom-2 -right-2 hidden md:block">
              <DeviceSelect
                size="sm"
                kind="audioinput"
                onMediaDeviceError={onMicrophoneDeviceSelectError}
                onActiveDeviceChange={handleAudioDeviceChange}
                className="w-8 h-8 p-1 bg-slate-700/90 backdrop-blur-sm rounded-full hover:bg-slate-600/90 transition-colors border border-slate-500/50"
              >
                <ChevronDown className="w-4 h-4 text-slate-300" />
              </DeviceSelect>
            </div>
          </div>
        )}

        {/* Video */}
        {capabilities.supportsVideoInput && visibleControls.camera && (
          <div className="relative flex items-center">
            <TrackToggle
              variant="primary"
              source={Track.Source.Camera}
              pressed={cameraToggle.enabled}
              pending={cameraToggle.pending}
              disabled={cameraToggle.pending}
              onPressedChange={cameraToggle.toggle}
              className={cn(
                "relative w-14 h-14 rounded-full p-0 border-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg",
                cameraToggle.enabled 
                  ? "bg-gradient-to-r from-blue-500 to-cyan-600 border-blue-400 text-white shadow-blue-500/25" 
                  : "bg-slate-600 border-slate-500 text-slate-300 hover:bg-slate-500 shadow-slate-500/25"
              )}
            />
            {/* Device selector */}
            <div className="absolute -bottom-1 -right-1 hidden md:block">
              <DeviceSelect
                size="sm"
                kind="videoinput"
                onMediaDeviceError={onCameraDeviceSelectError}
                onActiveDeviceChange={handleVideoDeviceChange}
                className="w-6 h-6 p-1 bg-slate-700/90 backdrop-blur-sm rounded-full hover:bg-slate-600/90 transition-colors border border-slate-500/50"
              >
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </DeviceSelect>
            </div>
          </div>
        )}

        {/* Screen Share */}
        {capabilities.supportsScreenShare && visibleControls.screenShare && (
          <TrackToggle
            variant="secondary"
            source={Track.Source.ScreenShare}
            pressed={screenShareToggle.enabled}
            disabled={screenShareToggle.pending}
            onPressedChange={screenShareToggle.toggle}
            className={cn(
              "relative w-14 h-14 rounded-full p-0 border-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg",
              screenShareToggle.enabled 
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 border-purple-400 text-white shadow-purple-500/25" 
                : "bg-slate-600 border-slate-500 text-slate-300 hover:bg-slate-500 shadow-slate-500/25"
            )}
          >
            {screenShareToggle.enabled ? (
              <Monitor className="w-6 h-6" />
            ) : (
              <MonitorOff className="w-6 h-6" />
            )}
          </TrackToggle>
        )}

        {/* Chat Toggle */}
        {visibleControls.chat && (
          <Toggle
            variant="secondary"
            aria-label="Toggle chat"
            pressed={chatOpen}
            onPressedChange={setChatOpen}
            disabled={!isAgentAvailable}
            className={cn(
              "relative w-14 h-14 rounded-full p-0 border-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg",
              chatOpen 
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-400 text-white shadow-indigo-500/25" 
                : "bg-slate-600 border-slate-500 text-slate-300 hover:bg-slate-500 shadow-slate-500/25 disabled:opacity-50"
            )}
          >
            <MessageCircle className="w-6 h-6" />
          </Toggle>
        )}

        {/* End Call */}
        {visibleControls.leave && (
          <Button
            variant="destructive"
            onClick={onLeave}
            disabled={isDisconnecting}
            className="w-14 h-14 rounded-full p-0 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-2 border-red-400 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-red-500/25 ml-2"
          >
            {isDisconnecting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <PhoneOff className="w-6 h-6" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}