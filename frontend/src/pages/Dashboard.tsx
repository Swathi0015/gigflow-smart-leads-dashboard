import { useEffect, useState } from "react";
import axios from "axios";

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
}

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  // FETCH LEADS
  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/leads",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      setLeads(response.data.leads);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch leads");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // DELETE LEAD
  const deleteLead = async (id: string) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/leads/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchLeads();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  // EXPORT CSV
  const exportCSV = () => {
    let csv =
      "Name,Email,Status,Source\n";

    leads.forEach((lead) => {
      csv += `${lead.name},${lead.email},${lead.status},${lead.source}\n`;
    });

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download = "leads.csv";

    a.click();
  };

  // SEARCH FILTER
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      lead.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
          }}
        >
          Smart Leads Dashboard
        </h1>

        <button
          onClick={() => {
            localStorage.clear();

            window.location.href =
              "/login";
          }}
          style={{
            background: "red",
            color: "white",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* SEARCH + EXPORT */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            padding: "10px",
            width: "300px",
          }}
        />

        <button
          onClick={exportCSV}
          style={{
            background: "blue",
            color: "white",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Export CSV
        </button>
      </div>

      {/* TABLE */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#1e293b",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                border:
                  "1px solid gray",
                padding: "15px",
              }}
            >
              Name
            </th>

            <th
              style={{
                border:
                  "1px solid gray",
              }}
            >
              Email
            </th>

            <th
              style={{
                border:
                  "1px solid gray",
              }}
            >
              Status
            </th>

            <th
              style={{
                border:
                  "1px solid gray",
              }}
            >
              Source
            </th>

            <th
              style={{
                border:
                  "1px solid gray",
              }}
            >
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredLeads.map((lead) => (
            <tr key={lead._id}>
              <td
                style={{
                  border:
                    "1px solid gray",
                  padding: "15px",
                }}
              >
                {lead.name}
              </td>

              <td
                style={{
                  border:
                    "1px solid gray",
                }}
              >
                {lead.email}
              </td>

              <td
                style={{
                  border:
                    "1px solid gray",
                }}
              >
                {lead.status}
              </td>

              <td
                style={{
                  border:
                    "1px solid gray",
                }}
              >
                {lead.source}
              </td>

              <td
                style={{
                  border:
                    "1px solid gray",
                }}
              >
                <button
                  onClick={() =>
                    deleteLead(
                      lead._id
                    )
                  }
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding:
                      "8px 15px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;