export function calculateDeveloperScore(user, repos) {
  if (!user || !repos) return 0;

  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );

  const totalForks = repos.reduce(
    (sum, repo) => sum + repo.forks_count,
    0
  );

  const activeRepos = repos.filter(
    repo => !repo.fork
  ).length;

  return (
    totalStars * 2 +
    totalForks +
    user.followers +
    activeRepos * 3
  );
}
