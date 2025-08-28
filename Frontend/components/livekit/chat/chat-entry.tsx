import * as React from 'react';
import type { MessageFormatter, ReceivedChatMessage } from '@livekit/components-react';
import { cn } from '@/lib/utils';
import { useChatMessage } from './hooks/utils';
import { Bot, User } from 'lucide-react';

export interface ChatEntryProps extends React.HTMLAttributes<HTMLLIElement> {
  /** The chat massage object to display. */
  entry: ReceivedChatMessage;
  /** Hide sender name. Useful when displaying multiple consecutive chat messages from the same person. */
  hideName?: boolean;
  /** Hide message timestamp. */
  hideTimestamp?: boolean;
  /** An optional formatter for the message body. */
  messageFormatter?: MessageFormatter;
}

export const ChatEntry = ({
  entry,
  messageFormatter,
  hideName,
  hideTimestamp,
  className,
  ...props
}: ChatEntryProps) => {
  const { message, hasBeenEdited, time, locale, name } = useChatMessage(entry, messageFormatter);

  const isUser = entry.from?.isLocal ?? false;
  const messageOrigin = isUser ? 'remote' : 'local';

  return (
    <li
      data-lk-message-origin={messageOrigin}
      title={time.toLocaleTimeString(locale, { timeStyle: 'full' })}
      className={cn('group flex gap-4 mb-6', isUser ? 'flex-row-reverse' : 'flex-row', className)}
      {...props}
    >
      {/* Avatar */}
      <div className={cn(
        'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg',
        isUser 
          ? 'bg-gradient-to-r from-blue-500 to-cyan-600' 
          : 'bg-gradient-to-r from-purple-500 to-indigo-600'
      )}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Container */}
      <div className={cn('flex flex-col max-w-[75%] md:max-w-[60%]', isUser ? 'items-end' : 'items-start')}>
        {(!hideTimestamp || !hideName || hasBeenEdited) && (
          <div className={cn('flex items-center gap-2 mb-2', isUser ? 'flex-row-reverse' : 'flex-row')}>
            {!hideName && (
              <span className="text-xs font-medium text-slate-400">
                {isUser ? 'You' : name || 'AI Assistant'}
              </span>
            )}
            {!hideTimestamp && (
              <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {hasBeenEdited && '*'}
                {time.toLocaleTimeString(locale, { timeStyle: 'short' })}
              </span>
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div className={cn(
          'rounded-2xl px-5 py-3 max-w-full break-words shadow-lg backdrop-blur-sm border',
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-br-md border-blue-400/30' 
            : 'bg-slate-700/80 text-slate-100 rounded-bl-md border-slate-600/50'
        )}>
          <span className="text-sm leading-relaxed whitespace-pre-wrap">
            {message}
          </span>
        </div>
      </div>
    </li>
  );
};
