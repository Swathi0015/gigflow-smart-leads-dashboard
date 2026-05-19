
interface Lead {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  status?: string;
  company?: string;
  phone?: string;
}

interface LeadsTableProps {
  leads: Lead[];
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  // Defensive check: extract array if a paginated object was passed by mistake
  const safeLeads = Array.isArray(leads) 
    ? leads 
    : (leads as any)?.leads && Array.isArray((leads as any).leads)
      ? (leads as any).leads
      : [];

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.thRow}>
            <th style={styles.th}>Full Name</th>
            <th style={styles.th}>Email Address</th>
            <th style={styles.th}>Company</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {safeLeads.length === 0 ? (
            <tr>
              <td colSpan={4} style={styles.emptyCell}>
                No pipeline deals records tracked inside this workspace block folder view.
              </td>
            </tr>
          ) : (
            safeLeads.map((lead: Lead, index: number) => (
              <tr key={lead._id || lead.id || index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                <td style={styles.td}>{lead.name || "N/A"}</td>
                <td style={styles.td}>{lead.email || "N/A"}</td>
                <td style={styles.td}>{lead.company || "N/A"}</td>
                <td style={styles.td}>
                  <span style={lead.status === "Closed" ? styles.statusClosed : styles.statusActive}>
                    {lead.status || "Active"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  tableContainer: { width: "100%", overflowX: "auto" as const, backgroundColor: "#1f2937", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.2)" },
  table: { width: "100%", borderCollapse: "collapse" as const, textAlign: "left" as const, fontSize: "0.95rem" },
  thRow: { backgroundColor: "#374151", borderBottom: "2px solid #4b5563" },
  th: { padding: "1rem", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase" as const, fontSize: "0.8rem", letterSpacing: "0.05em" },
  evenRow: { backgroundColor: "#1f2937", borderBottom: "1px solid #374151" },
  oddRow: { backgroundColor: "#111827", borderBottom: "1px solid #374151" },
  td: { padding: "1rem", color: "#e5e7eb" },
  emptyCell: { padding: "3rem", textAlign: "center" as const, color: "#9ca3af", fontStyle: "italic" },
  statusActive: { padding: "0.25rem 0.6rem", backgroundColor: "#065f46", color: "#34d399", borderRadius: "50px", fontSize: "0.75rem", fontWeight: "600" },
  statusClosed: { padding: "0.25rem 0.6rem", backgroundColor: "#7f1d1d", color: "#f87171", borderRadius: "50px", fontSize: "0.75rem", fontWeight: "600" }
};