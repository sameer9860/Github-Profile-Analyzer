import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  return (
    <form
      className="search-bar"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSearch(value);
      }}
    >
      <input
        placeholder="Enter GitHub username..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Analyze</button>
    </form>
  );
}
