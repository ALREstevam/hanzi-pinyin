import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import styles from './MermaidDiagram.module.css';
import { getGeminiResponse } from '../utils/geminiApi';
import clsx from 'clsx';

interface MermaidDiagramProps {
  phrase: string;
  pinyin: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ phrase, pinyin }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [explanationLoading, setExplanationLoading] = useState<boolean>(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);

  useEffect(() => {
    const generateContent = async () => {
      setLoading(true);
      setError(null);
      setChart(''); // Clear previous chart
      setExplanation(''); // Clear previous explanation
      setExplanationLoading(false);
      setExplanationError(null);

      if (!phrase) {
        setError('No phrase provided to generate content.');
        setLoading(false);
        return;
      }

      // Prompt for Mermaid Chart
      const chartPrompt = `Generate a Mermaid graph (flowchart) explaining the Chinese phrase "${phrase}" with its pinyin "${pinyin}".
      
      Follow this exact format for the nodes:
      - Main phrase node: B["Chinese Phrase\\nEnglish Translation"]
      - Word nodes: B1["Word\\nWord Pinyin\\nWord English Translation"]
      - Character nodes: B1a["Character - Character Pinyin - Character English Translation"]
      - Radical nodes: B1a1["Radical (Radical Pinyin) - Radical English Translation"]

      All texts in the nodes must be quoted using double quotes.
      Do not include any characters that are not allowed in Mermaid node text, such as backticks or unescaped special characters.
      
      Example:
      
      graph TD
          B["我喜欢面包\\nWǒ xǐhuān miànbāo \\nI like bread"]
      
          B --> B1["我\\nwǒ\\nI"]
          B1 --> B1a["手 (shǒu) - Hand"]
          B1 --> B1b["戈 (gē) - Spear"]
      
          B --> B2["喜欢\\nxǐhuān\\nLike"]
          B2 --> B2a["喜 - xǐ - Happiness/Pleasure"]
          B2a --> B2a1["士 (shì) - erudite"]
          B2a --> B2a2["口 (kǒu) - mouth"]
          B2a --> B2a3["吕 (lǚ) - column/music"]
          B2 --> B2b["欢 - huān - happiness/satisfaction"]
          B2b --> B2b1["戈 (gē) - spear"]
          B2b --> B2b2["又 (yòu) - hand"]
          B2b --> B2b3["欠 (qiàn) - duty"]
      
          B --> B3["面包\\nmiànbāo\\nbread"]
          B3 --> B3a["面 - miàn - flour/pasta"]
          B3 --> B3b["包 - bāo - wrap/package"]
          B3b --> B3b1["勹 (bāo) - casing"]
          B3b --> B3b2["巳 (sì) - Snake/rebirth"]
      
      Provide ONLY the Mermaid graph definition, nothing else, be sure to generate a VALID MERMAID DIAGRAM.
      `;

      // Prompt for Explanation Text
      const explanationPrompt = `
You are a tool for explaining phases in chines

**Behaviors and Rules**:

. Translation Format: Strictly adhere to the specified translation format.
. Be concise, clear, and direct; avoid circumlocution or unnecessary repetition; get straight to the point; prioritize readability.
. Be clear when a term is not from HSK1.
. Use bold and italics for emphasis and readability.
. When I ask you for a translation, use the format of the example below:
. Do not answer with text besides the format below

ANSWER FORMAT EXAMPLE:

---

[HANZI]        你好，我的女朋友，今天想吃肉和冰淇淋吗？
[PINYIN]       Nǐ hǎo, wǒ de nǚ péngyou, jīntiān xiǎng chī ròu hé bīngqílín ma?
[LITERAL]   Hello, my girlfriend, want to eat meat and ice cream today?

Breakdown:

- 你好 (nǐ hǎo): Hello [HSK1]
  - 你 = ⺅ (person) + 尔 → "you" as a person
  - 好 = 女 (woman) + 子 (child) → "good" = traditional harmony

- 我的 (wǒ de): My [HSK1]
  - 我 = 手 (hand) + 戈 (spear) → "I" = agent/self
  - 的 = 白 (white) + 勺 (ladle) → used to show possession

- 女朋友 (nǚ péngyou): Girlfriend
  - 女: woman radical
  - 朋 = 月 + 月 → two moons = companionship
  - 友 = 又 (again/hand) + ⺗ (heart) → friendship, goodwill

- 今天 (jīntiān): Today [HSK1]
  - 今 = simplified symbol for "now"
  - 天 = 大 (big) + 一 (one) → vast sky above = day

- 想 (xiǎng): Want/think [HSK1]
  - 想 = 相 (look at) + ⺗ (heart) → feeling and thought combined

- 吃 (chī): Eat [HSK1]
  - 吃 = 口 (mouth) + 乞 (beg) → act of eating

- 肉 (ròu): Meat [HSK1]
  - 肉 = meat/flesh radical (often written like 月 in compounds)

- 和 (hé): And [HSK1]
  - 和 = 禾 (grain) + 口 (mouth) → harmony through shared food

- 冰淇淋 (bīngqílín): Ice cream
  - 冰 = 冫(ice radical) + 水 (water)
  - 淇 = 氵(water) + 其 (phonetic)
  - 淋 = 氵(water) + 林 (forest)
    → all cold/liquid-related, borrowed sounds

- 吗 (ma): Question particle [HSK1]
  - 吗 = 口 (mouth) + 马 (horse) → phonetic use, indicates yes/no question

  --

TASK:

Explain the Chinese phrase "${phrase}" with its pinyin "${pinyin}" following the above rules and format.
Then generate short text showing how to use it in a context.
`;

      try {
        // Fetch Mermaid Chart
        const geminiChartResponse = await getGeminiResponse(chartPrompt);
        if (geminiChartResponse) {
          const cleanedChart = geminiChartResponse
            .replace(/^```mermaid\n/, '')
            .replace(/\\n```$/, '<br>')
            .trim();
          setChart(cleanedChart);
          console.log('MermaidDiagram: Cleaned chart content:', cleanedChart);
        } else {
          setError('Failed to get a valid chart response from Gemini API.');
        }

        // Fetch Explanation Text
        setExplanationLoading(true);
        const geminiExplanationResponse = await getGeminiResponse(explanationPrompt);
        if (geminiExplanationResponse) {
          // Assuming explanation might also come in a markdown block, clean it
          const cleanedExplanation = geminiExplanationResponse
            .trim();
          setExplanation(cleanedExplanation);
          console.log('MermaidDiagram: Cleaned explanation content:', cleanedExplanation);
        } else {
          setExplanationError('Failed to get a valid explanation response from Gemini API.');
        }
      } catch (err: any) {
        setError(`Error fetching content from Gemini: ${err.message}`);
        console.error('Error fetching content from Gemini:', err);
      } finally {
        setLoading(false);
        setExplanationLoading(false);
      }
    };

    generateContent();
  }, [phrase, pinyin]);

  useEffect(() => {
    if (mermaidRef.current && chart) {
      console.log('MermaidDiagram: mermaidRef.current is available, attempting to render chart.');
      console.log('MermaidDiagram: Chart content:', chart);

      // Clear previous content
      mermaidRef.current.innerHTML = '';

      mermaid.initialize({ startOnLoad: false });
      try {
        const uniqueId = `mermaid-chart-${Math.random().toString(36).substr(2, 9)}`;
        mermaid.render(uniqueId, chart).then(({ svg }) => {
          if (mermaidRef.current && svg) {
            mermaidRef.current.innerHTML = svg;
            console.log('MermaidDiagram: Chart rendered successfully.');
          } else {
            console.error('MermaidDiagram: SVG content is empty or mermaidRef.current is null after render.');
          }
        }).catch(error => {
          console.error('MermaidDiagram: Error in mermaid.render promise:', error);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `<p class="${styles.error}">Error rendering diagram: ${error.message}. Please check the Mermaid syntax.</p>`;
          }
        });
      } catch (error: any) {
        console.error('MermaidDiagram: Error rendering Mermaid chart (synchronous):', error);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `<p class="${styles.error}">Error rendering diagram: ${error.message}. Please check the Mermaid syntax.</p>`;
        }
      }
    } else if (!chart) {
      console.log('MermaidDiagram: Chart content is not yet available for rendering.');
    } else {
      console.log('MermaidDiagram: mermaidRef.current is NOT available for rendering.');
    }
  }, [chart]);

  if (loading) {
    return <div className={styles.mermaidContainer}>Loading chart and explanation...</div>;
  }

  if (error) {
    return <div className={clsx(styles.mermaidContainer, styles.error)}>{error}</div>;
  }

  return (
    <div className={styles.mermaidContainer}>
      <div ref={mermaidRef} className={styles.mermaidChart}>
        {/* Mermaid chart will be rendered here */}
      </div>
      {explanationLoading && <div className={styles.explanationContainer}>Loading explanation...</div>}
      {explanationError && <div className={clsx(styles.explanationContainer, styles.error)}>{explanationError}</div>}
      {explanation && !explanationLoading && !explanationError && (
        <div className={styles.explanationContainer}>
          <h3>Explanation:</h3>
          <pre className={styles.explanationText}>{explanation}</pre>
        </div>
      )}
    </div>
  );
};

export default MermaidDiagram;