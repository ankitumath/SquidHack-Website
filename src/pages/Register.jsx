import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Footer from '../components/Footer.jsx';

// Prepopulated dummy finalist data to showcase the Admin Dashboard immediately
const dummySubmissions = [
  {
    id: "SQ-1082",
    teamName: "Nexus Coders",
    college: "SAGE University Indore",
    leaderName: "Rohan Sharma",
    leaderEmail: "rohan.sharma@gmail.com",
    leaderMobile: "9876543210",
    cityState: "Indore, MP",
    memberCount: "3",
    members: [
      { name: "Divya Patel", email: "divya.p@gmail.com", mobile: "9876501234", course: "B.Tech", year: "3rd", branch: "CSE" },
      { name: "Aman Gupta", email: "aman.g@gmail.com", mobile: "9876512345", course: "B.Tech", year: "3rd", branch: "IT" }
    ],
    projectTitle: "DeFi Micro-Lending Portal",
    problemStatement: "Lack of quick collateral-free student micro-loans.",
    themeCategory: "Innovate",
    projectDescription: "A blockchain-based micro-lending web application that allows university students to borrow and lend small sums of money securely using trust scores. Built on Ethereum with smart contracts to automate repayments.",
    transactionId: "610293485710",
    upiId: "rohansharma@okaxis",
    filename: "payment_receipt_nexus.png",
    status: "Approved",
    paymentVerified: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toLocaleString() // 5 hrs ago
  },
  {
    id: "SQ-1095",
    teamName: "Web Warriors",
    college: "IIT Indore",
    leaderName: "Karan Johar",
    leaderEmail: "karan.johar@iiti.ac.in",
    leaderMobile: "9509285817",
    cityState: "Indore, MP",
    memberCount: "2",
    members: [
      { name: "Pooja Hegde", email: "pooja.h@iiti.ac.in", mobile: "9509212345", course: "B.Tech", year: "4th", branch: "CSE" }
    ],
    projectTitle: "AI Mental Health Companion",
    problemStatement: "Escalating academic stress and lack of anonymous therapy portals.",
    themeCategory: "Solve",
    projectDescription: "An anonymous real-time companion chatbot leveraging state-of-the-art NLP models to provide cognitive behavioral therapy exercises to students experiencing stress. Built using Next.js and Tailwind.",
    transactionId: "612749038271",
    upiId: "karanjohar@oksbi",
    filename: "receipt_karan.pdf",
    status: "Pending",
    paymentVerified: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toLocaleString() // 30 mins ago
  }
];

// Simulated Email Log outbox
const dummyEmailLogs = [
  {
    to: "rohan.sharma@gmail.com",
    subject: "SquidHack 2026 - Registration Received (Team ID: SQ-1082)",
    body: "Greetings Rohan Sharma,\n\nWe have received your finalist registration for Team 'Nexus Coders' (ID: SQ-1082). Our VIP judges are verifying your ₹1500 transaction ID: 610293485710. See you in the arena!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5.1).toLocaleString()
  },
  {
    to: "rohan.sharma@gmail.com",
    subject: "SquidHack 2026 - Finalist Spot Confirmed!",
    body: "Congratulations Rohan Sharma,\n\nYour finalist registration and payment of ₹1500 have been VERIFIED and APPROVED. Your team 'Nexus Coders' is officially confirmed. Get ready to play the game on August 1st at SAGE University Indore. Outplay. Outcode. Survive.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.9).toLocaleString()
  },
  {
    to: "karan.johar@iiti.ac.in",
    subject: "SquidHack 2026 - Registration Received (Team ID: SQ-1095)",
    body: "Greetings Karan Johar,\n\nWe have received your finalist registration for Team 'Web Warriors' (ID: SQ-1095). Our VIP judges are verifying your ₹1500 transaction ID: 612749038271. See you in the arena!",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toLocaleString()
  }
];

