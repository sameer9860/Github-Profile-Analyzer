import { useEffect, useState } from "react";

export function useGithubProfile(username) {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const userRes = await fetch(
          `https://api.github.com/users/${username}`
        );
        if (!userRes.ok) throw new Error("User not found");

        const repoRes = await fetch(
          `https://api.github.com/users/${username}/repos`
        );

        setUser(await userRes.json());
        setRepos(await repoRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username]);

  return { user, repos, loading, error };
}
