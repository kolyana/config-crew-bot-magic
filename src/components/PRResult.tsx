
import React from 'react';
import { PRResult as PRResultType } from '@/models/PRTypes';
import { CodeBlock } from './CodeBlock';
import { Button } from '@/components/ui/button';
import { Check, ClipboardCopy, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PRResultProps {
  result: PRResultType;
  onClose: () => void;
}

export const PRResult: React.FC<PRResultProps> = ({ result, onClose }) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const typeColorMap = {
    kafka: 'border-kafka',
    kong: 'border-kong',
    gatekeeper: 'border-gatekeeper'
  };

  const typeIconColorMap = {
    kafka: 'bg-kafka text-white',
    kong: 'bg-kong text-white',
    gatekeeper: 'bg-gatekeeper text-white'
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.content);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "PR content copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy the PR content",
      });
    }
  };

  const downloadAsYaml = () => {
    // Create a blob with the content
    const blob = new Blob([result.content], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.type}-${result.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.yaml`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "PR content downloaded as YAML file",
    });
  };

  return (
    <Card className={cn(
      "w-full border-t-4 shadow-lg",
      typeColorMap[result.type]
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            typeIconColorMap[result.type]
          )}>
            {result.type === 'kafka' && <span className="text-sm font-bold">K</span>}
            {result.type === 'kong' && <span className="text-sm font-bold">KG</span>}
            {result.type === 'gatekeeper' && <span className="text-sm font-bold">GK</span>}
          </div>
          <CardTitle className="text-lg">{result.title}</CardTitle>
        </div>
        {result.description && (
          <p className="text-sm text-muted-foreground mt-2">{result.description}</p>
        )}
      </CardHeader>
      
      <CardContent>
        <CodeBlock code={result.content} />
      </CardContent>
      
      <CardFooter className="flex justify-between flex-wrap gap-2">
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-4 w-4 mr-1" /> : <ClipboardCopy className="h-4 w-4 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={downloadAsYaml}
          >
            <Download className="h-4 w-4 mr-1" />
            Download YAML
          </Button>
        </div>
        
        <Button 
          variant="secondary" 
          size="sm"
          onClick={onClose}
        >
          Close
        </Button>
      </CardFooter>
    </Card>
  );
};
