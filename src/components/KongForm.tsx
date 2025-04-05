
import React from 'react';
import { KongPRData } from '@/models/PRTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { TagInput } from './TagInput';
import { Loader2 } from 'lucide-react';

interface KongFormProps {
  onSubmit: (data: KongPRData) => void;
  isLoading?: boolean;
}

export const KongForm: React.FC<KongFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = React.useState<KongPRData>({
    serviceName: '',
    routePath: '',
    methods: ['GET'],
    hosts: [],
    tags: [],
    environment: 'dev',
    description: ''
  });

  const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
  const environments = ['dev', 'staging', 'prod'];

  const handleChange = (field: keyof KongPRData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMethodToggle = (method: string) => {
    setFormData(prev => {
      const methods = [...prev.methods];
      if (methods.includes(method)) {
        return { ...prev, methods: methods.filter(m => m !== method) };
      } else {
        return { ...prev, methods: [...methods, method] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="serviceName">Service Name</Label>
        <Input
          id="serviceName"
          value={formData.serviceName}
          onChange={(e) => handleChange('serviceName', e.target.value)}
          placeholder="my-api-service"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="routePath">Route Path</Label>
        <Input
          id="routePath"
          value={formData.routePath}
          onChange={(e) => handleChange('routePath', e.target.value)}
          placeholder="/api/v1/resource"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label>HTTP Methods</Label>
        <div className="grid grid-cols-4 gap-2">
          {httpMethods.map(method => (
            <div key={method} className="flex items-center space-x-2">
              <Checkbox
                id={`method-${method}`}
                checked={formData.methods.includes(method)}
                onCheckedChange={() => handleMethodToggle(method)}
                disabled={isLoading}
              />
              <Label htmlFor={`method-${method}`} className="text-sm font-normal">
                {method}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hosts">Hosts</Label>
        <TagInput 
          placeholder="Add hosts (e.g. api.example.com)"
          tags={formData.hosts}
          setTags={(hosts) => handleChange('hosts', hosts)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <TagInput 
          placeholder="Add tags (e.g. api, internal)"
          tags={formData.tags}
          setTags={(tags) => handleChange('tags', tags)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="environment">Environment</Label>
        <Select 
          value={formData.environment} 
          onValueChange={(value) => handleChange('environment', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select environment" />
          </SelectTrigger>
          <SelectContent>
            {environments.map(env => (
              <SelectItem key={env} value={env}>
                {env}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Brief description of the Kong route purpose"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        variant="default"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate PR'
        )}
      </Button>
    </form>
  );
};
