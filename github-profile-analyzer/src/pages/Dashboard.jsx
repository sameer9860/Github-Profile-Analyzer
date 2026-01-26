import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ProfileCard from "../components/ProfileCard";
import "./Dashboard.css";


export default function Dashboard() {
  const [username, setUsername] = useState("");

  return (
    <div className="dashboard">
      <header className="header">
        <h1>GitHub Profile Analyzer</h1>
        <p>Analyze GitHub profiles with visual insights</p>
      </header>

      <SearchBar onSearch={setUsername} />

      {username && (
        <div className="content">
          <ProfileCard username={username} />
        </div>
      )}
    </div>
  );
}
