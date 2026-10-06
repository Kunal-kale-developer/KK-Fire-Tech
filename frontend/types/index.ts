export type ComplianceType =
  | "FORM_A" // Fire Safety Certificate
  | "FORM_B" // Annual Fire Safety Audit Report
  | "FORM_N" // Fire NOC
  | "AMC_COMPREHENSIVE"
  | "AMC_NON_COMPREHENSIVE"
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

// ---------- Outreach (AMC sales pipeline) ----------

export type Segment = "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL";

export type LeadStage =
  | "NEW"
  | "CONTACTED"
  | "MEETING"
  | "PROPOSAL"
  | "SIGNED"
  | "LOST";

export type LeadSource =
  | "GOOGLE_MAPS"
  | "REFERRAL"
  | "EXISTING_CLIENT"
  | "OTHER";

export type ActivityType =
  | "CALL"
  | "WHATSAPP"
  | "VISIT"
  | "EMAIL"
  | "PROPOSAL_SENT";

export interface Lead {
  id: number;
  organizationName: string;
  segment: Segment;
  source: LeadSource;
  stage: LeadStage;
  city?: string;
  area?: string;
  contactName?: string;
  contactRole?: string;
  phone?: string;
  email?: string;
  ownerName?: string;
  nextFollowUpDate?: string; // ISO date
}

export interface LeadActivity {
  id: number;
  type: ActivityType;
  outcome?: string;
  doneAt: string;
}