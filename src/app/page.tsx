"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Box, Cpu, Zap, CheckCircle2, ChevronRight, Layers, Target, Command, Bot, MessageSquare, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { Navbar } from "@/components/Navbar";

function seededValue(index: number, salt: number) {
  // Integer hash is stable across runtimes and avoids tiny trig precision drifts.
  let value = (index + 1) * 374761393 + (salt + 1) * 668265263;
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  value ^= value >>> 16;
  return (value >>> 0) / 4294967296;
}

function seededRange(index: number, salt: number, min: number, max: number) {
  const ranged = min + seededValue(index, salt) * (max - min);
  return Number(ranged.toFixed(4));
}

function seededSignedRange(index: number, salt: number, magnitude: number) {
  return (seededValue(index, salt) * 2 - 1) * magnitude;
}

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatReply, setChatReply] = useState<string | null>(null);

  const handleChatSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      setChatReply("Please type a question first.");
      return;
    }

    setChatReply(
      `Placeholder response for: "${trimmedQuestion}". Connect Gemini API here later to return real answers.`
    );
  };

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const grainParticles = Array.from({ length: 40 }, (_, index) => ({
    width: seededRange(index, 1, 1, 5),
    height: seededRange(index, 2, 1, 5),
    left: seededRange(index, 3, 0, 100),
    top: seededRange(index, 4, 0, 100),
    y: seededSignedRange(index, 5, 100),
    x: seededSignedRange(index, 6, 25),
    duration: seededRange(index, 7, 5, 10),
    delay: seededRange(index, 8, 0, 5),
    scale: seededRange(index, 9, 0.5, 1.5),
  }));
  const cloudParticles = Array.from({ length: 10 }, (_, index) => ({
    width: seededRange(index, 10, 100, 400),
    height: seededRange(index, 11, 100, 400),
    left: seededRange(index, 12, 0, 100),
    top: seededRange(index, 13, 0, 100),
    y: seededSignedRange(index, 14, 20),
    x: seededSignedRange(index, 15, 20),
    opacity: seededRange(index, 16, 0.05, 0.2),
    duration: seededRange(index, 17, 10, 20),
  }));

  return (
    <>
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--background-base)]">
        {/* Animated Background - Floating Grains */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 mix-blend-screen mix-blend-color-dodge">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          {grainParticles.map((grain, i) => (
            <motion.div
              key={`grain-${i}`}
              className="absolute bg-[var(--accent-neon)] rounded-full blur-[2px] opacity-30"
              style={{
                width: `${grain.width}px`,
                height: `${grain.height}px`,
                left: `${grain.left}%`,
                top: `${grain.top}%`,
              }}
              animate={{
                y: [0, grain.y],
                x: [0, grain.x],
                opacity: [0, 0.6, 0],
                scale: [0, grain.scale, 0],
              }}
              transition={{
                duration: grain.duration,
                repeat: Infinity,
                ease: "linear",
                delay: grain.delay,
              }}
            />
          ))}
          {cloudParticles.map((cloud, i) => (
             <motion.div
             key={`cloud-${i}`}
             className="absolute rounded-full mix-blend-screen opacity-10"
             style={{
               background: i % 2 === 0 ? "radial-gradient(circle, var(--accent-neon) 0%, transparent 60%)" : "radial-gradient(circle, var(--primary) 0%, transparent 60%)",
               width: `${cloud.width}px`,
               height: `${cloud.height}px`,
               left: `${cloud.left}%`,
               top: `${cloud.top}%`,
               filter: 'blur(40px)',
             }}
             animate={{
               y: [0, cloud.y, 0],
               x: [0, cloud.x, 0],
               opacity: [0.05, cloud.opacity, 0.05],
             }}
             transition={{
               duration: cloud.duration,
               repeat: Infinity,
               ease: "easeInOut",
             }}
           />
          ))}
        </div>
        <motion.div 
          className="absolute inset-0 z-0 opacity-30 pointer-events-none"
          style={{ y: backgroundY }}
        >
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--primary)] blur-[150px] mix-blend-screen opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--accent-neon)] blur-[120px] mix-blend-screen opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        </motion.div>

        <div className="container relative z-10 mx-auto px-6 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-full flex items-center justify-center mb-10">
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute inset-[-5%] rounded-full blur-md pointer-events-none"
                  style={{ background: "var(--logo-glow)" }}
                />
                <Image
                  src="/logo-small.png"
                  alt="Tazkhiir Logo"
                  width={448}
                  height={224}
                  className="relative z-10 h-44 sm:h-56 md:h-72 lg:h-80 w-auto mx-auto"
                  style={{ filter: "var(--logo-filter)" }}
                  priority
                />
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              We design and ship AI integrations, web platforms, data systems, and cloud workflows that help teams move from idea to production faster.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/contact" className="bg-[var(--primary)] text-[#0B0B0B] font-bold text-lg px-8 py-4 rounded-full flex items-center gap-3 transition-all duration-300 hover:scale-105 glow-btn w-full sm:w-auto justify-center">
                Start a Project <ArrowRight size={20} />
              </Link>
              <Link href="#services" className="text-white font-medium text-lg px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-all w-full sm:w-auto glass">
                See Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section id="services" className="py-32 relative bg-[var(--background-secondary)]">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Services built for delivery</h2>
            <p className="text-[var(--text-secondary)] text-lg">Every engagement is scoped around a real outcome: automate a workflow, launch a product, improve data visibility, or harden the systems behind it.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Cpu size={32} />, title: "AI Integration", desc: "Add assistants, automations, search, and decision support to the tools your teams already use." },
              { icon: <Layers size={32} />, title: "Web Platforms", desc: "Build customer-facing sites, dashboards, and internal tools with a clear product structure." },
              { icon: <Target size={32} />, title: "Data Systems", desc: "Model, clean, and surface operational data so reporting and analytics stay reliable." },
              { icon: <Box size={32} />, title: "UI Engineering", desc: "Turn design direction into polished interfaces with accessible interaction patterns." },
              { icon: <Command size={32} />, title: "Cloud DevOps", desc: "Set up CI/CD, environment automation, deployment hygiene, and release monitoring." },
              { icon: <Zap size={32} />, title: "Performance", desc: "Reduce load times, remove bottlenecks, and keep critical journeys responsive." },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-10 rounded-3xl hover:-translate-y-2 transition-transform duration-500 group relative overflow-hidden flex flex-col items-start"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
                <div className="text-[var(--accent-neon)] mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-[var(--text-muted)] leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT / SPLIT LAYOUT */}
      <section id="approach" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="relative z-10 w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden glass border border-white/10 flex items-center justify-center bg-[var(--surface)]/50">
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/20 to-transparent mix-blend-overlay"></div>
                {/* Simulated 3D Graphic */}
                <div className="relative w-64 h-64 border border-[var(--primary)]/30 rounded-full animate-spin-slow flex items-center justify-center shadow-[0_0_50px_rgba(182,255,59,0.15)]">
                     <div className="w-48 h-48 border border-[var(--accent-neon)]/50 rounded-full flex items-center justify-center animate-spin-reverse-slow">
                        <Box size={60} className="text-[var(--accent-neon)]/80 animate-pulse" />
                     </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8">A practical process, not a vague promise.</h2>
              <p className="text-xl text-[var(--text-secondary)] mb-8 font-light">
                We start with the workflow or product problem, map the systems involved, then deliver a solution your team can actually maintain after launch.
              </p>
              <ul className="space-y-4 mb-10">
                {["Discovery that aligns scope, users, and business goals", "Architecture that fits your team and release cadence", "Delivery that includes documentation, handoff, and support"].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-[var(--text-secondary)]">
                    <CheckCircle2 className="text-[var(--primary)]" size={24} />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="#process" className="flex items-center gap-2 text-[var(--accent-neon)] font-bold hover:underline underline-offset-8 transition-all">
                See how we structure projects <ChevronRight size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES / BENTO GRID */}
      <section id="results" className="py-32 bg-[var(--surface)]">
        <div className="container mx-auto px-6">
          <div className="text-center md:text-left mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">What you get</h2>
                <p className="text-[var(--text-secondary)] text-lg max-w-xl">The deliverables are tailored to the job, but the pattern stays consistent: clarity, speed, maintainability, and measurable impact.</p>
             </div>
             <Link href="#testimonials" className="hidden md:flex text-white border border-white/20 glass px-6 py-3 rounded-full items-center gap-2 hover:bg-white/10 transition-colors">
               Review sample work
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="md:col-span-2 md:row-span-2 glass p-10 rounded-3xl flex flex-col justify-end relative overflow-hidden group"
             >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-[80px] group-hover:bg-[var(--primary)]/20 transition-all duration-700"></div>
                <Zap className="text-[var(--accent-neon)] mb-auto" size={40} />
                <h3 className="text-3xl font-bold mb-3 mt-8">Delivery plan</h3>
                <p className="text-[var(--text-muted)] text-lg">A scoped roadmap with priorities, milestones, and handoff criteria your team can follow.</p>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="md:col-span-2 glass border-t border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-[var(--primary)]/30 transition-colors"
             >
                <Layers className="text-white/60 mb-6" size={32} />
                <h3 className="text-2xl font-bold mb-2">System integration</h3>
                <p className="text-[var(--text-muted)]">APIs, automation, and data flow designed to fit into your current stack.</p>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="glass border-t border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-[var(--primary)]/30 transition-colors"
             >
                <h3 className="text-2xl font-bold mb-2 text-[var(--accent-neon)]">Maintainable</h3>
                <p className="text-[var(--text-muted)]">Readable code, reusable patterns, and documentation that survives staff changes.</p>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="glass border-t border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-[var(--primary)]/30 transition-colors"
             >
                <h3 className="text-2xl font-bold mb-2 text-[var(--primary)]">Measured</h3>
                <p className="text-[var(--text-muted)]">Performance baselines, analytics hooks, and release checks for every build.</p>
             </motion.div>
          </div>
        </div>
      </section>

      {/* 5. PROCESS TIMELINE */}
      <section id="process" className="py-32 relative">
         <div className="container mx-auto px-6">
            <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How delivery works</h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">We keep the process structured so scope, design, implementation, and launch all stay aligned.</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
               {[
              { step: "01", title: "Discover the problem", desc: "We map the workflow, users, constraints, and systems involved before any build work starts." },
              { step: "02", title: "Design the solution", desc: "We define architecture, user flows, information structure, and delivery milestones." },
              { step: "03", title: "Build and integrate", desc: "We implement the product, connect existing tools, and keep stakeholder feedback in the loop." },
              { step: "04", title: "Launch and improve", desc: "We ship, monitor, and iterate with a clear support path after release." }
               ].map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    key={i} 
                    className="flex gap-8 mb-16 relative"
                  >
                     {/* Timeline line */}
                {i !== 3 && <div className="absolute top-16 left-6 md:left-10 bottom-[-64px] w-px bg-gradient-to-b from-[var(--primary)] to-transparent"></div>}
                     
                     <div className="w-12 h-12 md:w-20 md:h-20 rounded-full flex-shrink-0 bg-[var(--background-secondary)] border-2 border-[var(--primary)] flex items-center justify-center text-xl font-mono text-[var(--accent-neon)] z-10 glass">
                        {item.step}
                     </div>
                     <div className="pt-2 md:pt-5">
                        <h3 className="text-2xl md:text-3xl font-bold mb-3">{item.title}</h3>
                        <p className="text-lg text-[var(--text-secondary)]">{item.desc}</p>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section id="testimonials" className="py-32 bg-[var(--background-secondary)] border-y border-white/5 overflow-hidden">
        <div className="container mx-auto px-6">
           <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Selected outcomes</h2>
           
           <div className="flex gap-6 w-full overflow-x-hidden relative">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--background-secondary)] to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--background-secondary)] to-transparent z-10"></div>

              <motion.div 
                className="flex gap-8 min-w-max pb-8"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              >
                  {[
                    { tag: "AI automation", title: "Support triage assistant", result: "Cut first-response time by 68%.", desc: "Built an internal assistant that routes requests, drafts replies, and surfaces priority issues." },
                    { tag: "Web platform", title: "Client portal refresh", result: "Reduced task completion time by 42%.", desc: "Reworked the portal structure, navigation, and dashboard flow around real user jobs." },
                    { tag: "Data systems", title: "Operations dashboard", result: "Unified reporting across three teams.", desc: "Combined fragmented exports and spreadsheets into a single operational view." },
                    { tag: "Cloud DevOps", title: "Release automation", result: "Shortened deployment cycles from days to hours.", desc: "Standardized builds, previews, and release checks across environments." },
                  ].map((item, i) => (
                    <div key={i} className="w-[400px] glass p-10 rounded-3xl whitespace-normal border border-white/10">
                       <div className="text-sm uppercase tracking-[0.2em] text-[var(--accent-neon)] mb-4">{item.tag}</div>
                       <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                       <p className="text-[var(--text-secondary)] leading-relaxed mb-8">{item.desc}</p>
                       <div className="font-semibold text-white mb-1">{item.result}</div>
                       <div className="text-sm text-[var(--text-muted)]">Project outcome</div>
                    </div>
                  ))}
              </motion.div>
           </div>
        </div>
      </section>

      {/* 8. CTA SECTION */}
      <section id="contact" className="py-40 relative my-20">
         <div className="absolute inset-0 bg-[var(--primary)]/5 mix-blend-screen pointer-events-none"></div>
         <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="max-w-4xl mx-auto glass p-16 md:p-24 rounded-[3rem] border border-[var(--primary)]/30 relative overflow-hidden shadow-[0_0_100px_rgba(139,195,74,0.1)]"
            >
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--primary)]/10 z-0"></div>
               <div className="relative z-10">
                 <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">Start the project.</h2>
                 <p className="text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto font-light">If you need AI, product engineering, data work, or delivery support, we can scope the path and start with the highest-value piece first.</p>
                  <Link href="/contact" className="bg-[var(--primary)] text-[#0B0B0B] font-bold text-xl px-12 py-5 rounded-full shadow-[0_0_40px_rgba(182,255,59,0.3)] hover:shadow-[0_0_60px_rgba(182,255,59,0.5)] transition-all hover:scale-105 inline-flex items-center gap-3">
                    Book a discovery call <Zap className="fill-black" size={24} />
                  </Link>
               </div>
            </motion.div>
         </div>
      </section>

          {/* 9. FOOTER */}
      <footer className="bg-[var(--background-base)] border-t border-white/10 pt-20 pb-10">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
               <div className="col-span-1 md:col-span-2">
                 <div className="flex items-center gap-3 text-[var(--text-primary)] font-bold text-xl tracking-wider mb-6">
                      <div className="relative flex items-center justify-center">
                        <div
                          className="absolute inset-[-6%] rounded-full blur-md pointer-events-none"
                          style={{ background: "var(--logo-glow)" }}
                        />
                        <Image src="/logo-small.png" alt="Tazkhiir Logo" width={160} height={40} className="relative z-10 h-10 w-auto" style={{ filter: "var(--logo-filter)" }} />
                      </div>
                    <span>TAZKHIIR</span>
                 </div>
                 <p className="text-[var(--text-muted)] max-w-md">AI integration, web platforms, data systems, and cloud delivery for teams that need practical execution.</p>
               </div>
               <div>
                 <h4 className="font-bold mb-6">Services</h4>
                 <ul className="space-y-4 text-[var(--text-muted)]">
                   <li><a href="#services" className="hover:text-white transition-colors">AI Integration</a></li>
                   <li><a href="#services" className="hover:text-white transition-colors">Web Platforms</a></li>
                   <li><a href="#services" className="hover:text-white transition-colors">Data Systems</a></li>
                 </ul>
               </div>
               <div>
                 <h4 className="font-bold mb-6">Contact</h4>
                 <ul className="space-y-4 text-[var(--text-muted)]">
                   <li><a href="#approach" className="hover:text-white transition-colors">How we work</a></li>
                   <li><a href="#results" className="hover:text-white transition-colors">Selected work</a></li>
                   <li><Link href="/contact" className="hover:text-white transition-colors">Start a project</Link></li>
                 </ul>
               </div>
            </div>
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-[var(--text-muted)] text-sm">
               <p>&copy; 2026 Tazkhiir Corporation. Built for practical delivery.</p>
               <div className="flex gap-6 mt-4 md:mt-0">
                 <a href="#services" className="hover:text-white">Services</a>
                 <Link href="/contact" className="hover:text-white">Contact</Link>
               </div>
            </div>
         </div>
      </footer>

      {/* Floating Chatbot Widget */}
      <div className="fixed right-5 bottom-5 z-[60] md:right-8 md:bottom-8">
        {isChatOpen && (
          <div className="mb-3 w-[calc(100vw-2.5rem)] max-w-sm rounded-3xl border border-white/10 bg-[var(--surface)]/95 shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden backdrop-blur-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[var(--background-secondary)]/90">
              <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
                <Bot size={18} className="text-[var(--accent-neon)]" />
                <span>Tazkhiir Chatbot</span>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                aria-label="Close chatbot"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-[var(--background-secondary)]/90 p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)] mb-2">Assistant</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {chatReply ?? "Hi. This is a placeholder chatbot. Ask a question to test the UI."}
                </p>
              </div>

              {question.trim() && (
                <div className="rounded-2xl border border-[var(--primary)]/25 bg-[var(--primary)]/18 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)] mb-2">You</p>
                  <p className="text-sm text-[var(--text-primary)]">{question}</p>
                </div>
              )}

              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  id="chatbot-question"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask a question..."
                  className="w-full rounded-xl bg-transparent border border-white/20 px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1 bg-[var(--primary)] text-[#0B0B0B] font-bold px-4 py-2 rounded-xl hover:scale-[1.02] transition-transform"
                >
                  <MessageSquare size={16} />
                </button>
              </form>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsChatOpen((prev) => !prev)}
          aria-label={isChatOpen ? "Close chatbot" : "Open chatbot"}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] text-[#0B0B0B] font-bold px-5 py-3 shadow-[0_0_30px_rgba(182,255,59,0.35)] hover:scale-105 transition-transform"
        >
          <Bot size={18} />
          <span>{isChatOpen ? "Close Chat" : "Chat"}</span>
        </button>
      </div>
    </>
  );
}
