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
    try {
      const response = await fetch(
        `https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${char}.json`
      );
      if (response.status !== 200) {
        throw new Error(`Char ${char}'s SVG was not found.`);
      }
      return response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async getCachedPaintFor(
    char: string,
    ttlMs: number = 86400000
  ): Promise<HanziInstructions | null> {
    const cacheKey = `hanzi-${char}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const { data, expiresAt, notFound }: HanziCache = JSON.parse(cachedData);

      if (notFound && Date.now() < expiresAt) {
        return null;
      }

      if (data && Date.now() < expiresAt) {
        return data;
      }
    }

    const data = await HanziPaintBuilder.getDownloadedPaintFor(char);

    localStorage.setItem(
      cacheKey,
      JSON.stringify(
        data
          ? { data, expiresAt: Date.now() + ttlMs }
          : { notFound: true, expiresAt: Date.now() + ttlMs }
      )
    );

    return data;
  }

  static async get(char: string) {
    const data = await HanziPaintBuilder.getCachedPaintFor(char);
    if (!data) {
      return { toHtml: () => "<span>Error generating</span>" };
    }
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
