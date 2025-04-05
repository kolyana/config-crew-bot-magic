// Types for PR generation

export type PRType = 'kafka' | 'kong' | 'gatekeeper';

// Kafka Topic PR data
export interface KafkaPRData {
  topicName: string;
  partitions: number;
  replicationFactor: number;
  retentionMs: number;
  environment: string;
  description: string;
}

// Kong Route PR data
export interface KongPRData {
  serviceName: string;
  routePath: string;
  methods: string[];
  hosts: string[];
  tags: string[];
  environment: string;
  description: string;
}

// Gatekeeper Route PR data
export interface GatekeeperPRData {
  routeName: string;
  namespace: string;
  methods: string[];
  publicPath: string;
  privatePath: string;
  environment: string;
  description: string;
}

// Combined type for all PR data
export type PRData = KafkaPRData | KongPRData | GatekeeperPRData;

// Message in the chat
export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

// PR Result
export interface PRResult {
  title: string;
  description: string;
  content: string;
  type: PRType;
}
