import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value);
      }}
    >
      <input
        placeholder="Enter GitHub username"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Analyze</button>
    </form>
  );
}
