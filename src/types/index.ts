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

export interface ServiceRequest {
  id: string;
  buildingId: string;
  buildingName: string;
  userId: string;
  userName: string;
  description: string;
  photoUrl?: string;
  status: 'pending' | 'dispatched' | 'in_progress' | 'resolved';
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface ChatSession {
  id: string;
  buildingId: string;
  userId: string;
  startedAt: Date;
  messageCount: number;
}
