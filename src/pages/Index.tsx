import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Shield, Wrench, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useApp, mockUsers } from '@/contexts/AppContext';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const roleCards: { role: UserRole; title: string; description: string; icon: typeof Users; features: string[] }[] = [
  {
    role: 'admin',
    title: 'Administrator',
    description: 'Full system access with user management and oversight capabilities',
    icon: Shield,
    features: ['User Management', 'Document Upload', 'System Reports', 'All Buildings'],
  },
  {
    role: 'technician',
    title: 'Technician',
    description: 'Technical diagnostics with deep O&M manual access and troubleshooting',
    icon: Wrench,
    features: ['Technical AI Guidance', 'Fault Diagnosis', 'O&M Manual Access', 'Regional Access'],
  },
  {
    role: 'client',
    title: 'Facilities Manager',
    description: 'Building overview with service request capabilities and basic guidance',
    icon: Users,
    features: ['Service Requests', 'Simple Troubleshooting', 'Document View', 'Single Building'],
  },
];

const roleBadgeClass = {
  admin: 'role-badge-admin',
  technician: 'role-badge-technician',
  client: 'role-badge-client',
};

export default function Index() {
  const navigate = useNavigate();
  const { setCurrentUser, currentUser } = useApp();

  const handleRoleSelect = (role: UserRole) => {
    setCurrentUser(mockUsers[role]);
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent shadow-accent">
                <Building2 className="h-8 w-8 text-accent-foreground" />
              </div>
            </div>
            
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Sparkles className="h-3 w-3" />
              AI-Powered Building Management
            </Badge>
            
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Building Manager AI Assistant
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Your intelligent assistant for facilities management, technical troubleshooting, 
              and O&M documentation. Select a role to experience the system.
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <span className="font-bold text-foreground">MPS</span>
              </div>
              <span>Mechanical Project Services</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold mb-2">Select Your Role</h2>
          <p className="text-muted-foreground">
            Choose how you want to experience the BMAI system
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roleCards.map((card, index) => (
            <motion.div
              key={card.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <button
                onClick={() => handleRoleSelect(card.role)}
                className={cn(
                  'w-full text-left bg-card rounded-2xl border border-border p-6',
                  'hover:shadow-xl hover:border-accent/50 hover:-translate-y-1',
                  'transition-all duration-300 group',
                  currentUser?.role === card.role && 'border-accent shadow-accent'
                )}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                    card.role === 'admin' && 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
                    card.role === 'technician' && 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
                    card.role === 'client' && 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200',
                  )}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <Badge className={cn('text-xs', roleBadgeClass[card.role])}>
                      {card.title}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {card.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {card.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all">
                  Enter as {card.title}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            <strong>Disclaimer:</strong> This is a demonstration of the BMAI system. 
            AI-generated responses are for informational purposes only and should be 
            verified by qualified personnel. MPS accepts no liability for actions taken 
            based solely on AI suggestions.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
