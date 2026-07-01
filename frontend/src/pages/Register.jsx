import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import Footer from "../components/Footer.jsx";

const Register = () => {
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [selectedFile, setSelectedFile] = useState(null);
  const [paymentFile, setPaymentFile] = useState(null);

  // Form inputs data
  const [formData, setFormData] = useState({
    teamName: "",
    college: "",
    leaderName: "",
    leaderEmail: "",
    leaderMobile: "",
    cityState: "",
    memberCount: "1",
    projectTitle: "",
    problemStatement: "",
    themeCategory: "Innovate",
    projectDescription: "",
    transactionId: "",
    upiId: "",
    agree1: false,
    agree2: false,
    agree3: false,
    agree4: false,
    agree5: false,
  });

  // Success Overlay States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedTeamId, setAssignedTeamId] = useState("");
  const [successOverlayOpen, setSuccessOverlayOpen] = useState(false);

  // Load from local storage draft
  useEffect(() => {
    const draftRaw = localStorage.getItem("squidhack_draft");
    if (draftRaw) {
      try {
        setFormData(JSON.parse(draftRaw));
      } catch (err) {
        console.error("Failed to load draft", err);
      }
    }
  }, []);

  // Auto-save form draft to local storage
  useEffect(() => {
    localStorage.setItem("squidhack_draft", JSON.stringify(formData));
  }, [formData]);

  // Sticky header transition on scroll
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Word counter helper
  const getDescriptionWordCount = () => {
    const text = formData.projectDescription || "";
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  // Dynamic input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // File Upload screenshot selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file.name);
      setPaymentFile(file);
    }
  };

  // Step Validation logic
  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      const { teamName, college, leaderName, leaderEmail, leaderMobile, cityState } = formData;
      return (
        teamName &&
        college &&
        leaderName &&
        leaderEmail &&
        leaderMobile &&
        cityState &&
        leaderMobile.length === 10
      );
    }
    if (stepNum === 2) {
      const count = parseInt(formData.memberCount || 1);
      for (let i = 2; i <= count; i++) {
        const name = formData[`memberName_${i}`];
        const email = formData[`memberEmail_${i}`];
        const mobile = formData[`memberMobile_${i}`];
        if (!name || !email || !mobile || mobile.length !== 10) {
          return false;
        }
      }
      return true;
    }
    if (stepNum === 3) {
      const { projectTitle, problemStatement, themeCategory, projectDescription } = formData;
      const wordCount = getDescriptionWordCount();
      return projectTitle && problemStatement && themeCategory && projectDescription && wordCount <= 500;
    }
    if (stepNum === 4) {
      const { transactionId } = formData;
      return transactionId && transactionId.length === 12 && selectedFile;
    }
    if (stepNum === 5) {
      const { agree1, agree2, agree3, agree4, agree5 } = formData;
      return agree1 && agree2 && agree3 && agree4 && agree5;
    }
    return true;
  };

  const handleStepNavigation = (direction) => {
    if (direction === 1 && !validateStep(currentStep)) {
      alert("Please fill out all required fields correctly before moving to the next step.");
      return;
    }
    const nextStep = currentStep + direction;
    if (nextStep >= 1 && nextStep <= totalSteps) {
      setCurrentStep(nextStep);
      window.scrollTo({ top: 150, behavior: "smooth" });
    }
  };

  const triggerConfetti = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  // Final Registration Submission Handler
  const handleFormSubmit = (e) => {
    e.preventDefault();

    let firstInvalidStep = 0;
    for (let s = 1; s <= totalSteps; s++) {
      if (!validateStep(s)) {
        firstInvalidStep = s;
        break;
      }
    }

    if (firstInvalidStep > 0) {
      setCurrentStep(firstInvalidStep);
      alert("Validation failed. Returning to Step " + firstInvalidStep + " to correct errors.");
      return;
    }

    setIsSubmitting(true);
    const teamId = "SQ-" + Math.floor(1000 + Math.random() * 9000);

    // Build multipart/form-data payload
    const payload = new FormData();
    payload.append("teamId", teamId);
    payload.append("teamName", formData.teamName);
    payload.append("college", formData.college);
    payload.append("leaderName", formData.leaderName);
    payload.append("leaderEmail", formData.leaderEmail);
    payload.append("leaderMobile", formData.leaderMobile);
    payload.append("cityState", formData.cityState);
    payload.append("memberCount", formData.memberCount);
    payload.append("projectTitle", formData.projectTitle);
    payload.append("problemStatement", formData.problemStatement);
    payload.append("themeCategory", formData.themeCategory);
    payload.append("projectDescription", formData.projectDescription);
    payload.append("transactionId", formData.transactionId);
    payload.append("upiId", formData.upiId || "N/A");

    // Gather dynamic member details
    const members = [];
    const count = parseInt(formData.memberCount, 10);
    for (let i = 2; i <= count; i++) {
      members.push({
        name: formData[`memberName_${i}`],
        email: formData[`memberEmail_${i}`],
        mobile: formData[`memberMobile_${i}`],
        year: formData[`college_${i}`],
      });
    }
    payload.append("members", JSON.stringify(members));

    // Append file if selected
    if (paymentFile) {
      payload.append("paymentScreenshot", paymentFile);
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/registrations`, {
      method: "POST",
      body: payload,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Registration failed on server");
        }
        return response.json();
      })
      .then((savedRegistration) => {
        // Log simulated email in local storage outbox
        const newEmail = {
          to: savedRegistration.leaderEmail,
          subject: `SquidHack 2026 - Registration Received (Team ID: ${savedRegistration.teamId})`,
          body: `Greetings ${savedRegistration.leaderName},\n\nWe have received your finalist registration for Team '${savedRegistration.teamName}' (ID: ${savedRegistration.teamId}). Our organizers are verifying your ₹1500 transaction ID: ${savedRegistration.transactionId}. See you in the arena!`,
          timestamp: new Date().toLocaleString(),
        };

        const savedEmails = localStorage.getItem("squidhack_emails");
        const currentEmails = savedEmails ? JSON.parse(savedEmails) : [];
        const updatedEmails = [newEmail, ...currentEmails];
        localStorage.setItem("squidhack_emails", JSON.stringify(updatedEmails));

        // Reset form states
        setFormData({
          teamName: "",
          college: "",
          leaderName: "",
          leaderEmail: "",
          leaderMobile: "",
          cityState: "",
          memberCount: "1",
          projectTitle: "",
          problemStatement: "",
          themeCategory: "Innovate",
          projectDescription: "",
          transactionId: "",
          upiId: "",
          agree1: false,
          agree2: false,
          agree3: false,
          agree4: false,
          agree5: false,
        });
        localStorage.removeItem("squidhack_draft");
        setSelectedFile(null);
        setPaymentFile(null);
        setCurrentStep(1);

        // Trigger success view
        setAssignedTeamId(savedRegistration.teamId || teamId);
        setIsSubmitting(false);
        setSuccessOverlayOpen(true);
        triggerConfetti();
      })
      .catch((err) => {
        console.error("Server submission failed:", err);
        alert("Registration failed. Please make sure the backend server is running and try again.");
        setIsSubmitting(false);
      });
  };

  // Dynamic Member inputs arrays helper
  const getMemberIndices = () => {
    const indices = [];
    const count = parseInt(formData.memberCount || 1);
    for (let i = 2; i <= count; i++) {
      indices.push(i);
    }
    return indices;
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="ambient-bg pointer-events-none"></div>

      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 w-full px-8 py-4 flex justify-between items-center z-50 transition-all duration-300 ${
          isScrolled ? "bg-black py-3 border-b border-gray-900" : "bg-black/80 border-b border-gray-900/60"
        }`}
      >
        <Link to="/" className="flex flex-col select-none">
          <div className="font-heading font-black text-xl md:text-2xl tracking-[0.15em] leading-none uppercase">
            SQUID<br />
            H<span className="triangle-a text-[0.8em] -translate-y-[0.1em]"></span>CK
          </div>
          <div className="text-squid-pink text-[9px] font-bold tracking-[0.2em] mt-1">&lt;/ REGISTRATION &gt;</div>
        </Link>

        <div className="flex items-center gap-3">

          <Link
            to="/"
            className="border border-gray-800 hover:border-white px-4 py-2 rounded-sm text-[10px] md:text-xs font-bold tracking-widest uppercase bg-black/40 backdrop-blur-sm transition-all duration-300"
          >
            Back to Site
          </Link>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col justify-center">
        {/* REGISTRATION FORM VIEW */}
        <section id="registration-section" className="w-full">
          <div className="text-center mb-10">
            <div className="flex justify-center gap-3 text-squid-pink text-sm mb-4">
              <span>◯</span>
              <span>△</span>
              <span>◻</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-black tracking-widest mb-3 uppercase">
              FINALIST <span className="text-squid-pink">REGISTRATION</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto text-xs md:text-sm leading-relaxed font-medium">
              Congratulations! Your team has been shortlisted as a finalist. Confirm your participation by completing details and
              verifying your <strong className="text-white">₹1500</strong> registration fee.
            </p>

            {/* Draft Indicator */}
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest select-none">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              <span>Enter Valid Details</span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="mb-10 max-w-3xl mx-auto px-4">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gray-900 z-0">
                <div
                  className="h-full bg-squid-pink transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                ></div>
              </div>

              {[1, 2, 3, 4, 5].map((step) => {
                const stepNames = ["Team", "Members", "Project", "Payment", "Agreement"];
                const isCurrent = step === currentStep;
                const isCompleted = step < currentStep;
                let borderClass = "border-gray-800 text-gray-500";
                if (isCurrent) borderClass = "border-squid-pink text-squid-pink shadow-[0_0_10px_rgba(249,0,77,0.3)]";
                else if (isCompleted) borderClass = "border-green-500 text-green-500";

                return (
                  <div key={step} className="step-indicator relative z-10 flex flex-col items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full border-2 bg-black flex items-center justify-center font-tech text-xs font-black transition-all duration-300 ${borderClass}`}
                    >
                      {step}
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 hidden sm:inline">
                      {stepNames[step - 1]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content Card */}
          <form
            onSubmit={handleFormSubmit}
            noValidate
            className="glass-card p-6 md:p-10 rounded-sm shadow-2xl flex flex-col gap-8 max-w-3xl mx-auto border border-gray-800"
          >
            {/* STEP 1: TEAM DETAILS */}
            {currentStep === 1 && (
              <div className="step-pane flex flex-col gap-6">
                <div className="border-b border-gray-900 pb-4">
                  <h2 className="text-xl font-tech font-black tracking-widest uppercase text-white flex items-center gap-2">
                    <span className="text-squid-pink">◯</span> Section 1: Team Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-[13px] font-bold tracking-widest uppercase text-gray-400">Team Name *</label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter Team Name"
                      className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2.5 text-sm md:text-base text-white placeholder:text-[13px] md:placeholder:text-sm placeholder:text-gray-500 focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-[13px] font-bold tracking-widest uppercase text-gray-400">College/University Name *</label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. SAGE University"
                      className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2.5 text-sm md:text-base text-white placeholder:text-[13px] md:placeholder:text-sm placeholder:text-gray-500 focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-[13px] font-bold tracking-widest uppercase text-gray-400">Team Leader Name *</label>
                    <input
                      type="text"
                      name="leaderName"
                      value={formData.leaderName}
                      onChange={handleInputChange}
                      required
                      placeholder="Full Name"
                      className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2.5 text-sm md:text-base text-white placeholder:text-[13px] md:placeholder:text-sm placeholder:text-gray-500 focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-[13px] font-bold tracking-widest uppercase text-gray-400">Team Leader Email *</label>
                    <input
                      type="email"
                      name="leaderEmail"
                      value={formData.leaderEmail}
                      onChange={handleInputChange}
                      required
                      placeholder="leader@gmail.com"
                      className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2.5 text-sm md:text-base text-white placeholder:text-[13px] md:placeholder:text-sm placeholder:text-gray-500 focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-[13px] font-bold tracking-widest uppercase text-gray-400">Team Leader Mobile *</label>
                    <input
                      type="tel"
                      name="leaderMobile"
                      value={formData.leaderMobile}
                      onChange={handleInputChange}
                      pattern="[0-9]{10}"
                      required
                      placeholder="10-digit number"
                      className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2.5 text-sm md:text-base text-white placeholder:text-[13px] md:placeholder:text-sm placeholder:text-gray-500 focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-[13px] font-bold tracking-widest uppercase text-gray-400">City & State *</label>
                    <input
                      type="text"
                      name="cityState"
                      value={formData.cityState}
                      onChange={handleInputChange}
                      required
                      placeholder="Indore, MP"
                      className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2.5 text-sm md:text-base text-white placeholder:text-[13px] md:placeholder:text-sm placeholder:text-gray-500 focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs md:text-[13px] font-bold tracking-widest uppercase text-gray-400">Number of Team Members *</label>
                    <select
                      name="memberCount"
                      value={formData.memberCount}
                      onChange={handleInputChange}
                      className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-3 text-sm md:text-base text-white focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all cursor-pointer"
                    >
                      <option value="1">1 Member (Solo Leader)</option>
                      <option value="2">2 Members</option>
                      <option value="3">3 Members</option>
                      <option value="4">4 Members</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: DYNAMIC MEMBER DETAILS */}
            {currentStep === 2 && (
              <div className="step-pane flex flex-col gap-6">
                <div className="border-b border-gray-900 pb-4">
                  <h2 className="text-xl font-tech font-black tracking-widest uppercase text-white flex items-center gap-2">
                    <span className="text-squid-pink">△</span> Section 2: Member Details
                  </h2>
                </div>

                <div id="dynamic-members-container" className="flex flex-col gap-8 divide-y divide-gray-900">
                  {getMemberIndices().length === 0 ? (
                    <div className="text-xs text-gray-500 py-4 text-center">Solo Team. Only leader details required.</div>
                  ) : (
                    getMemberIndices().map((idx) => (
                      <div key={idx} className="pt-6 flex flex-col gap-4">
                        <h3 className="text-xs font-tech font-black tracking-widest text-squid-pink uppercase flex items-center gap-2">
                          <span className="text-[10px]">◻</span> Member {idx} Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold tracking-widest uppercase text-gray-500">Full Name *</label>
                            <input
                              type="text"
                              name={`memberName_${idx}`}
                              value={formData[`memberName_${idx}`] || ""}
                              onChange={handleInputChange}
                              required
                              className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-3 py-2 text-sm text-white focus:outline-none transition-all"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold tracking-widest uppercase text-gray-500">Email Address *</label>
                            <input
                              type="email"
                              name={`memberEmail_${idx}`}
                              value={formData[`memberEmail_${idx}`] || ""}
                              onChange={handleInputChange}
                              required
                              className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-3 py-2 text-sm text-white focus:outline-none transition-all"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold tracking-widest uppercase text-gray-500">Mobile Number *</label>
                            <input
                              type="tel"
                              name={`memberMobile_${idx}`}
                              value={formData[`memberMobile_${idx}`] || ""}
                              onChange={handleInputChange}
                              pattern="[0-9]{10}"
                              required
                              placeholder="10-digit number"
                              className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-3 py-2 text-sm text-white placeholder:text-[11px] placeholder:text-gray-500 focus:outline-none transition-all"
                            />
                          </div>
                       
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold tracking-widest uppercase text-gray-500">College Name *</label>
                            <input
                              type="text"
                              name={`memberCollege_${idx}`}
                              value={formData[`memberCollege_${idx}`] || ""}
                              onChange={handleInputChange}
                              required
                              placeholder="e.g. SAGE University"
                              className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-3 py-2 text-sm text-white placeholder:text-[11px] placeholder:text-gray-500 focus:outline-none transition-all"
                            />
                          </div>
                     
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: PROJECT INFORMATION */}
            {currentStep === 3 && (
              <div className="step-pane flex flex-col gap-6">
                <div className="border-b border-gray-900 pb-4">
                  <h2 className="text-xl font-tech font-black tracking-widest uppercase text-white flex items-center gap-2">
                    <span className="text-squid-pink">◻</span> Section 3: Project Details
                  </h2>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-[13px] font-bold tracking-widest uppercase text-gray-400">Project Title *</label>
                    <input
                      type="text"
                      name="projectTitle"
                      value={formData.projectTitle}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter project title"
                      className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2.5 text-sm md:text-base text-white placeholder:text-[13px] md:placeholder:text-sm placeholder:text-gray-500 focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-[13px] font-bold tracking-widest uppercase text-gray-400">Problem Statement *</label>
                    <input
                      type="text"
                      name="problemStatement"
                      value={formData.problemStatement}
                      onChange={handleInputChange}
                      required
                      placeholder="Describe the problem statement you are addressing"
                      className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2.5 text-sm md:text-base text-white placeholder:text-[13px] md:placeholder:text-sm placeholder:text-gray-500 focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-[13px] font-bold tracking-widest uppercase text-gray-400">Theme Category *</label>
                    <select
                      name="themeCategory"
                      value={formData.themeCategory}
                      onChange={handleInputChange}
                      className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-3 text-sm md:text-base text-white focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all cursor-pointer"
                    >
                      <option value="Innovate">INNOVATE (Disruptive Ideas)</option>
                      <option value="Solve">SOLVE (Real-world scalable solutions)</option>
                      <option value="Survive">SURVIVE (Robust high-load architectures)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs md:text-[13px] font-bold tracking-widest uppercase text-gray-400">Project Description *</label>
                      <span
                        className={`text-xs font-bold ${
                          getDescriptionWordCount() > 500 ? "text-squid-pink animate-pulse" : "text-gray-500"
                        }`}
                      >
                        {getDescriptionWordCount()} / 500 Words
                      </span>
                    </div>
                    <textarea
                      name="projectDescription"
                      value={formData.projectDescription}
                      onChange={handleInputChange}
                      required
                      rows="6"
                      placeholder="Provide a detailed description of your project..."
                      className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2.5 text-sm md:text-base text-white placeholder:text-[13px] md:placeholder:text-sm placeholder:text-gray-500 focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all resize-none font-medium"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT VERIFICATION */}
            {currentStep === 4 && (
              <div className="step-pane flex flex-col gap-6">
                <div className="border-b border-gray-900 pb-4">
                  <h2 className="text-xl font-tech font-black tracking-widest uppercase text-white flex items-center gap-2">
                    <span className="text-squid-pink">◯</span> Section 4: Payment Verification
                  </h2>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 py-4">
                  <div className="flex flex-col items-center gap-3 w-full md:w-1/3">
                    <div className="rounded-md shadow-lg shadow-squid-pink/20 border-4 border-squid-pink overflow-hidden w-[176px] h-[176px]">
                      <img
                        id="upi-qr-code"
                        src="/akashQr.jpeg"
                        alt="Registration UPI QR Code"
                        className="w-full h-full object-cover object-center scale-[1.08]"
                      />
                    </div>
                    <span className="text-[9px] text-gray-400 tracking-[0.25em] font-bold uppercase mt-1">Scan with PhonePe · AKASH YADAV</span>
                  </div>

                  <div className="w-full md:w-2/3 flex flex-col gap-4">
                    <div className="border border-squid-pink/20 bg-squid-pink/5 p-4 rounded-sm">
                      <div className="text-[10px] font-bold text-squid-pink tracking-widest uppercase mb-1">Finalist Registration Fee</div>
                      <div className="text-3xl font-tech font-black text-white">
                        ₹1,500 <span className="text-xs font-bold text-gray-500 tracking-wider">/ TEAM</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 space-y-2 font-medium">
                      <div className="flex gap-2">
                        <span className="text-squid-pink font-bold">1.</span> Scan the QR code on the left using your mobile phone.
                      </div>
                      <div className="flex gap-2">
                        <span className="text-squid-pink font-bold">2.</span> Complete the finalist payment of ₹1500.
                      </div>
                      <div className="flex gap-2">
                        <span className="text-squid-pink font-bold">3.</span> Save the transaction receipt screenshot.
                      </div>
                      <div className="flex gap-2">
                        <span className="text-squid-pink font-bold">4.</span> Enter the 12-digit UPI Transaction ID and upload proof below.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-[13px] font-bold tracking-widest uppercase text-gray-400">
                      UPI Transaction ID (12-Digit) *
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      required
                      pattern="[0-9]{12}"
                      placeholder="e.g. 617892345091"
                      className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2.5 text-sm md:text-base text-white placeholder:text-[13px] md:placeholder:text-sm placeholder:text-gray-500 focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs md:text-[13px] font-bold tracking-widest uppercase text-gray-400">Your UPI ID Used</label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      placeholder="e.g. name@okhdfcbank"
                      className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2.5 text-sm md:text-base text-white placeholder:text-[13px] md:placeholder:text-sm placeholder:text-gray-500 focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs md:text-[13px] font-bold tracking-widest uppercase text-gray-400">Upload Payment Screenshot *</label>
                    <div className="relative border border-dashed border-gray-800 hover:border-squid-pink transition-colors rounded-sm p-6 flex flex-col items-center justify-center cursor-pointer bg-black/40 group">
                      <input
                        type="file"
                        id="screenshot-upload"
                        required
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <svg
                        className={`w-8 h-8 ${
                          selectedFile ? "text-green-500" : "text-gray-500 group-hover:text-squid-pink"
                        } transition-colors mb-2`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        ></path>
                      </svg>
                      <div className="text-xs text-gray-500 font-bold group-hover:text-white transition-colors">
                        {selectedFile ? "CHANGE FILE" : "CHOOSE RECEIPT IMAGE (JPG/JPEG/PNG)"}
                      </div>
                      {selectedFile && (
                        <span className="text-xs text-squid-pink font-bold uppercase mt-2">✓ Selected: {selectedFile}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & AGREEMENT */}
            {currentStep === 5 && (
              <div className="step-pane flex flex-col gap-6">
                <div className="border-b border-gray-900 pb-4">
                  <h2 className="text-xl font-tech font-black tracking-widest uppercase text-white flex items-center gap-2">
                    <span className="text-squid-pink">△</span> Section 5: Team Agreement & Review
                  </h2>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Data Summary */}
                  <div className="border border-gray-900 p-4 rounded-sm bg-black/50">
                    <h3 className="text-xs font-tech font-black tracking-widest text-squid-pink uppercase mb-3 border-b border-gray-900 pb-1.5">
                      Registration Summary Review
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm text-gray-400 font-medium">
                      <div>
                        <span className="text-gray-650">Team Name:</span>{" "}
                        <strong className="text-white">{formData.teamName}</strong>
                      </div>
                      <div>
                        <span className="text-gray-650">College Name:</span>{" "}
                        <strong className="text-white">{formData.college}</strong>
                      </div>
                      <div>
                        <span className="text-gray-650">Leader Name:</span>{" "}
                        <strong className="text-white">{formData.leaderName}</strong>
                      </div>
                      <div>
                        <span className="text-gray-650">Leader Email:</span>{" "}
                        <strong className="text-white">{formData.leaderEmail}</strong>
                      </div>
                      <div>
                        <span className="text-gray-650">Leader Phone:</span>{" "}
                        <strong className="text-white">{formData.leaderMobile}</strong>
                      </div>
                      <div>
                        <span className="text-gray-650">Team Members:</span>{" "}
                        <strong className="text-white">{formData.memberCount} Players</strong>
                      </div>
                      <div>
                        <span className="text-gray-650">Project Title:</span>{" "}
                        <strong className="text-white">{formData.projectTitle}</strong>
                      </div>
                      <div>
                        <span className="text-gray-650">Theme category:</span>{" "}
                        <strong className="text-white">{formData.themeCategory}</strong>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-gray-650">Transaction ID:</span>{" "}
                        <strong className="text-white font-tech text-squid-pink">{formData.transactionId}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 font-semibold text-xs md:text-sm text-gray-400">
                    <label className="flex items-start gap-3 cursor-pointer hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        name="agree1"
                        checked={formData.agree1}
                        onChange={handleInputChange}
                        required
                        className="mt-0.5 border border-gray-800 rounded bg-black accent-squid-pink cursor-pointer w-4 h-4"
                      />
                      <span>We confirm that the ₹1500 registration fee has been paid successfully.</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        name="agree2"
                        checked={formData.agree2}
                        onChange={handleInputChange}
                        required
                        className="mt-0.5 border border-gray-800 rounded bg-black accent-squid-pink cursor-pointer w-4 h-4"
                      />
                      <span>We agree that the details supplied during this step are valid and correct.</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        name="agree3"
                        checked={formData.agree3}
                        onChange={handleInputChange}
                        required
                        className="mt-0.5 border border-gray-800 rounded bg-black accent-squid-pink cursor-pointer w-4 h-4"
                      />
                      <span>We acknowledge that falsification of details will lead to immediate disqualification.</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        name="agree4"
                        checked={formData.agree4}
                        onChange={handleInputChange}
                        required
                        className="mt-0.5 border border-gray-800 rounded bg-black accent-squid-pink cursor-pointer w-4 h-4"
                      />
                      <span>We acknowledge that registration fees are non-refundable under all scenarios.</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        name="agree5"
                        checked={formData.agree5}
                        onChange={handleInputChange}
                        required
                        className="mt-0.5 border border-gray-800 rounded bg-black accent-squid-pink cursor-pointer w-4 h-4"
                      />
                      <span>We agree to follow the code of conduct of SCYP club and SAGE University.</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex justify-between items-center border-t border-gray-900 pt-6">
              <button
                type="button"
                onClick={() => handleStepNavigation(-1)}
                className={`px-6 py-2.5 border border-gray-800 hover:border-white text-gray-300 hover:text-white rounded-sm text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer ${
                  currentStep === 1 ? "opacity-0 pointer-events-none" : ""
                }`}
              >
                Previous
              </button>
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => handleStepNavigation(1)}
                  className="px-6 py-2.5 bg-squid-pink text-white rounded-sm text-xs font-bold tracking-widest uppercase transition-colors shadow-[0_0_15px_rgba(249,0,77,0.3)] hover:shadow-[0_0_25px_rgba(249,0,77,0.5)] cursor-pointer"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-squid-pink to-[#8a002b] text-white rounded-sm text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(249,0,77,0.4)] hover:shadow-[0_0_30px_rgba(249,0,77,0.7)] hover:scale-105 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "VERIFYING DATA..." : "Confirm Final Registration"}
                </button>
              )}
            </div>
          </form>
        </section>
      </main>

      {/* SUCCESS OVERLAY */}
      {successOverlayOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="glass-card max-w-lg w-full p-8 rounded-sm text-center border-2 border-squid-pink shadow-[0_0_50px_rgba(249,0,77,0.3)] mx-4 flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full border-4 border-squid-pink bg-black flex items-center justify-center text-4xl text-squid-pink font-heading font-black drop-shadow-[0_0_15px_rgba(249,0,77,0.8)] animate-pulse">
              ◯
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-black tracking-widest text-white uppercase mb-2">
                REGISTRATION SUCCESS
              </h2>
              <div className="text-squid-pink font-tech text-xs tracking-widest font-bold uppercase mb-4">
                Player Spot Secured
              </div>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6 font-medium">
                🎉 Registration Completed Successfully! Your payment and finalist details have been received. Our team will verify
                your submission within 24 hours. A confirmation email has been logged to your inbox. See you at SquidHack 2026!
              </p>
              <div className="border border-gray-800 p-3 rounded-sm bg-black/50 text-left mb-6 w-full">
                <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold">
                  <span>Assigned Team ID:</span>
                  <span className="text-squid-pink font-bold">{assignedTeamId}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSuccessOverlayOpen(false);
                setCurrentStep(1);
              }}
              className="w-full py-3 bg-squid-pink text-white rounded-sm text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-[0_0_15px_rgba(249,0,77,0.4)] hover:shadow-[0_0_30px_rgba(249,0,77,0.7)] cursor-pointer"
            >
              Return To Portal
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Register;
