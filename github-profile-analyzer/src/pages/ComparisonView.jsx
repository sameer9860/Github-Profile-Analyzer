import { useState } from "react";
import { motion } from "framer-motion";
import ComparisonSearch from "../components/ComparisonSearch";
import Comparison from "../components/Comparison";
import "../index.css";
import "../App.css";

export default function ComparisonView({ usernames, onSearch, onBack }) {
  const [currentUsernames, setCurrentUsernames] = useState(usernames);

  const handleSearch = (newUsernames) => {
    setCurrentUsernames(newUsernames);
    onSearch(newUsernames);
  };

  return (
    <div className="dashboard comparison-view">
      {/* BACK BUTTON */}
      {onBack && (
        <motion.button
          className="back-button"
          onClick={onBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </motion.button>
      )}

      {/* HERO SECTION */}
      <section className="hero">
        <h1>Compare GitHub Profiles</h1>
        <p>Compare two developers side-by-side with detailed metrics</p>

        <ComparisonSearch onSearch={handleSearch} />
      </section>

      {/* COMPARISON CONTENT */}
      {(currentUsernames.first || currentUsernames.second) && (
        <section className="content">
          <Comparison usernames={currentUsernames} />
        </section>
      )}
    </div>
  );
}
