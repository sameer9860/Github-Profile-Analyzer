import { useState } from "react";

export default function ComparisonSearch({ onSearch }) {
  const [username1, setUsername1] = useState("");
  const [username2, setUsername2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username1.trim() && username2.trim()) {
      onSearch({ first: username1.trim(), second: username2.trim() });
    }
  };

  const handleSwap = () => {
    const temp = username1;
    setUsername1(username2);
    setUsername2(temp);
  };

  return (
    <form className="comparison-search" onSubmit={handleSubmit}>
      <div className="comparison-inputs">
        <div className="input-group">
          <label htmlFor="user1">Developer 1</label>
          <input
            id="user1"
            type="text"
            placeholder="Enter first username..."
            value={username1}
            onChange={(e) => setUsername1(e.target.value)}
            autoComplete="off"
          />
        </div>

        <button
          type="button"
          className="swap-button"
          onClick={handleSwap}
          title="Swap usernames"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1 4 1 10 7 10" />
            <polyline points="23 20 23 14 17 14" />
            <path d="M20.362 4.431l-5.725 5.725M3.637 19.569l5.725-5.725" />
          </svg>
        </button>

        <div className="input-group">
          <label htmlFor="user2">Developer 2</label>
          <input
            id="user2"
            type="text"
            placeholder="Enter second username..."
            value={username2}
            onChange={(e) => setUsername2(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      <button
        type="submit"
        className="search-button"
        disabled={!username1.trim() || !username2.trim()}
      >
        <span>Compare Profiles</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </form>
  );
}
