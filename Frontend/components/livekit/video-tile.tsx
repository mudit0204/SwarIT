import React from 'react';
import { motion } from 'motion/react';
import { VideoTrack } from '@livekit/components-react';
import { cn } from '@/lib/utils';

const MotionVideoTrack = motion.create(VideoTrack);

export const VideoTile = ({
  trackRef,
  className,
  ref,
}: React.ComponentProps<'div'> & React.ComponentProps<typeof VideoTrack>) => {
  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-600/50 bg-slate-800 shadow-lg',
        className
      )}
    >
      <MotionVideoTrack
        trackRef={trackRef}
        width={trackRef?.publication.dimensions?.width ?? 0}
        height={trackRef?.publication.dimensions?.height ?? 0}
        className={cn('h-full w-full object-cover')}
      />
    </div>
  );
};
