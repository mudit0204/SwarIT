import { type TrackReference, VideoTrack } from '@livekit/components-react';
import { cn } from '@/lib/utils';

interface AgentAudioTileProps {
  videoTrack: TrackReference;
  className?: string;
}

export const AvatarTile = ({
  videoTrack,
  className,
  ref,
}: React.ComponentProps<'div'> & AgentAudioTileProps) => {
  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <VideoTrack
        trackRef={videoTrack}
        width={videoTrack?.publication.dimensions?.width ?? 0}
        height={videoTrack?.publication.dimensions?.height ?? 0}
        className="h-full w-full object-cover"
      />

      {/* Subtle overlay for better text readability if needed */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
    </div>
  );
};
