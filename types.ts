
export enum ProductionStatus {
  PLANNING = 'Planning',
  QUEUED = 'Queued',
  IN_PROGRESS = 'In Progress',
  QUALITY_CHECK = 'Quality Check',
  COMPLETED = 'Completed',
  DELAYED = 'Delayed'
}

export enum QualityStatus {
  PENDING = 'Pending',
  PASS = 'Pass',
  FAIL = 'Fail'
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  HALF_DAY = 'Half Day',
  LEAVE = 'Leave'
}

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: ProductionStatus;
  priority: 'Low' | 'Medium' | 'High';
  progress: number;
}

export interface Resource {
  id: string;
  name: string;
  type: 'Machine' | 'Human' | 'Station';
  utilization: number;
  status: 'Online' | 'Offline' | 'Maintenance';
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  group: 'Raw Material' | 'Packing Material';
  quantity: number;
  unit: string;
  reorderLevel: number;
  status: 'In Stock' | 'Out of Stock';
}

export interface MaterialRequirement {
  inventoryItemId: string;
  quantityPerUnit: number;
}

export interface ProductionProcess {
  id: string;
  productName: string;
  rawMaterials: MaterialRequirement[];
  packingMaterials: MaterialRequirement[];
}

export interface QualityLog {
  id: string;
  timestamp: string;
  orderId: string;
  inspector: string;
  passed: boolean;
  defects?: string;
}

export interface RawMaterialSample {
  id: string;
  materialName: string;
  batchNumber: string;
  supplier: string;
  receivedDate: string;
  testDate?: string;
  status: QualityStatus;
  labTechnician: string;
  remarks?: string;
}

export interface GovProductSample {
  id: string;
  productName: string;
  orderNumber: string;
  officialName: string;
  department: string;
  collectionDate: string;
  resultDate?: string;
  status: QualityStatus;
  remarks?: string;
}

export interface TransportEntry {
  id: string;
  orderId: string;
  transporterName: string;
  transportCost: number;
  loadingCost: number;
  unloadingCost: number;
  labourCharge: number;
  date: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  workerCount: number;
}

export interface AttendanceRecord {
  id: string;
  warehouseId: string;
  workerName: string;
  date: string;
  status: AttendanceStatus;
  shift: 'Morning' | 'Evening' | 'Night';
}

export interface DashboardStats {
  oee: number;
  activeOrders: number;
  utilizationRate: number;
  deficiencyRate: number;
}
