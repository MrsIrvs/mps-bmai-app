import { motion } from 'framer-motion';
import { HardHat } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContractorManagement } from '@/components/contractors/ContractorManagement';

export default function ContractorsPage() {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <HardHat className="h-5 w-5 text-accent" />
            </div>
            Contractors
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage external service providers and their building assignments
          </p>
        </motion.div>

        <ContractorManagement />
      </div>
    </AppLayout>
  );
}
