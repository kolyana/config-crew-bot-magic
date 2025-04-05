
import React from 'react';
import { GatekeeperPRData } from '@/models/PRTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface GatekeeperFormProps {
  onSubmit: (data: GatekeeperPRData) => void;
}

export const GatekeeperForm: React.FC<GatekeeperFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = React.useState<GatekeeperPRData>({
    routeName: '',
    namespace: '',
    methods: ['GET'],
    publicPath: '',
    privatePath: '',
    environment: 'dev',
    description: ''
  });

  const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const environments = ['dev', 'staging', 'prod'];
  const namespaces = ['default', 'api', 'services', 'auth'];

  const handleChange = (field: keyof GatekeeperPRData, value: any) => {
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
        <Label htmlFor="routeName">Route Name</Label>
        <Input
          id="routeName"
          value={formData.routeName}
          onChange={(e) => handleChange('routeName', e.target.value)}
          placeholder="user-service-route"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="namespace">Namespace</Label>
        <Select 
          value={formData.namespace} 
          onValueChange={(value) => handleChange('namespace', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select namespace" />
          </SelectTrigger>
          <SelectContent>
            {namespaces.map(ns => (
              <SelectItem key={ns} value={ns}>
                {ns}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="publicPath">Public Path</Label>
        <Input
          id="publicPath"
          value={formData.publicPath}
          onChange={(e) => handleChange('publicPath', e.target.value)}
          placeholder="/api/users"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="privatePath">Private Path (Internal Service Path)</Label>
        <Input
          id="privatePath"
          value={formData.privatePath}
          onChange={(e) => handleChange('privatePath', e.target.value)}
          placeholder="/users"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>HTTP Methods</Label>
        <div className="grid grid-cols-3 gap-3">
          {httpMethods.map(method => (
            <div key={method} className="flex items-center space-x-2">
              <Checkbox
                id={`method-${method}`}
                checked={formData.methods.includes(method)}
                onCheckedChange={() => handleMethodToggle(method)}
              />
              <Label htmlFor={`method-${method}`} className="text-sm font-normal">
                {method}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="environment">Environment</Label>
        <Select 
          value={formData.environment} 
          onValueChange={(value) => handleChange('environment', value)}
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
          placeholder="Brief description of the Gatekeeper route purpose"
          rows={3}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        variant="default"
      >
        Generate PR
      </Button>
    </form>
  );
};
