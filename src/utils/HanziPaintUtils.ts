export interface HanziCache {
  data?: HanziInstructions;
  expiresAt: number;
  notFound?: boolean;
}

export interface HanziInstructions {
  strokes: string[];
}

export default class HanziPaintBuilder {
  static async getDownloadedPaintFor(
    char: string
  ): Promise<HanziInstructions | null> {
    const MAX_RETRIES = 3;
    let retries = 0;
    let delay = 100; // milliseconds

    while (retries < MAX_RETRIES) {
      try {
        const response = await fetch(
          `https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${char}.json`
        );
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 404) {
          // If 404, it means the char's SVG is genuinely not found, no need to retry
          console.warn(`Char ${char}'s SVG was not found (404).`);
          return null;
        } else {
          // For other errors, retry
          throw new Error(
            `Failed to fetch char ${char}'s SVG with status: ${response.status}`
          );
        }
      } catch (err: any) {
        console.error(
          `Attempt ${retries + 1} failed for char ${char}:`,
          err.message
        );
        retries++;
        if (retries < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        } else {
          console.error(`Max retries reached for char ${char}.`);
          return null;
        }
      }
    }
    return null; // Should not be reached if max retries are handled
  }

  static async getCachedPaintFor(
    char: string,
    ttlMs: number = 86400000
  ): Promise<HanziInstructions | null> {
    const cacheKey = `hanzi-${char}`;
    const cachedData = localStorage.getItem(cacheKey);

    const saveToLocalStorage = (data: HanziInstructions | null) => {
      localStorage.setItem(
        cacheKey,
        JSON.stringify(
          data
            ? { data, expiresAt: Date.now() + ttlMs }
            : { notFound: true, expiresAt: Date.now() + ttlMs }
        )
      );
    };

    const download = async (char: string) => {
      const data = await HanziPaintBuilder.getDownloadedPaintFor(char);
      saveToLocalStorage(data);
      return data;
    };

    if (cachedData) {
      const { data, expiresAt, notFound }: HanziCache = JSON.parse(cachedData);

      if (notFound) {
        return download(char);
      }

      if (data && Date.now() < expiresAt) {
        console.log(`HanziPaintBuilder: Char ${char} found in cache.`);
        return data;
      }
      console.log(
        `HanziPaintBuilder: Cache for ${char} expired or invalid, fetching new data.`
      );
    }

    console.log(
      `HanziPaintBuilder: No cache found for ${char}, fetching new data.`
    );

    return download(char);
  }

  static async get(char: string) {
    const data = await HanziPaintBuilder.getCachedPaintFor(char);
    if (!data) {
      console.log(
        `HanziPaintBuilder: No data returned for ${char} after caching attempt.`
      );
      return { toHtml: () => "<span>Error generating</span>" };
    }
    console.log(`HanziPaintBuilder: Data successfully retrieved for ${char}.`);
    return {
      toHtml: () => HanziPaintSvg.generateHtml(data),
    };
  }
}

export class HanziPaintSvg {
  static generateHtml(data: HanziInstructions): string {
    if (!data || !data.strokes) return "";

    return (
      `<svg class="hanziPaint" viewBox="0 0 1024 1150" xmlns="http://www.w3.org/2000/svg">` +
      data.strokes
        .map((stroke, index) => {
          const color = getColorGradient(index, data.strokes.length);
          return `<path d="${stroke}" fill="${color}" stroke-width="1" stroke="${color}" transform="scale(1, -1) translate(0, -1024)"/>`;
        })
        .join("") +
      `</svg>`
    );
  }
}

export function getColorGradient(
  index: number,
  total: number,
  alpha: number = 0.8,
  startColor = [0, 0, 0],
  endColor = [255, 20, 20]
): string {
  const r = Math.round(
    startColor[0] + (endColor[0] - startColor[0]) * (index / (total - 1))
  );
  const g = Math.round(
    startColor[1] + (endColor[1] - startColor[1]) * (index / (total - 1))
  );
  const b = Math.round(
    startColor[2] + (endColor[2] - startColor[2]) * (index / (total - 1))
  );

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
