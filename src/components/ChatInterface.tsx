
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { KafkaForm } from './KafkaForm';
import { KongForm } from './KongForm';
import { GatekeeperForm } from './GatekeeperForm';
import { PRResult as PRResultComponent } from './PRResult';
import { SendIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ChatMessage, PRData, PRResult, PRType } from '@/models/PRTypes';
import { generatePR } from '@/services/PRGenerationService';
import { v4 as uuidv4 } from 'uuid';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      type: 'bot',
      content: "Hi there! I'm your PR generation assistant. I can help you create PRs for Kafka topics, Kong routes, or Gatekeeper routes. What would you like to create today?",
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState<PRType>('kafka');
  const [prResult, setPrResult] = useState<PRResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const newUserMessage: ChatMessage = {
      id: uuidv4(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');

    // Simple bot response based on user input
    setTimeout(() => {
      let botResponse: string;

      if (inputMessage.toLowerCase().includes('kafka')) {
        botResponse = "To create a Kafka topic PR, please use the Kafka form tab.";
        setActiveTab('kafka');
      } else if (inputMessage.toLowerCase().includes('kong')) {
        botResponse = "For Kong route PRs, please switch to the Kong form tab.";
        setActiveTab('kong');
      } else if (inputMessage.toLowerCase().includes('gatekeeper')) {
        botResponse = "To create a Gatekeeper route PR, use the Gatekeeper form tab.";
        setActiveTab('gatekeeper');
      } else {
        botResponse = "I can help you create PRs for Kafka topics, Kong routes, or Gatekeeper routes. Please select the appropriate tab and fill out the form to generate a PR.";
      }

      const newBotMessage: ChatMessage = {
        id: uuidv4(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newBotMessage]);
    }, 500);
  };

  const handleFormSubmit = (type: PRType, data: PRData) => {
    try {
      // Generate the PR
      const result = generatePR(type, data);
      setPrResult(result);

      // Add a message about the generated PR
      const newBotMessage: ChatMessage = {
        id: uuidv4(),
        type: 'bot',
        content: `I've generated a PR for your ${type} configuration. You can copy the YAML or download it.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error('Error generating PR:', error);
      
      const newBotMessage: ChatMessage = {
        id: uuidv4(),
        type: 'bot',
        content: `Sorry, there was an error generating the PR: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newBotMessage]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto">
      <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
        {/* Left side - Chat */}
        <div className="flex-1 flex flex-col border rounded-lg bg-card overflow-hidden min-h-[300px]">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">PR Assistant</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map(message => (
              <ChatMessageComponent key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <Separator />
          
          <form onSubmit={handleSendMessage} className="p-4 flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <SendIcon size={18} />
            </Button>
          </form>
        </div>
        
        {/* Right side - Forms */}
        <div className="md:w-[350px] border rounded-lg bg-card">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PRType)} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="kafka" className="text-xs md:text-sm">Kafka</TabsTrigger>
              <TabsTrigger value="kong" className="text-xs md:text-sm">Kong</TabsTrigger>
              <TabsTrigger value="gatekeeper" className="text-xs md:text-sm">Gatekeeper</TabsTrigger>
            </TabsList>
            
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
              <TabsContent value="kafka">
                <KafkaForm onSubmit={(data) => handleFormSubmit('kafka', data)} />
              </TabsContent>
              
              <TabsContent value="kong">
                <KongForm onSubmit={(data) => handleFormSubmit('kong', data)} />
              </TabsContent>
              
              <TabsContent value="gatekeeper">
                <GatekeeperForm onSubmit={(data) => handleFormSubmit('gatekeeper', data)} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      
      {/* PR Result */}
      {prResult && (
        <div className="mt-4">
          <PRResultComponent 
            result={prResult} 
            onClose={() => setPrResult(null)} 
          />
        </div>
      )}
    </div>
  );
};
