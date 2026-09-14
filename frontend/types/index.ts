export type ComplianceType =
  | "FORM_B"
  | "AMC_COMPREHENSIVE"
  | "AMC_NON_COMPREHENSIVE"
  | "FIRE_NOC"
  | "OTHER";

export type ComplianceStatus = "VALID" | "DUE_SOON" | "EXPIRED";

export type StakeholderRole =
  | "ARCHITECT"
  | "DESIGNER"
  | "VENDOR"
  | "CHAIRMAN"
  | "ADMIN";

export interface Building {
  id: number;
  name: string;
  address: string;
  city?: string;
  buildingType?: string;
  societyChairmanName?: string;
  societyChairmanContact?: string;
}

export interface ComplianceItem {
  id: number;
  building: Building;
  type: ComplianceType;
  issuingAuthority?: string;
  validFrom: string; // ISO date
  validUntil: string; // ISO date
  renewalCycleMonths?: number;
  status: ComplianceStatus;
}

export interface DashboardItem {
  complianceItemId: number;
  buildingId: number;
  buildingName: string;
  type: ComplianceType;
  validUntil: string;
  status: ComplianceStatus;
}

export interface Stakeholder {
  id: number;
  name: string;
  role: StakeholderRole;
  email?: string;
  phone?: string;
  organization?: string;
}
