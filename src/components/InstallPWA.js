import React, { useEffect, useState } from "react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log("User choice:", choice);
    setDeferredPrompt(null);
    setShowButton(false);
  };

  return (
    <>
      {showButton && (
        <button
          onClick={handleInstall}
          style={{
            padding: "10px 20px",
            background: "#0d6efd",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            position: "fixed",
            bottom: "20px",
            right: "20px",
          }}
        >
          Install App
        </button>
      )}
    </>
  );
}
