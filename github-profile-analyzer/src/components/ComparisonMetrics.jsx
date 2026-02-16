import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGithubProfile } from "../hooks/useGithubProfile";

export default function ComparisonMetrics({ usernames }) {
  const [profile1, setProfile1] = useState(null);
  const [profile2, setProfile2] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [data1, data2] = await Promise.all([
          fetch(`https://api.github.com/users/${usernames.first}`).then((r) =>
            r.json()
          ),
          fetch(`https://api.github.com/users/${usernames.second}`).then((r) =>
            r.json()
          ),
        ]);
        setProfile1(data1);
        setProfile2(data2);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    if (usernames.first && usernames.second) {
      fetchData();
    }
  }, [usernames]);

  if (loading) {
    return (
      <div className="comparison-metrics">
        <div className="skeleton" style={{ height: "300px" }}></div>
      </div>
    );
  }

  if (!profile1 || !profile2) {
    return null;
  }

  const metrics = [
    {
      label: "Public Repos",
      key: "public_repos",
      icon: "📚",
    },
    {
      label: "Followers",
      key: "followers",
      icon: "👥",
    },
    {
      label: "Following",
      key: "following",
      icon: "🔗",
    },
    {
      label: "Public Gists",
      key: "public_gists",
      icon: "🔤",
    },
    {
      label: "Total Stars",
      key: "total_stars",
      icon: "⭐",
    },
    {
      label: "Total Forks",
      key: "total_forks",
      icon: "🍴"  ,
    },
    {
      label: "Total Watchers",
      key: "total_watchers",
      icon: "👀",
    },
    {
      label:"Final Score",
      key:"final_score",
      icon:"🏆"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="comparison-metrics"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3>Comparative Metrics</h3>

      <motion.div className="metrics-grid" variants={containerVariants}>
        {metrics.map((metric) => {
          const value1 = profile1[metric.key] || 0;
          const value2 = profile2[metric.key] || 0;
          const max = Math.max(value1, value2);
          const percent1 = (value1 / max) * 100 || 0;
          const percent2 = (value2 / max) * 100 || 0;
          const winner = value1 > value2 ? "first" : value2 > value1 ? "second" : "tie";

          return (
            <motion.div
              key={metric.key}
              className="metric-card"
              variants={itemVariants}
            >
              <div className="metric-header">
                <span className="metric-icon">{metric.icon}</span>
                <span className="metric-label">{metric.label}</span>
              </div>

              <div className="metric-values">
                <div className={`value-item ${winner === 'first' ? 'winner' : ''}`}>
                  <span className="value">{value1.toLocaleString()}</span>
                  <span className="username">{usernames.first}</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${percent1}%` }}
                    ></div>
                  </div>
                </div>

                <div className={`value-item ${winner === 'second' ? 'winner' : ''}`}>
                  <span className="value">{value2.toLocaleString()}</span>
                  <span className="username">{usernames.second}</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${percent2}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {winner !== "tie" && (
                <div className={`winner-badge ${winner}`}>
                  🏆 {winner === "first" ? usernames.first : usernames.second} leads
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* ACCOUNT CREATION INFO */}
      <motion.div className="account-info" variants={itemVariants}>
        <h4>Account Timeline</h4>
        <div className="timeline-grid">
          <div className="timeline-item">
            <span className="timeline-label">Created</span>
            <span className="timeline-value">
              {new Date(profile1.created_at).toLocaleDateString()}
            </span>
            <span className="timeline-username">{usernames.first}</span>
          </div>
          <div className="timeline-item">
            <span className="timeline-label">Updated</span>
            <span className="timeline-value">
              {new Date(profile1.updated_at).toLocaleDateString()}
            </span>
            <span className="timeline-username">{usernames.first}</span>
          </div>
          <div className="timeline-item">
            <span className="timeline-label">Created</span>
            <span className="timeline-value">
              {new Date(profile2.created_at).toLocaleDateString()}
            </span>
            <span className="timeline-username">{usernames.second}</span>
          </div>
          <div className="timeline-item">
            <span className="timeline-label">Updated</span>
            <span className="timeline-value">
              {new Date(profile2.updated_at).toLocaleDateString()}
            </span>
            <span className="timeline-username">{usernames.second}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
