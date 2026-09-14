import { ComplianceStatus } from "@/types";

const STYLES: Record<ComplianceStatus, string> = {
  VALID: "bg-green-100 text-green-800 border-green-300",
  DUE_SOON: "bg-amber-100 text-amber-800 border-amber-300",
  EXPIRED: "bg-red-100 text-red-800 border-red-300",
};

const LABELS: Record<ComplianceStatus, string> = {
  VALID: "Valid",
  DUE_SOON: "Due soon",
  EXPIRED: "Expired",
};

export default function StatusBadge({ status }: { status: ComplianceStatus }) {
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
