
import React from 'react';
import { KafkaPRData } from '@/models/PRTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface KafkaFormProps {
  onSubmit: (data: KafkaPRData) => void;
}

export const KafkaForm: React.FC<KafkaFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = React.useState<KafkaPRData>({
    topicName: '',
    partitions: 3,
    replicationFactor: 3,
    retentionMs: 604800000, // 7 days in milliseconds
    environment: 'dev',
    description: ''
  });

  const handleChange = (field: keyof KafkaPRData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const environments = ['dev', 'staging', 'prod'];
  const retentionOptions = [
    { label: '1 day', value: 86400000 },
    { label: '3 days', value: 259200000 },
    { label: '7 days', value: 604800000 },
    { label: '30 days', value: 2592000000 }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="topicName">Topic Name</Label>
        <Input
          id="topicName"
          value={formData.topicName}
          onChange={(e) => handleChange('topicName', e.target.value)}
          placeholder="my-service.events"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="partitions">Partitions: {formData.partitions}</Label>
        <Slider
          id="partitions"
          min={1}
          max={16}
          step={1}
          value={[formData.partitions]}
          onValueChange={(value) => handleChange('partitions', value[0])}
          className="py-4"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="replicationFactor">Replication Factor: {formData.replicationFactor}</Label>
        <Slider
          id="replicationFactor"
          min={1}
          max={5}
          step={1}
          value={[formData.replicationFactor]}
          onValueChange={(value) => handleChange('replicationFactor', value[0])}
          className="py-4"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="retentionMs">Retention Period</Label>
        <Select 
          value={formData.retentionMs.toString()} 
          onValueChange={(value) => handleChange('retentionMs', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select retention period" />
          </SelectTrigger>
          <SelectContent>
            {retentionOptions.map(option => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          placeholder="Brief description of the Kafka topic purpose"
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
