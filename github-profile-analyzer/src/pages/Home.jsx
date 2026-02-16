import { motion } from "framer-motion";
import "../styles/Home.css";

export default function Home({ onSelectMode }) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="home-container">
      {/* GITHUB HEADER */}
      <motion.div
        className="github-header"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="github-logo"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        <h1>GitHub Profile Analyzer And Comparison Tool</h1>
      </motion.div>

      {/* HERO SECTION */}
      <motion.div
        className="hero-section"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <h2>Choose Your Path</h2>
        <p>Analyze and compare GitHub developers with visual insights</p>
      </motion.div>

      {/* MODE SELECTOR */}
      <motion.div
        className="mode-selector"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ANALYZER CARD */}
        <motion.button
          className="mode-card analyzer"
          onClick={() => onSelectMode("analyzer")}
          whileHover={{ scale: 1.05, y: -10 }}
          whileTap={{ scale: 0.95 }}
          variants={itemVariants}
        >
          <div className="mode-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12h18M3 6h18M3 18h18M6 3v18M18 3v18" />
            </svg>
          </div>
          <h3>Profile Analyzer</h3>
          <p>Deep dive into a single developer's GitHub profile</p>
          <ul className="features">
            <li>📊 Detailed statistics</li>
            <li>💻 Language breakdown</li>
            <li>🏆 Repository insights</li>
            <li>📈 Activity metrics</li>
          </ul>
          {/* <div className="cta-text">Requires: 1 Username</div> */}
        </motion.button>

        {/* COMPARISON CARD */}
        <motion.button
          className="mode-card comparison"
          onClick={() => onSelectMode("comparison")}
          whileHover={{ scale: 1.05, y: -10 }}
          whileTap={{ scale: 0.95 }}
          variants={itemVariants}
        >
          <div className="mode-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="7" cy="12" r="4" />
              <circle cx="17" cy="12" r="4" />
              <line x1="11" y1="12" x2="13" y2="12" />
              <path d="M2 12h2M20 12h2" />
            </svg>
          </div>
          <h3>Profile Comparison</h3>
          <p>Compare two developers side-by-side with metrics</p>
          <ul className="features">
            <li>⚖️ Side-by-side stats</li>
            <li>📊 Comparative charts</li>
            <li>🎯 Skill comparison</li>
            <li>🔄 Activity comparison</li>
          </ul>
          {/* <div className="cta-text">Requires: 2 Usernames</div> */}
        </motion.button>
      </motion.div>

      {/* FOOTER */}
      <motion.footer
        className="home-footer"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <p>Powered by GitHub API • Real-time data • Open Source</p>
      </motion.footer>
    </div>
  );
}
