import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ComparisonView from "./pages/ComparisonView";
import "./App.css";

export default function App() {
  const [mode, setMode] = useState("home"); // home | analyzer | comparison
  const [comparisonUsernames, setComparisonUsernames] = useState({
    first: "",
    second: "",
  });

  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode);
  };

  const handleComparison = (usernames) => {
    setComparisonUsernames(usernames);
  };

  const handleBackToHome = () => {
    setMode("home");
    setComparisonUsernames({ first: "", second: "" });
  };

  return (
    <AnimatePresence mode="wait">
      {mode === "home" && (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Home onSelectMode={handleSelectMode} />
        </motion.div>
      )}

      {mode === "analyzer" && (
        <motion.div
          key="analyzer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Dashboard onBack={handleBackToHome} />
        </motion.div>
      )}

      {mode === "comparison" && (
        <motion.div
          key="comparison"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ComparisonView
            usernames={comparisonUsernames}
            onSearch={handleComparison}
            onBack={handleBackToHome}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
