"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ActivityType, Lead, LeadStage } from "@/types";

const STAGES: LeadStage[] = ["NEW", "CONTACTED", "MEETING", "PROPOSAL", "SIGNED", "LOST"];

function waLink(lead: Lead) {
  if (!lead.phone) return null;
  const digits = lead.phone.replace(/\D/g, "");
  const number = digits.length === 10 ? `91${digits}` : digits;
  const text = encodeURIComponent(
    `Namaste ${lead.contactName ?? ""}, ${lead.organizationName} cha Form B ani fire AMC baddal bolayche hote. 2 minute milel ka?`
  );
  return `https://wa.me/${number}?text=${text}`;
}

export default function LeadQueue({ leads }: { leads: Lead[] }) {
  const router = useRouter();

  async function log(lead: Lead, type: ActivityType, outcome: string, followUpInDays = 3) {
    const next = new Date();
    next.setDate(next.getDate() + followUpInDays);
    await api.leads.logActivity(lead.id, {
      type,
      outcome,
      nextFollowUpDate: next.toLocaleDateString("en-CA"), // YYYY-MM-DD, local date
    });
    router.refresh();
  }

  async function changeStage(lead: Lead, stage: LeadStage) {
    await api.leads.changeStage(lead.id, stage);
    router.refresh();
  }

  return (
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
        <tr>
          <th className="px-4 py-3">Lead</th>
          <th className="px-4 py-3">Contact</th>
          <th className="px-4 py-3">Follow-up</th>
          <th className="px-4 py-3">Stage</th>
          <th className="px-4 py-3">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {leads.map((lead) => {
          const wa = waLink(lead);
          return (
            <tr key={lead.id}>
              <td className="px-4 py-3">
                <div className="font-medium">{lead.organizationName}</div>
                <div className="text-xs text-gray-400">{lead.segment} · {lead.area ?? lead.city ?? "—"}</div>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {lead.contactName ?? "—"} {lead.contactRole && `(${lead.contactRole})`}
              </td>
              <td className="px-4 py-3 text-gray-600">{lead.nextFollowUpDate ?? "—"}</td>
              <td className="px-4 py-3">
                <select
                  value={lead.stage}
                  onChange={(e) => changeStage(lead, e.target.value as LeadStage)}
                  className="rounded-md border border-gray-300 px-2 py-1 text-xs"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td className="space-x-2 px-4 py-3">
                {wa && (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => log(lead, "WHATSAPP", "message sent")}
                    className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white"
                  >
                    WhatsApp
                  </a>
                )}
                {lead.phone && (
                  <a
                    href={`tel:${lead.phone}`}
                    onClick={() => log(lead, "CALL", "called", 2)}
                    className="rounded-md bg-brand px-3 py-1 text-xs font-medium text-white"
                  >
                    Call
                  </a>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}