import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Wrench, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useApp, mockUsers } from '@/contexts/AppContext';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import mpsLogo from '@/assets/mps-logo.png';

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
    <div className="min-h-screen bg-background font-body">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-light)' }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <img src={mpsLogo} alt="MPS Logo" className="h-20 w-auto" />
            </div>
            
            <Badge variant="secondary" className="mb-4 gap-1.5 bg-primary/10 text-primary border-0">
              <Sparkles className="h-3 w-3" />
              AI-Powered Building Management
            </Badge>
            
            <h1 className="text-4xl lg:text-5xl font-heading font-semibold tracking-tight mb-4 text-foreground">
              Building Manager AI Assistant
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-body">
              Your intelligent assistant for facilities management, technical troubleshooting, 
              and O&M documentation. Select a role to experience the system.
            </p>

            <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium">Powered by</span>
              <span className="font-heading font-semibold text-foreground">Mechanical Project Services</span>
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
          <h2 className="text-2xl font-heading font-semibold mb-2">Select Your Role</h2>
          <p className="text-muted-foreground font-body">
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
                    card.role === 'admin' && 'bg-primary/10 text-primary group-hover:bg-primary/20',
                    card.role === 'technician' && 'bg-info/10 text-info group-hover:bg-info/20',
                    card.role === 'client' && 'bg-success/10 text-success group-hover:bg-success/20',
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
