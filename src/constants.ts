import { Asset, Location, Distribution, LedgerEntry, User } from './types';

export const MOCK_ASSETS: Asset[] = [
  { id: '1', name: 'Desktop CPU', category: 'Hardware', serialNumber: 'ST-001', location: 'Main Store', status: 'Available', quantity: 5.0, uom: 'PCS' },
  { id: '2', name: 'MONITOR', category: 'Peripheral', serialNumber: 'ST-002', location: 'Main Store', status: 'Available', quantity: 3.0, uom: 'PCS' },
  { id: '3', name: 'RAM - DDR3', category: 'Component', serialNumber: 'ST-003', location: 'Storage B', status: 'Available', quantity: 3.0, uom: 'PCS' },
  { id: '4', name: 'RAM - DDR4', category: 'Component', serialNumber: 'ST-004', location: 'Storage B', status: 'Available', quantity: 2.0, uom: 'PCS' },
  { id: '5', name: 'SATA HARD DISK - OLD', category: 'Storage', serialNumber: 'ST-005', location: 'Archive', status: 'Available', quantity: 23.0, uom: 'PCS' },
  { id: '6', name: 'SSD Portable HARD DISK', category: 'Storage', serialNumber: 'ST-006', location: 'Main Store', status: 'Available', quantity: 1.0, uom: 'PCS' },
  { id: '7', name: 'Power Supply', category: 'Component', serialNumber: 'ST-007', location: 'Main Store', status: 'Available', quantity: 1.0, uom: 'PCS' },
  { id: '8', name: 'NVME-2 HARD DISK', category: 'Storage', serialNumber: 'ST-008', location: 'Server Room', status: 'Available', quantity: 0.0, uom: 'PCS' },
  { id: '9', name: 'NETWORK SWITCH', category: 'Networking', serialNumber: 'ST-009', location: 'Server Room', status: 'Available', quantity: 4.0, uom: 'PCS' },
  { id: '10', name: 'NETWORK Receiver and Access Point', category: 'Networking', serialNumber: 'ST-010', location: 'Global Office', status: 'Available', quantity: 6.0, uom: 'PCS' },
  { id: '11', name: 'Network Cable - CAT 6', category: 'Consumable', serialNumber: 'ST-011', location: 'Main Store', status: 'Available', quantity: 230.0, uom: 'METER' },
  { id: '12', name: 'Laptop', category: 'Computer', serialNumber: 'ST-012', location: 'Main Store', status: 'Available', quantity: 0.0, uom: 'PCS' },
  { id: '13', name: 'Printer for PC', category: 'Peripheral', serialNumber: 'ST-013', location: 'Main Store', status: 'Available', quantity: 1.0, uom: 'PCS' },
  { id: '14', name: 'RJ45 Connector', category: 'Consumable', serialNumber: 'ST-014', location: 'Main Store', status: 'Available', quantity: 0.0, uom: 'Box' },
  { id: '15', name: 'Keyboard', category: 'Peripheral', serialNumber: 'ST-015', location: 'Main Store', status: 'Available', quantity: 1.0, uom: 'PCS' },
  { id: '16', name: 'Mouse', category: 'Peripheral', serialNumber: 'ST-016', location: 'Main Store', status: 'Available', quantity: 0.0, uom: 'PCS' },
  { id: '17', name: 'HDMI Cable 2m', category: 'Consumable', serialNumber: 'ST-017', location: 'Main Store', status: 'Available', quantity: 15.0, uom: 'PCS' },
  { id: '18', name: 'USB-C Docking Station', category: 'Peripheral', serialNumber: 'ST-018', location: 'Main Store', status: 'Available', quantity: 8.0, uom: 'PCS' },
  { id: '19', name: 'Wireless Mouse', category: 'Peripheral', serialNumber: 'ST-019', location: 'Main Store', status: 'Available', quantity: 12.0, uom: 'PCS' },
  { id: '20', name: 'External DVD Drive', category: 'Hardware', serialNumber: 'ST-020', location: 'Storage B', status: 'Available', quantity: 4.0, uom: 'PCS' },
  { id: '21', name: 'Webcam 1080p', category: 'Peripheral', serialNumber: 'ST-021', location: 'Main Store', status: 'Available', quantity: 20.0, uom: 'PCS' },
  { id: '22', name: 'Gaming Chair', category: 'Furniture', serialNumber: 'ST-022', location: 'Office A', status: 'Available', quantity: 5.0, uom: 'PCS' },
  { id: '23', name: 'Curved Monitor 32"', category: 'Peripheral', serialNumber: 'ST-023', location: 'Main Store', status: 'Available', quantity: 2.0, uom: 'PCS' },
  { id: '24', name: 'Blue Mechanical Keyboard', category: 'Peripheral', serialNumber: 'ST-024', location: 'Main Store', status: 'Available', quantity: 7.0, uom: 'PCS' },
  { id: '25', name: 'Soundbar', category: 'Peripheral', serialNumber: 'ST-025', location: 'Office B', status: 'Available', quantity: 3.0, uom: 'PCS' },
  { id: '26', name: 'Microphone Stand', category: 'Peripheral', serialNumber: 'ST-026', location: 'Storage B', status: 'Available', quantity: 10.0, uom: 'PCS' },
  { id: '27', name: 'Pop Filter', category: 'Consumable', serialNumber: 'ST-027', location: 'Storage B', status: 'Available', quantity: 25.0, uom: 'PCS' },
  { id: '28', name: 'XLR Cable 3m', category: 'Consumable', serialNumber: 'ST-028', location: 'Storage B', status: 'Available', quantity: 18.0, uom: 'PCS' },
  { id: '29', name: 'Audio Interface', category: 'Hardware', serialNumber: 'ST-029', location: 'Main Store', status: 'Available', quantity: 2.0, uom: 'PCS' },
  { id: '30', name: 'Studio Monitors', category: 'Peripheral', serialNumber: 'ST-030', location: 'Main Store', status: 'Available', quantity: 4.0, uom: 'Pair' },
  { id: '31', name: 'Desk Desk Mat', category: 'Consumable', serialNumber: 'ST-031', location: 'Main Store', status: 'Available', quantity: 30.0, uom: 'PCS' },
  { id: '32', name: 'Ergonomic Footrest', category: 'Furniture', serialNumber: 'ST-032', location: 'Office A', status: 'Available', quantity: 12.0, uom: 'PCS' },
  { id: '33', name: 'Laptop Stand', category: 'Peripheral', serialNumber: 'ST-033', location: 'Main Store', status: 'Available', quantity: 15.0, uom: 'PCS' },
  { id: '34', name: 'Ring Light', category: 'Peripheral', serialNumber: 'ST-034', location: 'Studio', status: 'Available', quantity: 6.0, uom: 'PCS' },
  { id: '35', name: 'Green Screen', category: 'Hardware', serialNumber: 'ST-035', location: 'Studio', status: 'Available', quantity: 1.0, uom: 'PCS' },
  { id: '36', name: 'Tripod', category: 'Hardware', serialNumber: 'ST-036', location: 'Studio', status: 'Available', quantity: 5.0, uom: 'PCS' },
  { id: '37', name: 'Softbox Light Kit', category: 'Hardware', serialNumber: 'ST-037', location: 'Studio', status: 'Available', quantity: 2.0, uom: 'Set' },
  { id: '38', name: 'Camera DSL-R', category: 'Hardware', serialNumber: 'ST-038', location: 'Main Store', status: 'Available', quantity: 3.0, uom: 'PCS' },
  { id: '39', name: 'Memory Card 128GB', category: 'Storage', serialNumber: 'ST-039', location: 'Main Store', status: 'Available', quantity: 40.0, uom: 'PCS' },
  { id: '40', name: 'Flash Drive 64GB', category: 'Storage', serialNumber: 'ST-040', location: 'Main Store', status: 'Available', quantity: 100.0, uom: 'PCS' },
  { id: '41', name: 'Charging Cable iPhone', category: 'Consumable', serialNumber: 'ST-041', location: 'Main Store', status: 'Available', quantity: 50.0, uom: 'PCS' },
  { id: '42', name: 'Charging Cable Android', category: 'Consumable', serialNumber: 'ST-042', location: 'Main Store', status: 'Available', quantity: 50.0, uom: 'PCS' },
  { id: '43', name: 'Power Bank 20000mAh', category: 'Hardware', serialNumber: 'ST-043', location: 'Main Store', status: 'Available', quantity: 12.0, uom: 'PCS' },
  { id: '44', name: 'Bluetooth Headset', category: 'Peripheral', serialNumber: 'ST-044', location: 'Main Store', status: 'Available', quantity: 10.0, uom: 'PCS' },
  { id: '45', name: 'Noise Cancelling Headphones', category: 'Peripheral', serialNumber: 'ST-045', location: 'Main Store', status: 'Available', quantity: 5.0, uom: 'PCS' },
  { id: '46', name: 'Smart Watch', category: 'Hardware', serialNumber: 'ST-046', location: 'Main Store', status: 'Available', quantity: 8.0, uom: 'PCS' },
  { id: '47', name: 'Tablet 10"', category: 'Hardware', serialNumber: 'ST-047', location: 'Main Store', status: 'Available', quantity: 6.0, uom: 'PCS' },
  { id: '48', name: 'Stylus Pen', category: 'Peripheral', serialNumber: 'ST-048', location: 'Main Store', status: 'Available', quantity: 20.0, uom: 'PCS' },
  { id: '49', name: 'Protective Case Tablet', category: 'Consumable', serialNumber: 'ST-049', location: 'Storage B', status: 'Available', quantity: 15.0, uom: 'PCS' },
  { id: '50', name: 'Screen Protector', category: 'Consumable', serialNumber: 'ST-050', location: 'Storage B', status: 'Available', quantity: 30.0, uom: 'PCS' },
  { id: '51', name: 'Cleaning Kit', category: 'Consumable', serialNumber: 'ST-051', location: 'Main Store', status: 'Available', quantity: 20.0, uom: 'Set' },
  { id: '52', name: 'Air Blower', category: 'Hardware', serialNumber: 'ST-052', location: 'Maintenance', status: 'Available', quantity: 5.0, uom: 'PCS' },
  { id: '53', name: 'Soldering Iron', category: 'Hardware', serialNumber: 'ST-053', location: 'Maintenance', status: 'Available', quantity: 2.0, uom: 'PCS' },
  { id: '54', name: 'Multimeter', category: 'Hardware', serialNumber: 'ST-054', location: 'Maintenance', status: 'Available', quantity: 3.0, uom: 'PCS' },
  { id: '55', name: 'Screwdriver Set', category: 'Hardware', serialNumber: 'ST-055', location: 'Maintenance', status: 'Available', quantity: 10.0, uom: 'Set' },
  { id: '56', name: 'Ethernet Tester', category: 'Hardware', serialNumber: 'ST-056', location: 'Maintenance', status: 'Available', quantity: 2.0, uom: 'PCS' },
  { id: '57', name: 'Heat Shrink Kit', category: 'Consumable', serialNumber: 'ST-057', location: 'Main Store', status: 'Available', quantity: 4.0, uom: 'Box' },
  { id: '58', name: 'Label Maker Tape', category: 'Consumable', serialNumber: 'ST-058', location: 'Main Store', status: 'Available', quantity: 1.0, uom: 'PCS' },
];

