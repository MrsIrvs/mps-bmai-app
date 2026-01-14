import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, Grid3X3, List } from 'lucide-react';
import { Document } from '@/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock documents
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'HVAC System O&M Manual - Daikin VRV',
    buildingId: '1',
    type: 'om_manual',
    uploadedAt: new Date('2024-01-10'),
    uploadedBy: 'Sarah Mitchell',
    size: 15_420_000,
    status: 'indexed',
  },
  {
    id: '2',
    name: 'Fire Protection System Manual',
    buildingId: '1',
    type: 'compliance',
    uploadedAt: new Date('2024-01-08'),
    uploadedBy: 'Sarah Mitchell',
    size: 8_340_000,
    status: 'indexed',
  },
  {
    id: '3',
    name: 'Building Management System Guide',
    buildingId: '1',
    type: 'system_description',
    uploadedAt: new Date('2024-01-05'),
    uploadedBy: 'James Carter',
    size: 12_100_000,
    status: 'indexed',
  },
  {
    id: '4',
    name: 'Electrical Distribution O&M',
    buildingId: '1',
    type: 'om_manual',
    uploadedAt: new Date('2024-01-14'),
    uploadedBy: 'Sarah Mitchell',
    size: 6_780_000,
    status: 'processing',
  },
  {
    id: '5',
    name: 'Emergency Procedures Manual',
    buildingId: '1',
    type: 'compliance',
    uploadedAt: new Date('2024-01-03'),
    uploadedBy: 'Emily Chen',
    size: 2_450_000,
    status: 'indexed',
  },
  {
    id: '6',
    name: 'Lifts & Escalators Maintenance Guide',
    buildingId: '1',
    type: 'om_manual',
    uploadedAt: new Date('2023-12-20'),
    uploadedBy: 'James Carter',
    size: 18_900_000,
    status: 'indexed',
  },
];

export default function DocumentsPage() {
  const { selectedBuilding, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredDocs = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesBuilding = doc.buildingId === selectedBuilding?.id;
    return matchesSearch && matchesType && matchesBuilding;
  });

  return (
    <AppLayout>
      <div className="p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                Documents
              </h1>
              <p className="text-muted-foreground mt-1">
                O&M manuals and technical documentation for {selectedBuilding?.name}
              </p>
            </div>
            {currentUser?.role === 'admin' && <DocumentUpload />}
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="om_manual">O&M Manuals</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="system_description">System Descriptions</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className={cn('rounded-none', viewMode === 'grid' && 'bg-muted')}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn('rounded-none', viewMode === 'list' && 'bg-muted')}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocs.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No documents found</h3>
            <p className="text-muted-foreground">
              {searchQuery || filterType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Upload documents to get started'}
            </p>
          </div>
        ) : (
          <div
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                : 'space-y-3'
            )}
          >
            {filteredDocs.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
