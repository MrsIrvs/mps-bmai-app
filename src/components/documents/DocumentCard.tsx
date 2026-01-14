import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, AlertCircle, Loader2, MoreVertical, Download, Trash2, Eye } from 'lucide-react';
import { Document } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentCardProps {
  document: Document;
  onClick?: () => void;
}

const typeLabels = {
  om_manual: 'O&M Manual',
  compliance: 'Compliance',
  system_description: 'System Description',
  other: 'Other',
};

const statusConfig = {
  processing: {
    icon: Loader2,
    label: 'Processing',
    className: 'bg-warning/10 text-warning',
    iconClassName: 'animate-spin',
  },
  indexed: {
    icon: CheckCircle2,
    label: 'Indexed',
    className: 'bg-success/10 text-success',
    iconClassName: '',
  },
  error: {
    icon: AlertCircle,
    label: 'Error',
    className: 'bg-destructive/10 text-destructive',
    iconClassName: '',
  },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function DocumentCard({ document, onClick }: DocumentCardProps) {
  const status = statusConfig[document.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        'group relative bg-card rounded-xl border border-border p-5 cursor-pointer',
        'hover:shadow-lg hover:border-accent/30 transition-all duration-200'
      )}
      onClick={onClick}
    >
      {/* Type Badge */}
      <Badge variant="secondary" className="absolute top-4 right-14 text-xs">
        {typeLabels[document.type]}
      </Badge>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download className="mr-2 h-4 w-4" />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 shrink-0">
          <FileText className="h-6 w-6 text-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium truncate pr-20">{document.name}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>{formatFileSize(document.size)}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {document.uploadedAt.toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className={cn('inline-flex items-center gap-1.5 mt-4 px-2.5 py-1 rounded-full text-xs font-medium', status.className)}>
        <StatusIcon className={cn('h-3.5 w-3.5', status.iconClassName)} />
        {status.label}
      </div>
    </motion.div>
  );
}