export const MOCK_LOCATIONS: Location[] = [
  {
    id: 'LOC-001',
    name: 'North American HQ',
    cityRegion: 'New York, USA',
    assignedAssets: 4210,
    primaryContact: {
      name: 'Sarah Miller',
      role: 'IT Operations Manager',
      avatarInitials: 'SM'
    },
    status: 'Operational'
  },
  {
    id: 'LOC-042',
    name: 'London Tech Center',
    cityRegion: 'London, UK',
    assignedAssets: 2890,
    primaryContact: {
      name: 'James Hales',
      role: 'Regional Lead',
      avatarInitials: 'JH'
    },
    status: 'Operational'
  },
  {
    id: 'LOC-019',
    name: 'Singapore Hub',
    cityRegion: 'Singapore',
    assignedAssets: 1440,
    primaryContact: {
      name: 'Li Yan',
      role: 'Site Reliability Engineer',
      avatarInitials: 'LY'
    },
    status: 'Audit Required'
  },
  {
    id: 'LOC-088',
    name: 'Berlin R&D Lab',
    cityRegion: 'Berlin, Germany',
    assignedAssets: 850,
    primaryContact: {
      name: 'Otto Kraus',
      role: 'Facility IT Lead',
      avatarInitials: 'OK'
    },
    status: 'Operational'
  }
];

