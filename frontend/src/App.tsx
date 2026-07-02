import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthModal } from "./components/AuthModal";
import { TaskDashboard } from "./components/TaskDashboard";
import { RoleHierarchyPanel } from "./components/RoleHierarchyPanel";
import { Menu, X, ChevronDown, CheckSquare, Shield, Filter, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const MainLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const [videoReady, setVideoReady] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoReady(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // If loading authentication session, show a clean loader
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-dark">
        <div className="h-10 w-10 border-4 border-yellow border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If logged in, show the Task Dashboard
  if (user) {
    return <TaskDashboard />;
  }

  // Otherwise, show the landing hero page
  return (
    <div className="scene relative h-screen w-full flex flex-col overflow-y-auto bg-fallback scroll-smooth">
      {/* Live wallpaper background overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Background dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#070b13] via-[#0b1220] to-[#121c32]" />
        
        {/* Moving grid overlay */}
        <div className="absolute inset-0 live-grid opacity-20" />

        {/* Floating Glowing Neon Spheres (Live wallpaper style) */}
        <div className="absolute top-[10%] left-[15%] w-[320px] h-[320px] rounded-full bg-yellow/10 blur-[80px] animate-orb-slow-1" />
        <div className="absolute bottom-[35%] right-[5%] w-[420px] h-[420px] rounded-full bg-cyan-500/10 blur-[100px] animate-orb-slow-2" />
        <div className="absolute top-[45%] right-[35%] w-[220px] h-[220px] rounded-full bg-indigo-500/5 blur-[70px] animate-orb-slow-3" />
      </div>

      {/* Background Video / Ambient Fallback */}
      <video
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={() => setVideoReady(true)}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 pointer-events-none ${
          videoReady ? "opacity-20" : "opacity-0"
        }`}
        src="https://assets.mixkit.co/videos/preview/mixkit-data-center-server-racks-telecommunications-42171-large.mp4"
      />

      {/* Drift Background Grid overlay */}
      <div className="absolute inset-0 bg-video z-0 pointer-events-none" />

      {/* AnimatePresence for content fade-in */}
      <AnimatePresence>
        {videoReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col flex-1 w-full relative z-10"
          >
            {/* Hero Wrap Section */}
            <section id="hero" className="min-h-screen w-full flex flex-col justify-between">
              {/* Header */}
              <header className="relative z-50 flex items-start justify-between px-6 md:px-12 pt-6 md:pt-10">
                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EXPO_OUT, delay: 0.1 }}
                  onClick={() => scrollToSection("hero")}
                  className="logo font-barlow text-white text-2xl md:text-3xl tracking-tighter leading-none cursor-pointer"
                >
                  <div>TASKFORGE</div>
                  <div className="text-yellow">PRO</div>
                </motion.div>

                {/* Desktop Nav */}
                <nav className="desktop hidden md:flex items-center gap-8 lg:gap-12 pt-1">
                  {["Features", "Pricing", "Company"].map((item, idx) => (
                    <motion.button
                      key={item}
                      onClick={() => scrollToSection(item.toLowerCase())}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EXPO_OUT, delay: 0.2 + idx * 0.1 }}
                      whileHover={{ scale: 1.05, x: 2, color: "#ffda00" }}
                      className="flex items-center gap-1.5 text-white/95 font-medium tracking-tight text-sm hover:text-yellow transition-all"
                    >
                      <span>{item}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </motion.button>
                  ))}
                  
                  {/* Header CTA Login Button */}
                  <motion.button
                    onClick={() => setIsAuthModalOpen(true)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EXPO_OUT, delay: 0.5 }}
                    className="px-5 py-1.5 rounded-lg border border-yellow/40 hover:border-yellow bg-yellow/5 hover:bg-yellow/10 text-yellow text-xs font-bold font-barlow tracking-wider transition"
                  >
                    SIGN IN
                  </motion.button>
                </nav>

                {/* Mobile Hamburger */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-1 text-white hover:text-yellow transition"
                  aria-label="Toggle Menu"
                >
                  {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
              </header>

              {/* Mobile Menu Overlay */}
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-x-0 top-0 h-screen z-40 bg-menuBg flex flex-col items-center justify-center gap-8"
                  >
                    {["Features", "Pricing", "Company"].map((item, idx) => (
                      <motion.button
                        key={item}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: EXPO_OUT, delay: idx * 0.1 }}
                        onClick={() => scrollToSection(item.toLowerCase())}
                        className="text-white text-2xl font-bold hover:text-yellow transition"
                      >
                        {item}
                      </motion.button>
                    ))}
                    <motion.button
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EXPO_OUT, delay: 0.3 }}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="mt-4 px-8 py-2.5 rounded-lg bg-yellow text-dark font-bold font-barlow tracking-widest text-lg"
                    >
                      SIGN IN
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Content */}
              <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1.8fr_1.2fr] gap-8 px-6 md:px-12 pt-8 md:pt-16 pb-4 items-center">
                {/* Left Column - Giant Headline */}
                <div className="headline flex flex-col justify-center min-w-0">
                  <div className="overflow-clip select-none">
                    {/* PLAN */}
                    <motion.div
                      initial={{ x: -600, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.85, ease: EXPO_OUT, delay: 0 }}
                      className="font-barlow font-extrabold text-[42px] sm:text-[70px] md:text-[90px] lg:text-[110px] xl:text-[120px] leading-[0.8] tracking-tighter text-white uppercase"
                    >
                      PLAN
                    </motion.div>
                    {/* EXECUTE */}
                    <motion.div
                      initial={{ x: 600, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.85, ease: EXPO_OUT, delay: 0.13 }}
                      className="font-barlow font-extrabold text-[42px] sm:text-[70px] md:text-[90px] lg:text-[110px] xl:text-[120px] leading-[0.8] tracking-tighter text-dark uppercase ml-[0.3em] select-none"
                      style={{ WebkitTextStroke: "1px rgba(255,255,255,0.25)" }}
                    >
                      EXECUTE
                    </motion.div>
                    {/* AT SCALE */}
                    <motion.div
                      initial={{ x: -600, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.85, ease: EXPO_OUT, delay: 0.26 }}
                      className="font-barlow font-extrabold text-[42px] sm:text-[70px] md:text-[90px] lg:text-[110px] xl:text-[120px] leading-[0.8] tracking-tighter text-white uppercase"
                    >
                      AT SCALE
                    </motion.div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="right-col flex flex-col justify-center gap-6">
                  {/* Tagline */}
                  <div className="tagline text-xl md:text-2xl lg:text-3.5xl leading-[0.95] tracking-tight font-bold text-white/95">
                    <div className="row overflow-hidden flex ml-0">
                      <motion.span
                        initial={{ y: "100%", rotateX: 45, opacity: 0 }}
                        animate={{ y: 0, rotateX: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: EXPO_OUT, delay: 0.3 }}
                      >
                        Workflows
                      </motion.span>
                    </div>
                    <div className="row overflow-hidden flex ml-[1.5em] gap-1 flex-wrap">
                      {["built", "for", "teams"].map((word, index) => (
                        <motion.span
                          key={word}
                          initial={{ y: "100%", rotateX: 45, opacity: 0 }}
                          animate={{ y: 0, rotateX: 0, opacity: 1 }}
                          transition={{ duration: 0.6, ease: EXPO_OUT, delay: 0.5 + index * 0.08 }}
                        >
                          {word}&nbsp;
                        </motion.span>
                      ))}
                    </div>
                    <div className="row overflow-hidden flex ml-0 gap-1 flex-wrap">
                      {["powered", "by", "roles"].map((word, index) => (
                        <motion.span
                          key={word}
                          initial={{ y: "100%", rotateX: 45, opacity: 0 }}
                          animate={{ y: 0, rotateX: 0, opacity: 1 }}
                          transition={{ duration: 0.6, ease: EXPO_OUT, delay: 0.7 + index * 0.08 }}
                        >
                          {word}&nbsp;
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Role Hierarchy Panel */}
                  <RoleHierarchyPanel />
                </div>
              </main>

              {/* Footer */}
              <footer className="flex flex-col md:flex-row gap-6 items-stretch md:items-end justify-between px-6 md:px-12 pb-8 md:pb-12 pt-4">
                {/* Stat Block */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, ease: EXPO_OUT, delay: 0.45 }}
                  className="stat-block flex items-center gap-4 text-white"
                >
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-dark flex-shrink-0 shadow-md">
                    <CheckSquare className="w-6 h-6 text-dark" />
                  </div>
                  <div>
                    <div className="stat-num font-barlow text-4xl md:text-5xl font-black text-yellow leading-none">
                      1M+
                    </div>
                    <div className="text-xs md:text-sm text-white/80 leading-snug">
                      tasks completed / across teams / on time, every time
                  </div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  onClick={() => setIsAuthModalOpen(true)}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: EXPO_OUT, delay: 0.5 }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="cta relative self-end w-full max-w-[320px] h-[52px] cursor-pointer border-none bg-none p-0 outline-none select-none transition"
                >
                  {/* SVG pill shape */}
                  <svg className="pill absolute inset-0 w-full h-full" viewBox="0 0 434.001 68" preserveAspectRatio="none">
                    <path
                      fill="#ffda00"
                      d="M316 0C329.08 0 340.435 7.38674 346.121 18.2162C348.618 22.9736 353.086 26.8535 358.459 26.8535H359.252C364.667 26.8535 369.155 22.9169 371.63 18.1007C377.159 7.34039 388.205 0.00015843 400.931 0C419.195 0 434.001 15.1191 434.001 33.7695L433.99 34.6416C433.537 52.8891 418.909 67.5391 400.931 67.5391C387.96 67.5389 376.734 59.9132 371.317 48.8128C368.923 43.9077 364.427 39.873 358.969 39.873C353.492 39.873 348.986 43.9356 346.589 48.8605C341.074 60.1913 329.449 68 316 68H34.001C15.2233 68 0 52.7777 0 34C0 15.2223 15.2233 0 34.001 0H316ZM400.931 2.44141C384.063 2.44163 370.303 16.419 370.303 33.7695C370.303 51.1201 384.063 65.0974 400.931 65.0977C417.798 65.0977 431.56 51.1202 431.56 33.7695C431.56 16.4189 417.798 2.44141 400.931 2.44141Z"
                    />
                  </svg>
                  <div className="label absolute left-0 top-0 w-[78%] h-full flex items-center justify-center text-dark font-bold font-barlow text-lg tracking-wider">
                    START FREE TRIAL
                  </div>
                  <div className="arrow-wrap absolute right-[1%] top-1/2 -translate-y-1/2 w-[16%] aspect-square flex items-center justify-center">
                    <svg
                      className="w-[38%] transition-transform duration-300 -rotate-[135deg] hover:rotate-[-90deg]"
                      viewBox="0 0 16.89 20.37"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.2"
                    >
                      <path d="M8.45 1v18.37M1 9.45l7.45-7.45 7.44 7.45" />
                    </svg>
                  </div>
                </motion.button>
              </footer>
            </section>

            {/* Features Bento Grid Section */}
            <section id="features" className="relative w-full py-28 px-6 md:px-12 glass-panel border-t border-white/10 mt-10">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-black font-barlow text-white tracking-tight text-center">
                  ENGINEERED FOR <span className="text-yellow">TEAM PERFORMANCE</span>
                </h2>
                <p className="text-white/60 text-center mt-3 max-w-2xl mx-auto text-sm md:text-base">
                  TaskForge Pro delivers the workflows enterprise engineering teams need to orchestrate pipelines, enforce secure roles, and ship software.
                </p>
                
                {/* Bento Grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                  {/* Feature 1 */}
                  <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-yellow/30 transition-all duration-300 hover:-translate-y-1">
                    <Shield className="w-10 h-10 text-yellow mb-4" />
                    <h3 className="text-xl font-bold font-barlow tracking-wider text-white">ROLE-BASED ACTIONS</h3>
                    <p className="text-white/70 text-sm mt-2 leading-relaxed">
                      Secure roles limit actions. Users view tasks; Admins build, edit, and orchestrate schedules; Super Admins manage the platform.
                    </p>
                  </div>
                  {/* Feature 2 */}
                  <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-yellow/30 transition-all duration-300 hover:-translate-y-1">
                    <Filter className="w-10 h-10 text-yellow mb-4" />
                    <h3 className="text-xl font-bold font-barlow tracking-wider text-white">DYNAMIC WORKFLOWS</h3>
                    <p className="text-white/70 text-sm mt-2 leading-relaxed">
                      Instantly drill down using real-time search, priority levels, and progress states. Keep your backlog clean and structured.
                    </p>
                  </div>
                  {/* Feature 3 */}
                  <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-yellow/30 transition-all duration-300 hover:-translate-y-1">
                    <Calendar className="w-10 h-10 text-yellow mb-4" />
                    <h3 className="text-xl font-bold font-barlow tracking-wider text-white">ENTERPRISE AUDITING</h3>
                    <p className="text-white/70 text-sm mt-2 leading-relaxed">
                      Full history logging, JWT security expirations, helmet-guarded headers, and database soft-deletes to protect core information.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="relative w-full py-28 px-6 md:px-12 bg-black/40 border-t border-white/10">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-black font-barlow text-white tracking-tight text-center">
                  FLEXIBLE PLANS FOR <span className="text-yellow">ANY SCALE</span>
                </h2>
                <p className="text-white/60 text-center mt-3 max-w-2xl mx-auto text-sm md:text-base">
                  Select the operational plan that aligns with your engineering team's size and compliance standards.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                  {/* Starter Tier */}
                  <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-yellow/20 transition-all">
                    <div>
                      <span className="text-xs font-bold text-white/50 tracking-widest uppercase">STARTER</span>
                      <h3 className="text-3xl font-black font-barlow text-white mt-2">FREE</h3>
                      <p className="text-white/60 text-xs mt-1">For single users and simple checklists</p>
                      <ul className="mt-6 space-y-3 text-sm text-white/80">
                        <li className="flex items-center gap-2">✓ Task listing and search</li>
                        <li className="flex items-center gap-2">✓ Status & priority filters</li>
                        <li className="flex items-center gap-2 text-white/40">✗ Custom role levels</li>
                      </ul>
                    </div>
                    <button 
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full py-2.5 rounded-lg border border-white/20 hover:border-white text-white text-xs font-bold tracking-wider mt-8 transition"
                    >
                      START FREE
                    </button>
                  </div>
                  
                  {/* Professional Tier (Featured) */}
                  <div className="p-8 rounded-2xl bg-yellow/5 border-2 border-yellow flex flex-col justify-between relative hover:shadow-[0_0_30px_rgba(255,218,0,0.15)] transition-all">
                    <div className="absolute top-0 right-6 -translate-y-1/2 bg-yellow text-dark text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      RECOMMENDED
                    </div>
                    <div>
                      <span className="text-xs font-bold text-yellow tracking-widest uppercase">PROFESSIONAL</span>
                      <h3 className="text-3xl font-black font-barlow text-white mt-2">
                        $19<span className="text-sm font-medium text-white/60">/mo</span>
                      </h3>
                      <p className="text-white/60 text-xs mt-1">For production teams requiring full workflow management</p>
                      <ul className="mt-6 space-y-3 text-sm text-white/80">
                        <li className="flex items-center gap-2 text-yellow">✓ All Starter features</li>
                        <li className="flex items-center gap-2">✓ Task creation & updates</li>
                        <li className="flex items-center gap-2">✓ Admin role permissions</li>
                        <li className="flex items-center gap-2">✓ Priority queues</li>
                      </ul>
                    </div>
                    <button 
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full py-2.5 rounded-lg bg-yellow hover:bg-[#ffe540] text-dark text-xs font-bold tracking-wider mt-8 transition"
                    >
                      START TRIAL
                    </button>
                  </div>
                  
                  {/* Enterprise Tier */}
                  <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-yellow/20 transition-all">
                    <div>
                      <span className="text-xs font-bold text-white/50 tracking-widest uppercase">ENTERPRISE</span>
                      <h3 className="text-3xl font-black font-barlow text-white mt-2">
                        $49<span className="text-sm font-medium text-white/60">/mo</span>
                      </h3>
                      <p className="text-white/60 text-xs mt-1">For companies requiring role auditing and high limits</p>
                      <ul className="mt-6 space-y-3 text-sm text-white/80">
                        <li className="flex items-center gap-2">✓ All Professional features</li>
                        <li className="flex items-center gap-2">✓ Unlimited task creation</li>
                        <li className="flex items-center gap-2">✓ Super Admin dashboard access</li>
                        <li className="flex items-center gap-2">✓ Dedicated database backups</li>
                      </ul>
                    </div>
                    <button 
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full py-2.5 rounded-lg border border-white/20 hover:border-white text-white text-xs font-bold tracking-wider mt-8 transition"
                    >
                      CONTACT SALES
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Sub-footer Section */}
            <section id="company" className="py-12 bg-black/60 border-t border-white/5 text-center text-xs text-white/40">
              <p>© {new Date().getFullYear()} TaskForge Pro Inc. All Rights Reserved. Built to Enterprise Specifications.</p>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal Overlay */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};
export default App;
