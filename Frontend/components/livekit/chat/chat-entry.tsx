import * as React from 'react';
import { Bot, User } from 'lucide-react';
import type { MessageFormatter, ReceivedChatMessage } from '@livekit/components-react';
import { cn } from '@/lib/utils';
import { useChatMessage } from './hooks/utils';

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
      className={cn('group mb-6 flex gap-4', isUser ? 'flex-row-reverse' : 'flex-row', className)}
      {...props}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full shadow-lg',
          isUser
            ? 'bg-gradient-to-r from-blue-500 to-cyan-600'
            : 'bg-gradient-to-r from-purple-500 to-indigo-600'
        )}
      >
        {isUser ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
      </div>

      {/* Message Container */}
      <div
        className={cn(
          'flex max-w-[75%] flex-col md:max-w-[60%]',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        {(!hideTimestamp || !hideName || hasBeenEdited) && (
          <div
            className={cn('mb-2 flex items-center gap-2', isUser ? 'flex-row-reverse' : 'flex-row')}
          >
            {!hideName && (
              <span className="text-xs font-medium text-slate-400">
                {isUser ? 'You' : name || 'AI Assistant'}
              </span>
            )}
            {!hideTimestamp && (
              <span className="text-xs text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
                {hasBeenEdited && '*'}
                {time.toLocaleTimeString(locale, { timeStyle: 'short' })}
              </span>
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            'max-w-full rounded-2xl border px-5 py-3 break-words shadow-lg backdrop-blur-sm',
            isUser
              ? 'rounded-br-md border-blue-400/30 bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
              : 'rounded-bl-md border-slate-600/50 bg-slate-700/80 text-slate-100'
          )}
        >
          <span className="text-sm leading-relaxed whitespace-pre-wrap">{message}</span>
        </div>
      </div>
    </li>
  );
};
