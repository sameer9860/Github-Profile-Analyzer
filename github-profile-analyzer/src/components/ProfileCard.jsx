import { useGithubProfile } from "../hooks/useGithubProfile";

export default function ProfileCard({ username }) {
  const { user, repos, loading, error } = useGithubProfile(username);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return null;

  return (
    <div>
      <img src={user.avatar_url} width="100" />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
      <p>Followers: {user.followers}</p>
      <p>Public Repos: {user.public_repos}</p>
    </div>
  );
}
