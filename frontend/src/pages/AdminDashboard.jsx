import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeAdminTab, setActiveAdminTab] = useState("teams"); // 'teams' or 'emails'
  const [submissions, setSubmissions] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminFilterPayment, setAdminFilterPayment] = useState("all");
  const [adminFilterStatus, setAdminFilterStatus] = useState("all");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTeamForModal, setSelectedTeamForModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [emailSending, setEmailSending] = useState({}); // { teamId: true/false }
  const [emailSent, setEmailSent] = useState({}); // { teamId: 'success'|'error'|null }
  // Reject reason modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const navigate = useNavigate();

  // Check authentication and load data
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminEmail");
          navigate("/admin/login");
          return;
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to load registrations");
        }

        // Map backend registrations to frontend dashboard keys
        const mappedData = data.map((item) => ({
          id: item.teamId,
          teamName: item.teamName,
          college: item.college,
          leaderName: item.leaderName,
          leaderEmail: item.leaderEmail,
          leaderMobile: item.leaderMobile,
          cityState: item.cityState || "N/A",
          memberCount: item.memberCount ? item.memberCount.toString() : "0",
          members: (item.members || []).map((m) => ({
            name: m.name,
            email: m.email,
            mobile: m.mobile,
            course: m.course || "N/A",
            year: m.year || "1st",
            branch: m.branch || "N/A",
          })),
          projectTitle: item.projectTitle || "N/A",
          problemStatement: item.problemStatement || "N/A",
          themeCategory: item.themeCategory || "General",
          projectDescription: item.projectDescription || "N/A",
          transactionId: item.transactionId,
          upiId: item.upiId || "N/A",
          filename: item.paymentScreenshot ? "Proof Image" : "N/A",
          paymentScreenshot: item.paymentScreenshot || null,
          status: item.paymentStatus === "Verified" ? "Approved" : item.paymentStatus || "Pending",
          paymentVerified: item.paymentStatus === "Verified",
          timestamp: item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A",
        }));

        setSubmissions(mappedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();

    // Load simulated emails outbox log from localStorage
    const savedEmails = localStorage.getItem("squidhack_emails");
    if (savedEmails) {
      setEmailLogs(JSON.parse(savedEmails));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  // Send real email via backend
  const handleSendEmail = async (teamId, status, reason = "") => {
    const token = localStorage.getItem("adminToken");
    const team = submissions.find((item) => item.id === teamId);
    if (!team) return;

    // Duplicate-send guard
    if (emailSent[teamId] === "success") {
      const confirmed = window.confirm(
        `An email has already been sent to ${team.leaderEmail} for this team.\n\nSend again?`
      );
      if (!confirmed) return;
    }

    setEmailSending((prev) => ({ ...prev, [teamId]: true }));
    setEmailSent((prev) => ({ ...prev, [teamId]: null }));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: team.leaderEmail,
          teamName: team.teamName,
          leaderName: team.leaderName,
          teamId: team.id,
          status,
          reason,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send email");

      setEmailSent((prev) => ({ ...prev, [teamId]: "success" }));

      // Log the sent email with timestamp, status, and optional reason
      const newLog = {
        id: teamId,
        teamName: team.teamName,
        to: team.leaderEmail,
        subject:
          status === "Approved"
            ? `✅ SquidHack 2026 — Finalist Spot Confirmed! [${team.id}]`
            : `⚠️ SquidHack 2026 — Registration Status Update [${team.id}]`,
        status,
        reason: reason || "",
        sentStatus: "success",
        timestamp: new Date().toLocaleString(),
      };
      const updatedLogs = [newLog, ...emailLogs];
      setEmailLogs(updatedLogs);
      localStorage.setItem("squidhack_emails", JSON.stringify(updatedLogs));
    } catch (err) {
      setEmailSent((prev) => ({ ...prev, [teamId]: "error" }));
      // Log failed attempt too
      const failLog = {
        id: teamId,
        teamName: team.teamName,
        to: team.leaderEmail,
        subject: `❌ FAILED — ${status} email to ${team.teamName}`,
        status,
        reason: reason || "",
        sentStatus: "error",
        timestamp: new Date().toLocaleString(),
      };
      const updatedLogs = [failLog, ...emailLogs];
      setEmailLogs(updatedLogs);
      localStorage.setItem("squidhack_emails", JSON.stringify(updatedLogs));
      alert("Email Error: " + err.message);
    } finally {
      setEmailSending((prev) => ({ ...prev, [teamId]: false }));
    }
  };

  // Open reject modal
  const openRejectModal = (teamId) => {
    setRejectTargetId(teamId);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  // Confirm rejection email from modal
  const confirmRejectEmail = () => {
    if (rejectTargetId) {
      handleSendEmail(rejectTargetId, "Rejected", rejectReason);
    }
    setRejectModalOpen(false);
    setRejectTargetId(null);
    setRejectReason("");
  };

  // Admin approval/rejection updates
  const handleUpdateStatus = async (teamId, newStatus) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations/${teamId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      // Update local state
      const updatedSubs = submissions.map((item) => {
        if (item.id === teamId) {
          return {
            ...item,
            status: newStatus === "Approved" ? "Approved" : newStatus,
            paymentVerified: newStatus === "Approved" ? true : item.paymentVerified,
          };
        }
        return item;
      });
      setSubmissions(updatedSubs);

      // Log simulated email in local storage outbox
      const targetTeam = submissions.find((item) => item.id === teamId);
      if (targetTeam) {
        // Reset email sent state so the button shows again after status change
        setEmailSent((prev) => ({ ...prev, [teamId]: null }));
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // CSV data exporter
  const handleCSVExport = () => {
    if (submissions.length === 0) {
      alert("No data available to export");
      return;
    }

    let csv =
      "Team ID,Team Name,College,Leader Name,Leader Email,Leader Mobile,City/State,Members Count,Project Title,Theme,UPI TxID,Status\n";
    submissions.forEach((item) => {
      csv += `"${item.id}","${item.teamName}","${item.college}","${item.leaderName}","${item.leaderEmail}","${item.leaderMobile}","${item.cityState}","${item.memberCount}","${item.projectTitle}","${item.themeCategory}","${item.transactionId}","${item.status}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `squidhack_finalists_${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic filter lists
  const getFilteredSubmissions = () => {
    return submissions.filter((item) => {
      const matchesSearch =
        item.teamName.toLowerCase().includes(adminSearch.toLowerCase()) ||
        item.id.toLowerCase().includes(adminSearch.toLowerCase()) ||
        item.college.toLowerCase().includes(adminSearch.toLowerCase()) ||
        item.leaderName.toLowerCase().includes(adminSearch.toLowerCase());

      const matchesPay =
        adminFilterPayment === "all" ||
        (adminFilterPayment === "verified" && item.paymentVerified) ||
        (adminFilterPayment === "pending" && !item.paymentVerified);

      const matchesStatus = adminFilterStatus === "all" || item.status === adminFilterStatus;

      return matchesSearch && matchesPay && matchesStatus;
    });
  };

  const handleOpenDetails = (id) => {
    const target = submissions.find((item) => item.id === id);
    if (target) {
      setSelectedTeamForModal(target);
      setDetailsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="ambient-bg pointer-events-none"></div>

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full px-4 sm:px-8 py-4 flex justify-between items-center z-50 bg-black/90 border-b border-gray-900">
        <Link to="/" className="flex flex-col select-none">
          <div className="font-heading font-black text-xl md:text-2xl tracking-[0.15em] leading-none uppercase">
            SQUID<br />
            H<span className="triangle-a text-[0.8em] -translate-y-[0.1em]"></span>CK
          </div>
          <div className="text-squid-pink text-[9px] font-bold tracking-[0.2em] mt-1.5 uppercase">
            &lt;/ Admin Portal &gt;
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider hidden md:inline">
            Logged as: <span className="text-white">{localStorage.getItem("adminEmail")}</span>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-gray-800 hover:border-squid-pink px-4 py-2 rounded-sm text-[10px] md:text-xs font-bold tracking-widest uppercase bg-black/40 backdrop-blur-sm transition-all duration-300 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col justify-center">
        {loading ? (
          <div className="text-center py-20 font-tech tracking-[0.3em] uppercase text-gray-500 animate-pulse text-xs">
            Loading database files...
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-500 text-sm font-bold uppercase mb-4">Error loading data</div>
            <pre className="text-xs text-gray-400 font-mono mb-6">{error}</pre>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-gray-850 hover:border-white rounded-sm text-xs font-bold uppercase tracking-widest"
            >
              Retry
            </button>
          </div>
        ) : (
          <section id="admin-section" className="w-full">
            <div className="text-center mb-10">
              <div className="flex justify-center gap-3 text-squid-pink text-sm mb-4">
                <span>◻</span>
                <span>△</span>
                <span>◯</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-heading font-black tracking-widest mb-3 uppercase">
                FRONTMAN <span className="text-squid-pink">CONTROLS</span>
              </h1>
              <p className="text-gray-400 max-w-xl mx-auto text-xs md:text-sm leading-relaxed font-medium">
                Verify finalist team registrations, verify payments, approve submissions, and monitor automated system notification logs.
              </p>
            </div>

            {/* Dashboard Card */}
            <div className="glass-card p-6 md:p-10 rounded-sm shadow-2xl flex flex-col gap-6">
              {/* Top Filters */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center border-b border-gray-900 pb-6">
                <div className="relative w-full md:w-1/3">
                  <input
                    type="text"
                    placeholder="Search Team, ID, College..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="w-full bg-black border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2 text-xs text-white focus:outline-none transition-all"
                  />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <select
                    value={adminFilterPayment}
                    onChange={(e) => setAdminFilterPayment(e.target.value)}
                    className="flex-1 md:flex-initial bg-black border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Payments</option>
                    <option value="verified">Verified Payments</option>
                    <option value="pending">Pending Payments</option>
                  </select>
                  <select
                    value={adminFilterStatus}
                    onChange={(e) => setAdminFilterStatus(e.target.value)}
                    className="flex-1 md:flex-initial bg-black border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Approved">Approved Teams</option>
                    <option value="Pending">Pending Teams</option>
                    <option value="Rejected">Rejected Teams</option>
                  </select>
                  <button
                    onClick={handleCSVExport}
                    className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-white px-4 py-2 rounded-sm text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Export
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 border-b border-gray-900">
                <button
                  onClick={() => setActiveAdminTab("teams")}
                  className={`pb-3 border-b-2 text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer ${
                    activeAdminTab === "teams"
                      ? "border-squid-pink text-white"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  }`}
                >
                  Finalist Registrations ({submissions.length})
                </button>
                <button
                  onClick={() => setActiveAdminTab("emails")}
                  className={`pb-3 border-b-2 text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer ${
                    activeAdminTab === "emails"
                      ? "border-squid-pink text-white"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  }`}
                >
                  Email Log ({emailLogs.length})
                </button>
              </div>

              {/* Teams Table */}
              {activeAdminTab === "teams" && (
                <div className="w-full overflow-x-auto -mx-2 px-2">
                  <table className="min-w-[640px] w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 uppercase tracking-wider font-bold">
                        <th className="py-3 px-4">Team ID</th>
                        <th className="py-3 px-4">Team Name</th>
                        <th className="py-3 px-4">Leader Name</th>
                        <th className="py-3 px-4">College</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900">
                      {getFilteredSubmissions().length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-gray-500 uppercase tracking-widest">
                            No registrations match your search
                          </td>
                        </tr>
                      ) : (
                        getFilteredSubmissions().map((item) => (
                          <tr key={item.id} className="border-b border-gray-900 hover:bg-white/5 transition-colors">
                            <td className="py-4 px-4 font-tech text-squid-pink font-bold">{item.id}</td>
                            <td className="py-4 px-4 font-bold text-white">{item.teamName}</td>
                            <td className="py-4 px-4 text-gray-400">{item.leaderName}</td>
                            <td className="py-4 px-4 text-gray-400">{item.college}</td>
                            <td className="py-4 px-4">
                              {item.paymentVerified ? (
                                <span className="text-green-500 font-bold">✓ Verified</span>
                              ) : (
                                <span className="text-yellow-500 font-bold">⏱ Pending</span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              {item.status === "Approved" && (
                                <span className="px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase bg-green-950/40 text-green-500 border border-green-800">
                                  Approved
                                </span>
                              )}
                              {item.status === "Rejected" && (
                                <span className="px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase bg-red-950/40 text-red-500 border border-red-800">
                                  Rejected
                                </span>
                              )}
                              {item.status === "Pending" && (
                                <span className="px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase bg-yellow-950/40 text-yellow-500 border border-yellow-800">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right flex justify-end gap-2">
                              <button
                                onClick={() => handleOpenDetails(item.id)}
                                className="px-2.5 py-1.5 bg-gray-900 border border-gray-800 hover:border-white rounded-sm text-[10px] font-bold uppercase transition-colors cursor-pointer"
                              >
                                Details
                              </button>
                              {item.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(item.id, "Approved")}
                                    className="px-2 py-1.5 bg-green-950 border border-green-800 hover:bg-green-900 rounded-sm text-[10px] font-bold uppercase text-green-500 hover:text-white transition-colors cursor-pointer"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(item.id, "Rejected")}
                                    className="px-2 py-1.5 bg-red-950 border border-red-800 hover:bg-red-900 rounded-sm text-[10px] font-bold uppercase text-red-500 hover:text-white transition-colors cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </>
                              )}
                              {(item.status === "Approved" || item.status === "Rejected") && (
                                <button
                                  onClick={() => handleSendEmail(item.id, item.status)}
                                  disabled={emailSending[item.id]}
                                  title={`Send ${item.status} email to ${item.leaderEmail}`}
                                  className={`px-2.5 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all cursor-pointer disabled:opacity-50 ${
                                    emailSent[item.id] === "success"
                                      ? "bg-green-950 border border-green-700 text-green-400"
                                      : emailSent[item.id] === "error"
                                      ? "bg-red-950 border border-red-700 text-red-400"
                                      : "bg-blue-950 border border-blue-800 hover:border-blue-500 text-blue-400 hover:text-white"
                                  }`}
                                >
                                  {emailSending[item.id]
                                    ? "..."
                                    : emailSent[item.id] === "success"
                                    ? "✓ Sent"
                                    : emailSent[item.id] === "error"
                                    ? "✕ Failed"
                                    : "✉ Email"}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Email Actions + Logs */}
              {activeAdminTab === "emails" && (
                <div className="w-full flex flex-col gap-6">

                  {/* --- One-click Email Actions Table --- */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-l-2 border-squid-pink pl-2">
                        Email Actions — Send Approve / Reject to Participants
                      </span>
                      <span className="text-[9px] text-gray-600 uppercase tracking-wider font-bold">One-click send</span>
                    </div>

                    <div className="w-full overflow-x-auto">
                      <table className="min-w-[540px] w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-gray-800 text-gray-500 uppercase tracking-wider font-bold">
                            <th className="py-3 px-3">Team</th>
                            <th className="py-3 px-3">Leader Email</th>
                            <th className="py-3 px-3">Status</th>
                            <th className="py-3 px-3 text-right">Email Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-900">
                          {submissions.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="py-8 text-center text-gray-600 uppercase tracking-widest">
                                No registrations loaded
                              </td>
                            </tr>
                          ) : (
                            submissions.map((item) => (
                              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-3 px-3">
                                  <div className="font-bold text-white">{item.teamName}</div>
                                  <div className="text-[10px] text-squid-pink font-tech">{item.id}</div>
                                </td>
                                <td className="py-3 px-3 text-gray-400 text-[11px]">{item.leaderEmail}</td>
                                <td className="py-3 px-3">
                                  {item.status === "Approved" && (
                                    <span className="px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase bg-green-950/40 text-green-500 border border-green-800">Approved</span>
                                  )}
                                  {item.status === "Rejected" && (
                                    <span className="px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase bg-red-950/40 text-red-500 border border-red-800">Rejected</span>
                                  )}
                                  {item.status === "Pending" && (
                                    <span className="px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase bg-yellow-950/40 text-yellow-500 border border-yellow-800">Pending</span>
                                  )}
                                </td>
                                <td className="py-3 px-3">
                                  <div className="flex justify-end gap-2">
                                    {/* Approve Email Button */}
                                    <button
                                      onClick={() => handleSendEmail(item.id, "Approved")}
                                      disabled={emailSending[item.id]}
                                      title={`Send Approval email to ${item.leaderEmail}`}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all cursor-pointer disabled:opacity-50 ${
                                        emailSent[item.id] === "success" && item.status === "Approved"
                                          ? "bg-green-950 border border-green-600 text-green-400"
                                          : "bg-green-950/30 border border-green-900 hover:border-green-600 hover:bg-green-950 text-green-500 hover:text-green-300"
                                      }`}
                                    >
                                      {emailSending[item.id] ? (
                                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                                      ) : emailSent[item.id] === "success" ? (
                                        <span>✓</span>
                                      ) : (
                                        <span>✉</span>
                                      )}
                                      {emailSending[item.id] ? "Sending..." : emailSent[item.id] === "success" ? "Sent" : "Approve"}
                                    </button>

                                    {/* Reject Email Button */}
                                    <button
                                      onClick={() => openRejectModal(item.id)}
                                      disabled={emailSending[item.id]}
                                      title={`Send Rejection email to ${item.leaderEmail}`}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all cursor-pointer disabled:opacity-50 ${
                                        emailSent[item.id] === "error"
                                          ? "bg-red-950 border border-red-600 text-red-400"
                                          : "bg-red-950/30 border border-red-900 hover:border-red-600 hover:bg-red-950 text-red-500 hover:text-red-300"
                                      }`}
                                    >
                                      <span>✕</span>
                                      {emailSending[item.id] ? "Sending..." : "Reject"}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* --- Email Sent Log --- */}
                  <div className="flex flex-col gap-3 border-t border-gray-900 pt-5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Sent Notifications History ({emailLogs.length})
                      </span>
                      <button
                        onClick={() => {
                          setEmailLogs([]);
                          setEmailSent({});
                          localStorage.setItem("squidhack_emails", "[]");
                        }}
                        className="text-[10px] text-squid-pink hover:text-white font-bold uppercase tracking-widest cursor-pointer"
                      >
                        Clear Log
                      </button>
                    </div>
                    <div id="email-logs-list" className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-2">
                      {emailLogs.length === 0 ? (
                        <div className="text-xs text-gray-500 py-8 text-center uppercase tracking-widest">
                          No emails sent yet
                      </div>
                    ) : (
                      emailLogs.map((log, index) => (
                        <div
                          key={index}
                          className={`bg-black/60 border p-4 rounded-sm flex flex-col gap-2 relative ${
                            log.sentStatus === "error" ? "border-red-900/60" : "border-gray-900"
                          }`}
                        >
                          <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase font-bold">
                            <span>
                              To: <strong className="text-white">{log.to}</strong>
                              {log.teamName && <span className="text-gray-600 ml-2">({log.teamName})</span>}
                            </span>
                            <span className="shrink-0 ml-2">{log.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="text-[11px] font-bold text-squid-pink tracking-wide flex-1">{log.subject}</div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase shrink-0 ${
                              log.status === "Approved"
                                ? "bg-green-950/60 text-green-500 border border-green-800"
                                : "bg-red-950/60 text-red-500 border border-red-800"
                            }`}>{log.status}</span>
                            {log.sentStatus === "error" && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase bg-orange-950/60 text-orange-400 border border-orange-800">Send Failed</span>
                            )}
                            {log.sentStatus === "success" && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase bg-green-950/30 text-green-600 border border-green-900">✓ Delivered</span>
                            )}
                          </div>
                          {log.reason && (
                            <div className="mt-1 text-[10px] text-gray-400 border-l-2 border-red-800 pl-2">
                              <span className="text-gray-600 uppercase tracking-widest text-[9px]">Reason: </span>{log.reason}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {detailsModalOpen && selectedTeamForModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
          <div className="glass-card max-w-2xl w-full p-6 md:p-8 rounded-sm border border-gray-800 flex flex-col gap-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-900 pb-4">
              <h3 className="text-base font-tech font-black tracking-widest text-white uppercase">
                REGISTRATION DETAILS: <span className="text-squid-pink">{selectedTeamForModal.id}</span>
              </h3>
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="text-gray-400 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-6 text-xs font-medium">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1 */}
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="font-bold text-gray-500 uppercase tracking-widest text-[9px] mb-1">
                      Team Information
                    </div>
                    <div className="grid grid-cols-2 gap-1 bg-black/40 p-3 rounded-sm border border-gray-900">
                      <div className="col-span-2">
                        <span className="text-gray-500">Name:</span> {selectedTeamForModal.teamName}
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">College:</span> {selectedTeamForModal.college}
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Leader:</span> {selectedTeamForModal.leaderName}
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span> {selectedTeamForModal.leaderEmail}
                      </div>
                      <div>
                        <span className="text-gray-500">Mobile:</span> {selectedTeamForModal.leaderMobile}
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">City/State:</span> {selectedTeamForModal.cityState}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-500 uppercase tracking-widest text-[9px] mb-1">
                      Project Information
                    </div>
                    <div className="flex flex-col gap-1 bg-black/40 p-3 rounded-sm border border-gray-900">
                      <div>
                        <span className="text-gray-500 font-semibold">Title:</span> {selectedTeamForModal.projectTitle}
                      </div>
                      <div>
                        <span className="text-gray-500 font-semibold">Category:</span>{" "}
                        {selectedTeamForModal.themeCategory}
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-500 block font-semibold mb-1">Problem Statement:</span>{" "}
                        {selectedTeamForModal.problemStatement}
                      </div>
                      <div className="mt-2 text-gray-400 max-h-[120px] overflow-y-auto pr-1">
                        <span className="text-gray-500 block font-semibold">Description:</span>{" "}
                        {selectedTeamForModal.projectDescription}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="font-bold text-gray-500 uppercase tracking-widest text-[9px] mb-1">
                      Payment Verification
                    </div>
                    <div className="flex flex-col gap-2 bg-black/40 p-3 rounded-sm border border-gray-900">
                      <div>
                        <span className="text-gray-500">UPI Transaction ID:</span>{" "}
                        <span className="text-squid-pink font-bold font-tech">
                          {selectedTeamForModal.transactionId}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">UPI ID Used:</span> {selectedTeamForModal.upiId}
                      </div>
                      <div>
                        <span className="text-gray-500">Receipt Screenshot:</span>{" "}
                        {selectedTeamForModal.paymentScreenshot ? (
                          <a
                            href={selectedTeamForModal.paymentScreenshot}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline font-semibold cursor-pointer block mt-1"
                          >
                            View Uploaded Screenshot →
                          </a>
                        ) : (
                          <span className="text-gray-500 block mt-1">No Screenshot Uploaded</span>
                        )}
                      </div>
                      {selectedTeamForModal.paymentScreenshot && (
                        <div className="mt-3 flex items-center justify-center border border-dashed border-gray-800 p-2 rounded-sm bg-black/80 h-32 relative overflow-hidden">
                          <img
                            src={selectedTeamForModal.paymentScreenshot}
                            alt="Receipt Preview"
                            className="h-full w-auto object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-500 uppercase tracking-widest text-[9px] mb-1">
                      Team Members ({selectedTeamForModal.memberCount})
                    </div>
                    <div className="bg-black/40 p-3 rounded-sm border border-gray-900 max-h-[200px] overflow-y-auto flex flex-col gap-3">
                      <div>
                        <div className="font-bold text-squid-pink uppercase tracking-widest text-[10px]">
                          Member 1 (Leader)
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <span className="text-gray-500">Name:</span> {selectedTeamForModal.leaderName}
                          </div>
                          <div>
                            <span className="text-gray-500">Mobile:</span> {selectedTeamForModal.leaderMobile}
                          </div>
                        </div>
                      </div>
                      {selectedTeamForModal.members.map((m, mIdx) => (
                        <div key={mIdx} className="border-t border-gray-900 pt-3 mt-3">
                          <div className="font-bold text-squid-pink uppercase tracking-widest text-[10px]">
                            Member {mIdx + 2} Details
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <span className="text-gray-500">Name:</span> {m.name}
                            </div>
                            <div>
                              <span className="text-gray-500">Email:</span> {m.email}
                            </div>
                            <div>
                              <span className="text-gray-500">Mobile:</span> {m.mobile}
                            </div>
                            <div>
                              <span className="text-gray-500">Course:</span> {m.course}
                            </div>
                            <div>
                              <span className="text-gray-500">Year:</span> {m.year}
                            </div>
                            <div>
                              <span className="text-gray-500">Branch:</span> {m.branch}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
