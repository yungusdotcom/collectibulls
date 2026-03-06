"use client";

import { useState, useEffect } from "react";
import LandingPage from "@/components/LandingPage";
import CollectibullsApp from "@/components/CollectibullsApp";

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Check if user has entered before (skip landing on return visits)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasEntered = sessionStorage.getItem("collectibulls:entered");
      if (hasEntered === "true") {
        setEntered(true);
      }
    }
  }, []);

  const handleEnter = () => {
    setTransitioning(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("collectibulls:entered", "true");
    }
    setTimeout(() => {
      setEntered(true);
      setTransitioning(false);
    }, 400);
  };

  if (entered) {
    return <CollectibullsApp />;
  }

  return (
    <div style={{
      opacity: transitioning ? 0 : 1,
      transition: "opacity 0.4s ease",
    }}>
      <LandingPage onEnter={handleEnter} />
    </div>
  );
}
