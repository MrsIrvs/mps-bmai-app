import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BuildingManagement } from '@/components/buildings/BuildingManagement';

export default function BuildingsPage() {
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
              <Building2 className="h-5 w-5 text-accent" />
            </div>
            Building Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage buildings, regions, and access settings
          </p>
        </motion.div>

        <BuildingManagement />
      </div>
    </AppLayout>
  );
}
