import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ServiceRequestList } from '@/components/service-requests/ServiceRequestList';
import { useApp } from '@/contexts/AppContext';

export default function ServiceRequestsPage() {
  const { selectedBuilding } = useApp();

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
              <Wrench className="h-5 w-5 text-accent" />
            </div>
            Service Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage maintenance requests for {selectedBuilding?.name}
          </p>
        </motion.div>

        <ServiceRequestList />
      </div>
    </AppLayout>
  );
}
