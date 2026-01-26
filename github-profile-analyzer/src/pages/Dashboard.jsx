import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ProfileCard from "../components/ProfileCard";
import "../index.css";

export default function Dashboard() {
  const [username, setUsername] = useState("");

  return (
    <div className="dashboard">
      {/* HERO SECTION */}
      <section className="hero">
        <h1>GitHub Profile Analyzer</h1>
        <p>Analyze GitHub developers with visual insights</p>

        <SearchBar onSearch={setUsername} />
      </section>

      {/* CONTENT */}
      {username && (
        <section className="content">
          <ProfileCard username={username} />
        </section>
      )}
    </div>
  );
}
