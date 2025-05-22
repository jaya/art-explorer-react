import React, { useEffect, useState } from "react";

interface TypewriterSuggestionProps {
  text: string;
  speed?: number;
  className?: string;
}

const TypewriterSuggestion: React.FC<TypewriterSuggestionProps> = ({
  text,
  speed = 50,
  className,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeoutId);
    }
  }, [currentIndex, text, speed]);

  return <span className={className}>{displayedText}</span>;
};

export default TypewriterSuggestion;
