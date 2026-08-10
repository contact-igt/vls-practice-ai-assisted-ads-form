import Button from "@/common/Button";
import styles from "./styles.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { programConfig } from "@/constants/Home";

const Response = () => {
  const [userDetail, setUserDetail] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const storedData = localStorage.getItem("PaymentDetails");
      if (storedData) {
        setUserDetail(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Invalid PaymentDetails in localStorage", error);
    }
  }, []);

  if (!mounted) {
    return (
      <section className={`pt-5 mt-5 ${styles.responseSection}`}>
        <div className="container text-center">
          <p>Loading status...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`pt-5 mt-5 ${styles.responseSection}`}>
      <div className="container">
        <div className={`text-center ${styles.responseIcon}`}>
          <Image
            src="/assets/Response/success.png"
            alt="Success Icon"
            width={120}
            height={120}
            priority
          />
        </div>

        <div className={`text-center ${styles.responseInfo}`}>
          <h2 className={styles.successText}>Registration Received!</h2>
          <p className="lead mt-2 mb-4" style={{ color: "#444", fontSize: "1.1rem" }}>
            Thank you for registering your interest in the{" "}
            <strong>Decoding of Practice Masterclass</strong>.
          </p>

          {/* ── Next Steps Info Card ── */}
          <div className={styles.noticeBox}>
            <div className={styles.noticeTitle}>
              📋 What Happens Next?
            </div>
            <div className={styles.stepList}>
              <div className={styles.stepItem}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepText}>
                  <p>
                    <strong>Team Outreach:</strong> Our team will reach out to you shortly via Phone / WhatsApp to confirm your details.
                  </p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepText}>
                  <p>
                    <strong>Payment Confirmation:</strong> After speaking with our team, you can complete the registration fee of <strong>₹{programConfig?.fee || 499}</strong> to confirm your seat for the live masterclass.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Application Summary ── */}
          {userDetail && (
            <div className={styles.summaryBox}>
              <h6 className="fw-bold mb-3 text-muted" style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Your Submitted Details
              </h6>
              {userDetail.name && (
                <p>
                  <strong>Name:</strong> {userDetail.name}
                </p>
              )}
              {userDetail.mobile && (
                <p>
                  <strong>Mobile:</strong> {userDetail.mobile}
                </p>
              )}
              {userDetail.who_are_you && (
                <p>
                  <strong>Role / Profession:</strong> {userDetail.who_are_you}
                </p>
              )}
            </div>
          )}
        </div>

        <div className={`d-flex flex-md-row flex-column justify-content-center gap-3 ${styles.responseCta}`}>
          <Button name={"Back to Home"} link={"/"} icon={"arrow-left"} />
          <Button name={"Contact Support"} link={"tel:+919500207811"} icon={"phone"} />
        </div>
      </div>
    </section>
  );
};

export default Response;