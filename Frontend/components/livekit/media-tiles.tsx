import React, { useMemo } from 'react';
import { Track } from 'livekit-client';
import { AnimatePresence, motion } from 'motion/react';
import {
  type TrackReference,
  useLocalParticipant,
  useTracks,
  useVoiceAssistant,
} from '@livekit/components-react';
import { cn } from '@/lib/utils';
import { AgentTile } from './agent-tile';
import { AvatarTile } from './avatar-tile';
import { VideoTile } from './video-tile';

const MotionVideoTile = motion.create(VideoTile);
const MotionAgentTile = motion.create(AgentTile);
const MotionAvatarTile = motion.create(AvatarTile);

const animationProps = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0,
  },
  transition: {
    stiffness: 675,
    damping: 75,
    mass: 1,
  },
};

const classNames = {
  // GRID
  // 2 Columns x 3 Rows
  grid: [
    'h-full w-full',
    'grid gap-x-2 place-content-center',
    'grid-cols-[1fr_1fr] grid-rows-[90px_1fr_90px]',
  ],
  // Agent
  // chatOpen: true,
  // hasSecondTile: true
  // layout: Column 1 / Row 1
  // align: x-end y-center
  agentChatOpenWithSecondTile: ['col-start-1 row-start-1', 'self-center justify-self-end'],
  // Agent
  // chatOpen: true,
  // hasSecondTile: false
  // layout: Column 1 / Row 1 / Column-Span 2
  // align: x-center y-center
  agentChatOpenWithoutSecondTile: ['col-start-1 row-start-1', 'col-span-2', 'place-content-center'],
  // Agent
  // chatOpen: false
  // layout: Column 1 / Row 1 / Column-Span 2 / Row-Span 3
  // align: x-center y-center
  agentChatClosed: ['col-start-1 row-start-1', 'col-span-2 row-span-3', 'place-content-center'],
  // Second tile
  // chatOpen: true,
  // hasSecondTile: true
  // layout: Column 2 / Row 1
  // align: x-start y-center
  secondTileChatOpen: ['col-start-2 row-start-1', 'self-center justify-self-start'],
  // Second tile
  // chatOpen: false,
  // hasSecondTile: false
  // layout: Column 2 / Row 2
  // align: x-end y-end
  secondTileChatClosed: ['col-start-2 row-start-3', 'place-content-end'],
};

export function useLocalTrackRef(source: Track.Source) {
  const { localParticipant } = useLocalParticipant();
  const publication = localParticipant.getTrackPublication(source);
  const trackRef = useMemo<TrackReference | undefined>(
    () => (publication ? { source, participant: localParticipant, publication } : undefined),
    [source, publication, localParticipant]
  );
  return trackRef;
}

interface MediaTilesProps {
  chatOpen: boolean;
}

export function MediaTiles({ chatOpen }: MediaTilesProps) {
  const {
    state: agentState,
    audioTrack: agentAudioTrack,
    videoTrack: agentVideoTrack,
  } = useVoiceAssistant();
  const [screenShareTrack] = useTracks([Track.Source.ScreenShare]);
  const cameraTrack: TrackReference | undefined = useLocalTrackRef(Track.Source.Camera);

  const isCameraEnabled = cameraTrack && !cameraTrack.publication.isMuted;
  const isScreenShareEnabled = screenShareTrack && !screenShareTrack.publication.isMuted;
  const hasSecondTile = isCameraEnabled || isScreenShareEnabled;

  const transition = {
    ...animationProps.transition,
    delay: chatOpen ? 0 : 0.15, // delay on close
  };
  const agentAnimate = {
    ...animationProps.animate,
    scale: chatOpen ? 1 : 3,
    transition,
  };
  const avatarAnimate = {
    ...animationProps.animate,
    transition,
  };
  const agentLayoutTransition = transition;
  const avatarLayoutTransition = transition;

  const isAvatar = agentVideoTrack !== undefined;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <div className="relative h-full w-full">
        {/* Main video area - full screen when chat is closed */}
        <div className={cn(
          'absolute transition-all duration-500 ease-out',
          !chatOpen 
            ? 'inset-4 top-20 bottom-44 md:inset-8 md:top-24 md:bottom-48'
            : 'top-24 left-6 w-40 h-48 md:top-28 md:left-8 md:w-48 md:h-56'
        )}>
          <div className="h-full w-full flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {!isAvatar && (
                <MotionAgentTile
                  key="agent"
                  layoutId="agent"
                  {...animationProps}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={transition}
                  state={agentState}
                  audioTrack={agentAudioTrack}
                  className={cn(
                    'w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 transition-all duration-500',
                    agentState === 'speaking' && 'border-blue-500 shadow-blue-500/30 scale-105',
                    agentState === 'listening' && 'border-green-500 shadow-green-500/30 scale-105',
                    agentState === 'thinking' && 'border-yellow-500 shadow-yellow-500/30 scale-105',
                    'border-slate-600 shadow-slate-500/20'
                  )}
                />
              )}
              {isAvatar && (
                <MotionAvatarTile
                  key="avatar"
                  layoutId="avatar"
                  {...animationProps}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={avatarLayoutTransition}
                  videoTrack={agentVideoTrack}
                  className={cn(
                    'w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 transition-all duration-500',
                    'border-slate-600 shadow-slate-500/20',
                    '[&>video]:w-full [&>video]:h-full [&>video]:object-cover'
                  )}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Self-view and screen share - floating in corner */}
        <div className={cn(
          'absolute transition-all duration-500 ease-out z-40',
          chatOpen 
            ? 'top-24 right-6 md:top-28 md:right-8' 
            : 'bottom-48 right-6 md:bottom-52 md:right-8'
        )}>
          <div className="space-y-3">
            <AnimatePresence>
              {/* Camera view */}
              {cameraTrack && isCameraEnabled && (
                <MotionVideoTile
                  key="camera"
                  layout="position"
                  layoutId="camera"
                  {...animationProps}
                  trackRef={cameraTrack}
                  transition={{
                    ...animationProps.transition,
                    delay: chatOpen ? 0 : 0.15,
                  }}
                  className="w-28 h-36 md:w-32 md:h-40 rounded-2xl overflow-hidden shadow-xl border-2 border-slate-600/50 backdrop-blur-sm"
                />
              )}
              
              {/* Screen share */}
              {isScreenShareEnabled && (
                <MotionVideoTile
                  key="screen"
                  layout="position"
                  layoutId="screen"
                  {...animationProps}
                  trackRef={screenShareTrack}
                  transition={{
                    ...animationProps.transition,
                    delay: chatOpen ? 0 : 0.15,
                  }}
                  className="w-36 h-24 md:w-40 md:h-28 rounded-2xl overflow-hidden shadow-xl border-2 border-slate-600/50 backdrop-blur-sm"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
