import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  MapPin, 
  Cpu, 
  Users, 
  Award, 
  Plus, 
  Lock, 
  Eye,
  ArrowRight, 
  ShieldCheck, 
  Zap,
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  Search,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  HelpCircle,
  TrendingUp,
  Box,
  QrCode,
  CheckCircle2,
  Menu,
  X,
  CreditCard,
  Target,
  Sparkles,
  Smartphone,
  WifiOff,
  CloudLightning,
  Calendar,
  Ticket,
  ExternalLink,
  Image as ImageIcon,
  Smile,
  Send,
  Download,
  Paperclip,
  FileText,
  Terminal,
  Laptop,
  Clock,
  Video,
  Upload
} from "lucide-react";
import { cn } from "./lib/utils";
import { auth } from "./lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

import ReactMarkdown from "react-markdown";

// --- CUSTOM COMPONENTS ---

const CentauriButton = ({ 
  children, 
  onClick, 
  variant = "primary", 
  disabled = false,
  className 
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  variant?: "primary" | "secondary" | "glass" | "ghost", 
  disabled?: boolean,
  className?: string 
}) => {
  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200/20 disabled:opacity-50",
    secondary: "bg-alabaster text-charleston-green border border-white/10 hover:bg-alabaster/90 disabled:opacity-50",
    glass: "glass text-alabaster border-white/20 hover:bg-white/10 disabled:opacity-50",
    ghost: "text-alabaster/60 hover:text-alabaster hover:bg-white/5 disabled:opacity-50"
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-2 active:scale-95",
        styles[variant],
        className
      )}
    >
      {children}
    </button>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, loading, lastAction, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    ...(user && profile?.onboardingComplete ? [{ to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Mission Hub" }] : []),
    { to: "/home", icon: <Compass size={20} />, label: "Discover" },
    { to: "/points", icon: <MapPin size={20} />, label: "Centauri Points" },
    { to: "/ai-guide", icon: <Sparkles size={20} />, label: "AI Guide" },
    { to: "/shop", icon: <Ticket size={20} />, label: "Shop" },
    { to: "/find-a-mentor", icon: <Users size={20} />, label: "Mentors" },
    { to: "/learning", icon: <GraduationCap size={20} />, label: "Academy" },
    { to: "/opportunities", icon: <Briefcase size={20} />, label: "Jobs" },
  ];

  const handleLogin = () => {
    navigate("/signup?mode=login");
  };

  return (
    <div className="min-h-screen bg-charleston-green text-alabaster font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-alabaster/95 backdrop-blur-xl border-b border-black/5 z-[100] flex items-center justify-between px-6 md:px-12 transition-all">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-3xl font-black tracking-tighter text-charleston-green uppercase font-display">Centauri</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <Link 
              key={item.to} 
              to={item.to}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                location.pathname === item.to ? "bg-black/5 text-charleston-green" : "text-charleston-green/60 hover:text-charleston-green"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

      <div className="flex items-center gap-4">
          <Link to="/mentor-apply" className="hidden lg:block text-[10px] font-bold uppercase tracking-widest text-charleston-green/40 hover:text-charleston-green transition-colors">
            Become a Mentor
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="flex items-center gap-3 p-1 pr-4 bg-charleston-green/5 border border-black/10 rounded-full hover:bg-black/10 transition-all">
                <img 
                  referrerPolicy="no-referrer"
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-black/10"
                />
                <div className="hidden sm:block">
                  <p className="text-xs font-bold leading-tight truncate max-w-[100px] text-charleston-green">{user.displayName?.split(" ")[0]}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    <span className="text-[10px] text-charleston-green/60 font-mono">CP-LVL 4</span>
                  </div>
                </div>
              </Link>
              <button 
                onClick={async () => { await logout(); navigate("/"); }}
                className="p-2 text-charleston-green/40 hover:text-red-600 transition-colors"
                title="Log Out"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <CentauriButton onClick={handleLogin} className="py-2 px-6 rounded-full text-sm bg-charleston-green text-alabaster hover:bg-charleston-green/90 border-none shadow-none">
              Log In
            </CentauriButton>
          )}
          <button 
            className="lg:hidden p-2 text-charleston-green/60"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-charleston-green pt-28 px-6 lg:hidden"
          >
            <div className="grid gap-6">
              {navItems.map((item) => (
                <Link 
                  key={item.to} 
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-2xl font-bold tracking-tight text-alabaster/40 hover:text-alabaster transition-colors"
                >
                  <span className="p-3 bg-white/5 rounded-2xl text-indigo-400">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <footer className="bg-black/20 border-t border-white/5 py-12 px-6 md:px-12 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-black tracking-tighter text-alabaster uppercase">Centauri</Link>
            <p className="text-sm text-alabaster/40 leading-relaxed font-medium">Providing digital infrastructure and AI guidance for the next generation of UK technology talent.</p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Mission</h4>
            <div className="flex flex-col gap-2 font-medium text-sm text-alabaster/60">
              <Link to="/home" className="hover:text-alabaster transition-colors">Discover Hubs</Link>
              <Link to="/points" className="hover:text-alabaster transition-colors">Centauri Points</Link>
              <Link to="/find-a-mentor" className="hover:text-alabaster transition-colors">Find a Mentor</Link>
              <Link to="/opportunities" className="hover:text-alabaster transition-colors">Job Board</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Network</h4>
            <div className="flex flex-col gap-2 font-medium text-sm text-alabaster/60">
              <Link to="/shop" className="hover:text-alabaster transition-colors">Locker Shop</Link>
              <Link to="/learning" className="hover:text-alabaster transition-colors">Academy</Link>
              <Link to="/ai-guide" className="hover:text-alabaster transition-colors">AI Pilot Case</Link>
              <Link to="/mentor-apply" className="hover:text-alabaster transition-colors">Become a Mentor</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Contact</h4>
            <div className="flex flex-col gap-2 font-medium text-sm text-alabaster/60">
              <a href="mailto:hello@centauri.uk" className="hover:text-alabaster transition-colors">Contact Us</a>
              <a href="#" className="hover:text-alabaster transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-alabaster transition-colors">Terms of Service</a>
              <span className="text-[10px] uppercase tracking-widest pt-4 text-alabaster/20 font-bold">© Centauri 2026</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Persistence Bar */}
      {lastAction && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-4 glass rounded-[24px] z-[100] border border-indigo-100 flex items-center gap-4 shadow-2xl"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
            <CheckCircle2 size={16} />
          </div>
          <div className="text-sm">
            <span className="font-bold">Centauri Engine:</span> {lastAction.user_message}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// --- LOGIC COMPONENTS ---

const Counter = ({ value, duration = 1.5 }: { value: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const target = parseFloat(value.replace(/[^0-9.]/g, ''));
  const suffix = value.replace(/[0-9.]/g, '');

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(progress * target);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  const displayValue = target % 1 === 0 ? Math.floor(count) : count.toFixed(1);

  return (
    <span>{displayValue}{suffix}</span>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  return (
    <div className="space-y-32 pb-32">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px] -z-10" />

        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-8 max-w-4xl"
        >

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.95]">
            Access. <br />
            Confidence. <br />
            <span className="text-indigo-400">{user ? "Mission Hub." : "Connection."}</span>
          </h1>
          <p className="text-xl md:text-2xl text-alabaster/60 max-w-2xl mx-auto font-medium">
            Helping underserved youth in the UK bridge the digital divide with AI guidance, device access, and industry matching.
          </p>
          <div className="flex flex-col items-center gap-6 pt-4">
            <CentauriButton 
              onClick={() => navigate(user ? "/dashboard" : "/signup")} 
              className="text-lg py-4 px-12 rounded-2xl w-full sm:w-auto shadow-xl shadow-indigo-600/20"
            >
              {user ? "Enter Mission Hub" : "Get Started"} <ChevronRight size={20} />
            </CentauriButton>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <CentauriButton variant="secondary" onClick={() => navigate("/points")} className="text-lg py-4 px-10 rounded-2xl">
                <MapPin size={20} /> Find a Centauri Point
              </CentauriButton>
              <CentauriButton variant="secondary" onClick={() => navigate("/find-a-mentor")} className="text-lg py-4 px-10 rounded-2xl">
                <Users size={20} /> Find a Mentor
              </CentauriButton>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl w-full">
          {[
            { label: "700k+ Youths Missing Access", value: "700K+" },
            { label: "Active Centauri Points", value: "120+" },
            { label: "Career Matches", value: "4.2K" },
            { label: "Total Student XP", value: "1.2M" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="space-y-1"
            >
              <div className="text-4xl font-bold tracking-tighter">
                <Counter value={stat.value} />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-alabaster/40 font-bold leading-tight max-w-[140px] mx-auto">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Cpu />} 
            title="Device Network" 
            desc="Reserve laptops and 5G hubs at local libraries and community centers with one tap."
            color="bg-purple-50 text-purple-600"
          />
          <FeatureCard 
            icon={<Sparkles />} 
            title="AI Career Guide" 
            desc="Personalized roadmaps and CV optimization powered by the world's most advanced AI."
            color="bg-blue-50 text-blue-600"
          />
          <FeatureCard 
            icon={<Award />} 
            title="Gamified Growth" 
            desc="Earn badges, streaks, and real-world internship opportunities as you learn."
            color="bg-emerald-50 text-emerald-600"
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">FAQs</h2>
          <p className="text-alabaster/40 text-lg">Everything you need to know about the Centauri network.</p>
        </div>
        <FAQAccordion />
      </section>
    </div>
  );
};

const FAQAccordion = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What exactly is Centauri?",
      answer: "Centauri is a digital equity platform dedicated to helping underserved youth in the UK. We provide free access to professional hardware, AI-powered career mentorship, and direct connections to technology employers."
    },
    {
      question: "How do I access a laptop or hardware?",
      answer: "Through our 'Centauri Points' network, you can reserve high-spec laptops and 5G connectivity hubs at local libraries and community centers. Just use your Centauri ID to unlock the hardware lockers."
    },
    {
      question: "Is it completely free to use?",
      answer: "Yes. Our mission is to bridge the digital divide. All our core services—including AI career guidance, hardware loans, and learning resources—are free for eligible young people aged 16-24."
    },
    {
      question: "How does the AI Career Guide help me?",
      answer: "Our AI analysis tool takes your current skills and interests to create a step-by-step roadmap. It helps you build a professional CV, suggests specific training bootcamps, and prepares you for technical interviews."
    },
    {
      question: "Can I use Centauri if I'm still in school?",
      answer: "Absolutely. We have resources specifically designed for students (GCSE/A-Level/T-Level) as well as those who have already left formal education and are looking for their first breakthrough in tech."
    }
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <motion.div 
          key={i}
          className={cn(
            "group overflow-hidden rounded-3xl border transition-all duration-300",
            expandedIndex === i ? "bg-white/5 border-indigo-500/30" : "bg-white/5 border-white/5 hover:border-white/10"
          )}
        >
          <button
            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
            className="w-full p-6 md:p-8 flex items-center justify-between text-left"
          >
            <span className={cn(
              "text-lg md:text-xl font-bold tracking-tight transition-colors",
              expandedIndex === i ? "text-indigo-400" : "text-alabaster"
            )}>
              {faq.question}
            </span>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
              expandedIndex === i ? "bg-indigo-600 text-white rotate-180" : "bg-white/5 text-alabaster/40 group-hover:text-alabaster"
            )}>
              <ChevronDown size={20} />
            </div>
          </button>
          <AnimatePresence>
            {expandedIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-6 md:px-8 pb-8 text-alabaster/60 leading-relaxed text-lg">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color }: any) => (
  <div className="card-centauri p-10 space-y-6">
    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", color)}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <h3 className="text-3xl font-bold tracking-tight">{title}</h3>
    <p className="text-lg text-alabaster/40 leading-relaxed">{desc}</p>
  </div>
);

const OnboardingPage = () => {
  const { processOnboarding, user, profile, loading: authLoading, signUp, login } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [isLoginMode, setIsLoginMode] = useState(searchParams.get("mode") === "login" || !user);
  const [recommendation, setRecommendation] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && user && profile) {
      if (profile.onboardingComplete) {
        navigate("/dashboard");
      } else if (profile.currentStep && profile.currentStep > step) {
        setStep(profile.currentStep);
      }
    }
  }, [user, profile, authLoading, navigate]);

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "login") {
      setIsLoginMode(true);
    } else if (mode === "signup") {
      setIsLoginMode(false);
    }
  }, [searchParams]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    stateSchool: "No",
    fsmEligible: "No",
    occupation: "",
    ethnicity: "",
    ethnicityOther: "",
    gender: "",
    genderOther: "",
    postcode: "",
    strengths: "",
    weaknesses: ""
  });
  const [errors, setErrors] = useState<string[] | null>(null);

  const getStepValidationError = () => {
    if (isLoginMode) {
      if (!formData.email.includes("@")) return "A valid email address is required.";
      if (!formData.password) return "Password is required.";
      return null;
    }

    if (step === 1) {
      if (!formData.fullName.trim()) return "Full name is required to initialize your pilot profile.";
      if (!formData.email.includes("@")) return "A valid email address is required for mission comms.";
      const phoneDigits = formData.phone.replace(/\D/g, "");
      if (phoneDigits.length !== 11) return "UK mobile numbers must be exactly 11 digits (e.g., 07123456789).";
      if (formData.password.length < 8) return "Security protocol requires a password of at least 8 characters.";
      if (formData.password !== formData.confirmPassword) return "Passwords do not match. Please verify your security key.";
    }
    if (step === 2) {
      if (!formData.occupation.trim()) return "Please specify the occupation of the main earner.";
      if (!formData.postcode.trim()) return "Home postcode is required for localized support.";
    }
    if (step === 3) {
      if (!formData.ethnicity) return "Please select your ethnicity or 'Prefer not to say'.";
      if (formData.ethnicity === "Other ethnic group" && !formData.ethnicityOther.trim()) {
        return "Please specify your ethnic group details.";
      }
      
      if (!formData.gender) return "Please select your gender or 'Prefer not to say'.";
      if (formData.gender === "Other" && !formData.genderOther.trim()) {
        return "Please specify your gender details.";
      }
    }
    if (step === 4) {
      if (!formData.strengths.trim()) return "Please share your strengths so we can customize your path.";
      if (!formData.weaknesses.trim()) return "Please identify areas for growth for better targeting.";
    }
    return null;
  };

  const handleAuth = async () => {
    const error = getStepValidationError();
    if (error) {
      setErrors([error]);
      return;
    }

    setLoading(true);
    setErrors(null);
    try {
      if (isLoginMode) {
        await login(formData.email, formData.password);
        navigate("/dashboard");
      } else {
        // First step of signup - create auth account
        await signUp(formData.email, formData.password, formData.fullName);
        setStep(2);
      }
    } catch (err: any) {
      setErrors([err.message || "Authentication failed. Please check your credentials."]);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    const error = getStepValidationError();
    if (error) {
      setErrors([error]);
      return;
    }

    setLoading(true);
    setErrors(null);
    try {
      const result = await processOnboarding({ ...formData, step });
      if (result.validation_errors) {
        setErrors(result.validation_errors);
        setLoading(false);
        return;
      }

      if (result.recommended_course) {
        setRecommendation(result.recommended_course);
      }

      if (result.is_complete) {
        setStep(5); 
      } else {
        setStep(step + 1);
      }
    } catch (err) {
      setErrors(["Centauri Gatekeeper timed out. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  if (isLoginMode) {
    return (
      <div className="max-w-md mx-auto py-24 px-6 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-lg text-alabaster/50">Return to your mission hub.</p>
        </div>

        <div className="card-centauri p-10 space-y-8">
          {errors && (
            <div className="space-y-2">
              {errors.map((e, i) => (
                <p key={i} className="text-xs font-bold text-red-400 bg-red-400/10 p-3 rounded-xl flex items-center gap-2">
                  <Zap size={14} /> {e}
                </p>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <InputField 
              label="Email Address" 
              placeholder="pilot@connection.com" 
              value={formData.email}
              onChange={(e: any) => setFormData({...formData, email: e.target.value})}
            />
            <InputField 
              label="Centauri Access Key" 
              type="password" 
              showPasswordToggle 
              value={formData.password}
              onChange={(e: any) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <CentauriButton onClick={handleAuth} className="w-full py-5 text-lg" disabled={loading}>
            {loading ? "Authenticating..." : "Enter Command Centre"}
          </CentauriButton>

          <p className="text-center text-sm text-alabaster/40 font-medium">
            New pilot? <button onClick={() => setIsLoginMode(false)} className="text-indigo-400 font-bold hover:underline">Start Onboarding</button>
          </p>
        </div>
      </div>
    );
  }

  if (step === 5) {
    const finishOnboarding = async () => {
      setLoading(true);
      try {
        await processOnboarding(formData, true); // true = complete update in Firestore
        navigate("/dashboard");
      } catch (err) {
        setErrors(["Sync failed. Please try again."]);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-2xl mx-auto py-24 px-6 text-center space-y-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full mx-auto flex items-center justify-center mb-8"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-5xl font-bold tracking-tight">Onboarding Complete</h1>
        {recommendation ? (
          <div className="card-centauri p-8 space-y-4 text-left border-indigo-500/30">
            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-widest text-xs">
              <Sparkles size={14} /> Recommended Course
            </div>
            <h3 className="text-3xl font-bold">{recommendation.title}</h3>
            <p className="text-alabaster/60 leading-relaxed">{recommendation.reason}</p>
          </div>
        ) : (
          <p className="text-xl text-alabaster/50">Welcome to the Centauri Network, Pilot.</p>
        )}
        <CentauriButton onClick={finishOnboarding} disabled={loading} className="w-full py-5 text-lg">
          {loading ? "Initializing Hub..." : "Select Mission & Enter Hub"}
        </CentauriButton>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="space-y-8">
        {/* Navigation Controls */}
        <div className="flex items-center justify-between h-8">
          <button 
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1 || loading}
            className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-alabaster/40 hover:text-alabaster transition-all disabled:opacity-0"
          >
            <ChevronLeft size={18} /> Back
          </button>
          {step < 5 && (
            <button 
              onClick={handleProcess}
              disabled={loading}
              className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-alabaster/40 hover:text-alabaster transition-all"
            >
              Forward <ChevronRight size={18} />
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={cn(
              "h-2 flex-1 rounded-full transition-all duration-500",
              step >= s ? "bg-indigo-600" : "bg-white/5"
            )} />
          ))}
        </div>

        <section className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight">
              {step === 1 ? "Identity" : step === 2 ? "Background" : step === 3 ? "Demographics" : "Skills"}
            </h1>
            <p className="text-xl text-alabaster/50">
              {step === 4 ? "Help us customize your learning journey." : "Secure mission onboarding for UK youth."}
            </p>
          </div>

          {errors && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm space-y-1">
              {errors.map((e, i) => <div key={i} className="flex items-center gap-2"><ArrowRight size={12} /> {e}</div>)}
            </div>
          )}

          <div className="grid gap-6">
            {step === 1 && (
              <>
                <InputField label="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="Alex Nomos" />
                <InputField label="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="alex@example.com" />
                <InputField label="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="07123456789" />
                <InputField label="Secure Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" showPasswordToggle />
                <InputField label="Confirm Password" type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} placeholder="••••••••" showPasswordToggle />
              </>
            )}

            {step === 2 && (
              <>
        <div className="grid grid-cols-2 gap-4 items-stretch">
          <SelectField label="State School Student?" value={formData.stateSchool} options={["Yes", "No"]} onChange={v => setFormData({...formData, stateSchool: v})} />
          <SelectField 
            label={
              <div className="flex items-center gap-1">
                FSM Eligible?
                <div className="group relative">
                  <HelpCircle size={14} className="text-alabaster/20 cursor-help hover:text-indigo-400 transition-colors" />
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-tighter rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 pointer-events-none whitespace-nowrap shadow-xl z-[150]">
                    Free School Meals
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-indigo-600" />
                  </div>
                </div>
              </div>
            } 
            value={formData.fsmEligible} 
            options={["Yes", "No"]} 
            onChange={v => setFormData({...formData, fsmEligible: v})} 
          />
        </div>
                <InputField label="Occupation of Main Earner" value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} placeholder="e.g. Retail, Student, Unemployed" />
                <InputField label="Home Postcode" value={formData.postcode} onChange={e => setFormData({...formData, postcode: e.target.value})} placeholder="SW1A 1AA" />
              </>
            )}

            {step === 3 && (
              <>
                <DropdownField 
                  label="Ethnicity" 
                  value={formData.ethnicity} 
                  options={[
                    "White",
                    "Asian or Asian British",
                    "Black, Black British, Caribbean or African",
                    "Mixed or multiple ethnic groups",
                    "Other ethnic group",
                    "Prefer not to say"
                  ]} 
                  onChange={v => setFormData({...formData, ethnicity: v})} 
                />
                {formData.ethnicity === "Other ethnic group" && (
                  <InputField label="Please specify ethnicity" value={formData.ethnicityOther} onChange={e => setFormData({...formData, ethnicityOther: e.target.value})} placeholder="Self-identify" />
                )}
                
                <DropdownField 
                  label="Gender" 
                  value={formData.gender} 
                  options={["Male", "Female", "Non-binary", "Other", "Prefer not to say"]} 
                  onChange={v => setFormData({...formData, gender: v})} 
                />
                {formData.gender === "Other" && (
                  <InputField label="Please specify gender" value={formData.genderOther} onChange={e => setFormData({...formData, genderOther: e.target.value})} placeholder="Self-identify" />
                )}
              </>
            )}

            {step === 4 && (
              <>
                <TextAreaField label="What are your key strengths?" value={formData.strengths} onChange={e => setFormData({...formData, strengths: e.target.value})} placeholder="e.g. Problem solving, creative thinking, fast learner..." />
                <TextAreaField label="What are your main weaknesses?" value={formData.weaknesses} onChange={e => setFormData({...formData, weaknesses: e.target.value})} placeholder="e.g. Public speaking, time management, technical experience..." />
              </>
            )}
          </div>

          <CentauriButton onClick={step === 1 ? handleAuth : handleProcess} disabled={loading} className="w-full py-5 text-lg">
            {loading ? (step === 1 ? "Authenticating..." : "Gatekeeper Reviewing...") : step === 4 ? "Complete Onboarding" : "Next Mission"}
          </CentauriButton>

          {step === 1 && (
            <p className="text-center text-sm text-alabaster/40 font-medium">
              Already have an account? <button onClick={() => setIsLoginMode(true)} className="text-indigo-400 font-bold hover:underline">Log In</button>
            </p>
          )}

          
          <p className="text-center text-[10px] text-alabaster/30 uppercase tracking-[0.2em] font-bold">
            Data protected by Centauri AES-256 Protocol
          </p>
        </section>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder, type = "text", showPasswordToggle = false }: any) => {
  const [show, setShow] = useState(false);
  const inputType = show && showPasswordToggle ? "text" : type;

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-alabaster/40 ml-4">{label}</label>
      <div className="relative group">
        <input 
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 outline-none focus:border-indigo-500 transition-colors text-alabaster"
        />
        {showPasswordToggle && (
          <button
            type="button"
            onMouseDown={() => setShow(true)}
            onMouseUp={() => setShow(false)}
            onMouseLeave={() => setShow(false)}
            onTouchStart={() => setShow(true)}
            onTouchEnd={() => setShow(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-alabaster/20 hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <Eye size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

const TextAreaField = ({ label, value, onChange, placeholder }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold uppercase tracking-widest text-alabaster/40 ml-4">{label}</label>
    <textarea 
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-indigo-500 transition-colors text-alabaster resize-none"
    />
  </div>
);

const DropdownField = ({ label, value, options, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold uppercase tracking-widest text-alabaster/40 ml-4">{label}</label>
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-indigo-500 transition-colors text-alabaster appearance-none cursor-pointer"
    >
      <option value="" disabled className="bg-charleston-green">Select {label}</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt} className="bg-charleston-green">{opt}</option>
      ))}
    </select>
  </div>
);

const SelectField = ({ label, value, options, onChange }: any) => (
  <div className="space-y-2 flex flex-col h-full uppercase">
    <div className="min-h-[16px] text-[10px] font-bold tracking-widest text-alabaster/40 ml-4 leading-none flex items-center">
      {label}
    </div>
    <div className="flex gap-2 flex-1 pt-1">
      {options.map((opt: string) => (
        <button 
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "flex-1 p-4 rounded-2xl border transition-all text-sm font-bold flex items-center justify-center",
            value === opt ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white/5 border-white/10 text-alabaster/40"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const MentorMatchPage = () => (
  <div className="max-w-4xl mx-auto py-32 px-6 text-center space-y-12">
    <div className="w-32 h-32 bg-indigo-600 rounded-full mx-auto flex items-center justify-center animate-pulse">
      <Users size={64} className="text-white" />
    </div>
    <div className="space-y-4">
      <h1 className="text-6xl font-bold tracking-tight">Priority Match Initated</h1>
      <p className="text-xl text-alabaster/50 max-w-2xl mx-auto">
        Centauri Gatekeeper has flagged you as <strong>High Priority</strong>. You've been fast-tracked to our 1-to-1 Mentor Matching Programme.
      </p>
    </div>
    <div className="flex justify-center gap-6">
      <CentauriButton onClick={() => window.location.href = "/dashboard"} variant="secondary">Go to Mission Hub</CentauriButton>
      <CentauriButton>Start Interview</CentauriButton>
    </div>
  </div>
);

const LockerHubPage = () => (
  <div className="max-w-4xl mx-auto py-32 px-6 text-center space-y-12">
    <div className="w-32 h-32 bg-emerald-500/20 rounded-full mx-auto flex items-center justify-center">
      <Box size={64} className="text-emerald-400" />
    </div>
    <div className="space-y-4">
      <h1 className="text-6xl font-bold tracking-tight">Active Locker Network</h1>
      <p className="text-xl text-alabaster/50 max-w-2xl mx-auto">
        We don't have mentors in your area yet, but your Centauri ID is active! You can still access our <strong>Laptop Loan Lockers</strong> at any of our Hub Points.
      </p>
    </div>
    <div className="flex justify-center gap-6">
      <CentauriButton onClick={() => window.location.href = "/points"}>Find Nearest Locker</CentauriButton>
      <CentauriButton variant="secondary" onClick={() => window.location.href = "/dashboard"}>Open Dashboard</CentauriButton>
    </div>
  </div>
);

const SignupPage = OnboardingPage;

const StatusToggle = ({ label, checked, onChange, helper }: any) => (
  <button 
    onClick={onChange}
    className={cn(
      "w-full p-6 border rounded-3xl text-left transition-all flex items-center justify-between",
      checked ? "border-indigo-500 bg-indigo-500/10" : "border-white/5 bg-white/5 hover:border-white/20"
    )}
  >
    <div className="space-y-1">
      <div className="font-bold flex items-center gap-2">
        {label}
        {checked && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
      </div>
      <div className="text-xs text-alabaster/40 font-mono tracking-tight uppercase">{helper}</div>
    </div>
    <div className={cn(
      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
      checked ? "bg-indigo-500 border-indigo-500 text-white" : "border-white/10"
    )}>
      {checked && <div className="w-2 h-2 bg-white rounded-full" />}
    </div>
  </button>
);

const CentauriIDCard = () => {
  const { user, profile } = useApp();
  return (
    <motion.div 
      whileHover={{ scale: 1.02, rotateY: 5 }}
      className="max-w-md mx-auto aspect-[1.6/1] bg-indigo-600 rounded-[32px] p-8 text-white relative flex flex-col justify-between overflow-hidden shadow-2xl shadow-indigo-500/20"
    >
      {/* Texture/Pattern */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-black/20 to-transparent" />
      
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-2">
          <Zap size={24} className="fill-current" />
          <span className="font-bold tracking-tighter text-xl uppercase italic">Centauri ID</span>
        </div>
        <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
          {profile?.priorityLevel && profile.priorityLevel > 6 ? "Priority Access" : "Standard Tier"}
        </div>
      </div>

      <div className="flex items-end justify-between z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img 
              referrerPolicy="no-referrer"
              src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"} 
              alt="Avatar" 
              className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30"
            />
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">{user?.displayName || "Centauri Pilot"}</h2>
              <p className="text-[10px] font-mono opacity-60 uppercase tracking-widest">{user?.email || "ID: C-882200-X"}</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div>
              <div className="text-[8px] opacity-40 uppercase font-bold tracking-widest">Issued</div>
              <div className="text-xs font-bold uppercase">2026-MAY</div>
            </div>
            <div>
              <div className="text-[8px] opacity-40 uppercase font-bold tracking-widest">Type</div>
              <div className="text-xs font-bold uppercase">LIFETIME ACCESS</div>
            </div>
            <div>
              <div className="text-[8px] opacity-40 uppercase font-bold tracking-widest">Credits</div>
              <div className="text-xs font-bold uppercase">100 XP</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-2 rounded-xl">
          <QrCode size={48} className="text-indigo-600" />
        </div>
      </div>
    </motion.div>
  );
};

const PointsPage = () => {
  const { triggerCentauri } = useApp();
  const navigate = useNavigate();
  const points = [
    { name: "Birmingham Mission Hub", type: "Command Center", status: "Active", devices: 20, available: 4, distance: "0.1mi", pos: { t: 50, l: 50 } },
    { name: "Wolverhampton Node", type: "Satellite Hub", status: "Active", devices: 12, available: 8, distance: "12.4mi", pos: { t: 20, l: 20 } },
    { name: "Dudley Digital Vault", type: "Digital Vault", status: "Limited", devices: 5, available: 2, distance: "8.2mi", pos: { t: 45, l: 20 } },
    { name: "Solihull Innovation Point", type: "Academy", status: "Active", devices: 35, available: 12, distance: "9.1mi", pos: { t: 75, l: 65 } },
    { name: "Walsall Learning Centre", type: "Secure Node", status: "Offline", devices: 0, available: 0, distance: "8.8mi", pos: { t: 15, l: 55 } },
    { name: "Coventry Edge Node", type: "Edge Cache", status: "Active", devices: 18, available: 6, distance: "18.5mi", pos: { t: 65, l: 85 } },
    { name: "Stourbridge Link", type: "Relay", status: "Active", devices: 8, available: 3, distance: "10.2mi", pos: { t: 80, l: 15 } },
  ];

  return (
    <div className="grid lg:grid-cols-[1fr_400px] h-[calc(100vh-80px)]">
      {/* Map Simulation */}
      <div className="relative bg-[#020617] overflow-hidden flex items-center justify-center">
        {/* Original Clean Tech Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#6366F1 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }} />
        <div className="absolute inset-0 bg-radial-gradient(circle_at_center, transparent 0%, #020617 90%) pointer-events-none" />
        
        <div className="relative w-full h-full p-12 flex flex-col items-center justify-center">
          <div className="absolute top-10 left-10 flex flex-col gap-2 z-20">
            <div className="px-5 py-2 bg-black/80 backdrop-blur-2xl rounded-full text-[10px] font-black shadow-sm border border-indigo-500/20 text-indigo-400 tracking-[0.2em] leading-none uppercase">Sector: West Midlands</div>
            <div className="text-[9px] font-mono text-white/30 px-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Satellite Uplink Active
            </div>
          </div>
          
          <div className="absolute bottom-10 right-10 flex gap-4 z-20">
             <div className="px-4 py-2 bg-black/80 backdrop-blur-2xl rounded-lg text-[9px] border border-white/5 font-mono text-white/40 uppercase tracking-widest leading-none">
                Mission Status: Ready
             </div>
          </div>
          
          {/* Map Pins overlayed on the map area */}
          <div className="absolute inset-0 w-full h-full">
             {points.map((p, i) => (
                <motion.div 
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1, type: "spring", damping: 15 }}
                  className="absolute pointer-events-auto"
                  style={{ top: `${p.pos.t}%`, left: `${p.pos.l}%` }}
                >
                  <div className="group relative flex flex-col items-center">
                    {/* Compass Rings */}
                    <div className="absolute inset-[-30px] border border-indigo-500/5 rounded-full animate-[spin_15s_linear_infinite]" />
                    <div className="absolute inset-[-15px] border border-indigo-500/10 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
                    
                    {/* Radar Pulse */}
                    <motion.div 
                      animate={{ scale: [1, 3], opacity: [0.4, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeOut" }}
                      className={cn(
                        "absolute inset-0 rounded-full",
                        p.devices > 0 ? "bg-indigo-400/30" : "bg-red-500/10"
                      )}
                    />
                    
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all group-hover:scale-125 cursor-pointer border backdrop-blur-xl",
                      p.devices > 0 
                        ? "bg-[#0A0F1E]/80 border-indigo-500/50 group-hover:bg-indigo-600/80 group-hover:border-indigo-400" 
                        : "bg-red-950/80 border-red-500/50"
                    )}>
                      {p.name.includes("Hub") || p.name.includes("Mission") ? <MapPin size={24} className="text-indigo-400 group-hover:text-white" /> : <Zap size={20} className="text-indigo-500 group-hover:text-white" />}
                    </div>
                    
                    {/* Floating Label (Mini) */}
                    <div className="mt-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/5 text-[9px] font-bold text-white/60 tracking-wider transition-all group-hover:opacity-0">
                      {p.name.split(' ')[0]}
                    </div>
                    
                    {/* Geographical Tag (Large) */}
                    <div className="absolute top-full mt-4 glass-dark p-4 rounded-2xl text-[11px] font-bold min-w-[220px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all transform translate-y-4 group-hover:translate-y-0 z-50 border border-indigo-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                      <div className="flex items-center justify-between mb-3">
                        <div className={cn("px-2.5 py-1 rounded-md text-[9px] uppercase tracking-widest font-black", p.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400")}>
                          {p.status}
                        </div>
                        <div className="text-[9px] text-indigo-400 font-mono tracking-tighter">NODE ID: {Math.random().toString(36).substring(7).toUpperCase()}</div>
                      </div>
                      <div className="text-alabaster text-base tracking-tight mb-0.5">{p.name}</div>
                      <div className="text-white/40 uppercase tracking-[0.2em] text-[8px] mb-3">{p.type}</div>
                      
                      <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-3">
                        <div className="space-y-1">
                          <div className="text-[8px] text-white/30 uppercase tracking-widest font-black">Capacity</div>
                          <div className="text-alabaster text-xs">{p.devices} Nodes</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[8px] text-white/30 uppercase tracking-widest font-black">Available</div>
                          <div className="text-emerald-400 text-xs">{p.available} Slots</div>
                        </div>
                      </div>

                      <button 
                        onClick={(e) => { e.stopPropagation(); triggerCentauri(`Booking session at ${p.name}`); }}
                        className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                      >
                        Secure Access
                      </button>
                    </div>
                  </div>
                </motion.div>
             ))}
          </div>
        </div>
      </div>

      {/* Point List */}
      <div className="bg-charleston-green border-l border-white/5 overflow-y-auto p-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-alabaster">Centauri Points</h2>
            <div className="p-2 bg-white/5 rounded-lg text-alabaster/60 hover:text-white transition-colors cursor-pointer"><Search size={16} /></div>
          </div>
          <p className="text-sm text-alabaster/50 font-medium leading-relaxed">Select a hub to reserve circular tech hardware or book a local mentorship session.</p>
        </div>

        <div className="space-y-4">
          {points.map((p, i) => {
            const occupancy = p.devices > 0 ? ((p.devices - p.available) / p.devices) * 100 : 0;
            const isHighDemand = occupancy >= 75;
            const loanDuration = isHighDemand ? "12h" : "24h";

            return (
              <motion.div 
                key={i} 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className={cn(
                  "card-centauri p-6 space-y-4 transition-all hover:bg-white/[0.03]",
                  isHighDemand && "border-orange-500/20"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1 font-mono">{p.type}</div>
                    <h4 className="font-bold text-alabaster text-lg">{p.name}</h4>
                    <div className="text-xs text-alabaster/40 flex items-center gap-1 font-medium"><MapPin size={10} className="text-indigo-500" /> {p.distance} away</div>
                  </div>
                  <div className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    p.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                  )}>
                    {p.status}
                  </div>
                </div>

                {p.status !== "Offline" && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2.5">
                       <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-alabaster/30">
                         <span>Locker Occupancy</span>
                         <span className={cn(isHighDemand ? "text-orange-400" : "text-emerald-400")}>{occupancy.toFixed(0)}%</span>
                       </div>
                       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${occupancy}%` }}
                           className={cn("h-full transition-all", isHighDemand ? "bg-gradient-to-r from-orange-600 to-orange-400" : "bg-gradient-to-r from-emerald-600 to-emerald-400")} 
                         />
                       </div>
                       {isHighDemand && (
                         <div className="text-[9px] font-bold text-orange-400/80 uppercase tracking-tight flex items-center gap-1">
                           <Zap size={10} /> High demand zone detected
                         </div>
                       )}
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-white/5 pt-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Clock size={12} className="text-alabaster/20" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-alabaster/40">
                            Loan Window
                          </span>
                        </div>
                        <div className={cn("text-xs font-bold pl-5", isHighDemand ? "text-orange-400" : "text-white")}>
                          {loanDuration} Duration
                        </div>
                      </div>
                      <CentauriButton 
                        onClick={() => navigate("/ai-guide", { state: { 
                          action: "LOCKER_RESERVE", 
                          name: p.name, 
                          message: `I'm at ${p.name}. Capacity is ${occupancy.toFixed(0)}%. Requesting laptop loan.` 
                        }})}
                        className="py-2.5 px-5 text-xs rounded-xl shadow-lg border border-white/5"
                        variant={p.available > 0 ? "primary" : "secondary"}
                      >
                        {p.available > 0 ? "Request Laptop" : "Join Waitlist"}
                      </CentauriButton>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AIGuidePage = () => {
  const { askAI } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<any[]>([
    { role: "ai", text: "Hello! I'm Centauri AI. I can help you find a tech path, optimize your CV, or suggest learning resources. What's on your mind?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const state = location.state as { action?: string; message?: string };
    if (state?.action === "LOCKER_RESERVE" && state.message) {
      handleAutoSend(state.message);
    }
  }, [location.state]);

  const handleAutoSend = async (msg: string) => {
    setLoading(true);
    try {
      const resp = await askAI(msg);
      processAiResponse(msg, resp);
    } catch (e) {
      setMessages(prev => [...prev, { role: "ai", text: "System Error: Centauri Core is offline." }]);
    } finally {
      setLoading(false);
    }
  };

  const processAiResponse = (userText: string, resp: any) => {
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    
    const targetUrl = resp.data_payload?.target_url || (resp.ui_logic?.includes("redirect") ? resp.target_url : null);

    if (targetUrl && targetUrl !== location.pathname) {
      setMessages(prev => [...prev, { 
        role: "ai", 
        text: resp.user_message,
        data: resp.data_payload,
        db_operation: resp.db_operation,
        ui_logic: resp.ui_logic,
        action: { label: `Go to ${targetUrl.split("/")[1]?.replace(/-/g, " ") || "Dashboard"}`, url: targetUrl }
      }]);
    } else {
      setMessages(prev => [...prev, { 
        role: "ai", 
        text: resp.user_message,
        data: resp.data_payload,
        db_operation: resp.db_operation,
        ui_logic: resp.ui_logic
      }]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.type.startsWith("image/") || file.type === "text/plain") {
        setAttachedFile(file);
      } else {
        alert("Please upload a PDF, image, or text file.");
      }
    }
  };

  const onSend = async () => {
    if ((!input && !attachedFile) || loading) return;
    
    let userMsg = input;
    if (attachedFile) {
      userMsg = userMsg ? `${userMsg} [File attached: ${attachedFile.name}]` : `[File attached: ${attachedFile.name}]`;
    }

    setInput("");
    const fileToUpload = attachedFile;
    setAttachedFile(null);
    
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      let fileData = undefined;
      if (fileToUpload) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => {
            const base64 = (reader.result as string).split(",")[1];
            resolve(base64);
          };
        });
        reader.readAsDataURL(fileToUpload);
        const base64 = await base64Promise;
        fileData = { data: base64, mimeType: fileToUpload.type };
      }

      const resp = await askAI(userMsg, fileData);
      processAiResponse(userMsg, resp);
    } catch (e) {
      setMessages(prev => [...prev, { role: "ai", text: "I'm sorry, I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col p-6">
      <div className="flex-1 overflow-y-auto space-y-6 pb-6 scrollbar-hide">
        {messages.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "flex flex-col max-w-[80%]",
              m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <div className={cn(
              "p-5 rounded-[24px] text-sm leading-relaxed",
              m.role === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "glass dark:bg-black/40 border-black/5 rounded-tl-none font-medium"
            )}>
              {m.role === "ai" ? (
                <div className="space-y-4">
                  <div className="markdown-body">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                  {m.db_operation && (
                    <div className="mt-2 p-3 bg-black/80 rounded-xl border border-white/10 font-mono text-[10px] text-emerald-400 overflow-x-auto">
                      <div className="text-white/40 mb-1 flex items-center gap-1">
                        <Terminal size={10} /> SYSTEM_EXEC_DB
                      </div>
                      {m.db_operation}
                    </div>
                  )}
                  {m.ui_logic && (
                    <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-bold uppercase tracking-tighter text-indigo-400 w-fit">
                      Trigger: {m.ui_logic}
                    </div>
                  )}
                  {m.action && (
                    <CentauriButton 
                      onClick={() => navigate(m.action.url)}
                      className="py-2 px-4 text-xs rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white"
                    >
                      {m.action.label} <ArrowRight size={14} />
                    </CentauriButton>
                  )}
                  {m.data && (
                    <div className="flex flex-wrap gap-2">
                       {m.data.streak !== undefined && (
                         <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-orange-400">
                           Streak: {m.data.streak}
                         </div>
                       )}
                       {m.data.laptops_loaned !== undefined && (
                         <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                           <Laptop size={10} /> <Counter value={m.data.laptops_loaned.toString()} /> Loaned
                         </div>
                       )}
                       {m.data.hours_mentored !== undefined && (
                         <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1">
                           <Clock size={10} /> <Counter value={m.data.hours_mentored.toString()} /> Hours
                         </div>
                       )}
                    </div>
                  )}
                </div>
              ) : (
                m.text
              )}
            </div>
            <div className="mt-2 text-[10px] text-alabaster/40 font-bold uppercase tracking-widest">{m.role === "ai" ? "Centauri AI" : "You"}</div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-2 p-4 glass rounded-full w-24 justify-center">
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          </div>
        )}
        <div ref={chatEnd} />
      </div>

      <div className="relative group">
        {attachedFile && (
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute -top-16 left-0 right-0 p-2 glass rounded-2xl border border-white/10 flex items-center justify-between mb-4 mx-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-alabaster">{attachedFile.name}</p>
                <p className="text-[10px] text-alabaster/40 uppercase font-bold tracking-widest">{(attachedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button 
              onClick={() => setAttachedFile(null)}
              className="p-2 text-alabaster/40 hover:text-white"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-[30px] opacity-20 blur group-hover:opacity-40 transition-opacity" />
        <div className="relative flex items-center bg-white/5 rounded-[28px] border border-white/10 overflow-hidden p-2 gap-2 shadow-xl shadow-black/20">
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.txt,image/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 text-alabaster/40 hover:text-alabaster hover:bg-white/5 transition-all rounded-2xl flex items-center justify-center"
            title="Upload CV or Document"
          >
            <Paperclip size={20} />
          </button>
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onSend()}
            placeholder="Ask anything about tech careers..." 
            className="flex-1 px-4 py-3 outline-none text-sm font-medium bg-transparent text-alabaster"
          />
          <button 
            onClick={onSend}
            disabled={(!input && !attachedFile) || loading}
            className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:grayscale"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { profile, user, bookings, loading, logout } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && profile && !profile.onboardingComplete) {
      navigate("/signup");
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="flex gap-2">
          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 bg-indigo-500 rounded-full" />
          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-3 h-3 bg-indigo-500 rounded-full" />
          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-3 h-3 bg-indigo-500 rounded-full" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-alabaster/20 animate-pulse">Establishing Secure Uplink</p>
      </div>
    );
  }

  // If loading is finished and user is STILL null, then show restricted
  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-alabaster/20">
          <Lock size={48} />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Access Restricted</h1>
          <p className="text-xl text-alabaster/50 max-w-md">Please log in to access your Mission Hub and track your progress.</p>
        </div>
        <CentauriButton onClick={() => navigate("/signup?mode=login")} className="px-12">Log In / Sign Up</CentauriButton>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
      <div className="flex flex-col md:flex-row gap-8 justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">Mission Hub</h1>
          <p className="text-xl text-alabaster/50">Welcome back, Pilot. Your training is 42% complete.</p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="flex gap-4">
            <StatBox icon={<Zap size={16} />} value={profile?.streak || 0} label="Day Streak" color="text-orange-400" />
            <StatBox icon={<Award size={16} />} value={profile?.badges?.length || 1} label="Badges" color="text-indigo-400" />
            <StatBox icon={<TrendingUp size={16} />} value={profile?.xp || 100} label="Total XP" color="text-emerald-400" />
          </div>
          <button 
            onClick={async () => { await logout(); navigate("/"); }}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-alabaster/20 hover:text-red-400 transition-colors flex items-center gap-2"
          >
            <Lock size={10} /> Terminate Session
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card-centauri h-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold tracking-tight">Current Roadmap</h3>
              <CentauriButton variant="ghost" className="text-xs">View All</CentauriButton>
            </div>
            <div className="space-y-6">
              <RoadmapStep number="01" title="Digital Fundamentals" status="COMPLETED" />
              <RoadmapStep number="02" title="Introduction to Web" status="ACTIVE" />
              <RoadmapStep number="03" title="Mentorship Matching" status="LOCKED" />
              <RoadmapStep number="04" title="First Career Talk" status="LOCKED" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-centauri bg-black/40 text-white border-none p-8 space-y-6">
              <CloudLightning size={40} className="text-indigo-400" />
              <h3 className="text-3xl font-bold tracking-tight leading-tight">Apply for a Centauri Grant</h3>
              <p className="text-white/60">Unlock up to £1,000 for verified course fees or equipment.</p>
              <button className="w-full py-4 bg-alabaster text-charleston-green font-bold rounded-2xl transition-colors hover:bg-alabaster/90">Unlock Level 5</button>
            </div>
            <div className="card-centauri overflow-hidden p-0 flex flex-col">
              <div className="p-8 space-y-2 flex-1">
                 <h3 className="text-2xl font-bold tracking-tight">Hardware Health</h3>
                 <p className="text-sm text-alabaster/50">Tracking your HP ProBook #9921</p>
                 <div className="pt-4 space-y-2">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                     <span>Battery</span>
                     <span>92%</span>
                   </div>
                   <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[92%]" />
                   </div>
                 </div>
              </div>
              <div className="p-4 bg-indigo-600 text-white text-center font-bold text-xs">NEXT CHECK: 14 DAYS</div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card-centauri p-0 overflow-hidden">
            <div className="p-8 space-y-6">
              <h3 className="text-xl font-bold tracking-tight">Active ID</h3>
              <CentauriIDCard />
            </div>
          </div>

          {bookings.length > 0 && (
            <div className="card-centauri border-indigo-500/20 shadow-xl shadow-indigo-500/5 transition-all animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <Calendar size={18} className="text-indigo-400" />
                  Upcoming Sessions
                </h3>
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              </div>
              <div className="space-y-4">
                {bookings.map((b, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Video size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-sm">
                          {b.type} {b.mentorName && <span className="text-indigo-400">w/ {b.mentorName}</span>}
                        </div>
                        <div className="text-[10px] text-alabaster/40 uppercase tracking-widest font-bold">{b.platform}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-indigo-400">{b.date}</div>
                      <div className="text-[10px] text-alabaster/40 font-bold uppercase">{b.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card-centauri">
            <h3 className="text-xl font-bold tracking-tight mb-6">Recent Badges</h3>
            <div className="flex flex-wrap gap-4">
               {["Pioneer", "Verified", "Day 1"].map((b, i) => (
                 <div key={i} className="group relative">
                   <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-help">
                     <Award size={20} />
                   </div>
                   <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 glass text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                     {b} ACHIEVED
                   </div>
                 </div>
               ))}
               <div className="w-12 h-12 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center text-alabaster/20">
                 <Plus size={20} />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ icon, value, label, color }: any) => (
  <div className="glass px-6 py-4 rounded-3xl border-white/5 flex flex-col items-center min-w-[120px]">
    <div className={cn("mb-1", color)}>{icon}</div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-[10px] font-bold uppercase tracking-tighter opacity-30">{label}</div>
  </div>
);

const RoadmapStep = ({ number, title, status }: any) => (
  <div className="flex items-center gap-6 group">
    <div className="text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors font-mono">{number}</div>
    <div className="flex-1">
      <h4 className="font-bold text-lg">{title}</h4>
      <div className={cn(
        "text-[10px] font-bold uppercase tracking-widest",
        status === "COMPLETED" ? "text-emerald-400" : status === "ACTIVE" ? "text-indigo-400" : "text-alabaster/20"
      )}>{status}</div>
    </div>
    <div className={cn(
      "w-8 h-8 rounded-full flex items-center justify-center",
      status === "COMPLETED" ? "bg-emerald-500/20 text-emerald-400" : status === "ACTIVE" ? "bg-indigo-600 text-white" : "border-2 border-white/5 text-white/10"
    )}>
      {status === "COMPLETED" ? <CheckCircle2 size={16} /> : <ChevronRight size={16} />}
    </div>
  </div>
);

const ShopPage = () => {
  const { profile } = useApp();
  const streak = profile?.streak || 0;

  const rewards = [
    { title: "Digital Toolkit", cost: 3, icon: <Box />, desc: "Premium resource packs and exclusive learning guides.", category: "RESOURCES" },
    { title: "Skills Voucher", cost: 5, icon: <Ticket />, desc: "Access to introductory professional level courses.", category: "EDUCATION" },
    { title: "Professional Cert", cost: 12, icon: <Award />, desc: "CompTIA or Coursera certification + Digital Passport.", category: "CERTIFICATION" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
      <div className="flex flex-col md:flex-row gap-8 justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-5xl font-bold tracking-tight">Learning Shop</h1>
          <p className="text-xl text-alabaster/50">Redeem your hard-earned streaks for professional growth tools.</p>
        </div>
        <div className="flex items-center gap-4 bg-orange-500/10 border border-orange-500/20 px-6 py-3 rounded-full">
           <Zap className="text-orange-400" size={20} />
           <div className="text-xl font-black text-orange-400">{streak} Streak Points</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {rewards.map((reward, i) => (
          <div key={i} className={cn(
            "card-centauri p-8 space-y-6 flex flex-col justify-between relative overflow-hidden",
            streak >= reward.cost ? "border-indigo-500/30 bg-indigo-500/5" : "opacity-60 grayscale"
          )}>
            {streak < reward.cost && (
              <div className="absolute top-4 right-4 text-orange-400 flex items-center gap-1 font-bold text-xs">
                <Lock size={12} /> {reward.cost - streak} more points needed
              </div>
            )}
            <div className="space-y-4">
               <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400">
                 {React.cloneElement(reward.icon as React.ReactElement, { size: 28 } as any)}
               </div>
               <h3 className="text-3xl font-bold tracking-tight">{reward.title}</h3>
               <p className="text-sm text-alabaster/40 leading-relaxed">{reward.desc}</p>
            </div>
            <div className="space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-alabaster/20">{reward.category}</div>
              <CentauriButton 
                disabled={streak < reward.cost}
                className="w-full"
                variant={streak >= reward.cost ? "primary" : "secondary"}
              >
                Redeem for {reward.cost} Pts
              </CentauriButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FindMentorPage = () => {
  const navigate = useNavigate();
  const { bookings } = useApp();
  const mentors = [
    { 
      name: "Jordan Michaels", 
      role: "Lead Dev @ FinTech", 
      bio: "10+ years in Fintech. Passionate about helping fresh talent break into the industry.", 
      skills: ["Cloud", "Security", "Resume"], 
      mobility: "Online-only",
      color: "bg-indigo-500/20 text-indigo-400"
    },
    { 
      name: "Aisha Khan", 
      role: "UX Researcher @ DesignCo", 
      bio: "Focusing on accessibility and human-centered design. Available for in-person workshops.", 
      skills: ["Figma", "Research", "Accessibility"], 
      mobility: "In-Person (London)",
      color: "bg-emerald-500/20 text-emerald-400"
    },
    { 
      name: "Marcus Thorne", 
      role: "Data Scientist @ GovHub", 
      bio: "Specializing in public sector data and ethical AI. Weekly meetings guaranteed.", 
      skills: ["Python", "SQL", "Ethics"], 
      mobility: "Online-only",
      color: "bg-purple-500/20 text-purple-400"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
      <div className="space-y-1">
        <h1 className="text-5xl font-bold tracking-tight">Partners in Growth</h1>
        <p className="text-xl text-alabaster/50">Connect with industry professionals who are verified and ready to guide you.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {mentors.map((mentor, i) => {
          const hasActiveBooking = bookings.some(b => b.type === "Mentor Interview");
          return (
            <div key={i} className="card-centauri p-8 flex flex-col md:flex-row gap-8 items-start">
              <div className={cn("w-24 h-24 shrink-0 rounded-3xl flex items-center justify-center text-3xl font-bold transition-all", mentor.color, hasActiveBooking && "grayscale opacity-50")}>
                {mentor.name[0]}
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">{mentor.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">{mentor.role}</p>
                  </div>
                  <div className="px-3 py-1 glass rounded-full text-[10px] font-bold uppercase tracking-widest text-alabaster/40">
                    {mentor.mobility}
                  </div>
                </div>
                <p className="text-sm text-alabaster/60 leading-relaxed">{mentor.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map(s => (
                    <span key={s} className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold uppercase text-alabaster/30">{s}</span>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="text-[10px] font-bold text-alabaster/20 uppercase tracking-tighter">Requires: 1 Meeting / Week</div>
                  <CentauriButton 
                    onClick={() => navigate("/interview-booking", { state: { mentorName: mentor.name } })}
                    disabled={hasActiveBooking}
                    className={cn(
                      "py-2 px-4 text-xs rounded-xl transition-all",
                      hasActiveBooking && "opacity-50 cursor-not-allowed bg-white/5"
                    )}
                  >
                    {hasActiveBooking ? "Limit Reached" : "Request Connection"}
                  </CentauriButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MentorApplyPage = () => {
  const { user, submitMentorApplication } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    company: "",
    specialization: "Coding",
    cvName: "",
    cvData: ""
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.displayName || "",
        email: prev.email || user.email || ""
      }));
    }
  }, [user]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setError("Please upload a PDF file.");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          cvName: file.name,
          cvData: reader.result as string 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.role || !formData.company || !formData.cvData) {
      setError("Please fill in all required fields and upload your CV.");
      return;
    }

    setLoading(true);
    try {
      await submitMentorApplication({
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        company: formData.company,
        specialization: formData.specialization,
        cvName: formData.cvName,
        cvData: formData.cvData
      });
      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-6 text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 bg-indigo-500/20 text-indigo-400 rounded-full mx-auto flex items-center justify-center mb-8">
          <ShieldCheck size={48} />
        </motion.div>
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Application Received</h1>
          <p className="text-xl text-alabaster/60 max-w-lg mx-auto">
            Thank you for volunteering your expertise, <span className="text-white font-bold">{formData.fullName.split(' ')[0]}</span>. 
            Our regional lead will review your CV and contact you at <span className="text-indigo-400 font-bold">{formData.email}</span> as soon as possible for a follow-up interview.
          </p>
        </div>
        <div className="pt-8">
          <CentauriButton onClick={() => navigate("/")} className="px-12">
            Return Home
          </CentauriButton>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-6 space-y-12">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-400">
          <Users size={12} /> Expert Network
        </div>
        <h1 className="text-5xl font-bold tracking-tight">Guide a Pilot</h1>
        <p className="text-lg text-alabaster/50">Professional onboarding for Centauri Mentors.</p>
      </div>

      <div className="card-centauri p-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold flex items-center gap-2 animate-in shake duration-500">
            <Zap size={14} /> {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight uppercase tracking-tighter text-indigo-400/60">Basic Information</h3>
              <p className="text-sm text-alabaster/40">Tell us who you are and where we can reach you.</p>
            </div>
            
            <div className="space-y-4">
              <InputField 
                label="Full Name" 
                placeholder="e.g. Jordan Michaels" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
              <InputField 
                label="Email Address" 
                placeholder="jordan@company.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="pt-4">
              <CentauriButton 
                onClick={() => {
                  if (!formData.fullName || !formData.email) {
                    setError("Full name and email are required.");
                  } else {
                    setError(null);
                    setStep(2);
                  }
                }} 
                className="w-full"
              >
                Continue to Experience
              </CentauriButton>
            </div>
          </div>
        ) : step === 2 ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight uppercase tracking-tighter text-indigo-400/60">Professional History</h3>
              <p className="text-sm text-alabaster/40">Details about your background and skills.</p>
            </div>

            <div className="space-y-4">
              <InputField 
                label="Current Role" 
                placeholder="e.g. Senior Software Engineer" 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              />
              <InputField 
                label="Company / Organization" 
                placeholder="e.g. TechCorp UK" 
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
              <DropdownField 
                label="Core Specialization" 
                options={["Coding", "Design", "CV Writing", "Data Analysis", "Leadership"]} 
                value={formData.specialization}
                onChange={(val) => setFormData({...formData, specialization: val})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-alabaster/40 ml-1">Professional CV (PDF)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "p-8 border-2 border-dashed rounded-3xl transition-all cursor-pointer flex flex-col items-center justify-center gap-3",
                  formData.cvName 
                    ? "border-indigo-500 bg-indigo-500/5" 
                    : "border-white/10 bg-white/5 hover:border-white/20"
                )}
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", formData.cvName ? "bg-indigo-500 text-white" : "bg-white/10 text-alabaster/20")}>
                  {formData.cvName ? <FileText size={24} /> : <Upload size={24} />}
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm">{formData.cvName || "Click to upload CV"}</p>
                  <p className="text-[10px] text-alabaster/30 uppercase tracking-widest mt-1">Accepts .PDF (Max 5MB)</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <CentauriButton variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</CentauriButton>
              <CentauriButton 
                onClick={() => {
                  if (!formData.role || !formData.company || !formData.cvData) {
                    setError("All professional details and CV are required.");
                  } else {
                    setError(null);
                    setStep(3);
                  }
                }} 
                className="flex-[2]"
              >
                Continue to Terms
              </CentauriButton>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight uppercase tracking-tighter text-indigo-400/60">Safeguarding & Ethics</h3>
              <p className="text-sm text-alabaster/40">Final agreement before submission.</p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-alabaster/60 leading-relaxed italic">
              "I agree to comply with Centauri's safeguarding policies, undergo necessary DBS checks (if in-person), and commit to maintaining a professional, supportive environment for all mentees. I verify that all information provided is accurate."
            </div>
            <div className="flex items-center gap-4 p-4 glass rounded-2xl border-white/5">
              <input type="checkbox" id="agree" className="w-5 h-5 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-0" />
              <label htmlFor="agree" className="text-sm font-medium cursor-pointer">I understand and agree to these terms.</label>
            </div>

            <div className="flex gap-4 pt-4">
              <CentauriButton variant="secondary" onClick={() => setStep(2)} className="flex-1">Back</CentauriButton>
              <CentauriButton 
                onClick={handleSubmit} 
                className="flex-[2] py-4"
                disabled={loading}
              >
                {loading ? "Processing..." : "Submit Application"}
              </CentauriButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InterviewBookingPage = () => {
  const { addBooking, bookings } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mentorName = (location.state as any)?.mentorName || "Industry Professional";
  const hasExistingMentorBooking = bookings.some(b => b.type === "Mentor Interview");

  const availableDates = [
    { day: "Wed", date: "20", month: "May", full: "20/05/2026" },
    { day: "Thu", date: "21", month: "May", full: "21/05/2026" },
    { day: "Fri", date: "22", month: "May", full: "22/05/2026" },
    { day: "Mon", date: "25", month: "May", full: "25/05/2026" },
  ];

  const availableTimes = ["09:00", "10:30", "14:30", "16:00", "17:15"];

  const handleBookingConfirm = () => {
    // Check if slot is taken (though here we check if user has ANY booking at this time)
    const isSlotTaken = bookings.some(b => b.date === selectedDate && b.time === selectedTime);
    
    if (isSlotTaken) {
      setError("You already have an appointment booked for this time slot.");
      setShowConfirmation(false);
      return;
    }

    if (hasExistingMentorBooking) {
      setError("You can only have one active mentor interview at a time.");
      setShowConfirmation(false);
      return;
    }

    addBooking({
      type: "Mentor Interview",
      mentorName,
      date: selectedDate,
      time: selectedTime,
      platform: "MS Teams",
      id: Math.random().toString(36).substr(2, 9)
    });
    setShowConfirmation(false);
    alert("Booking confirmed! Redirecting to your Mission Hub.");
    navigate("/dashboard");
  };

  if (hasExistingMentorBooking) {
    return (
      <div className="max-w-4xl mx-auto py-32 px-6 text-center space-y-8 animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-red-500/20 text-red-400 rounded-full mx-auto flex items-center justify-center">
          <Calendar size={48} />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Booking Limit Reached</h1>
          <p className="text-xl text-alabaster/50 max-w-xl mx-auto">
            You already have an upcoming interview with <span className="text-white font-bold">{bookings.find(b => b.type === "Mentor Interview")?.mentorName}</span>. 
            You must complete or cancel your current session before booking another mentor.
          </p>
        </div>
        <CentauriButton onClick={() => navigate("/dashboard")} className="px-8">
          Back to Mission Hub
        </CentauriButton>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 space-y-16">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-indigo-600/20 text-indigo-400 rounded-full mx-auto flex items-center justify-center mb-4">
          <Calendar size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">Interview Booking</h1>
          <p className="text-xl text-alabaster/50 max-w-2xl mx-auto">
            Select a slot for your 15-minute introductory interview with <span className="text-white font-bold">{mentorName}</span>.
          </p>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold text-center flex items-center justify-center gap-2"
        >
          <Zap size={14} /> {error}
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Step 1: Date */}
        <div className="space-y-8 p-8 glass rounded-[32px] border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">1</div>
            <h3 className="text-xl font-bold tracking-tight">Select Date</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {availableDates.map((d) => (
              <button
                key={d.full}
                onClick={() => { setSelectedDate(d.full); setSelectedTime(null); setError(null); }}
                className={cn(
                  "p-4 rounded-2xl border transition-all flex flex-col items-center gap-1",
                  selectedDate === d.full 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                    : "bg-white/5 border-white/10 text-alabaster/40 hover:border-white/20"
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">{d.day}</span>
                <span className="text-2xl font-black">{d.date}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{d.month}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Time */}
        <div className={cn(
          "space-y-8 p-8 glass rounded-[32px] border-white/5 transition-all duration-500",
          !selectedDate && "opacity-20 pointer-events-none grayscale"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
              selectedDate ? "bg-indigo-600" : "bg-white/10"
            )}>2</div>
            <h3 className="text-xl font-bold tracking-tight">Select Time</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {availableTimes.map((t) => {
              const isTaken = bookings.some(b => b.date === selectedDate && b.time === t);
              return (
                <button
                  key={t}
                  disabled={isTaken}
                  onClick={() => { setSelectedTime(t); setError(null); }}
                  className={cn(
                    "p-4 rounded-2xl border transition-all font-bold text-sm",
                    selectedTime === t 
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                      : isTaken 
                        ? "bg-white/[0.02] border-white/10 text-alabaster/10 cursor-not-allowed line-through"
                        : "bg-white/5 border-white/10 text-alabaster/40 hover:border-white/20"
                  )}
                >
                  {t}
                  {isTaken && <span className="block text-[8px] mt-1 font-black opacity-40 uppercase">Conflicts</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <AnimatePresence>
        {selectedDate && selectedTime && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="flex flex-col items-center gap-6 pt-8"
          >
            <div className="px-6 py-3 glass rounded-full border-indigo-500/20 text-indigo-400 font-bold text-sm tracking-tight">
              Selected: {selectedDate} at {selectedTime}
            </div>
            <div className="flex gap-4">
              <CentauriButton variant="secondary" onClick={() => navigate(-1)}>Back</CentauriButton>
              <CentauriButton onClick={() => setShowConfirmation(true)} className="px-12">Confirm Selection</CentauriButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Overlay */}
      <AnimatePresence>
        {showConfirmation && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmation(false)}
              className="absolute inset-0 bg-charleston-green/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative card-centauri max-w-md w-full p-10 space-y-8 border-indigo-500/30"
            >
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto text-white shadow-2xl shadow-indigo-600/40">
                <CheckCircle2 size={40} />
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Check Details</h2>
                <p className="text-alabaster/60 leading-relaxed">
                  Are you sure you want to book an appointment with <span className="text-indigo-400 font-bold">{mentorName}</span> via <span className="text-indigo-400 font-bold">MS Teams</span> on <span className="text-white font-bold">{selectedDate}</span> at <span className="text-white font-bold">{selectedTime}</span>?
                </p>
              </div>
              <div className="space-y-3">
                <CentauriButton onClick={handleBookingConfirm} className="w-full py-4 text-lg">
                  Confirm Booking
                </CentauriButton>
                <CentauriButton variant="ghost" onClick={() => setShowConfirmation(false)} className="w-full">
                  No, let me change
                </CentauriButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AcademyPage = () => {
  const lessons = [
    { title: "HTML Micro", time: "2 min", xp: 10, category: "Code", color: "bg-red-500/20 text-red-400", summary: "Learn the backbone of the web in bite-sized chunks." },
    { title: "Python Basics", time: "15 min", xp: 40, category: "Code", color: "bg-blue-500/20 text-blue-400", summary: "Unlock the power of automation and data with Python programming." },
    { title: "UX Basics", time: "5 min", xp: 25, category: "Design", color: "bg-blue-500/20 text-blue-400", summary: "Understand user psychology and interface principles." },
    { title: "Prompt Eng 101", time: "3 min", xp: 15, category: "AI", color: "bg-emerald-500/20 text-emerald-400", summary: "Optimise your AI interactions for better results." },
    { title: "Career Ethics", time: "10 min", xp: 50, category: "Soft Skills", color: "bg-purple-500/20 text-purple-400", summary: "Navigate the workplace with integrity and professionalism." },
    { title: "Content Creation", time: "7 min", xp: 35, category: "Media", color: "bg-orange-500/20 text-orange-400", summary: "Master the art of storytelling and digital presence." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-5xl font-bold tracking-tight">Centauri Academy</h1>
          <p className="text-xl text-alabaster/50">Micro-learning optimized for low-data and offline access.</p>
        </div>
        <div className="p-3 glass rounded-2xl flex items-center gap-3">
          <Smartphone className="text-indigo-400" size={20} />
          <span className="text-sm font-bold uppercase tracking-widest text-alabaster/40">Offline Sync: ON</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lessons.map((lesson, i) => (
          <motion.div 
            key={i} 
            whileHover={{ scale: 1.02, y: -5 }}
            className="card-centauri p-8 flex flex-col justify-between min-h-[340px] border border-white/5"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit", lesson.color)}>
                  {lesson.category}
                </div>
                <button 
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors text-alabaster/40 hover:text-indigo-400"
                  title="Download for offline"
                >
                  <Download size={18} />
                </button>
              </div>
              <h3 className="text-3xl font-bold tracking-tight">{lesson.title}</h3>
              <p className="text-sm text-alabaster/50 leading-relaxed">{lesson.summary}</p>
            </div>
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4 text-sm font-medium text-alabaster/40">
                <span className="flex items-center gap-1"><Zap size={14} /> +{lesson.xp} XP</span>
                <span className="flex items-center gap-1"><WifiOff size={14} /> {lesson.time}</span>
              </div>
              <CentauriButton variant="secondary" className="w-full">Start Lesson</CentauriButton>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CommunityPage = () => {
  const { user } = useApp();
  const [postText, setPostText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mentors = [
    { name: "Sarah J.", role: "Senior Engineer @ Google", focus: "Frontend/UX", color: "bg-indigo-500/20 text-indigo-400" },
    { name: "David K.", role: "Founder @ EcoTech", focus: "Product Strategy", color: "bg-emerald-500/20 text-emerald-400" },
    { name: "Elena R.", role: "Data Scientist @ DeepMind", focus: "AI/ML", color: "bg-purple-500/20 text-purple-400" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addEmoji = (emoji: string) => {
    setPostText(prev => prev + emoji);
    setShowEmoji(false);
  };

  const emojis = ["🚀", "🔥", "💯", "👏", "💻", "✨", "🙌", "🎓"];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
      <div className="space-y-1">
        <h1 className="text-5xl font-bold tracking-tight">Centauri Network</h1>
        <p className="text-xl text-alabaster/50">Connect with expert mentors and a supportive peer community.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Create Post */}
          <div className="card-centauri p-8 space-y-4">
            <div className="flex gap-4">
              <img 
                src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=user`} 
                className="w-12 h-12 rounded-full border border-white/10"
                alt="Me"
              />
              <div className="flex-1 space-y-4">
                <textarea 
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Share your progress or ask a question..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-indigo-500 transition-colors min-h-[120px] text-alabaster"
                />
                
                {image && (
                  <div className="relative w-fit">
                    <img src={image} className="max-h-48 rounded-xl border border-white/10" alt="Preview" />
                    <button 
                      onClick={() => setImage(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 hover:bg-white/5 rounded-xl transition-colors text-alabaster/60 hover:text-indigo-400"
                      title="Add Photo"
                    >
                      <ImageIcon size={20} />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                    />
                    
                    <div className="relative">
                      <button 
                        onClick={() => setShowEmoji(!showEmoji)}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-alabaster/60 hover:text-indigo-400"
                        title="Add Emoji"
                      >
                        <Smile size={20} />
                      </button>
                      
                      <AnimatePresence>
                        {showEmoji && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute bottom-full mb-2 left-0 glass p-3 rounded-2xl grid grid-cols-4 gap-2 z-50 border border-white/10"
                          >
                            {emojis.map(e => (
                              <button 
                                key={e} 
                                onClick={() => addEmoji(e)}
                                className="text-xl hover:scale-125 transition-transform p-1"
                              >
                                {e}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <CentauriButton 
                    className="py-2 px-6 rounded-xl text-sm"
                    disabled={!postText && !image}
                    onClick={() => {
                      setPostText("");
                      setImage(null);
                    }}
                  >
                    Post <Send size={16} />
                  </CentauriButton>
                </div>
              </div>
            </div>
          </div>

          <div className="card-centauri p-8 space-y-6">
            <h3 className="text-2xl font-bold tracking-tight text-alabaster">Community Feed</h3>
            {[1, 2].map((p) => (
              <div key={p} className="flex gap-4 p-4 border-b border-white/5 last:border-0">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">JD</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-alabaster">Jordan Doe</span>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded uppercase font-bold text-alabaster/40">Student</span>
                  </div>
                  <p className="text-sm text-alabaster/60">Just finished the 'Introduction to Web' module! Highly recommend it to anyone starting out. 🚀</p>
                  <div className="flex gap-4 pt-2 text-[10px] font-bold uppercase tracking-widest text-alabaster/30">
                    <button className="hover:text-indigo-400 transition-colors">Like</button>
                    <button className="hover:text-indigo-400 transition-colors">Reply</button>
                  </div>
                </div>
              </div>
            ))}
            <CentauriButton variant="ghost" className="w-full text-xs">Load More</CentauriButton>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-xl font-bold tracking-tight text-alabaster">Featured Mentors</h3>
          {mentors.map((m, i) => (
            <div key={i} className="card-centauri p-6 flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold", m.color)}>
                {m.name[0]}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-alabaster">{m.name}</h4>
                <p className="text-[10px] font-bold uppercase text-alabaster/40">{m.role}</p>
                <div className="text-[10px] text-indigo-400 font-bold">{m.focus}</div>
              </div>
            </div>
          ))}
          <CentauriButton className="w-full">Book a Session</CentauriButton>
        </div>
      </div>
    </div>
  );
};

const OpportunitiesPage = () => {
  const jobs = [
    { title: "Junior Web Developer", company: "Sky Labs", type: "Apprenticeship", location: "London / Remote", color: "text-blue-400 border-blue-400" },
    { title: "Product Design Intern", company: "Monzo", type: "Internship", location: "London", color: "text-red-400 border-red-400" },
    { title: "IT Support Trainee", company: "NHS Digital", type: "Role", location: "Manchester", color: "text-emerald-400 border-emerald-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
      <div className="flex flex-col md:flex-row gap-8 justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-5xl font-bold tracking-tight">Opportunity Hub</h1>
          <p className="text-xl text-alabaster/50">Verified entry-level roles and learning grants for Centauri Pilots.</p>
        </div>
        <div className="flex gap-2">
          <CentauriButton variant="secondary" className="px-4 py-2 text-xs rounded-full">Filters</CentauriButton>
          <CentauriButton variant="primary" className="px-4 py-2 text-xs rounded-full">Alerts</CentauriButton>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job, i) => (
          <div key={i} className="card-centauri p-8 flex flex-col justify-between min-h-[320px]">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 glass rounded-xl flex items-center justify-center font-bold text-lg text-alabaster">{job.company[0]}</div>
                <div className={cn("text-[10px] font-bold uppercase px-2 py-0.5 border rounded", job.color)}>
                  {job.type}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-tight text-alabaster">{job.title}</h3>
                <p className="font-medium text-alabaster/40">{job.company}</p>
                <div className="text-xs text-alabaster/30 flex items-center gap-1"><MapPin size={10} /> {job.location}</div>
              </div>
            </div>
            <div className="pt-8 space-y-4">
              <div className="text-[10px] bg-indigo-500/20 text-indigo-400 p-2 rounded font-bold uppercase text-center italic">
                AI Match: 94% Suitable
              </div>
              <CentauriButton className="w-full">One-Click Apply</CentauriButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EventsPage = () => {
  const events = [
    { 
      title: "Centauri Hackathon 2026", 
      date: "July 15-16, 2026", 
      location: "East London Tech City", 
      type: "Hackathon", 
      tags: ["Code", "Social Impact"],
      color: "bg-indigo-500/20 text-indigo-400",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800"
    },
    { 
      title: "Tech Inclusivity Summit", 
      date: "Sept 5, 2026", 
      location: "Manchester Central", 
      type: "Conference", 
      tags: ["Diversity", "Networking"],
      color: "bg-emerald-500/20 text-emerald-400",
      image: "https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?auto=format&fit=crop&q=80&w=800"
    },
    { 
      title: "AI for Youth Workshop", 
      date: "Oct 12, 2026", 
      location: "Bristol Engine Shed", 
      type: "Workshop", 
      tags: ["AI", "Learning"],
      color: "bg-purple-500/20 text-purple-400",
      image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&q=80&w=800"
    },
    { 
      title: "Open Source Connect", 
      date: "Nov 20, 2026", 
      location: "Virtual / Discord", 
      type: "Meetup", 
      tags: ["Community", "Remote"],
      color: "bg-blue-500/20 text-blue-400",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12">
      <div className="flex flex-col md:flex-row gap-8 justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-5xl font-bold tracking-tight">Events & Signposts</h1>
          <p className="text-xl text-alabaster/50">Upcoming opportunities to connect, learn, and build with the community.</p>
        </div>
        <div className="flex gap-2">
          <CentauriButton variant="secondary" className="px-4 py-2 text-xs rounded-full">Calendar View</CentauriButton>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {events.map((event, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="card-centauri p-0 overflow-hidden group flex flex-col md:flex-row min-h-[240px]"
          >
            <div className="w-full md:w-48 relative overflow-hidden">
              <img 
                src={event.image} 
                className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                alt={event.title}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute top-4 left-4">
                 <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", event.color)}>
                  {event.type}
                </span>
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-alabaster/40 font-medium">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-md text-alabaster/60 border border-white/5 lowercase">#{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className="pt-6 flex gap-3">
                <CentauriButton className="flex-1 py-2 text-xs px-4">Register Now</CentauriButton>
                <CentauriButton variant="glass" className="p-2 aspect-square">
                  <ExternalLink size={14} />
                </CentauriButton>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* External Resources / Signposts */}
      <div className="pt-12 space-y-8">
        <h2 className="text-3xl font-bold tracking-tight">External Signposts</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Major League Hacking (MLH)", desc: "Global hackathon season for students.", link: "https://mlh.io" },
            { name: "Meetup.com - London Tech", desc: "Find grassroots tech meetups in the capital.", link: "https://meetup.com" },
            { name: "Eventbrite Tech", desc: "Workshops and local coding bootcamps.", link: "https://eventbrite.com" }
          ].map((s, i) => (
            <div key={i} className="card-centauri p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-xl font-bold tracking-tight text-indigo-400">{s.name}</h4>
                <p className="text-sm text-alabaster/50 leading-relaxed">{s.desc}</p>
              </div>
              <a 
                href={s.link} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-alabaster/40 hover:text-alabaster transition-colors pt-4 border-t border-white/5"
              >
                Visit Site <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/points" element={<PointsPage />} />
            <Route path="/ai-guide" element={<AIGuidePage />} />
            <Route path="/find-a-mentor" element={<FindMentorPage />} />
            <Route path="/mentor-apply" element={<MentorApplyPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/interview-booking" element={<InterviewBookingPage />} />
            <Route path="/learning" element={<AcademyPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/mentor-match-interview" element={<MentorMatchPage />} />
            <Route path="/locker-hub" element={<LockerHubPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}
