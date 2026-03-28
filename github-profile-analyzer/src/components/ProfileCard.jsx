import { useEffect } from "react";
import { motion } from "framer-motion";
import { useGithubProfile } from "../hooks/useGithubProfile";
import { useExportableAvatarSrc } from "../hooks/useExportableAvatarSrc";
import ScoreBadge from "./ScoreBadge";
import LanguageChart from "./LanguageChart";
import RepoList from "./RepoList";
import Skeleton from "./Skeleton";
import { calculateDeveloperScore } from "../utils/scoreCalculator";

export default function ProfileCard({ username, onExportReady }) {
  const { user, repos, loading, error } = useGithubProfile(username);
  const { src: avatarSrc, exportReady: avatarExportReady } =
    useExportableAvatarSrc(user?.avatar_url ?? "");

  useEffect(() => {
    if (!username) {
      onExportReady?.(false);
      return;
    }
    onExportReady?.(
      !loading && !!user && !error && avatarExportReady
    );
  }, [username, loading, user, error, onExportReady, avatarExportReady]);

  if (loading) {
    return (
      <div className="profile-card skeleton-container">
        <Skeleton
          width="140px"
          height="140px"
          style={{ borderRadius: "36px" }}
        />
        <div className="profile-info">
          <Skeleton width="40%" height="2rem" />
          <Skeleton width="60%" height="1rem" style={{ marginTop: "1rem" }} />
          <div className="stats-inline" style={{ marginTop: "2rem" }}>
            <Skeleton width="100px" height="1.5rem" />
            <Skeleton width="100px" height="1.5rem" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  if (!user) return null;

  const score = calculateDeveloperScore(user, repos);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: "100%" }}
    >
      <div className="profile-card">
        <img
          className="profile-avatar"
          src={avatarSrc}
          alt={`${user.login}'s avatar`}
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          {...(typeof avatarSrc === "string" &&
          (avatarSrc.startsWith("http://") ||
            avatarSrc.startsWith("https://"))
            ? { crossOrigin: "anonymous" }
            : {})}
        />
        <div className="profile-info">
          <h2>{user.name || user.login}</h2>
          <p>{user.bio || "No bio available"}</p>
          <div className="stats-inline">
            <div className="stat-item">
              <span>👥</span> {user.followers.toLocaleString()} Followers
            </div>
            <div className="stat-item">
              <span>📦</span> {repos.length} Repositories
            </div>
            {user.location && (
              <div className="stat-item">
                <span>📍</span> {user.location}
              </div>
            )}
          </div>
        </div>
        <ScoreBadge score={score} />
      </div>

      <div className="content">
        <div className="card-vignette">
          <LanguageChart repos={repos} />
        </div>
        <div className="card-vignette">
          <RepoList repos={repos} />
        </div>
      </div>
    </motion.div>
  );
}
