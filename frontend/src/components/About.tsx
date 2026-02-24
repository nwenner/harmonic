import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "../hooks/useTheme";

const GITHUB_URL = "https://github.com/nwenner/harmonic";

export function About() {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <ThemeToggle dark={dark} onToggle={toggle} />

      {/* Header */}
      <div className="bg-cdi-purple text-white px-6 py-10 sm:py-14 text-center">
        <Link to="/" className="inline-block text-indigo-300 hover:text-white text-sm mb-4 transition-colors">
          ← Back to Harmonic
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Project Harmonic
        </h1>
        <p className="text-cdi-gold text-base max-w-lg mx-auto font-medium">
          A Practice Space for Constructive Dialogue
        </p>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 text-indigo-300 hover:text-white text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          View on GitHub
        </a>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">

        {/* The Vision */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-3">
            The Vision
          </h2>
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3">
            <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
              Harmonic is a functional prototype. While many AI tools focus on information delivery or debate winning, Harmonic is designed for <strong className="text-stone-900 dark:text-stone-100">experience and practice</strong>. It creates a safe, low-stakes environment for users to apply CDI's curriculum by engaging with a realistic AI partner who holds different core values.
            </p>
            <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
              The goal isn't to change the AI's mind or win an argument; it is to find the "resonance" in a difficult conversation—learning to hear the fundamental human values beneath an opposing political or social stance.
            </p>
          </div>
        </section>

        {/* Product Thinking */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-3">
            Product Thinking & Design Choices
          </h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-2">
                1. Focus on Option A: The Practice Conversation
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                I chose Option A because it is the most immediately experiential. CDI's mission is centered on practice, not just content. By providing a realistic counterpart, we move the user from passive learning to active skill application.
              </p>
            </div>

            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-2">
                2. Anti-Strawman Persona Architecture
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-3">
                The "AI Fluency" centerpiece of Harmonic is a two-call generation strategy:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-3 text-sm">
                  <span className="text-cdi-purple font-mono flex-shrink-0 mt-0.5">1.</span>
                  <span className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    <strong className="text-stone-800 dark:text-stone-200">Persona Generation:</strong> Before the chat begins, the AI generates a deep persona (Occupation, Location, Core Beliefs). Crucially, these beliefs are value-rooted (e.g., family, fairness, liberty) rather than just a list of policy talking points.
                  </span>
                </li>
                <li className="flex gap-3 text-sm">
                  <span className="text-cdi-purple font-mono flex-shrink-0 mt-0.5">2.</span>
                  <span className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    <strong className="text-stone-800 dark:text-stone-200">The Dialogue:</strong> The AI is prompted to be a "realistic partner." It is instructed to admit when the user makes a good point, ask genuine questions, and avoid reciting statistics. This prevents the "Debate Bot" failure mode and keeps the conversation human.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-2">
                3. Intentional Friction
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                Harmonic uses "intentional friction." The AI is programmed to push back with real reasoning. If the user's argument has a hole, the AI will find it—not to "win," but to force the user to refine their own thinking and practice de-escalation.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Implementation */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-3">
            Technical Implementation
          </h2>
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3">
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              To meet the 4-hour build requirement, I prioritized a serverless, high-availability architecture that allows for rapid iteration:
            </p>
            <ul className="space-y-3">
              {[
                { label: "Frontend", detail: "A responsive React SPA (Vite + TypeScript + Tailwind) focusing on a \"warm neutral\" aesthetic to lower user heart rates and encourage contemplation." },
                { label: "Backend", detail: "AWS Lambda (Node.js 20) using a Function URL for low latency and direct CORS handling." },
                { label: "Intelligence", detail: "Anthropic's Claude 4.6 Sonnet, chosen for its superior nuance in roleplay and adherence to complex system prompts compared to other models." },
              ].map(({ label, detail }) => (
                <li key={label} className="flex gap-3 text-sm">
                  <span className="font-semibold text-stone-800 dark:text-stone-200 flex-shrink-0 w-24">{label}</span>
                  <span className="text-stone-600 dark:text-stone-400 leading-relaxed">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Evaluation */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-3">
            Evaluation & Success Metrics
          </h2>
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3">
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              In a full production rollout, I would evaluate Harmonic's success through:
            </p>
            <ul className="space-y-3">
              {[
                { label: "Perspective Shift Self-Reports", detail: "A post-session question: \"Did this conversation change how you view people who hold this stance?\"" },
                { label: "Engagement Depth", detail: "Measuring average message length and turns per session to ensure users are engaging deeply rather than dropping off." },
                { label: "Qualitative Transcript Review", detail: "Auditing sessions for \"ideal counterpart\" behavior—did the AI model the constructive behaviors CDI teaches?" },
              ].map(({ label, detail }) => (
                <li key={label} className="flex gap-3 text-sm">
                  <span className="text-cdi-purple mt-1.5 flex-shrink-0">•</span>
                  <span className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    <strong className="text-stone-800 dark:text-stone-200">{label}:</strong> {detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Challenges */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-3">
            Challenges & Future Iterations
          </h2>
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-3">
            <ul className="space-y-3">
              {[
                { label: "Safety / Moderation", detail: "Future versions would include a dedicated moderation layer to ensure topics remain within constructive bounds." },
                { label: "Memory Persistence", detail: "Implementing a database (like DynamoDB) would allow users to return to a conversation over multiple days, reflecting the long-term nature of real-world relationships." },
                { label: "Facilitator Dashboard", detail: "For university partners, a dashboard to view anonymized trends in where students struggle most with \"clashing notes.\"" },
              ].map(({ label, detail }) => (
                <li key={label} className="flex gap-3 text-sm">
                  <span className="text-cdi-purple mt-1.5 flex-shrink-0">•</span>
                  <span className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    <strong className="text-stone-800 dark:text-stone-200">{label}:</strong> {detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-2 pb-8">
          <Link
            to="/"
            className="inline-block bg-cdi-gold text-stone-900 px-8 py-3 rounded-xl font-semibold text-sm tracking-wide hover:brightness-105 transition-all"
          >
            Try Harmonic →
          </Link>
        </div>
      </div>
    </div>
  );
}
