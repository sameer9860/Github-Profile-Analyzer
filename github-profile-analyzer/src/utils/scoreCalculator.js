export function calculateScore(user, repos) {
  const stars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  return stars * 2 + user.followers + repos.length * 3;
}
