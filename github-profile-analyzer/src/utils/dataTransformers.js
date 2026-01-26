export function getLanguageStats(repos) {
  const stats = {};
  repos.forEach(repo => {
    if (repo.language) {
      stats[repo.language] = (stats[repo.language] || 0) + 1;
    }
  });
  return Object.entries(stats).map(([name, value]) => ({ name, value }));
}
