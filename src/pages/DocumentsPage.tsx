import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, Grid3X3, List } from 'lucide-react';
import { Document } from '@/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
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
import { supabase } from '@/integrations/supabase/client';

export default function DocumentsPage() {
  const { selectedBuilding } = useApp();
  const { role } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch documents from Supabase
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!selectedBuilding) {
        setDocuments([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('manuals')
          .select('*')
          .eq('building_id', selectedBuilding.id)
          .eq('is_active', true)
          .order('upload_date', { ascending: false });

        if (error) {
          console.error('Error fetching documents:', error);
          setDocuments([]);
        } else {
          // Transform database records to Document type
          const transformedDocs: Document[] = (data || []).map((manual) => ({
            id: manual.manual_id,
            name: manual.manual_name,
            buildingId: manual.building_id,
            type: manual.equipment_type || 'other',
            uploadedAt: new Date(manual.upload_date),
            uploadedBy: 'User', // TODO: Join with profiles table to get actual uploader name
            size: manual.file_size_bytes || 0,
            status: manual.processing_status === 'completed' ? 'indexed' :
                   manual.processing_status === 'processing' ? 'processing' : 'pending',
          }));
          setDocuments(transformedDocs);
        }
      } catch (error) {
        console.error('Exception fetching documents:', error);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [selectedBuilding]);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
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
            {role === 'admin' && <DocumentUpload />}
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
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
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
