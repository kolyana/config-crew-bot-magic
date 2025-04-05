
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">DevOps PR Generator</h1>
        <p className="text-muted-foreground">
          Generate PRs for Kafka topics, Kong routes, and Gatekeeper routes
        </p>
      </header>
      
      <main>
        <ChatInterface />
      </main>
    </div>
  );
};

export default Index;
