import { useGithubProfile } from "../hooks/useGithubProfile";
import StatCard from "./StatCard";
export default function ProfileCard({ username }) {
  const { user, repos, loading, error } = useGithubProfile(username);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return null;

  return (
    <div className="profile-card">
      <img src={user.avatar_url} alt="avatar" />
      <div>
        <div className="stats-grid">
  <StatCard label="Followers" value={user.followers} />
  <StatCard label="Public Repos" value={user.public_repos} />
  <StatCard label="Following" value={user.following} />
</div>
        <h2>{user.name || user.login}</h2>
        <p>{user.bio}</p>
        <div className="stats">
          <span>👥 {user.followers} Followers</span>
          <span>📦 {repos.length} Repos</span>
        </div>
      </div>
    </div>
  );
}
