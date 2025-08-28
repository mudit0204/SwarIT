import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';

interface ChatInputProps extends React.HTMLAttributes<HTMLFormElement> {
  onSend?: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, className, disabled, ...props }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onSubmit?.(e);
    onSend?.(message);
    setMessage('');
  };

  const isDisabled = disabled || message.trim().length === 0;

  useEffect(() => {
    if (disabled) return;
    // when not disabled refocus on input
    inputRef.current?.focus();
  }, [disabled]);

  return (
    <form
      {...props}
      onSubmit={handleSubmit}
      className={cn('flex items-center gap-3 bg-slate-700/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-600/50', className)}
    >
      <input
        autoFocus
        ref={inputRef}
        type="text"
        value={message}
        disabled={disabled}
        placeholder="Type a message..."
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-sm"
      />
      <Button
        size="sm"
        type="submit"
        variant={isDisabled ? 'secondary' : 'primary'}
        disabled={isDisabled}
        className={cn(
          "h-10 w-10 p-0 rounded-full transition-all duration-200 hover:scale-105 active:scale-95",
          isDisabled 
            ? "bg-slate-600 hover:bg-slate-500 text-slate-400" 
            : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25"
        )}
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
