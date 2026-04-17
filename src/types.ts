export type AssetStatus = 'Available' | 'In Use' | 'Maintenance' | 'Operational' | 'Audit Required' | 'Delayed' | 'Preparing' | 'In Transit';

export interface Asset {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  location: string;
  status: AssetStatus;
  quantity: number;
  uom: string;
  assignedTo?: string;
  ticket?: string;
}

export interface Location {
  id: string;
  name: string;
  cityRegion: string;
  assignedAssets: number;
  primaryContact: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  status: 'Operational' | 'Audit Required';
}

export interface Distribution {
  id: string;
  assetId?: string;
  assetName: string;
  serialNumber: string;
  quantity: number;
  date: string;
  assignedTo: string;
  branch: string;
  status: 'Delivered' | 'In Transit' | 'Preparing';
}

export interface LedgerEntry {
  id: string;
  supplierName: string;
  purchaseDate: string;
  itemType: string;
  qty: number;
  totalCost: string;
  intakeStatus: 'Pending Delivery' | 'RMA Processing' | 'Fully Inventoried';
}

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: string;
  status: 'Active' | 'Offline';
  lastAccess: string;
  avatarUrl: string;
}

export interface Permission {
  id: string;
  label: string;
  desc: string;
  active: boolean;
  category: 'inventory' | 'logistics' | 'system';
}

export interface SecurityRole {
  id: string;
  name: string;
  description: string;
  isStandard: boolean;
  permissions: string[]; // List of permission IDs
}
