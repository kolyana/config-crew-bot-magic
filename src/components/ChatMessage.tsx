
import React from 'react';
import { ChatMessage as ChatMessageType } from '../models/PRTypes';
import { cn } from '@/lib/utils';
import { BotIcon, UserIcon } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { type, content, timestamp } = message;
  
  // Check if content is code to format it differently
  const isCodeBlock = content.trim().startsWith('```') && content.trim().endsWith('```');
  const codeContent = isCodeBlock 
    ? content.trim().substring(3, content.trim().length - 3).trim() 
    : null;

  return (
    <div className={cn("flex gap-2 my-3", 
      type === 'user' ? "justify-end" : "justify-start"
    )}>
      {type === 'bot' && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <BotIcon size={16} />
        </div>
      )}
      
      <div className={cn(
        "chat-bubble max-w-[80%]",
        type === 'user' ? "chat-bubble-user" : "chat-bubble-bot"
      )}>
        {isCodeBlock ? (
          <CodeBlock code={codeContent || ''} />
        ) : (
          <div>{content}</div>
        )}
        <div className={cn(
          "text-xs mt-1 opacity-60",
          type === 'user' ? "text-right" : "text-left"
        )}>
          {timestamp.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
      
      {type === 'user' && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <UserIcon size={16} className="text-primary-foreground" />
        </div>
      )}
    </div>
  );
};
