import { getTopRepositories } from "../utils/repoUtils";

export default function RepoList({ repos }) {
const topRepos = getTopRepositories(repos);

if (!repos || repos.length === 0) {
  return <p style={{ textAlign: "center", marginTop: "20px" }}>No repositories available.</p>;
}

  return (
    <div className="repo-card">
      <h3>Top Repositories</h3>

    
      {topRepos.map((repo) => (
        <div key={repo.id} className="repo-item">
          <div>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
            >
              {repo.name}
            </a>
            <p>{repo.description || "No description"}</p>
          </div>

          <div className="repo-stats">
            <span>⭐ {repo.stargazers_count}</span>
            <span>🍴 {repo.forks_count}</span>
            <span>
              🕒 {new Date(repo.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
