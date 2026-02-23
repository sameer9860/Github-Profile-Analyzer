export function getTopRepositories(repos, limit = 5) {
  return [...repos]
    .sort(
      (a, b) =>
        b.stargazers_count +
        b.forks_count -
        (a.stargazers_count + a.forks_count)
    )
    .slice(0, limit);
}
