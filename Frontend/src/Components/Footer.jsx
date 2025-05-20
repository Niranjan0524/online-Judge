const Footer=()=>{
  return (
    <>
      <footer id="about" className="mt-10 py-10 px-4 bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#1e293b] rounded-t-3xl shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-8">
        
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-gray-400 to-yellow-400">
                CodeVibe
              </span>
              <span className="text-gray-400 text-sm">by</span>
              <span className="font-semibold text-cyan-400">
                Niranjan Alase
              </span>
            </div>
            <span className="text-gray-400 text-sm">Karnataka ,India</span>
            <a
              href="http://niranjanalase.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 text-sm text-yellow-400 hover:text-yellow-300 transition no-underline hover:no-underline rounded-full bg-gray-800 px-4 py-2 shadow-md hover:shadow-lg "
            >
              Know More About Me
            </a>
          </div>
         
          <div className="flex flex-col md:flex-row gap-6 text-center">
            <a
              href="https://github.com/Niranjan0524/online-Judge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-cyan-400 transition font-medium"
            >
              Contribution
            </a>
            <a
              href="mailto:parthalase05gmali.com@gmail.com"
              className="text-gray-300 hover:text-pink-400 transition font-medium"
            >
              Contact
            </a>

            <a
              href="https://www.linkedin.com/in/niranjan05/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-400 transition font-medium"
            >
              LinkedIn
            </a>
          </div>
          {/* Right: Socials */}
          <div className="flex gap-4 justify-center md:justify-end">
            <a
              href="https://github.com/Niranjan0524"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-125 transition"
              aria-label="GitHub"
            >
              <svg
                className="w-6 h-6 text-gray-400 hover:text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0112 6.84c.85.004 1.7.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48C19.13 20.54 22 16.74 22 12.26 22 6.58 17.52 2 12 2z" />
              </svg>
            </a>
            <a
              href="https://twitter.com/your-twitter"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-125 transition"
              aria-label="Twitter"
            >
              <svg
                className="w-6 h-6 text-gray-400 hover:text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.46 6c-.77.35-1.6.59-2.46.7a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.29 3.9A12.13 12.13 0 013 4.8a4.28 4.28 0 001.32 5.71c-.7-.02-1.36-.21-1.94-.53v.05a4.28 4.28 0 003.43 4.19c-.33.09-.68.14-1.04.14-.25 0-.5-.02-.74-.07a4.29 4.29 0 004 2.98A8.6 8.6 0 012 19.54a12.13 12.13 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.72 8.72 0 0024 4.59a8.48 8.48 0 01-2.54.7z" />
              </svg>
            </a>
            <a
              href="mailto:parthalase05gmali.com@gmail.com"
              className="hover:scale-125 transition"
              aria-label="Email"
            >
              <svg
                className="w-6 h-6 text-gray-400 hover:text-pink-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 7l10 6 10-6" />
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          &copy; 2025 CodeVibe. All rights reserved.
        </div>
      </footer>
    </>
  );
}

export default Footer;