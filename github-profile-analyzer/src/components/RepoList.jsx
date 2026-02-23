import { getTopRepositories } from "../utils/repoUtils";

export default function RepoList({ repos }) {
  const topRepos = getTopRepositories(repos);

  if (!repos || repos.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        No repositories available.
      </p>
    );
  }

  return (
    <>
      <h3>Top Repositories</h3>
      <div className="repo-list">
        {topRepos.map((repo) => (
          <div key={repo.id} className="repo-item">
            <div>
              <a href={repo.html_url} target="_blank" rel="noreferrer">
                {repo.name}
              </a>
              <p>{repo.description || "No description provided"}</p>
            </div>

            <div className="repo-stats">
              <span title="Stars">
                ⭐ {repo.stargazers_count.toLocaleString()}
              </span>
              <span title="Forks">🍴 {repo.forks_count.toLocaleString()}</span>
              <span className="repo-date" title="Last updated">
                {new Date(repo.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
