import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ProfileCard from "../components/ProfileCard";

export default function Dashboard() {
  const [username, setUsername] = useState("");

  return (
    <div style={{ padding: "20px" }}>
      <h1>GitHub Profile Analyzer</h1>
      <SearchBar onSearch={setUsername} />
      {username && <ProfileCard username={username} />}
    </div>
  );
}
