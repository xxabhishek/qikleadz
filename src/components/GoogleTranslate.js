import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    // Add Google Translate script dynamically
    const addGoogleTranslateScript = () => {
      const existingScript = document.getElementById("google-translate-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(script);
      }
    };

    // Initialize Google Translate widget
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en", // default language
          includedLanguages: "en,hi,mr,bn,gu,ta,te,ml,kn,pa", // add as needed
          layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
        },
        "google_translate_element"
      );
    };

    addGoogleTranslateScript();
  }, []);

  return (
    <div
      id="google_translate_element"
      className="translate-dropdown"
      style={{ display: "inline-block" }}
    ></div>
  );
};

export default GoogleTranslate;
