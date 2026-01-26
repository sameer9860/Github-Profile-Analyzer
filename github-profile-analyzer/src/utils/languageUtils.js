export function getLanguageStats(repos) {
  const languageCount = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageCount[repo.language] =
        (languageCount[repo.language] || 0) + 1;
    }
  });

  return Object.entries(languageCount).map(([name, value]) => ({
    name,
    value,
  }));
}
