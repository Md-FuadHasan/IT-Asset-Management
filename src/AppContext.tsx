import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Asset, Location, Distribution, LedgerEntry, User, SecurityRole, Permission } from './types';
import { MOCK_ASSETS, MOCK_LOCATIONS, MOCK_DISTRIBUTIONS, MOCK_LEDGER, MOCK_USERS } from './constants';

const INITIAL_PERMISSIONS: Permission[] = [
  { id: 'v-cat', label: 'View Catalog', desc: 'Read-only access to all assets', active: true, category: 'inventory' },
  { id: 'e-ast', label: 'Edit Asset Details', desc: 'Modify metadata and serial tags', active: true, category: 'inventory' },
  { id: 'd-ast', label: 'Delete Assets', desc: 'Permanent removal of inventory records', active: false, category: 'inventory' },
  { id: 'i-tra', label: 'Initiate Transfers', desc: 'Move items between locations', active: true, category: 'logistics' },
  { id: 'a-shp', label: 'Approve Shipments', desc: 'Final authorization for outgoing freight', active: false, category: 'logistics' },
  { id: 's-con', label: 'System Config', desc: 'Access to core application settings', active: false, category: 'system' },
];

const INITIAL_ROLES: SecurityRole[] = [
  { id: '1', name: 'Admin', description: 'Full system authorization', isStandard: true, permissions: ['v-cat', 'e-ast', 'd-ast', 'i-tra', 'a-shp', 's-con'] },
  { id: '2', name: 'Technician', description: 'Field operations and maintenance', isStandard: true, permissions: ['v-cat', 'e-ast', 'i-tra'] },
  { id: '3', name: 'Manager', description: 'Branch oversight and approvals', isStandard: true, permissions: ['v-cat', 'e-ast', 'i-tra', 'a-shp'] },
  { id: '4', name: 'Branch Lead', description: 'Local facility coordination', isStandard: true, permissions: ['v-cat', 'e-ast', 'i-tra'] },
  { id: '5', name: 'Audit Viewer', description: 'Compliance and reporting review', isStandard: true, permissions: ['v-cat'] },
];

interface AppContextType {
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  deleteAsset: (id: string) => void;
  
