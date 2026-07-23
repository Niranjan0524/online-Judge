import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { IoCopy, IoCopyOutline } from "react-icons/io5";

const CodeBlock = ({ code, language }) => {
  const [copied, setCopy] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-vibe-border bg-vibe-background">
      <button
        onClick={copyToClipboard}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-vibe-border bg-vibe-surface text-vibe-subtext hover:border-vibe-primary/60 hover:text-vibe-text"
        type="button"
        aria-label="Copy code"
      >
        {copied ? <IoCopy /> : <IoCopyOutline />}
      </button>
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          background: "#09090B",
          padding: "18px",
          paddingTop: "48px",
          fontFamily: "JetBrains Mono",
          margin: 0,
          border: "none",
          fontSize: "13px",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
