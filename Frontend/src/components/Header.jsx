import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiChevronDown,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../store/AuthContext";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Problems", sectionId: "problems" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Features", sectionId: "features" },
  { label: "About", sectionId: "about" },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout, user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const profileBtnRef = useRef();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleSectionClick = (sectionId) => {
    setShowMobileMenu(false);
    if (location.pathname === "/") {
      scrollToSection(sectionId);
    } else {
      navigate("/");
      setTimeout(() => scrollToSection(sectionId), 100);
    }
  };

  const handleLogout = () => {
    const status = confirm("Are you sure you want to logout?");
    const toastId = toast.loading("Logging out...");
    if (status) {
      setTimeout(() => {
        logout();
        navigate("/login");
        toast.dismiss(toastId);
        toast.success("Logged out successfully");
      }, 2000);
    } else {
      toast.dismiss(toastId);
      toast.error("You are logged in");
    }
  };

  useEffect(() => {
    function handleClick(e) {
      if (
        showProfileMenu &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showProfileMenu]);

  useEffect(() => {
    setShowMobileMenu(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

  const renderNavItem = (item, isMobile = false) => {
    const isActive = item.to && location.pathname === item.to;
    const baseClass = isMobile
      ? "flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium"
      : "rounded-xl px-3 py-2 text-sm font-medium";
    const stateClass = isActive
      ? "bg-vibe-elevated text-vibe-text"
      : "text-vibe-subtext hover:bg-vibe-surface hover:text-vibe-text";

    if (item.to) {
      return (
        <Link
          key={item.label}
          to={item.to}
          className={`${baseClass} ${stateClass}`}
        >
          {item.label}
        </Link>
      );
    }

    return (
      <button
        key={item.label}
        type="button"
        onClick={() => handleSectionClick(item.sectionId)}
        className={`${baseClass} ${stateClass} text-left`}
      >
        {item.label}
      </button>
    );
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-vibe-border bg-vibe-background/95">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group flex items-center gap-3 rounded-xl focus-visible:outline-vibe-primary"
            aria-label="CodeVibe home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-vibe-border bg-vibe-surface font-heading text-sm font-bold text-vibe-primary shadow-panel group-hover:border-vibe-primary/60">
              CV
            </span>
            <span className="font-heading text-xl font-bold tracking-normal text-vibe-text">
              CodeVibe
            </span>
          </Link>

          <div className="hidden items-center gap-1 rounded-2xl border border-vibe-border bg-vibe-surface/70 p-1 md:flex">
            {navItems.map((item) => renderNavItem(item))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isLoggedIn ? (
              <div className="relative" ref={profileBtnRef}>
                <button
                  className="flex items-center gap-2 rounded-xl border border-vibe-border bg-vibe-surface px-3 py-2 text-sm font-medium text-vibe-text shadow-panel hover:border-vibe-primary/70 hover:bg-vibe-elevated"
                  type="button"
                  onClick={() => setShowProfileMenu((value) => !value)}
                  aria-haspopup="menu"
                  aria-expanded={showProfileMenu}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-vibe-primary/15 text-vibe-primary">
                    <FiUser size={16} />
                  </span>
                  <span className="max-w-32 truncate">
                    {user?.name || "Profile"}
                  </span>
                  <FiChevronDown
                    size={16}
                    className={
                      showProfileMenu
                        ? "rotate-180 text-vibe-subtext"
                        : "text-vibe-subtext"
                    }
                  />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-48 overflow-hidden rounded-2xl border border-vibe-border bg-vibe-surface p-1 shadow-subtle">
                    <Link
                      to="/profile"
                      className="block rounded-xl px-3 py-2 text-sm text-vibe-subtext hover:bg-vibe-elevated hover:text-vibe-text"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block rounded-xl px-3 py-2 text-sm text-vibe-subtext hover:bg-vibe-elevated hover:text-vibe-text"
                    >
                      Settings
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block rounded-xl px-3 py-2 text-sm text-vibe-subtext hover:bg-vibe-elevated hover:text-vibe-text"
                    >
                      Dashboard
                    </Link>
                    <button
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-vibe-danger hover:bg-vibe-danger/10"
                      onClick={handleLogout}
                      type="button"
                    >
                      <FiLogOut size={15} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-vibe-primary/50 bg-vibe-primary px-4 py-2 text-sm font-semibold text-white shadow-panel hover:bg-vibe-primary/90 focus-visible:outline-vibe-primary"
              >
                <FiLogIn size={16} />
                Login
              </Link>
            )}
          </div>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-vibe-border bg-vibe-surface text-vibe-text hover:bg-vibe-elevated md:hidden"
            type="button"
            onClick={() => setShowMobileMenu((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={showMobileMenu}
          >
            {showMobileMenu ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </nav>

        {showMobileMenu && (
          <div className="border-t border-vibe-border bg-vibe-background px-4 py-4 md:hidden">
            <div className="flex flex-col gap-1 rounded-2xl border border-vibe-border bg-vibe-surface p-2">
              {navItems.map((item) => renderNavItem(item, true))}
              <div className="my-2 h-px bg-vibe-border" />
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-vibe-text hover:bg-vibe-elevated"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-vibe-primary/15 text-vibe-primary">
                      <FiUser size={16} />
                    </span>
                    {user?.name || "Profile"}
                  </Link>
                  <button
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-vibe-danger hover:bg-vibe-danger/10"
                    onClick={handleLogout}
                    type="button"
                  >
                    <FiLogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 rounded-xl bg-vibe-primary px-4 py-3 text-sm font-semibold text-white hover:bg-vibe-primary/90"
                >
                  <FiLogIn size={16} />
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="min-h-screen bg-vibe-background pt-16 text-vibe-text">
        <Outlet />
      </main>
    </>
  );
};

export default Header;
