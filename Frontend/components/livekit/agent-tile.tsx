// import { type AgentState, BarVisualizer, type TrackReference } from '@livekit/components-react';
// import { cn } from '@/lib/utils';
// import { Bot, Volume2 } from 'lucide-react';

// interface AgentAudioTileProps {
//   state: AgentState;
//   audioTrack: TrackReference;
//   className?: string;
// }

// export const AgentTile = ({
//   state,
//   audioTrack,
//   className,
//   ref,
// }: React.ComponentProps<'div'> & AgentAudioTileProps) => {
//   return (
//     <div 
//       ref={ref} 
//       className={cn(
//         'bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 flex flex-col items-center justify-center rounded-3xl shadow-2xl relative overflow-hidden',
//         className
//       )}
//     >
//       {/* Background pattern */}
//       <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      
//       {/* Agent Avatar */}
//       <div className="relative z-10 mb-4">
//         <div className="relative">
//           <div className={cn(
//             "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300",
//             state === 'speaking' && "bg-white/20 scale-110",
//             state === 'listening' && "bg-green-500/20 scale-105",
//             state === 'thinking' && "bg-yellow-500/20 scale-105",
//             "bg-white/10"
//           )}>
//             <Bot className="w-10 h-10 md:w-12 md:h-12 text-white" />
//           </div>
          
//           {/* Status indicator */}
//           <div className={cn(
//             "absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center",
//             state === 'speaking' && "bg-blue-500 animate-pulse",
//             state === 'listening' && "bg-green-500 animate-pulse",
//             state === 'thinking' && "bg-yellow-500 animate-spin",
//             "bg-gray-500"
//           )}>
//             {state === 'speaking' && <Volume2 className="w-3 h-3 text-white" />}
//           </div>
//         </div>
//       </div>

//       {/* Status Text */}
//       <div className="relative z-10 text-center mb-4">
//         <h3 className="text-white font-semibold text-lg md:text-xl">Swara</h3>
//         <p className="text-white/80 text-sm capitalize">
//           {state === 'listening' && 'Listening...'}
//           {state === 'thinking' && 'Processing...'}
//           {state === 'speaking' && 'Speaking...'}
//           {state === 'connecting' && 'Connecting...'}
//         </p>
//       </div>

//       {/* Audio Visualizer */}
//       <div className="relative z-10">
//         <BarVisualizer
//           barCount={7}
//           state={state}
//           options={{ minHeight: 4, maxHeight: 24 }}
//           trackRef={audioTrack}
//           className="flex items-end justify-center gap-1 h-8"
//         >
//           <span
//             className={cn([
//               'bg-white/60 min-h-1 w-1 rounded-full transition-all duration-200 ease-out',
//               'data-[lk-highlighted=true]:bg-white data-[lk-muted=true]:bg-white/30',
//             ])}
//           />
//         </BarVisualizer>
//       </div>
//     </div>
//   );
// };


import { type AgentState, BarVisualizer, type TrackReference } from '@livekit/components-react';
import { cn } from '@/lib/utils';
import { Bot, Volume2 } from 'lucide-react';

interface AgentAudioTileProps {
  state: AgentState;
  audioTrack: TrackReference;
  className?: string;
}

export const AgentTile = ({
  state,
  audioTrack,
  className,
  ref,
}: React.ComponentProps<'div'> & AgentAudioTileProps) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-gradient-to-br from-navy-900 via-indigo-900 to-slate-900 dark:from-navy-950 dark:via-indigo-950 dark:to-slate-950 flex flex-col items-center justify-center rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative overflow-hidden border border-white/10',
        className
      )}
    >
      {/* Subtle background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-70" />

      {/* Agent Avatar */}
      <div className="relative z-10 mb-4">
        <div className="relative flex items-center justify-center">
         
          {/* Circular sound-wave aura when speaking */}
          {state === 'speaking' && (
            <>
              <span className="absolute w-28 h-28 rounded-full bg-blue-500/20 animate-ping" />
              <span className="absolute w-36 h-36 rounded-full bg-blue-400/10 animate-pulse" />
            </>
          )}

          <div
            className={cn(
              "relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]",
              state === 'speaking' && "bg-white/10 scale-110 ring-2 ring-blue-400/40",
              state === 'listening' && "bg-green-400/10 scale-105 ring-2 ring-green-400/40",
              state === 'thinking' && "bg-yellow-400/10 scale-105 ring-2 ring-yellow-400/40",
              "bg-white/5"
            )}
          >
            <Bot className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </div>

          {/* Status indicator */}
          <div className={cn(
            "absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-navy-950 flex items-center justify-center shadow-md",
            state === 'speaking' && "bg-blue-400 animate-pulse",
            state === 'listening' && "bg-green-400 animate-pulse",
            state === 'thinking' && "bg-yellow-400 animate-spin",
            "bg-gray-500"
          )}>
            {state === 'speaking' && <Volume2 className="w-3 h-3 text-white" />}
          </div>
        </div>
      </div>

      {/* Status Text */}
      <div className="relative z-10 text-center mb-4">
        <h3 className="text-white font-semibold text-lg md:text-xl tracking-wide drop-shadow-lg">Swara</h3>
        <p className="text-white/70 text-sm capitalize tracking-wide">
          {state === 'listening' && 'Listening...'}
          {state === 'thinking' && 'Processing...'}
          {state === 'speaking' && 'Speaking...'}
          {state === 'connecting' && 'Connecting...'}
        </p>
      </div>

      {/* Audio Visualizer */}
      <div className="relative z-10">
        <BarVisualizer
          barCount={7}
          state={state}
          options={{ minHeight: 4, maxHeight: 28 }}
          trackRef={audioTrack}
          className="flex items-end justify-center gap-1 h-10"
        >
          <span
            className={cn([
              'bg-gradient-to-t from-indigo-300 to-white/70 min-h-1 w-1 rounded-full transition-all duration-200 ease-out',
              'data-[lk-highlighted=true]:from-white data-[lk-muted=true]:from-slate-500 data-[lk-muted=true]:to-slate-400/40',
            ])}
          />
        </BarVisualizer>
      </div>
    </div>
  );
};
