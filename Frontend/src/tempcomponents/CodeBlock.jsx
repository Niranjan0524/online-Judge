import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"; // Change to dracula
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // Change to atomDark
import { IoCopyOutline } from "react-icons/io5";
import { IoCopy } from "react-icons/io5";
import { useState } from "react";

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
    <div style={{ position: "relative" }}>
      <button
        onClick={copyToClipboard}
        style={{
          position: "absolute",
          top: "5px",
          right: "2px",
          marginRight: "15px",
          marginTop: "5px",
          background: "none",
          border: "none",
        }}
      >
        {copied ? <IoCopy /> : <IoCopyOutline />}
      </button>
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          background: "#1e1e1e", // Custom background
          padding: "15px", // Inner padding
          fontFamily: "Consolas",
          margin: " 15px 0px",
          border: "1px solid gray",
        }}
      >
        {code}
        {language}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