  locations: Location[];
  addLocation: (location: Omit<Location, 'id'>) => void;
  updateLocation: (id: string, location: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
  
  distributions: Distribution[];
  addDistribution: (distribution: Omit<Distribution, 'id'>) => void;
  updateDistribution: (id: string, distribution: Partial<Distribution>) => void;
  deleteDistribution: (id: string) => void;
  distributeAsset: (params: { assetId: string | 'manual'; assetName?: string; quantity: number; assignedTo: string; branch: string; date?: string; serialNumberOverride?: string }) => { success: boolean; message?: string };
  
  ledger: LedgerEntry[];
  addLedgerEntry: (entry: Omit<LedgerEntry, 'id'>) => void;
  
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  adjustQuantity: (id: string, delta: number) => void;
  
  users: User[];
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  currentUser: User | null;
  signIn: (usernameOrEmail: string, password: string) => boolean;
  signUp: (userData: Omit<User, 'id' | 'status' | 'lastAccess' | 'role' | 'avatarUrl'>) => void;
  signOut: () => void;
  
  securityRoles: SecurityRole[];
  addSecurityRole: (role: Omit<SecurityRole, 'id'>) => void;
  updateSecurityRole: (id: string, role: Partial<SecurityRole>) => void;
  deleteSecurityRole: (id: string) => void;
  
  permissions: Permission[];
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ADMIN_USER: User = {
  id: 'admin-id',
  name: 'System Admin',
  username: 'admin',
  email: 'admin@precision.io',
  password: 'admin1234',
  role: 'Admin',
  status: 'Active',
  lastAccess: 'Just now',
  avatarUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [distributions, setDistributions] = useState<Distribution[]>(MOCK_DISTRIBUTIONS);
  const [ledger, setLedger] = useState<LedgerEntry[]>(MOCK_LEDGER);
  
  // Persistence for Users
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('app_users');
    if (saved) return JSON.parse(saved);
    return [ADMIN_USER, ...MOCK_USERS];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('app_users', JSON.stringify(newUsers));
  };

  const signIn = (usernameOrEmail: string, password: string): boolean => {
    const user = users.find(u => 
      (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('current_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const signUp = (userData: any) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      role: 'Technician', // Default role for new signups
      status: 'Active',
      lastAccess: 'Just now',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username || userData.name}`
    };
    const updatedUsers = [newUser, ...users];
    saveUsers(updatedUsers);
    setCurrentUser(newUser);
    localStorage.setItem('current_user', JSON.stringify(newUser));
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('current_user');
  };

  const [securityRoles, setSecurityRoles] = useState<SecurityRole[]>(INITIAL_ROLES);
  const [permissions] = useState<Permission[]>(INITIAL_PERMISSIONS);
  const [searchQuery, setSearchQuery] = useState('');

  const addAsset = (asset: Omit<Asset, 'id'>) => {
    const newAsset: Asset = { ...asset, id: Math.random().toString(36).substr(2, 9) };
    setAssets(prev => [newAsset, ...prev]);
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const updateAsset = (id: string, updatedAsset: Partial<Asset>) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updatedAsset } : a));
  };

  const adjustQuantity = (id: string, delta: number) => {
    setAssets(prev => prev.map(a => 
      a.id === id ? { ...a, quantity: Math.max(0, a.quantity + delta) } : a
    ));
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const updatedUsers = users.map(u => u.id === id ? { ...u, ...updates } : u);
    saveUsers(updatedUsers);
  };

  const deleteUser = (id: string) => {
    if (id === 'admin-id') return; // Protect admin
    const updatedUsers = users.filter(u => u.id !== id);
    saveUsers(updatedUsers);
  };

  const addLocation = (location: Omit<Location, 'id'>) => {
    const newLoc: Location = { ...location, id: `LOC-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}` };
    setLocations(prev => [newLoc, ...prev]);
  };

  const updateLocation = (id: string, updatedLocation: Partial<Location>) => {
    setLocations(prev => prev.map(l => l.id === id ? { ...l, ...updatedLocation } : l));
  };

  const deleteLocation = (id: string) => {
    setLocations(prev => prev.filter(l => l.id !== id));
  };

  const addDistribution = (distribution: Omit<Distribution, 'id'>) => {
    const newDist: Distribution = { ...distribution, id: `TRX-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}` };
    setDistributions(prev => [newDist, ...prev]);
  };
  
  const updateDistribution = (id: string, updatedDistribution: Partial<Distribution>) => {
    setDistributions(prev => prev.map(d => d.id === id ? { ...d, ...updatedDistribution } : d));
  };
  
  const deleteDistribution = (id: string) => {
    setDistributions(prev => prev.filter(d => d.id !== id));
  };

  const distributeAsset = ({ assetId, assetName, quantity, assignedTo, branch, date, serialNumberOverride }: { assetId: string | 'manual'; assetName?: string; quantity: number; assignedTo: string; branch: string; date?: string; serialNumberOverride?: string }) => {
    let finalAssetName = assetName || '';
    let finalSerialNumber = serialNumberOverride || '';

    if (assetId !== 'manual') {
      const asset = assets.find(a => a.id === assetId);
      if (!asset) return { success: false, message: 'Asset not found' };
      if (asset.quantity < quantity) return { success: false, message: `Insufficient stock. Only ${asset.quantity} available.` };
      
      finalAssetName = asset.name;
      finalSerialNumber = serialNumberOverride || asset.serialNumber;
      
      setAssets(prev => prev.map(a => 
        a.id === assetId ? { ...a, quantity: a.quantity - quantity } : a
      ));
    }

    const newDist: Distribution = {
      id: `TRX-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
      assetId: assetId === 'manual' ? undefined : assetId,
      assetName: finalAssetName,
      serialNumber: finalSerialNumber,
      quantity,
      date: date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
      assignedTo,
      branch,
      status: 'Delivered'
    };
    
    setDistributions(prev => [newDist, ...prev]);

    // Add to ledger
    addLedgerEntry({
      supplierName: 'Internal Assignment',
      purchaseDate: newDist.date,
      itemType: finalAssetName,
      qty: -quantity,
      totalCost: '0.00',
      intakeStatus: 'Fully Inventoried'
    });

    return { success: true };
  };

  const addLedgerEntry = (entry: Omit<LedgerEntry, 'id'>) => {
    const newEntry: LedgerEntry = { ...entry, id: Math.random().toString(36).substr(2, 9) };
    setLedger(prev => [newEntry, ...prev]);
  };

  const addSecurityRole = (role: Omit<SecurityRole, 'id'>) => {
    const newRole: SecurityRole = { ...role, id: Math.random().toString(36).substr(2, 9) };
    setSecurityRoles(prev => [...prev, newRole]);
  };

  const updateSecurityRole = (id: string, updatedRole: Partial<SecurityRole>) => {
    setSecurityRoles(prev => prev.map(r => r.id === id ? { ...r, ...updatedRole } : r));
  };

  const deleteSecurityRole = (id: string) => {
    setSecurityRoles(prev => prev.filter(r => r.id !== id));
  };

  return (
    <AppContext.Provider value={{ 
      assets, addAsset, deleteAsset, updateAsset, adjustQuantity,
      locations, addLocation, updateLocation, deleteLocation,
      distributions, addDistribution, updateDistribution, deleteDistribution, distributeAsset,
      ledger, addLedgerEntry,
      users, updateUser, deleteUser, currentUser, signIn, signUp, signOut,
      securityRoles, addSecurityRole, updateSecurityRole, deleteSecurityRole,
      permissions,
      searchQuery, setSearchQuery
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
