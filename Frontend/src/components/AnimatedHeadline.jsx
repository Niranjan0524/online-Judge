

const words = [
  { text: "Responsive", color: "text-red-600" },
  { text: "Online", color: "text-yellow-500" },
  { text: "Judge", color: "text-yellow-500" },
];

const AnimatedHeadline = () => {
  

  return (
    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex flex-wrap gap-x-3">
      {words.map((w, i) => (
        <span
          key={w.text}
          className={`animated-word delay-${i + 1} ${w.color} drop-shadow-lg`}
          style={{ opacity:1}}
        >
          {w.text}
        </span>
      ))}
    </h1>
  );
};

export default AnimatedHeadline;
