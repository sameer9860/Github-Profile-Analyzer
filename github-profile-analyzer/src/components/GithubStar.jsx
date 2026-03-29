export default function GithubStar() {
  return (
    <a
      href="https://github.com/sameer9860/github-profile-analyzer"
      target="_blank"
      rel="noopener noreferrer"
      className="github-star-button"
      aria-label="Star on GitHub"
      title="Star on GitHub"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <span>Star</span>
    </a>
  );
}
