export const PRICE_ANNOUNCEMENT_TEXT = "Price will be announced shortly.";
export const DATE_TIME_ANNOUNCEMENT_TEXT =
  "Date and time will be announced shortly.";

export const isRegistrationOpen = (programConfig) => {
  if (programConfig?.sessionStatus !== "announced") return false;
  if (!programConfig?.classStartAt) return false;

  const classStartDate = new Date(programConfig.classStartAt);

  if (Number.isNaN(classStartDate.getTime())) return false;

  return new Date() < classStartDate;
};

export const isWaitlistMode = (programConfig) => {
  return !isRegistrationOpen(programConfig);
};

export const getPrimaryCtaText = (programConfig) => {
  return isRegistrationOpen(programConfig) ? "Register Here" : "Join Waitlist";
};

export const getSectionCtaText = (programConfig, fallback = "Register Now") => {
  return isRegistrationOpen(programConfig) ? fallback : "Join Waitlist";
};

export const getSessionDisplay = (programConfig) => {
  if (!isRegistrationOpen(programConfig)) return DATE_TIME_ANNOUNCEMENT_TEXT;

  if (programConfig?.sessionStatus === "announced" && programConfig?.date) {
    return programConfig?.time
      ? `${programConfig.date} - ${programConfig.time}`
      : programConfig.date;
  }

  return DATE_TIME_ANNOUNCEMENT_TEXT;
};