import ProfileCard from "./ProfileCard";

export default function Comparison({ usernames }) {
  // If neither username is provided, render nothing
  if (!usernames.first && !usernames.second) return null;

  return (
    <div className="comparison-grid">
      {usernames.first && (
        <div className="comparison-item">
          <ProfileCard username={usernames.first} />
        </div>
      )}
      {usernames.second && (
        <div className="comparison-item">
          <ProfileCard username={usernames.second} />
        </div>
      )}
    </div>
  );
}
