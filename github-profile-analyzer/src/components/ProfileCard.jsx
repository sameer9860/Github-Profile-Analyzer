import { useGithubProfile } from "../hooks/useGithubProfile";
import { calculateDeveloperScore } from "../utils/scoreCalculator";
import ScoreBadge from "./ScoreBadge";

import StatCard from "./StatCard";
export default function ProfileCard({ username }) {
  const { user, repos, loading, error } = useGithubProfile(username);

  const score = calculateDeveloperScore(user, repos);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return null;

  return (
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

  );
}
