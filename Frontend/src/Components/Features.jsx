const Features=()=>{
  const features = [
    {
      icon: (
        <svg
          className="w-8 h-8 text-cyan-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 4v16m8-8H4"></path>
        </svg>
      ),
      title: "Fast loading",
      desc: "Optimized for speed and seamless experience.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-pink-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 8v4l2 2"></path>
        </svg>
      ),
      title: "Real-time Feedback",
      desc: "Instant code evaluation and results.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-yellow-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <rect width="20" height="14" x="2" y="5" rx="2"></rect>
          <path d="M2 10h20"></path>
        </svg>
      ),
      title: "Creative Design",
      desc: "Modern glassmorphism UI for Gen Z.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-lime-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M5 13l4 4L19 7"></path>
        </svg>
      ),
      title: "Fully Responsive",
      desc: "Works beautifully on all devices.",
    },
  ];
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-gray-700 pt-8 ">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`glass-card feature-card delay-${
              i + 1
            } flex flex-col items-center text-center p-8 `}
            style={{ animationFillMode: "forwards" }}
          >
            <div className="mb-4 hover:scale-125 transition ">{f.icon}</div>
            <h4 className="text-xl font-bold mb-2">{f.title}</h4>
            <p className="text-gray-200">{f.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Features;