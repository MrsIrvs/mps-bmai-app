export type UserRole = 'admin' | 'technician' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  buildings: string[];
  region?: string;
  createdAt: Date;
}

export interface Building {
  id: string;
  name: string;
  address: string;
  region: string;
  imageUrl?: string;
  documentsCount: number;
  status: 'online' | 'offline' | 'warning';
}

export interface Document {
  id: string;
  name: string;
  buildingId: string;
  type: 'om_manual' | 'compliance' | 'system_description' | 'other';
  uploadedAt: Date;
  uploadedBy: string;
  size: number;
  status: 'processing' | 'indexed' | 'error';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: DocumentSource[];
  isExternalSource?: boolean;
}

export interface DocumentSource {
  documentName: string;
  section: string;
  page?: number;
}

// Equipment/service categories (matches manual equipment types)
export type EquipmentCategory = 'HVAC' | 'Electrical' | 'Fire' | 'Plumbing' | 'Hydraulic' | 'Security' | 'Lift' | 'Other';

// Request priority and status
export type RequestPriority = 'low' | 'medium' | 'high';
export type RequestStatus = 'pending' | 'dispatched' | 'in_progress' | 'resolved';

export interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BuildingServiceProviderAssignment {
  id: string;
  buildingId: string;
  serviceProviderId: string;
  category: EquipmentCategory;
  createdBy?: string;
  createdAt: Date;
  // Joined data (optional)
  serviceProvider?: ServiceProvider;
  building?: Building;
}

export interface ServiceRequest {
  id: string;
  buildingId: string;
  title: string;
  description: string;
  category: EquipmentCategory;
  priority: RequestPriority;
  status: RequestStatus;
  location?: string;
  dueDate?: Date;
  photoUrls: string[];
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  // Joined data (optional, for display purposes)
  buildingName?: string;
  createdByName?: string;
}

export interface ChatSession {
  id: string;
  buildingId: string;
  userId: string;
  startedAt: Date;
  messageCount: number;
}
