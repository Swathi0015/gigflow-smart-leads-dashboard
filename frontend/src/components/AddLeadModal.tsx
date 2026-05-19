import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface AddLeadModalProps {
  onLeadAdded: () => void;
}

export default function AddLeadModal({ onLeadAdded }: AddLeadModalProps) {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email) {
      setError("Please fill out both Name and Email fields.");
      return;
    }

    try {
      const activeToken = token || localStorage.getItem("token");
      
      await axios.post(
        "/leads",
        { name, email, phone, company, status: "Active" },
        {
          headers: { Authorization: `Bearer ${activeToken}` }
        }
      );

      setSuccess("Lead added to data pipeline successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      onLeadAdded();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create lead entry record.");
    }
  };

  return (
    <div style={styles.modalCard}>
      <h3 style={styles.title}>Capture New Pipeline Lead</h3>
      
      {error && <div style={styles.errorText}>❌ {error}</div>}
      {success && <div style={styles.successText}>✨ {success}</div>}

      <form onSubmit={handleSubmit} style={styles.formLayout}>
        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              style={styles.field}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              placeholder="john@company.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.field}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input 
              type="text" 
              placeholder="+1234567890" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              style={styles.field}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Company (Optional)</label>
            <input 
              type="text" 
              placeholder="Acme Corp" 
              value={company} 
              onChange={(e) => setCompany(e.target.value)} 
              style={styles.field}
            />
          </div>
        </div>

        <button type="submit" style={styles.submitBtn}>Add Lead Entry</button>
      </form>
    </div>
  );
}

const styles = {
  modalCard: {
    backgroundColor: "#1f2937",
    padding: "1.5rem",
    borderRadius: "8px",
    border: "1px solid #374151",
    marginBottom: "1rem"
  },
  title: { margin: "0 0 1rem 0", fontSize: "1.2rem", fontWeight: "600", color: "#ffffff" },
  formLayout: { display: "flex", flexDirection: "column" as const, gap: "1rem" },
  row: { display: "flex", gap: "1rem" },
  inputGroup: { flex: 1, display: "flex", flexDirection: "column" as const, gap: "0.3rem" },
  label: { fontSize: "0.85rem", color: "#9ca3af", fontWeight: "500" },
  field: {
    padding: "0.6rem",
    borderRadius: "6px",
    border: "1px solid #4b5563",
    backgroundColor: "#111827",
    color: "#ffffff",
    fontSize: "0.9rem"
  },
  submitBtn: {
    padding: "0.7rem",
    backgroundColor: "#0dd39e",
    color: "#111827",
    border: "none",
    borderRadius: "6px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "0.95rem",
    marginTop: "0.5rem"
  },
  errorText: { color: "#ef4444", fontSize: "0.85rem", margin: "0 0 0.5rem 0" },
  successText: { color: "#10b981", fontSize: "0.85rem", margin: "0 0 0.5rem 0" }
};