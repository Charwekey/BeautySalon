import { getAuditLogs } from "@/actions/dashboardActions";
import { Shield, Sparkles, Clock, User } from "lucide-react";

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-8">
      <div>
        <span className="font-script text-2xl text-[#B8737D]">Security & Compliance</span>
        <h1 className="text-3xl font-display font-bold text-[#3D262B]">System Audit Logs</h1>
        <p className="text-xs uppercase tracking-widest text-[#6B4D54] mt-1">
          Detailed activity log of administrative actions, booking confirmations, and role updates.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8D5D8] shadow-sm p-6 sm:p-8">
        {logs.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Shield className="w-12 h-12 text-[#B8737D] mx-auto opacity-50" />
            <h3 className="font-display text-lg font-semibold text-[#3D262B]">No Audit Records Yet</h3>
            <p className="text-xs text-[#6B4D54]">
              Administrative actions will automatically be recorded here in real-time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8D5D8] text-[11px] uppercase tracking-wider font-semibold text-[#6B4D54]">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Details</th>
                  <th className="py-3.5 px-4 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D5D8]/60 text-xs text-[#3D262B]">
                {logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-[#FDF7F8] transition-colors">
                    <td className="py-4 px-4 font-semibold text-[#3D262B] flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#B8737D]" />
                      {log.userName}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[10px] uppercase font-bold text-[#B8737D] bg-[#F8ECEE] px-2.5 py-0.5 rounded-full border border-[#E4B8C0]">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-[#3D262B]">{log.action}</td>
                    <td className="py-4 px-4 font-light text-[#6B4D54]">{log.details || "-"}</td>
                    <td className="py-4 px-4 text-right text-[11px] text-[#9E8288]">
                      {new Date(log.createdAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
