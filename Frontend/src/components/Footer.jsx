import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="border-t border-vibe-border bg-vibe-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-xl font-bold text-vibe-text">
            CodeVibe
          </p>
          <p className="mt-2 text-sm text-vibe-subtext">
            Built by Niranjan Alase in Karnataka, India.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-vibe-subtext">
          <a
            href="https://github.com/Niranjan0524/online-Judge"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-vibe-text"
          >
            Contribution
          </a>
          <a
            href="mailto:parthalase05gmali.com@gmail.com"
            className="hover:text-vibe-text"
          >
            Contact
          </a>
          <a
            href="http://niranjanalase.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-vibe-text"
          >
            Portfolio
          </a>
        </nav>

        <div className="flex gap-3">
          <a
            href="https://github.com/Niranjan0524"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-vibe-border bg-vibe-surface text-vibe-subtext hover:border-vibe-primary/60 hover:text-vibe-text"
            aria-label="GitHub"
          >
            <FiGithub size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/niranjan05/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-vibe-border bg-vibe-surface text-vibe-subtext hover:border-vibe-primary/60 hover:text-vibe-text"
            aria-label="LinkedIn"
          >
            <FiLinkedin size={18} />
          </a>
          <a
            href="mailto:parthalase05gmali.com@gmail.com"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-vibe-border bg-vibe-surface text-vibe-subtext hover:border-vibe-primary/60 hover:text-vibe-text"
            aria-label="Email"
          >
            <FiMail size={18} />
          </a>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl text-sm text-vibe-muted">
        Copyright 2025 CodeVibe. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
