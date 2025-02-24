import { useState, useEffect, FunctionComponent } from "react";
import HanziPaintBuilder from "../utils/HanziPaintUtils";

interface HanziComponentProps {
  char: string;
}

const HanziPaint: FunctionComponent<HanziComponentProps> = ({
  char,
}) => {
  const [svg, setSvg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    HanziPaintBuilder.get(char)
      .then((res) => res.toHtml())
      .then((data: string) => setSvg(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [char]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return <div dangerouslySetInnerHTML={{ __html: svg || "" }} />;
};

export default HanziPaint;
