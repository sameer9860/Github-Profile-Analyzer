import ProfileCard from "./ProfileCard";

export default function Comparison({ usernames }) {
  if (!usernames.first && !usernames.second) return null;

  return (
    <div className="comparison-grid">
      {usernames.first && <ProfileCard username={usernames.first} />}
      {usernames.second && <ProfileCard username={usernames.second} />}
    </div>
  );
}
