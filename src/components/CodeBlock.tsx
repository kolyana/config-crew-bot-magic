
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'yaml' }) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy the code to clipboard",
      });
    }
  };

  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={copyToClipboard}
          className="p-1.5 rounded-md bg-secondary/80 hover:bg-secondary text-foreground"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className={cn(
        "code-block",
        `language-${language}`
      )}>
        {code.split('\n').map((line, i) => (
          <div key={i} className="code-line">
            {line}
          </div>
        ))}
      </pre>
    </div>
  );
};