export const MOCK_DISTRIBUTIONS: Distribution[] = [
  {
    id: 'TRX-8829',
    assetName: 'DELL Vostro 3910',
    serialNumber: '9Z07Q14, 5C67Q14',
    quantity: 2,
    date: '29-Jan-2025',
    assignedTo: 'Mr Sayed Tajommul Ali',
    branch: 'Riyadh',
    status: 'Delivered'
  },
  {
    id: 'TRX-8830',
    assetName: 'HP- PRO TOWER 290 G9 DESKTO',
    serialNumber: '4CE334D1M8',
    quantity: 1,
    date: '04-Feb-2025',
    assignedTo: 'Ice Store Ops',
    branch: 'Ice Store',
    status: 'Delivered'
  },
  {
    id: 'TRX-8831',
    assetName: 'LENOVO -CENTRE NEO-50T Gen-4',
    serialNumber: 'GMOH92L5',
    quantity: 1,
    date: '25-Jan-2026',
    assignedTo: 'Deepak Sir',
    branch: 'Corporate HQ',
    status: 'Delivered'
  }
];

export const MOCK_LEDGER: LedgerEntry[] = [
  {
    id: '1',
    supplierName: 'Dell Technologies',
    purchaseDate: 'Oct 24, 2023',
    itemType: 'Workstation',
    qty: 12,
    totalCost: '$24,500.00',
    intakeStatus: 'Pending Delivery'
  },
  {
    id: '2',
    supplierName: 'Cisco Systems',
    purchaseDate: 'Oct 18, 2023',
    itemType: 'Networking',
    qty: 4,
    totalCost: '$18,200.00',
    intakeStatus: 'RMA Processing'
  },
  {
    id: '3',
    supplierName: 'Apple Inc.',
    purchaseDate: 'Oct 12, 2023',
    itemType: 'Laptop',
    qty: 25,
    totalCost: '$62,500.00',
    intakeStatus: 'Fully Inventoried'
  },
  {
    id: '4',
    supplierName: 'Lenovo',
    purchaseDate: 'Sep 28, 2023',
    itemType: 'Server',
    qty: 2,
    totalCost: '$14,800.00',
    intakeStatus: 'Fully Inventoried'
  }
];

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Marcus Chen',
    email: 'm.chen@precision.io',
    role: 'Technician',
    status: 'Active',
    lastAccess: '2 mins ago',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz6jIRTvX8Ald6qykzWCsk2Mm-SpFF1Dd_GbYQAysgQVYGQ6ys4yvIwmRD6FAttGPM8B6Yiklh7QRlCofKMtwaEp02oK2tBY-O5XG8o5y83kjqfJELM1Ak1eP9uFAW8XmTnyo6WKK6G2UmoNQAmQQR-P6Si5nJWJXTYM0ICe9eJSF2iMszmCcKBdnmf2CfSvR5nCf_eQ1GfusskurKMsKXhqrEzsebzSIgwfVRIs9Mm5zSwIgXxbCpWaGQy-jzXNHqnQWqC_RQIQY'
  },
  {
    id: '2',
    name: 'Elena Rodriguez',
    email: 'e.rodriguez@precision.io',
    role: 'Branch Lead',
    status: 'Active',
    lastAccess: '1 hour ago',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjmjDAp8OZU5g58UdDL91LBnbHIYtoioDlAIB_ZyDOT428K6r-nuTv1VQ4afkOWr0fJ6cfiGnt7646huG5mSpCZ8aNczb2OfHqwd4_S24pJTmN9xF-Pg4Du6pZmVp2NIUvRT1i2wBivMCyh8mzwZAZl7Ea2kt4Jw_RuC2YLvNTdyviyWqZVYC6KgJmXWlQdCofTsMMajVGp2mmIE9LzbM8XkfCfqczmrq4tY-gUoMRNrXhlrZvM_FPKQ4YXPJCtWBKSybfyGW5-Dk'
  },
  {
    id: '3',
    name: 'Julian Vane',
    email: 'j.vane@precision.io',
    role: 'Technician',
    status: 'Offline',
    lastAccess: '3 days ago',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiDbokhbvvwC2uSbL8_oJfZk6u4Xq7PH3KR3oGBFzxvGL17lLCMIVtHDMZ2441hWxFZSybE7KnX8wq4xrDa_RLfv7pyXcZNyWyqi2Yb6XNj4t3rQXxDLYkb9XvwTHDFwQf2lArhlN0IBaD50tTTm1Zb9ITh97V8Dze0sttZAxh3Yli97QGa3qTZzB5VAINOtHKfAAPhM8No6M3BIz3pSlFzL0jEsMaVNpuIu0ND0aT86Uoce7DmpuByL-tc1f8g8G6jdgQTjLilxc'
  }
];
