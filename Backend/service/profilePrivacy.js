const jwt = require("jsonwebtoken");

const VISIBILITY_OPTIONS = ["public", "private"];

const DEFAULT_PROFILE_PRIVACY = {
  publicProfile: "public",
  solvedProblems: "public",
  submissionHistory: "public",
  contestHistory: "public",
};

const normalizeProfilePrivacy = (privacySettings = {}) => {
  return Object.keys(DEFAULT_PROFILE_PRIVACY).reduce((settings, key) => {
    settings[key] = VISIBILITY_OPTIONS.includes(privacySettings[key])
      ? privacySettings[key]
      : DEFAULT_PROFILE_PRIVACY[key];
    return settings;
  }, {});
};

const validateProfilePrivacy = (privacySettings = {}) => {
  const errors = [];

  Object.keys(privacySettings).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(DEFAULT_PROFILE_PRIVACY, key)) {
      errors.push(`${key} is not a supported privacy setting`);
      return;
    }

    if (!VISIBILITY_OPTIONS.includes(privacySettings[key])) {
      errors.push(`${key} privacy must be public or private`);
    }
  });

  return errors;
};

const getViewerIdFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return null;
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    return id || null;
  } catch (error) {
    return null;
  }
};

const isProfileOwner = (profileUserId, viewerId) => {
  return Boolean(viewerId && profileUserId.toString() === viewerId.toString());
};

const canViewProfileSection = (privacySettings, section, isOwner) => {
  if (isOwner) {
    return true;
  }

  const normalizedSettings = normalizeProfilePrivacy(privacySettings);
  return normalizedSettings[section] === "public";
};

module.exports = {
  DEFAULT_PROFILE_PRIVACY,
  normalizeProfilePrivacy,
  validateProfilePrivacy,
  getViewerIdFromRequest,
  isProfileOwner,
  canViewProfileSection,
};
