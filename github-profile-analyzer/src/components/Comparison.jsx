import { useState } from "react";
import { motion } from "framer-motion";
import ProfileCard from "./ProfileCard";
import ComparisonMetrics from "./ComparisonMetrics";

export default function Comparison({ usernames }) {
  const [comparisonData, setComparisonData] = useState(null);

  // If neither username is provided, render nothing
  if (!usernames.first && !usernames.second) return null;

  return (
    <motion.div
      className="comparison-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="comparison-header">
        <h2>Developer Comparison</h2>
        <p>
          Comparing <strong>{usernames.first}</strong> and{" "}
          <strong>{usernames.second}</strong>
        </p>
      </div>

      {/* PROFILE CARDS */}
      <div className="comparison-grid">
        {usernames.first && (
          <motion.div
            className="comparison-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ProfileCard username={usernames.first} />
          </motion.div>
        )}
        {usernames.second && (
          <motion.div
            className="comparison-item"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ProfileCard username={usernames.second} />
          </motion.div>
        )}
      </div>

      {/* COMPARISON METRICS */}
      {usernames.first && usernames.second && (
        <ComparisonMetrics usernames={usernames} />
      )}
    </motion.div>
  );
}