const Register = () => {
  // Page routing views
  const [portalView, setPortalView] = useState('registration'); // 'registration' or 'admin'
  const [activeAdminTab, setActiveAdminTab] = useState('teams'); // 'teams' or 'emails'

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [selectedFile, setSelectedFile] = useState(null);

  // Form inputs data
  const [formData, setFormData] = useState({
    teamName: '',
    college: '',
    leaderName: '',
    leaderEmail: '',
    leaderMobile: '',
    cityState: '',
    memberCount: '1',
    projectTitle: '',
    problemStatement: '',
    themeCategory: 'Innovate',
    projectDescription: '',
    transactionId: '',
    upiId: '',
    agree1: false,
    agree2: false,
    agree3: false,
    agree4: false,
    agree5: false
  });

  // Admin Dashboard States
  const [submissions, setSubmissions] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminFilterPayment, setAdminFilterPayment] = useState('all');
  const [adminFilterStatus, setAdminFilterStatus] = useState('all');

  // Success Overlay / Details Modal States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedTeamId, setAssignedTeamId] = useState('');
  const [successOverlayOpen, setSuccessOverlayOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTeamForModal, setSelectedTeamForModal] = useState(null);

  // Load from local storage
  useEffect(() => {
    const draftRaw = localStorage.getItem('squidhack_draft');
    if (draftRaw) {
      try {
        setFormData(JSON.parse(draftRaw));
      } catch (err) {
        console.error("Failed to load draft", err);
      }
    }

    const savedSubs = localStorage.getItem('squidhack_submissions');
    if (!savedSubs) {
      localStorage.setItem('squidhack_submissions', JSON.stringify(dummySubmissions));
      setSubmissions(dummySubmissions);
    } else {
      setSubmissions(JSON.parse(savedSubs));
    }

    const savedEmails = localStorage.getItem('squidhack_emails');
    if (!savedEmails) {
      localStorage.setItem('squidhack_emails', JSON.stringify(dummyEmailLogs));
      setEmailLogs(dummyEmailLogs);
    } else {
      setEmailLogs(JSON.parse(savedEmails));
    }
  }, []);

  // Auto-save form draft to local storage
  useEffect(() => {
    localStorage.setItem('squidhack_draft', JSON.stringify(formData));
  }, [formData]);

  // Sticky header transition on scroll
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Word counter helper
  const getDescriptionWordCount = () => {
    const text = formData.projectDescription || '';
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  // Dynamic input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Mock File Upload screenshot selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file.name);
    }
  };

  // Step Validation logic
  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      const { teamName, college, leaderName, leaderEmail, leaderMobile, cityState } = formData;
      return teamName && college && leaderName && leaderEmail && leaderMobile && cityState && leaderMobile.length === 10;
    }
    if (stepNum === 2) {
      const count = parseInt(formData.memberCount || 1);
      for (let i = 2; i <= count; i++) {
        const name = formData[`memberName_${i}`];
        const email = formData[`memberEmail_${i}`];
        const mobile = formData[`memberMobile_${i}`];
        const course = formData[`memberCourse_${i}`];
        const year = formData[`memberYear_${i}`] || '1st';
        const branch = formData[`memberBranch_${i}`];
        if (!name || !email || !mobile || !course || !year || !branch || mobile.length !== 10) {
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
      // Highlight errors on invalid inputs
      alert("Please fill out all required fields correctly before moving to the next step.");
      return;
    }
    const nextStep = currentStep + direction;
    if (nextStep >= 1 && nextStep <= totalSteps) {
      setCurrentStep(nextStep);
      window.scrollTo({ top: 150, behavior: 'smooth' });
    }
  };

  const triggerConfetti = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
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

    setTimeout(() => {
      const teamData = {
        id: teamId,
        teamName: formData.teamName,
        college: formData.college,
        leaderName: formData.leaderName,
        leaderEmail: formData.leaderEmail,
        leaderMobile: formData.leaderMobile,
        cityState: formData.cityState,
        memberCount: formData.memberCount,
        members: [],
        projectTitle: formData.projectTitle,
        problemStatement: formData.problemStatement,
        themeCategory: formData.themeCategory,
        projectDescription: formData.projectDescription,
        transactionId: formData.transactionId,
        upiId: formData.upiId || 'N/A',
        filename: selectedFile || 'screenshot.png',
        status: 'Pending',
        paymentVerified: false,
        timestamp: new Date().toLocaleString()
      };

      const count = parseInt(teamData.memberCount);
      for (let i = 2; i <= count; i++) {
        teamData.members.push({
          name: formData[`memberName_${i}`],
          email: formData[`memberEmail_${i}`],
          mobile: formData[`memberMobile_${i}`],
          course: formData[`memberCourse_${i}`],
          year: formData[`memberYear_${i}`] || '1st',
          branch: formData[`memberBranch_${i}`]
        });
      }

      // Update Submissions list
      const updatedSubs = [teamData, ...submissions];
      setSubmissions(updatedSubs);
      localStorage.setItem('squidhack_submissions', JSON.stringify(updatedSubs));

      // Outbox simulated Email log
      const newEmail = {
        to: teamData.leaderEmail,
        subject: `SquidHack 2026 - Registration Received (Team ID: ${teamData.id})`,
        body: `Greetings ${teamData.leaderName},\n\nWe have received your finalist registration for Team '${teamData.teamName}' (ID: ${teamData.id}). Our VIP judges are verifying your ₹1500 transaction ID: ${teamData.transactionId}. See you in the arena!`,
        timestamp: new Date().toLocaleString()
      };
      const updatedEmails = [newEmail, ...emailLogs];
      setEmailLogs(updatedEmails);
      localStorage.setItem('squidhack_emails', JSON.stringify(updatedEmails));

      // Reset form states
      setFormData({
        teamName: '', college: '', leaderName: '', leaderEmail: '', leaderMobile: '', cityState: '', memberCount: '1',
        projectTitle: '', problemStatement: '', themeCategory: 'Innovate', projectDescription: '',
        transactionId: '', upiId: '', agree1: false, agree2: false, agree3: false, agree4: false, agree5: false
      });
      localStorage.removeItem('squidhack_draft');
      setSelectedFile(null);
      setCurrentStep(1);

      // Trigger overlays
      setAssignedTeamId(teamId);
      setIsSubmitting(false);
      setSuccessOverlayOpen(true);
      triggerConfetti();
    }, 1800);
  };

  // Admin approval/rejection updates
  const handleUpdateStatus = (id, newStatus) => {
    const updatedSubs = submissions.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          paymentVerified: newStatus === 'Approved' ? true : item.paymentVerified
        };
      }
      return item;
    });

    setSubmissions(updatedSubs);
    localStorage.setItem('squidhack_submissions', JSON.stringify(updatedSubs));

    // Simulated email outbox log
    const targetTeam = submissions.find(item => item.id === id);
    if (targetTeam) {
      let subject = '';
      let body = '';
      if (newStatus === 'Approved') {
        subject = `SquidHack 2026 - Finalist Spot Confirmed!`;
        body = `Congratulations ${targetTeam.leaderName},\n\nYour finalist registration and payment of ₹1500 have been VERIFIED and APPROVED. Your team '${targetTeam.teamName}' is officially confirmed. Get ready to play the game on August 1st at SAGE University Indore. Outplay. Outcode. Survive.`;
      } else {
        subject = `SquidHack 2026 - Registration Status Update`;
        body = `Greetings ${targetTeam.leaderName},\n\nWe regret to inform you that your finalist registration status for team '${targetTeam.teamName}' has been marked as Rejected due to payment validation mismatch. Please reach out to the SCYP coordinators immediately.`;
      }

      const newEmail = {
        to: targetTeam.leaderEmail,
        subject: subject,
        body: body,
        timestamp: new Date().toLocaleString()
      };
      const updatedEmails = [newEmail, ...emailLogs];
      setEmailLogs(updatedEmails);
      localStorage.setItem('squidhack_emails', JSON.stringify(updatedEmails));
    }
  };

  // CSV data exporter
  const handleCSVExport = () => {
    if (submissions.length === 0) {
      alert("No data available to export");
      return;
    }

    let csv = "Team ID,Team Name,College,Leader Name,Leader Email,Leader Mobile,City/State,Members Count,Project Title,Theme,UPI TxID,Status\n";
    submissions.forEach(item => {
      csv += `"${item.id}","${item.teamName}","${item.college}","${item.leaderName}","${item.leaderEmail}","${item.leaderMobile}","${item.cityState}","${item.memberCount}","${item.projectTitle}","${item.themeCategory}","${item.transactionId}","${item.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `squidhack_finalists_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic filter lists
  const getFilteredSubmissions = () => {
    return submissions.filter(item => {
      const matchesSearch = item.teamName.toLowerCase().includes(adminSearch.toLowerCase()) || 
                            item.id.toLowerCase().includes(adminSearch.toLowerCase()) || 
                            item.college.toLowerCase().includes(adminSearch.toLowerCase()) ||
                            item.leaderName.toLowerCase().includes(adminSearch.toLowerCase());
      
      const matchesPay = adminFilterPayment === 'all' || 
                         (adminFilterPayment === 'verified' && item.paymentVerified) || 
                         (adminFilterPayment === 'pending' && !item.paymentVerified);

      const matchesStatus = adminFilterStatus === 'all' || item.status === adminFilterStatus;

      return matchesSearch && matchesPay && matchesStatus;
    });
  };

  const handleOpenDetails = (id) => {
    const target = submissions.find(item => item.id === id);
    if (target) {
      setSelectedTeamForModal(target);
      setDetailsModalOpen(true);
    }
  };

  // Dynamic Member inputs arrays
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
      <header className={`fixed top-0 left-0 w-full px-8 py-4 flex justify-between items-center z-50 transition-all duration-300 ${isScrolled ? 'bg-black py-3 border-b border-gray-900' : 'bg-black/80 border-b border-gray-900/60'}`}>
        <Link to="/" className="flex flex-col select-none">
          <div className="font-heading font-black text-xl md:text-2xl tracking-[0.15em] leading-none uppercase">
            SQUID<br />
            H<span className="triangle-a text-[0.8em] -translate-y-[0.1em]"></span>CK
          </div>
          <div className="text-squid-pink text-[9px] font-bold tracking-[0.2em] mt-1">
            &lt;/ REGISTRATION &gt;
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setPortalView(portalView === 'registration' ? 'admin' : 'registration')} 
            className="flex items-center gap-2 border border-gray-800 hover:border-squid-pink px-4 py-2 rounded-sm text-[10px] md:text-xs font-bold tracking-widest uppercase bg-black/40 backdrop-blur-sm transition-all duration-300"
          >
            <span className="text-squid-pink">{portalView === 'registration' ? '◻' : '◯'}</span>
            <span>{portalView === 'registration' ? 'Admin Dashboard' : 'Registration Form'}</span>
          </button>
          <Link to="/" className="border border-gray-800 hover:border-white px-4 py-2 rounded-sm text-[10px] md:text-xs font-bold tracking-widest uppercase bg-black/40 backdrop-blur-sm transition-all duration-300">
            Back to Site
          </Link>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col justify-center">
        
        {/* REGISTRATION FORM VIEW */}
        {portalView === 'registration' && (
          <section id="registration-section" className="w-full transition-opacity duration-300">
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
                Congratulations! Your team has been shortlisted as a finalist. Confirm your participation by completing details and verifying your <strong className="text-white">₹1500</strong> registration fee.
              </p>

              {/* Draft Indicator */}
              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest select-none">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                <span>Draft Auto-Saved</span>
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

                {[1, 2, 3, 4, 5].map(step => {
                  const stepNames = ['Team', 'Members', 'Project', 'Payment', 'Agreement'];
                  const isCurrent = step === currentStep;
                  const isCompleted = step < currentStep;
                  let borderClass = 'border-gray-800 text-gray-500';
                  if (isCurrent) borderClass = 'border-squid-pink text-squid-pink shadow-[0_0_10px_rgba(249,0,77,0.3)]';
                  else if (isCompleted) borderClass = 'border-green-500 text-green-500';

                  return (
                    <div key={step} className="step-indicator relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full border-2 bg-black flex items-center justify-center font-tech text-xs font-black transition-all duration-300 ${borderClass}`}>
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

            {/* Multi-Step Form Stepper */}
            <form onSubmit={handleFormSubmit} className="glass-card p-6 md:p-10 rounded-sm shadow-2xl relative" noValidate>
              
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
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Team Name *</label>
                      <input 
                        type="text" 
                        name="teamName" 
                        value={formData.teamName} 
                        onChange={handleInputChange}
                        required 
                        className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2 text-sm text-white focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label class="text-[10px] font-bold tracking-widest uppercase text-gray-400">College/University Name *</label>
                      <input 
                        type="text" 
                        name="college" 
                        value={formData.college} 
                        onChange={handleInputChange}
                        required 
                        className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2 text-sm text-white focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Team Leader Name *</label>
                      <input 
                        type="text" 
                        name="leaderName" 
                        value={formData.leaderName} 
                        onChange={handleInputChange}
                        required 
                        className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2 text-sm text-white focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Team Leader Email *</label>
                      <input 
                        type="email" 
                        name="leaderEmail" 
                        value={formData.leaderEmail} 
                        onChange={handleInputChange}
                        required 
                        className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2 text-sm text-white focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Team Leader Mobile Number *</label>
                      <input 
                        type="tel" 
                        name="leaderMobile" 
                        value={formData.leaderMobile} 
                        onChange={handleInputChange}
                        pattern="[0-9]{10}" 
                        required 
                        placeholder="10-digit number" 
                        className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2 text-sm text-white focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">City & State *</label>
                      <input 
                        type="text" 
                        name="cityState" 
                        value={formData.cityState} 
                        onChange={handleInputChange}
                        required 
                        placeholder="Indore, MP" 
                        className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2 text-sm text-white focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Number of Team Members *</label>
                      <select 
                        name="memberCount" 
                        value={formData.memberCount} 
                        onChange={handleInputChange}
                        className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2.5 text-sm text-white focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all cursor-pointer"
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

                  <div id="dynamic-members-container" class="flex flex-col gap-8 divide-y divide-gray-900">
                    {getMemberIndices().length === 0 ? (
                      <div className="text-xs text-gray-500 py-4 text-center">Solo Team. Only leader details required.</div>
                    ) : (
                      getMemberIndices().map(idx => (
                        <div key={idx} className="pt-6 flex flex-col gap-4">
                          <h3 className="text-xs font-tech font-black tracking-widest text-squid-pink uppercase flex items-center gap-2">
                            <span className="text-[10px]">◻</span> Member {idx} Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-bold tracking-widest uppercase text-gray-500">Full Name *</label>
                              <input 
                                type="text" 
                                name={`memberName_${idx}`} 
                                value={formData[`memberName_${idx}`] || ''} 
                                onChange={handleInputChange}
                                required 
                                className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none transition-all" 
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-bold tracking-widest uppercase text-gray-500">Email Address *</label>
                              <input 
                                type="email" 
                                name={`memberEmail_${idx}`} 
                                value={formData[`memberEmail_${idx}`] || ''} 
                                onChange={handleInputChange}
                                required 
                                className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none transition-all" 
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-bold tracking-widest uppercase text-gray-500">Mobile Number *</label>
                              <input 
                                type="tel" 
                                name={`memberMobile_${idx}`} 
                                value={formData[`memberMobile_${idx}`] || ''} 
                                onChange={handleInputChange}
                                pattern="[0-9]{10}" 
                                required 
                                placeholder="10-digit number" 
                                className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none transition-all" 
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-bold tracking-widest uppercase text-gray-500">Course *</label>
                              <input 
                                type="text" 
                                name={`memberCourse_${idx}`} 
                                value={formData[`memberCourse_${idx}`] || ''} 
                                onChange={handleInputChange}
                                required 
                                placeholder="e.g. B.Tech" 
                                className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none transition-all" 
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-bold tracking-widest uppercase text-gray-500">Year *</label>
                              <select 
                                name={`memberYear_${idx}`} 
                                value={formData[`memberYear_${idx}`] || '1st'} 
                                onChange={handleInputChange}
                                className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none transition-all cursor-pointer"
                              >
                                <option value="1st">1st Year</option>
                                <option value="2nd">2nd Year</option>
                                <option value="3rd">3rd Year</option>
                                <option value="4th">4th Year</option>
                              </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-bold tracking-widest uppercase text-gray-500">Branch/Specialization *</label>
                              <input 
                                type="text" 
                                name={`memberBranch_${idx}`} 
                                value={formData[`memberBranch_${idx}`] || ''} 
                                onChange={handleInputChange}
                                required 
                                placeholder="e.g. CSE" 
                                className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none transition-all" 
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
                    <h2 class="text-xl font-tech font-black tracking-widest uppercase text-white flex items-center gap-2">
                      <span className="text-squid-pink">◻</span> Section 3: Project Details
                    </h2>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Project Title *</label>
                      <input 
                        type="text" 
                        name="projectTitle" 
                        value={formData.projectTitle} 
                        onChange={handleInputChange}
                        required 
                        className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2 text-sm text-white focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Problem Statement *</label>
                      <input 
                        type="text" 
                        name="problemStatement" 
                        value={formData.problemStatement} 
                        onChange={handleInputChange}
                        required 
                        className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2 text-sm text-white focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Theme Category *</label>
                      <select 
                        name="themeCategory" 
                        value={formData.themeCategory} 
                        onChange={handleInputChange}
                        className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2.5 text-sm text-white focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all cursor-pointer"
                      >
                        <option value="Innovate">INNOVATE (Disruptive Ideas)</option>
                        <option value="Solve">SOLVE (Real-world scalable solutions)</option>
                        <option value="Survive">SURVIVE (Robust high-load architectures)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Project Description *</label>
                        <span className={`text-[10px] font-bold ${getDescriptionWordCount() > 500 ? 'text-squid-pink animate-pulse' : 'text-gray-500'}`}>
                          {getDescriptionWordCount()} / 500 Words
                        </span>
                      </div>
                      <textarea 
                        name="projectDescription" 
                        value={formData.projectDescription} 
                        onChange={handleInputChange}
                        required 
                        rows="6" 
                        className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2 text-sm text-white focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all resize-none font-medium"
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
                      <div className="p-3 bg-white rounded-md shadow-lg shadow-squid-pink/10 border-4 border-squid-pink">
                        <img 
                          id="upi-qr-code" 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=000000&data=upi://pay?pa=squid@pay%26pn=SquidHack%26am=1500%26cu=INR%26tn=Finalist%20Registration" 
                          alt="Registration UPI QR Code" 
                          className="w-[180px] h-[180px] object-contain" 
                        />
                      </div>
                      <span className="text-[9px] text-gray-400 tracking-[0.25em] font-bold uppercase mt-1">Scan with any UPI App</span>
                    </div>

                    <div className="w-full md:w-2/3 flex flex-col gap-4">
                      <div className="border border-squid-pink/20 bg-squid-pink/5 p-4 rounded-sm">
                        <div className="text-[10px] font-bold text-squid-pink tracking-widest uppercase mb-1">Finalist Registration Fee</div>
                        <div className="text-3xl font-tech font-black text-white">₹1,500 <span className="text-xs font-bold text-gray-500 tracking-wider">/ TEAM</span></div>
                      </div>

                      <div className="text-xs text-gray-400 space-y-2 font-medium">
                        <div className="flex gap-2"><span className="text-squid-pink font-bold">1.</span> Scan the QR code on the left using your mobile phone.</div>
                        <div className="flex gap-2"><span class="text-squid-pink font-bold">2.</span> Complete the finalist payment of ₹1500.</div>
                        <div className="flex gap-2"><span className="text-squid-pink font-bold">3.</span> Save the transaction receipt screenshot.</div>
                        <div className="flex gap-2"><span className="text-squid-pink font-bold">4.</span> Enter the 12-digit UPI Transaction ID and upload proof below.</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">UPI Transaction ID (12-Digit) *</label>
                      <input 
                        type="text" 
                        name="transactionId" 
                        value={formData.transactionId} 
                        onChange={handleInputChange}
                        required 
                        pattern="[0-9]{12}" 
                        placeholder="e.g. 617892345091" 
                        className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2 text-sm text-white focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Your UPI ID Used</label>
                      <input 
                        type="text" 
                        name="upiId" 
                        value={formData.upiId} 
                        onChange={handleInputChange}
                        placeholder="e.g. name@okhdfcbank" 
                        className="bg-black/60 border border-gray-800 focus:border-squid-pink rounded-sm px-4 py-2 text-sm text-white focus:outline-none focus:shadow-[0_0_10px_rgba(249,0,77,0.2)] transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Upload Payment Screenshot *</label>
                      <div className="relative border border-dashed border-gray-800 hover:border-squid-pink transition-colors rounded-sm p-6 flex flex-col items-center justify-center cursor-pointer bg-black/40 group">
                        <input 
                          type="file" 
                          id="screenshot-upload" 
                          required 
                          accept="image/*,.pdf" 
                          onChange={handleFileSelect}
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                        />
                        <svg className={`w-8 h-8 ${selectedFile ? 'text-green-500' : 'text-gray-500 group-hover:text-squid-pink'} transition-colors mb-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                        </svg>
                        <div className="text-xs text-gray-500 font-bold group-hover:text-white transition-colors">
                          {selectedFile ? "CHANGE FILE" : "CHOOSE RECEIPT FILE (JPG/PNG/PDF)"}
                        </div>
                        {selectedFile && (
                          <span className="text-[10px] text-squid-pink font-bold uppercase mt-2">
                            ✓ Selected: {selectedFile}
                          </span>
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

                  <div className="bg-black/60 border border-gray-900 p-6 rounded-sm shadow-inner">
                    <h3 className="text-xs font-tech font-black tracking-widest text-squid-pink uppercase mb-4">REGISTRATION SUMMARY</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                      <div className="flex justify-between border-b border-gray-900/50 pb-2"><span className="text-gray-500 font-bold">TEAM NAME:</span> <span className="font-bold text-white">{formData.teamName}</span></div>
                      <div className="flex justify-between border-b border-gray-900/50 pb-2"><span class="text-gray-500 font-bold">TEAM LEADER:</span> <span className="font-bold text-white">{formData.leaderName}</span></div>
                      <div className="flex justify-between border-b border-gray-900/50 pb-2"><span className="text-gray-500 font-bold">COLLEGE:</span> <span className="font-bold text-white">{formData.college}</span></div>
                      <div className="flex justify-between border-b border-gray-900/50 pb-2"><span className="text-gray-500 font-bold">MEMBER COUNT:</span> <span className="font-bold text-white">{formData.memberCount} Players</span></div>
                      <div className="flex justify-between border-b border-gray-900/50 pb-2 md:col-span-2"><span className="text-gray-500 font-bold">PROJECT TITLE:</span> <span className="font-bold text-white">{formData.projectTitle}</span></div>
                      <div className="flex justify-between border-b border-gray-900/50 pb-2"><span className="text-gray-500 font-bold">FEE:</span> <span className="font-bold text-white">₹1500 (Verified)</span></div>
                      <div className="flex justify-between border-b border-gray-900/50 pb-2"><span className="text-gray-500 font-bold">TRANSACTION ID:</span> <span className="font-bold text-squid-pink font-tech">{formData.transactionId}</span></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 py-4">
                    <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Survival Agreement Checklist *</h3>
                    <div className="flex flex-col gap-3">
                      {[1, 2, 3, 4, 5].map(num => {
                        const agreeTexts = [
                          "We confirm that the payment has been made correctly.",
                          "All information provided in this registration form is 100% accurate.",
                          "Our entire team will be present physically at SAGE University Indore.",
                          "We agree to all hackathon rules, regulations, and code of conduct.",
                          "We understand that incorrect payment details will result in cancellation."
                        ];
                        return (
                          <label key={num} className="flex items-start gap-3 cursor-pointer group select-none">
                            <input 
                              type="checkbox" 
                              name={`agree${num}`} 
                              checked={formData[`agree${num}`]}
                              onChange={handleInputChange}
                              required 
                              className="mt-1 accent-squid-pink rounded-sm cursor-pointer w-4 h-4" 
                            />
                            <span className="text-xs text-gray-400 group-hover:text-white transition-colors font-medium">
                              {agreeTexts[num - 1]}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* BUTTON CONTROLS */}
              <div className="flex justify-between items-center mt-10 border-t border-gray-900 pt-6">
                <button 
                  type="button" 
                  onClick={() => handleStepNavigation(-1)} 
                  className={`px-6 py-2.5 border border-gray-800 hover:border-white text-gray-300 hover:text-white rounded-sm text-xs font-bold tracking-widest uppercase transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                >
                  Previous
                </button>
                {currentStep < totalSteps ? (
                  <button 
                    type="button" 
                    onClick={() => handleStepNavigation(1)} 
                    className="px-6 py-2.5 bg-squid-pink text-white rounded-sm text-xs font-bold tracking-widest uppercase transition-colors shadow-[0_0_15px_rgba(249,0,77,0.3)] hover:shadow-[0_0_25px_rgba(249,0,77,0.5)]"
                  >
                    Next Step
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-squid-pink to-[#8a002b] text-white rounded-sm text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(249,0,77,0.4)] hover:shadow-[0_0_30px_rgba(249,0,77,0.7)] hover:scale-105"
                  >
                    {isSubmitting ? "VERIFYING DATA..." : "Confirm Final Registration"}
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {/* ADMIN DASHBOARD VIEW */}
        {portalView === 'admin' && (
          <section id="admin-section" className="w-full transition-opacity duration-300">
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
                  onClick={() => setActiveAdminTab('teams')} 
                  className={`pb-3 border-b-2 text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer ${activeAdminTab === 'teams' ? 'border-squid-pink text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                  Finalist Registrations ({submissions.length})
                </button>
                <button 
                  onClick={() => setActiveAdminTab('emails')} 
                  className={`pb-3 border-b-2 text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer ${activeAdminTab === 'emails' ? 'border-squid-pink text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                  Simulated Outbox Log
                </button>
              </div>

              {/* Teams Table */}
              {activeAdminTab === 'teams' && (
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
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
                        getFilteredSubmissions().map(item => (
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
                              {item.status === 'Approved' && (
                                <span className="px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase bg-green-950/40 text-green-500 border border-green-800">Approved</span>
                              )}
                              {item.status === 'Rejected' && (
                                <span className="px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase bg-red-950/40 text-red-500 border border-red-800">Rejected</span>
                              )}
                              {item.status === 'Pending' && (
                                <span className="px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase bg-yellow-950/40 text-yellow-500 border border-yellow-800">Pending</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right flex justify-end gap-2">
                              <button 
                                onClick={() => handleOpenDetails(item.id)} 
                                className="px-2.5 py-1.5 bg-gray-900 border border-gray-800 hover:border-white rounded-sm text-[10px] font-bold uppercase transition-colors cursor-pointer"
                              >
                                Details
                              </button>
                              {item.status === 'Pending' && (
                                <>
                                  <button 
                                    onClick={() => handleUpdateStatus(item.id, 'Approved')} 
                                    className="px-2 py-1.5 bg-green-950 border border-green-800 hover:bg-green-900 rounded-sm text-[10px] font-bold uppercase text-green-500 hover:text-white transition-colors cursor-pointer"
                                  >
                                    ✓
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateStatus(item.id, 'Rejected')} 
                                    className="px-2 py-1.5 bg-red-950 border border-red-800 hover:bg-red-900 rounded-sm text-[10px] font-bold uppercase text-red-500 hover:text-white transition-colors cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Email Logs */}
              {activeAdminTab === 'emails' && (
                <div className="w-full flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sent Notifications History</span>
                    <button 
                      onClick={() => { setEmailLogs([]); localStorage.setItem('squidhack_emails', '[]'); }} 
                      className="text-[10px] text-squid-pink hover:text-white font-bold uppercase tracking-widest cursor-pointer"
                    >
                      Clear Log
                    </button>
                  </div>
                  <div id="email-logs-list" className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
                    {emailLogs.length === 0 ? (
                      <div className="text-xs text-gray-500 py-8 text-center uppercase tracking-widest">No emails logged in outbox</div>
                    ) : (
                      emailLogs.map((log, index) => (
                        <div key={index} className="bg-black/60 border border-gray-900 p-4 rounded-sm flex flex-col gap-2 relative">
                          <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase font-bold">
                            <span>To: <strong className="text-white">{log.to}</strong></span>
                            <span>{log.timestamp}</span>
                          </div>
                          <div className="text-[11px] font-bold text-squid-pink tracking-wide">{log.subject}</div>
                          <pre className="text-[10px] text-gray-400 font-mono whitespace-pre-wrap leading-relaxed border-t border-gray-900 pt-2 mt-1">{log.body}</pre>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
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
                🎉 Registration Completed Successfully! Your payment and finalist details have been received. Our team will verify your submission within 24 hours. A confirmation email has been logged to your inbox. See you at SquidHack 2026!
              </p>
              <div className="border border-gray-800 p-3 rounded-sm bg-black/50 text-left mb-6 w-full">
                <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold">
                  <span>Assigned Team ID:</span>
                  <span className="text-squid-pink font-bold">{assignedTeamId}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => { setSuccessOverlayOpen(false); navigateStep(-4); }} 
              className="w-full py-3 bg-squid-pink text-white rounded-sm text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-[0_0_15px_rgba(249,0,77,0.4)] hover:shadow-[0_0_30px_rgba(249,0,77,0.7)] cursor-pointer"
            >
              Return To Portal
            </button>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailsModalOpen && selectedTeamForModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
          <div className="glass-card max-w-2xl w-full p-6 md:p-8 rounded-sm border border-gray-800 flex flex-col gap-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-900 pb-4">
              <h3 className="text-base font-tech font-black tracking-widest text-white uppercase">
                REGISTRATION DETAILS: <span className="text-squid-pink">{selectedTeamForModal.id}</span>
              </h3>
              <button onClick={() => setDetailsModalOpen(false)} className="text-gray-400 hover:text-white font-bold text-sm cursor-pointer">✕</button>
            </div>

            <div className="flex flex-col gap-6 text-xs font-medium">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1 */}
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="font-bold text-gray-500 uppercase tracking-widest text-[9px] mb-1">Team Information</div>
                    <div className="grid grid-cols-2 gap-1 bg-black/40 p-3 rounded-sm border border-gray-900">
                      <div className="col-span-2"><span className="text-gray-500">Name:</span> {selectedTeamForModal.teamName}</div>
                      <div className="col-span-2"><span className="text-gray-500">College:</span> {selectedTeamForModal.college}</div>
                      <div className="col-span-2"><span className="text-gray-500">Leader:</span> {selectedTeamForModal.leaderName}</div>
                      <div><span className="text-gray-500">Email:</span> {selectedTeamForModal.leaderEmail}</div>
                      <div><span className="text-gray-500">Mobile:</span> {selectedTeamForModal.leaderMobile}</div>
                      <div className="col-span-2"><span className="text-gray-500">City/State:</span> {selectedTeamForModal.cityState}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-500 uppercase tracking-widest text-[9px] mb-1">Project Information</div>
                    <div className="flex flex-col gap-1 bg-black/40 p-3 rounded-sm border border-gray-900">
                      <div><span className="text-gray-500 font-semibold">Title:</span> {selectedTeamForModal.projectTitle}</div>
                      <div><span className="text-gray-500 font-semibold">Category:</span> {selectedTeamForModal.themeCategory}</div>
                      <div className="mt-2"><span className="text-gray-500 block font-semibold mb-1">Problem Statement:</span> {selectedTeamForModal.problemStatement}</div>
                      <div className="mt-2 text-gray-400 max-h-[120px] overflow-y-auto pr-1"><span className="text-gray-500 block font-semibold">Description:</span> {selectedTeamForModal.projectDescription}</div>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="font-bold text-gray-500 uppercase tracking-widest text-[9px] mb-1">Payment Verification</div>
                    <div className="flex flex-col gap-2 bg-black/40 p-3 rounded-sm border border-gray-900">
                      <div><span className="text-gray-500">UPI Transaction ID:</span> <span className="text-squid-pink font-bold font-tech">{selectedTeamForModal.transactionId}</span></div>
                      <div><span className="text-gray-500">UPI ID Used:</span> {selectedTeamForModal.upiId}</div>
                      <div><span className="text-gray-500">Attached File:</span> <span className="text-blue-400 underline font-semibold cursor-pointer">{selectedTeamForModal.filename}</span></div>
                      <div className="mt-3 flex items-center justify-center border border-dashed border-gray-800 p-2 rounded-sm bg-black/80 h-32 relative overflow-hidden">
                        <div className="text-center">
                          <div className="text-[10px] text-green-500 font-bold mb-1">★ PAYMENT PROOF UPLOADED ★</div>
                          <div className="text-[8px] text-gray-600 font-semibold">{selectedTeamForModal.filename}</div>
                          <div className="text-[8px] text-gray-600 font-semibold">1500 INR - UPI Successful</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-500 uppercase tracking-widest text-[9px] mb-1">Team Members ({selectedTeamForModal.memberCount})</div>
                    <div className="bg-black/40 p-3 rounded-sm border border-gray-900 max-h-[200px] overflow-y-auto flex flex-col gap-3">
                      <div>
                        <div className="font-bold text-squid-pink uppercase tracking-widest text-[10px]">Member 1 (Leader)</div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div><span className="text-gray-500">Name:</span> {selectedTeamForModal.leaderName}</div>
                          <div><span className="text-gray-500">Mobile:</span> {selectedTeamForModal.leaderMobile}</div>
                        </div>
                      </div>
                      {selectedTeamForModal.members.map((m, mIdx) => (
                        <div key={mIdx} className="border-t border-gray-900 pt-3 mt-3">
                          <div className="font-bold text-squid-pink uppercase tracking-widest text-[10px]">Member {mIdx + 2} Details</div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div><span className="text-gray-500">Name:</span> {m.name}</div>
                            <div><span className="text-gray-500">Email:</span> {m.email}</div>
                            <div><span className="text-gray-500">Mobile:</span> {m.mobile}</div>
                            <div><span className="text-gray-500">Course/Year:</span> {m.course} ({m.year} Year)</div>
                            <div className="col-span-2"><span className="text-gray-500">Branch:</span> {m.branch}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 border-t border-gray-900 pt-6 justify-end">
              <button 
                onClick={() => setDetailsModalOpen(false)} 
                className="px-4 py-2 border border-gray-800 hover:border-white text-gray-400 hover:text-white rounded-sm text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer"
              >
                Close
              </button>
              {selectedTeamForModal.status === 'Pending' && (
                <>
                  <button 
                    onClick={() => { handleUpdateStatus(selectedTeamForModal.id, 'Rejected'); setDetailsModalOpen(false); }} 
                    className="px-4 py-2 bg-red-950/40 border border-red-800 text-red-500 hover:bg-red-950/80 rounded-sm text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer"
                  >
                    Reject Team
                  </button>
                  <button 
                    onClick={() => { handleUpdateStatus(selectedTeamForModal.id, 'Approved'); setDetailsModalOpen(false); }} 
                    className="px-4 py-2 bg-green-950/40 border border-green-800 text-green-500 hover:bg-green-950/80 rounded-sm text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer"
                  >
                    Approve Team
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Register;
