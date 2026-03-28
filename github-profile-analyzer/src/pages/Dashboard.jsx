import { useState, useRef } from "react";
import { motion } from "framer-motion";
import SearchBar from "../components/SearchBar";
import ProfileCard from "../components/ProfileCard";
import ExportPdfButton from "../components/ExportPdfButton";
import { safeFilenameSegment } from "../utils/exportPdf";
import "../index.css";
import "../App.css";

export default function Dashboard({ onBack }) {
  const [username, setUsername] = useState("");
  const pdfRef = useRef(null);
  const [analysisExportReady, setAnalysisExportReady] = useState(false);

  return (
    <div className="dashboard">
      {/* BACK BUTTON */}
      {onBack && (
        <motion.button
          className="back-button"
          onClick={onBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </motion.button>
      )}

      {/* HERO SECTION */}
      <section className="hero">
        <h1>GitHub Profile Analyzer </h1>
        <p>Analyze GitHub developers with visual insights</p>

        <SearchBar onSearch={setUsername} />
        {username && (
          <div className="hero-pdf-row">
            <ExportPdfButton
              targetRef={pdfRef}
              filename={`${safeFilenameSegment(username)}-github-profile-analysis.pdf`}
              subtitle={`Analysis · ${username}`}
              disabled={!analysisExportReady}
            />
          </div>
        )}
      </section>

      {/* CONTENT */}
      {username && (
        <section className="content">
          <div ref={pdfRef} className="pdf-capture-root">
            <ProfileCard
              username={username}
              onExportReady={setAnalysisExportReady}
            />
          </div>
        </section>
      )}
    </div>
  );
}
