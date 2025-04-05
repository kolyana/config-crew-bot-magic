import { 
  PRType, 
  KafkaPRData, 
  KongPRData, 
  GatekeeperPRData,
  PRResult
} from '../models/PRTypes';

// Generate a Kafka Topic PR
export const generateKafkaPR = (data: KafkaPRData): PRResult => {
  const { topicName, partitions, replicationFactor, retentionMs, environment, description } = data;
  
  const yamlContent = `
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: ${topicName}
  namespace: kafka-${environment}
  labels:
    strimzi.io/cluster: kafka-cluster
spec:
  partitions: ${partitions}
  replicas: ${replicationFactor}
  config:
    retention.ms: ${retentionMs}
    min.insync.replicas: ${Math.min(2, replicationFactor)}
`;

  return {
    title: `Add Kafka Topic: ${topicName} for ${environment}`,
    description: description || `This PR adds a new Kafka topic "${topicName}" in the ${environment} environment.`,
    content: yamlContent.trim(),
    type: 'kafka',
  };
};

// Generate a Kong Route PR
export const generateKongPR = (data: KongPRData): PRResult => {
  const { serviceName, routePath, methods, hosts, tags, environment, description } = data;
  
  const yamlContent = `
apiVersion: configuration.konghq.com/v1
kind: KongIngress
metadata:
  name: ${serviceName}-route
  namespace: kong-${environment}
  annotations:
    kubernetes.io/ingress.class: kong
spec:
  route:
    methods: [${methods.map(m => `"${m}"`).join(', ')}]
    paths: ["${routePath}"]
    hosts: [${hosts.map(h => `"${h}"`).join(', ')}]
    tags: [${tags.map(t => `"${t}"`).join(', ')}]
    strip_path: true
    preserve_host: true
  plugins:
  - name: cors
  - name: rate-limiting
    config:
      minute: 60
      policy: local
  service:
    name: ${serviceName}
    port: 80
`;

  return {
    title: `Add Kong Route for ${serviceName} in ${environment}`,
    description: description || `This PR adds a new Kong route for the "${serviceName}" service in the ${environment} environment.`,
    content: yamlContent.trim(),
    type: 'kong',
  };
};

// Generate a Gatekeeper Route PR
export const generateGatekeeperPR = (data: GatekeeperPRData): PRResult => {
  const { routeName, namespace, methods, publicPath, privatePath, environment, description } = data;
  
  const yamlContent = `
apiVersion: gatekeeper.io/v1
kind: Route
metadata:
  name: ${routeName}
  namespace: ${namespace}-${environment}
spec:
  public:
    path: "${publicPath}"
    methods: [${methods.map(m => `"${m}"`).join(', ')}]
  private:
    service: ${routeName.toLowerCase()}-service
    path: "${privatePath}"
  auth:
    required: true
    type: jwt
  rateLimit:
    requestsPerMinute: 60
  cors:
    enabled: true
    allowedOrigins:
      - "*"
`;

  return {
    title: `Add Gatekeeper Route: ${routeName} in ${environment}`,
    description: description || `This PR adds a new Gatekeeper route "${routeName}" in the ${environment} environment.`,
    content: yamlContent.trim(),
    type: 'gatekeeper',
  };
};

// Main PR generator function
export const generatePR = (type: PRType, data: any): PRResult => {
  switch (type) {
    case 'kafka':
      return generateKafkaPR(data as KafkaPRData);
    case 'kong':
      return generateKongPR(data as KongPRData);
    case 'gatekeeper':
      return generateGatekeeperPR(data as GatekeeperPRData);
    default:
      throw new Error(`Unsupported PR type: ${type}`);
  }
};
