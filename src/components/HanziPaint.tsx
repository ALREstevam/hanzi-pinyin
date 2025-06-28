import { useState, useEffect, FunctionComponent, useRef } from "react";
import HanziPaintBuilder from "../utils/HanziPaintUtils";
import styles from './HanziPaint.module.css'; // Add this import

interface HanziComponentProps {
  char: string;
}

const HanziPaint: FunctionComponent<HanziComponentProps> = ({ char }) => {
  const [svg, setSvg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Start as false, only load when visible
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 10% of the component is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && !svg && !loading && !error) { // Only fetch if visible, not already loaded, not loading, and no error
      setLoading(true);
      setError(null);
      HanziPaintBuilder.get(char)
        .then((res) => res.toHtml())
        .then((data: string) => {
          if (data.includes("Error generating")) { // Check for the specific error string
            setError("Error generating SVG for " + char);
            setSvg(null); // Ensure SVG is null on error
          } else {
            setSvg(data);
          }
        })
        .catch((err: Error) => {
          setError(err.message);
          setSvg(null); // Ensure SVG is null on error
        })
        .finally(() => setLoading(false));
    }
  }, [char, isVisible, svg, loading, error]); // Add svg, loading, error to dependencies to prevent re-fetching loops

  if (!isVisible || loading) {
    return <div ref={containerRef} className={styles.hanziPlaceholder}>{char}</div>;
  }

  if (error || !svg) {
    // If there's an error or SVG is null (e.g., from "Error generating"), show the character as text
    return <div ref={containerRef} className={styles.hanziError}>{char}</div>;
  }

  return (
    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: svg }} className={styles.hanziSvgContainer} />
  );
};

export default HanziPaint;
