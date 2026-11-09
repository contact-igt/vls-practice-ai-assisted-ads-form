import React from "react";
import styles from "./styles.module.css";
import { programConfig } from "@/constants/Home";
import {
  getPrimaryCtaText,
  getSessionDisplay,
  isRegistrationOpen,
} from "@/utils/programStatus";

const RegisterSticky = ({ scrollToContactForm }) => {
  const registrationOpen = isRegistrationOpen(programConfig);
  const sessionDisplay = getSessionDisplay(programConfig);
  const ctaText = getPrimaryCtaText(programConfig);

  if (!registrationOpen) {
    return (
      <div
        className={styles.waitlistSticky}
        role="complementary"
        aria-label="Join waitlist"
      >
        <div className={styles.waitlistTitle}>
          Decoding of Practice - AI-Assisted Legal Practice Masterclass
        </div>
        <button
          type="button"
          onClick={scrollToContactForm}
          className={styles.waitlistButton}
          aria-label={ctaText}
        >
          {ctaText}
        </button>
      </div>
    );
  }

  return (
    <div
      className={styles.registrationSticky}
      role="complementary"
      aria-label="Quick registration"
    >
      <div className={styles.registrationTitle}>
        <h4>Decoding of Practice - AI-Assisted Legal Practice Masterclass</h4>
        <p>{sessionDisplay}</p>
      </div>
      <div className={styles.registrationActions}>
        {Boolean(programConfig.fee) && (
          <div
            className={styles.priceWrap}
            aria-label={`Price INR ${programConfig.fee}`}
          >
            <p className={styles.pricing}>
              <strong>{`INR \u20B9${programConfig.fee}`}</strong>
            </p>
            <p className={styles.mobilePricing}>
              <strong>{`INR \u20B9${programConfig.fee}`}</strong>
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={scrollToContactForm}
          className={styles.registrationButton}
          aria-label={ctaText}
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
};

export default RegisterSticky;