import { useGithubProfile } from "../hooks/useGithubProfile";
import ScoreBadge from "./ScoreBadge";
import LanguageChart from "./LanguageChart";
import RepoList from "./RepoList";
import Skeleton from "./Skeleton";
import { calculateDeveloperScore } from "../utils/scoreCalculator";

export default function ProfileCard({ username }) {
  const { user, repos, loading, error } = useGithubProfile(username);

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="profile-card">
        <Skeleton width="100px" height="100px" style={{ borderRadius: "50%" }} />
        <div style={{ flex: 1, marginLeft: "20px" }}>
          <Skeleton width="60%" />
          <Skeleton width="40%" />
          <div className="stats-grid">
            <Skeleton width="80px" />
            <Skeleton width="80px" />
            <Skeleton width="80px" />
          </div>
        </div>
      </div>
    );
  }

  // ✅ ERROR STATE
  if (error) {
    return (
      <div className="error-message">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  // ✅ NORMAL RENDER
  if (!user) return null;

  const score = calculateDeveloperScore(user, repos);

  return (
    <div>
      <div className="profile-card">
        <img src={user.avatar_url} alt="avatar" />
        <div style={{ flex: 1 }}>
          <h2>{user.name || user.login}</h2>
          <p>{user.bio}</p>
          <div className="stats">
            <span>👥 {user.followers} Followers</span>
            <span>📦 {repos.length} Repos</span>
          </div>
        </div>
        <ScoreBadge score={score} />
      </div>

  <ScoreBadge score={score} />

  <LanguageChart repos={repos} />

  <RepoList repos={repos} />

</div>

  );
}
