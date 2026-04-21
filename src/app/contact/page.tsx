import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--background-base)] pt-36 pb-20">
        <section className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto glass rounded-[2rem] border border-[var(--primary)]/25 p-10 md:p-14">
            <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8">
              <ArrowLeft size={18} /> Back to home
            </Link>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl">
              Tell us what you are building and what is blocking delivery. We will reply with a practical first step, timeline, and recommended scope.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              <a
                href="mailto:hello@tazkhiir.com"
                className="glass border border-white/10 rounded-2xl p-6 hover:border-[var(--primary)]/40 transition-colors"
              >
                <Mail className="text-[var(--accent-neon)] mb-3" size={24} />
                <h2 className="font-bold text-xl mb-2">Email</h2>
                <p className="text-[var(--text-muted)]">hello@tazkhiir.com</p>
              </a>

              <a
                href="tel:+12025550199"
                className="glass border border-white/10 rounded-2xl p-6 hover:border-[var(--primary)]/40 transition-colors"
              >
                <Phone className="text-[var(--accent-neon)] mb-3" size={24} />
                <h2 className="font-bold text-xl mb-2">Phone</h2>
                <p className="text-[var(--text-muted)]">+1 (202) 555-0199</p>
              </a>

              <a
                href="https://wa.me/12025550199"
                target="_blank"
                rel="noopener noreferrer"
                className="glass border border-white/10 rounded-2xl p-6 hover:border-[var(--primary)]/40 transition-colors"
              >
                <MessageCircle className="text-[var(--accent-neon)] mb-3" size={24} />
                <h2 className="font-bold text-xl mb-2">WhatsApp</h2>
                <p className="text-[var(--text-muted)]">Chat with our team</p>
              </a>
            </div>

            <div className="glass rounded-2xl border border-white/10 p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-3">Fast project intake</h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Share your goals, current stack, and timeline. We can usually provide a scoped response within one business day.
              </p>
              <a
                href="mailto:hello@tazkhiir.com?subject=Project%20Inquiry%20-%20Tazkhiir"
                className="inline-flex items-center gap-2 bg-[var(--primary)] text-[#0B0B0B] font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform glow-btn"
              >
                Send project details
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
