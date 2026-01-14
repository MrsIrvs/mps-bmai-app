import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Building2, AlertCircle } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const roleGreetings = {
  admin: 'Hello! I\'m your Building AI Assistant. As an administrator, I can help you with system oversight, user management insights, and technical documentation across all buildings.',
  technician: 'G\'day! I\'m here to help you diagnose and fix equipment faults. I have access to detailed O&M manuals and can provide step-by-step troubleshooting guidance for any system in this building.',
  client: 'Welcome! I\'m your Building AI Assistant. I can help you understand maintenance issues, find information in the building documentation, and submit service requests when needed.',
};

const samplePrompts = {
  admin: [
    'Show me a summary of all service requests this week',
    'Which documents are pending indexing?',
    'List all technicians assigned to WA region',
  ],
  technician: [
    'AHU-03 is showing fault code E47. What does this mean?',
    'What\'s the startup procedure for the chiller system?',
    'Where is the main electrical switchboard located?',
  ],
  client: [
    'The AC in level 3 isn\'t cooling properly',
    'Who do I contact for after-hours emergencies?',
    'When was the fire system last serviced?',
  ],
};

export function ChatInterface() {
  const { currentUser, selectedBuilding } = useApp();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!currentUser || !selectedBuilding) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSimulatedResponse(content, currentUser.role),
        timestamp: new Date(),
        sources: Math.random() > 0.5 ? [
          { documentName: 'HVAC O&M Manual', section: 'Troubleshooting', page: 47 },
        ] : undefined,
        isExternalSource: content.toLowerCase().includes('general') || Math.random() > 0.8,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  if (!currentUser || !selectedBuilding) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Please select a building to start chatting</p>
      </div>
    );
  }

  const prompts = samplePrompts[currentUser.role];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold">AI Assistant</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                {selectedBuilding.name}
              </div>
            </div>
          </div>
          <Badge variant="secondary" className={cn(
            currentUser.role === 'admin' && 'role-badge-admin',
            currentUser.role === 'technician' && 'role-badge-technician',
            currentUser.role === 'client' && 'role-badge-client',
          )}>
            {currentUser.role === 'client' ? 'FM Mode' : `${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Mode`}
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="max-w-4xl mx-auto py-6">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">How can I help you today?</h3>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                {roleGreetings[currentUser.role]}
              </p>

              {/* Sample prompts */}
              <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
                {prompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(prompt)}
                    className={cn(
                      'px-4 py-2.5 rounded-xl text-sm text-left',
                      'bg-card border border-border hover:border-accent/50 hover:bg-accent/5',
                      'transition-all duration-200'
                    )}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="flex items-center justify-center gap-2 mt-8 text-xs text-muted-foreground">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>AI responses should be verified by qualified personnel</span>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4 py-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                    <Sparkles className="h-5 w-5 text-accent-foreground animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

function getSimulatedResponse(query: string, role: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('fault') || lowerQuery.includes('error') || lowerQuery.includes('e47')) {
    if (role === 'technician') {
      return `**Fault Code E47: High Pressure Trip**

Based on the HVAC O&M Manual for this building's Daikin VRV system:

**Probable Causes:**
1. Dirty condenser coils (most common)
2. Refrigerant overcharge
3. Non-condensables in system
4. Condenser fan failure

**Recommended Diagnostic Steps:**
1. Check condenser coil condition - clean if dirty
2. Verify all condenser fans are operational
3. Check discharge pressure reading (should be <27 bar)
4. Inspect for refrigerant leaks if recently serviced

**Required Tools:** Manifold gauge set, coil cleaner, digital multimeter

Would you like detailed cleaning procedures or electrical testing steps?`;
    } else {
      return `I can see you're experiencing an issue with the HVAC system. Fault E47 typically indicates a high-pressure condition.

**What you can safely check:**
- Is the outdoor unit's airflow blocked by debris or objects?
- Can you hear the outdoor fans running?

⚠️ **Important:** For your safety, please don't attempt to open or service any equipment panels.

Would you like me to help you submit a service request to have a technician investigate?`;
    }
  }

  if (lowerQuery.includes('service request') || lowerQuery.includes('submit')) {
    return `I'd be happy to help you create a service request. Please provide:

1. **Description** of the issue
2. **Location** within the building
3. **Priority level** (Low/Medium/High)
4. **Photo** (optional but helpful)

You can also click the wrench icon in the sidebar to go directly to the Service Request form.`;
  }

  return `Thank you for your question about "${query.slice(0, 50)}${query.length > 50 ? '...' : ''}". 

I've searched the building documentation and found relevant information. Based on the building's O&M manuals, here's what I can tell you:

This facility uses integrated building management systems with scheduled maintenance protocols. For specific equipment details, I recommend checking the equipment registers in the Documents section.

Is there anything specific you'd like me to look up in more detail?`;
}
