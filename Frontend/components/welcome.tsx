// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import { Sparkles, Mic, Video, MessageSquare, Zap } from 'lucide-react';

// interface WelcomeProps {
//   disabled: boolean;
//   startButtonText: string;
//   onStartCall: () => void;
// }

// export const Welcome = ({
//   disabled,
//   startButtonText,
//   onStartCall,
//   ref,
// }: React.ComponentProps<'div'> & WelcomeProps) => {
//   return (
//     <section
//       ref={ref}
//       inert={disabled}
//       className={cn(
//         'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 fixed inset-0 overflow-hidden',
//         disabled ? 'z-10' : 'z-20'
//       )}
//     >
//       {/* Animated Background */}
//       <div className="absolute inset-0">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
//       </div>

//       {/* Content */}
//       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
//         {/* Main Logo/Icon */}
//         <div className="relative mb-12">
//           <div className="w-32 h-32 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-3xl shadow-2xl shadow-purple-500/50 flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
//             <Sparkles className="w-16 h-16 text-white" />
//           </div>
          
//           {/* Floating elements */}
//           <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce delay-200 flex items-center justify-center">
//             <Zap className="w-4 h-4 text-white" />
//           </div>
//           <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce delay-700 flex items-center justify-center">
//             <Mic className="w-4 h-4 text-white" />
//           </div>
//         </div>

//         {/* Title */}
//         <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-6 leading-tight">
//           AI Voice
//         </h1>
//         <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-8">
//           Assistant
//         </h2>
        
//         {/* Subtitle */}
//         <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
//           Experience the future of conversation with our intelligent AI assistant
//         </p>
        
//         {/* Start Button */}
//         <div className="relative group">
//           <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
//           <Button 
//             onClick={onStartCall} 
//             className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white px-12 py-6 rounded-full text-xl font-bold shadow-2xl transform transition-all duration-200 hover:scale-105 active:scale-95 border-0 min-w-[280px]"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
//                 <Mic className="w-4 h-4" />
//               </div>
//               {startButtonText}
//               <Sparkles className="w-5 h-5 animate-pulse" />
//             </div>
//           </Button>
//         </div>
        
//         {/* Features Grid */}
//         <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
//             <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
//               <Mic className="w-6 h-6 text-white" />
//             </div>
//             <h3 className="text-lg font-semibold text-white mb-2">Voice Commands</h3>
//             <p className="text-gray-300 text-sm">Natural voice interactions with advanced speech recognition</p>
//           </div>
          
//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
//             <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
//               <Video className="w-6 h-6 text-white" />
//             </div>
//             <h3 className="text-lg font-semibold text-white mb-2">Video Calls</h3>
//             <p className="text-gray-300 text-sm">High-quality video conversations with screen sharing</p>
//           </div>
          
//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
//             <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
//               <MessageSquare className="w-6 h-6 text-white" />
//             </div>
//             <h3 className="text-lg font-semibold text-white mb-2">Smart Chat</h3>
//             <p className="text-gray-300 text-sm">Intelligent text conversations with context awareness</p>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/50 to-transparent">
//         <p className="text-center text-sm text-gray-300">
//           Powered by advanced AI technology •{' '}
//           <a
//             target="_blank"
//             rel="noopener noreferrer"
//             href="https://docs.livekit.io/agents/start/voice-ai/"
//             className="text-purple-400 hover:text-purple-300 underline transition-colors"
//           >
//             Learn more
//           </a>
//         </p>
//       </div>
//     </section>
//   );
// };

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sparkles, Mic, Video, MessageSquare, Zap } from 'lucide-react';

interface WelcomeProps {
  disabled: boolean;
  startButtonText: string;
  onStartCall: () => void;
}

export const Welcome = ({
  disabled,
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeProps) => {
  return (
    <section
      ref={ref}
      inert={disabled}
      className={cn(
        'bg-white fixed inset-0 overflow-hidden',
        disabled ? 'z-10' : 'z-20'
      )}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96  h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Main Logo/Icon */}
        <div className="relative mb-12">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-900 via-blue-600 to-blue-800 rounded-3xl shadow-2xl shadow-blue-500/50 flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
            <Sparkles className="w-16 h-16 text-white" />
          </div>
         
          {/* Floating elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce delay-200 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce delay-700 flex items-center justify-center">
            <Mic className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-medium bg-gradient-to-r from-black via-grey-100 to-black
         bg-clip-text text-transparent mb-0 leading-tight" style={{ fontFamily: 'poppins, serif' }} >
          AI Voice Assistant for <br />  Complaint Management
        </h1>
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-8">
         
        </h1>
       
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-black max-w-2xl mx-auto mb-4 leading-relaxed">
          Experience the future of conversation with our <br /> intelligent AI assistant
        </p>
       
        {/* Start Button */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-900 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <Button
            onClick={onStartCall}
            className="relative bg-gradient-to-r from-blue-900 via-blue-600 to-blue-800 hover:from-blue-950 hover:via-blue-700 hover:to-blue-900 text-white px-12 py-6 rounded-full text-xl font-bold shadow-2xl transform transition-all duration-200 hover:scale-105 active:scale-95 border-0 min-w-[280px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              {startButtonText}
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </Button>
        </div>
     
 
</div>
 



      {/* Footer */}
      {/* <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/50 to-transparent">
        <p className="text-center text-sm text-gray-300">
          Powered by advanced AI technology •{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.livekit.io/agents/start/voice-ai/"
            className="text-blue-400 hover:text-purple-300 underline transition-colors"
          >
            Learn more
          </a>
        </p>
      </div> */}
    </section>
  );
};