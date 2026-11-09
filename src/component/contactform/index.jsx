"use client";

import Button from "@/common/Button";
import styles from "./styles.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Title from "@/common/Title";
import { HomePage, programConfig } from "@/constants/Home";
// import { useRouter } from "next/router"; // Razorpay: disabled — re-enable when Razorpay is active
import { useState } from "react";
import { Popup } from "@/common/Popup";
import { AcademyRegisterQuery } from "@/hooks/useAcademyTrainingQuery";
import {
  PRICE_ANNOUNCEMENT_TEXT,
  isRegistrationOpen,
} from "@/utils/programStatus";

const ContactForm = ({ ipAddress }) => {
  // const router = useRouter(); // Razorpay: disabled — re-enable when Razorpay is active
  const { mutate: registerMutate } = AcademyRegisterQuery();

  // const [instructionOpen, setInstructionOpen] = useState(false); // Razorpay: disabled
  // const [agree, setAgree] = useState(false);                     // Razorpay: disabled
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  // const [formValues, setFormValues] = useState(null);             // Razorpay: disabled

  const registrationOpen = isRegistrationOpen(programConfig);
  const formTitle = registrationOpen ? "Reserve" : "Join";
  const formSpanTitle = registrationOpen ? "Your Seat" : "Waitlist";
  const formSubtitle = "Decoding of Practice";

  const getUTM = (key) => {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem(key) || "";
    } catch {
      return "";
    }
  };

  const getProgramDate = () =>
    isRegistrationOpen(programConfig) && programConfig.date
      ? programConfig.date
      : "TBA";

  const createBasePayload = (values) => {
    const rawMobile = values?.mobile || "";
    const cleanMobile = rawMobile.replace(/\D/g, "").replace(/^91/, "").slice(-10);

    return {
      form_type: "ads_lead",
      name: values?.name?.trim() || "",
      mobile: cleanMobile ? `+91${cleanMobile}` : "",
      who_are_you: values?.whoAreYou?.trim() || "",
      why_join: values?.whyJoin?.trim() || "",
      attending: values?.attending || "no",
      programm_date: getProgramDate(),
      page_name: programConfig.pageName || "decoding-of-practice",
      ip_address: ipAddress || "",
      client_key: "vls_law",
      utm_source: getUTM("utm_source"),
      utm_medium: getUTM("utm_medium"),
      utm_campaign: getUTM("utm_campaign"),
      utm_term: getUTM("utm_term"),
      utm_content: getUTM("utm_content"),
    };
  };

  // ── Google Sheet submission (active) ──────────────────────────────────────
  const handleGoogleSheetForm = async (formData, retries = 3, delay = 1500) => {
    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbyXBhBQtwFuyJeTAdzcDb5DOEVylSdbgBHw5yASMEjSdWhc1BwqN8c5LAdW-v-YaNKp/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        }
      );
      await res.text();
      if (res.ok) {
        return true;
      }
      throw new Error("Sheet responded with non-OK");
    } catch (err) {
      console.error(
        `Google Sheet attempt failed. Retries left: ${retries}, err `
      );
      if (retries <= 1) {
        console.error("Google Sheet failed permanently!");
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      return handleGoogleSheetForm(formData, retries - 1, delay);
    }
  };

  const safeSetPaymentDetails = async (data) => {
    if (typeof window === "undefined") return;
    try {
      const safeData = JSON.stringify(data);
      localStorage.setItem("PaymentDetails", safeData);
    } catch (error) {
      console.error("Failed to store PaymentDetails:", error);
    }
  };

  // ── DB registration (kept, not removed) ───────────────────────────────────
  // eslint-disable-next-line no-unused-vars
  const registerUserToDB = (payload) =>
    new Promise((resolve, reject) => {
      registerMutate(
        { value: payload },
        {
          onSuccess: resolve,
          onError: reject,
        }
      );
    });

  // ── WhatsApp helper (kept, not removed) ───────────────────────────────────
  // eslint-disable-next-line no-unused-vars
  const handleWhatsappMessage = async (
    phone,
    name,
    amount,
    program,
    schedule,
    platform,
    date
  ) => {
    await fetch("/api/sendWhatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        name,
        amount,
        programm_name: program,
        schedule,
        platform,
        link_date: date,
      }),
    });
  };

  // ── Razorpay order + payment flow ─────────────────────────────────────────
  const openRazorpay = async (values) => {
    setPaymentError("");
    setProcessing(true);

    let order;
    try {
      const resp = await fetch("/api/create-order", { method: "POST" });
      order = await resp.json();
      if (!resp.ok || !order?.id) throw new Error("Order creation failed");
    } catch (error) {
      console.error("Unable to create Razorpay order", error);
      setProcessing(false);
      setPaymentError("Unable to start the payment. Please try again.");
      return;
    }

    if (typeof window === "undefined" || !window.Razorpay) {
      setProcessing(false);
      setPaymentError("Payment service did not load. Please refresh and try again.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "VLS Law Academy",
      order_id: order.id,
      description: `${HomePage?.razorpay?.title} - ₹${programConfig.fee}`,

      handler: async (response) => {
        setProcessing(true);

        let verified = false;
        try {
          const verifyResp = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          verified = (await verifyResp.json())?.verified === true;
        } catch (err) {
          console.error("Payment verification request failed:", err);
        }

        const apiPayload = {
          ...createBasePayload(values),
          amount: order.amount / 100,
          razorpay_order_id: response.razorpay_order_id || order.id,
          razorpay_payment_id: response.razorpay_payment_id || "",
          razorpay_signature: response.razorpay_signature || "",
          payment_status: verified ? "paid" : "paid_unverified",
        };

        await safeSetPaymentDetails(apiPayload);

        const params = new URLSearchParams();
        Object.keys(apiPayload).forEach((key) =>
          params.append(key, apiPayload[key] ?? "")
        );

        const sheetSaved = await handleGoogleSheetForm(params);
        if (!sheetSaved) {
          console.error("Google Sheet registration failed after payment");
        }

        // Payment succeeded — always land on the thank-you page.
        window.location.href = "/thank-you";
      },

      prefill: {
        name: values.name,
        contact: `+91${values.mobile}`,
      },

      modal: {
        ondismiss: () => {
          setProcessing(false);
          setPaymentError("Payment was not completed. Please try again to confirm your seat.");
        },
      },

      theme: { color: "#b20a0a" },
    };

    const razor = new window.Razorpay(options);
    razor.on("payment.failed", () => {
      setProcessing(false);
      setPaymentError("Payment failed. Please try again.");
    });

    setProcessing(false); // hide our overlay while Razorpay checkout is open
    razor.open();
  };

  // ── Formik ────────────────────────────────────────────────────────────────
  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      whoAreYou: "",
      whyJoin: "",
      attending: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required")
        .matches(
          /^[a-zA-Z\s'.]*$/,
          "Name can only contain letters, spaces, dots and apostrophes"
        )
        .max(100, "Name must not exceed 100 characters"),
      mobile: Yup.string()
        .required("Mobile number is required")
        .matches(
          /^[6-9][0-9]{9}$/,
          "Enter a valid 10-digit mobile number"
        ),
      whoAreYou: Yup.string()
        .required("Please select your current profession"),
      whyJoin: Yup.string()
        .required("Please share what made you interested")
        .min(10, "Please write at least 10 characters")
        .max(500, "Must not exceed 500 characters"),
      attending: Yup.string()
        .oneOf(["yes", "no"], "Please select Yes or No")
        .required("Please confirm your attendance"),
    }),

    onSubmit: async (values) => {
      if (registrationOpen) return openRazorpay(values);

      // Waitlist mode — no payment, just record the lead.
      setProcessing(true);
      const apiPayload = { ...createBasePayload(values), payment_status: "waitlist" };
      await safeSetPaymentDetails(apiPayload);
      const params = new URLSearchParams();
      Object.keys(apiPayload).forEach((key) =>
        params.append(key, apiPayload[key] ?? "")
      );
      await handleGoogleSheetForm(params);
      window.location.href = "/thank-you";
    },
  });

  return (
    <>
      <div className={styles?.formcardbottom} id="contact_form">
        <form
          id="contactForm"
          className="contact-form"
          onSubmit={formik.handleSubmit}
        >
          <div className={styles.formtitle}>
            <Title
              title1={formTitle}
              spantitle={formSpanTitle}
              subtitle={formSubtitle}
            />
          </div>

          {/* ── Name ── */}
          <div className={styles.inputgrp}>
            <label>
              Name<span style={{ color: "#b20a0a", marginLeft: "2px" }}>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Your full name"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name && (
              <small style={{ fontSize: "12px", color: "#dc3545" }}>
                {formik.errors.name}
              </small>
            )}
          </div>

          {/* ── Phone Number ── */}
          <div className={styles.inputgrp}>
            <label>
              Phone Number<span style={{ color: "#b20a0a", marginLeft: "2px" }}>*</span>
            </label>
            <div className="position-relative">
              <input
                type="text"
                className={`${styles.inputmobile} form-control`}
                placeholder="10-digit mobile number"
                name="mobile"
                value={formik.values.mobile}
                onChange={(e) => {
                  const cleaned = e.target.value
                    .replace(/\D/g, "")
                    .replace(/^91/, "")
                    .slice(0, 10);
                  formik.setFieldValue("mobile", cleaned);
                }}
                onBlur={formik.handleBlur}
              />
              <input
                className={`${styles.inputmobilecode} form-control position-absolute`}
                readOnly
                value={"+91"}
              />
            </div>
            {formik.touched.mobile && formik.errors.mobile && (
              <small style={{ fontSize: "12px", color: "#dc3545" }}>
                {formik.errors.mobile}
              </small>
            )}
          </div>

          {/* ── Profession ── */}
          <div className={styles.inputgrp}>
            <label>
              Your Current Profession
              <span style={{ color: "#b20a0a", marginLeft: "2px" }}>*</span>
            </label>
            <select
              className={`form-select ${styles.selectfield}`}
              name="whoAreYou"
              value={formik.values.whoAreYou}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" disabled>Select your profession</option>
              <option value="Law Student">Law Student</option>
              <option value="Advocate">Advocate</option>
              <option value="Legal Professional">Legal Professional</option>
              <option value="Judiciary Aspirant">Judiciary Aspirant</option>
              <option value="In-House Counsel">In-House Counsel</option>
              <option value="Other">Other</option>
            </select>
            {formik.touched.whoAreYou && formik.errors.whoAreYou && (
              <small style={{ fontSize: "12px", color: "#dc3545", display: "block", marginTop: "4px" }}>
                {formik.errors.whoAreYou}
              </small>
            )}
          </div>

          {/* ── Why Interested ── */}
          <div className={styles.inputgrp}>
            <label>
              What made you interested in this masterclass?
              <span style={{ color: "#b20a0a", marginLeft: "2px" }}>*</span>
            </label>
            <textarea
              className={`form-control ${styles.textareafield}`}
              placeholder="e.g. I want to learn how AI can assist in legal drafting and improve my practice efficiency..."
              rows={2}
              name="whyJoin"
              value={formik.values.whyJoin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className={styles.charcount}>
              {formik.values.whyJoin.length}/500
            </div>
            {formik.touched.whyJoin && formik.errors.whyJoin && (
              <small style={{ fontSize: "12px", color: "#dc3545" }}>
                {formik.errors.whyJoin}
              </small>
            )}
          </div>

          {/* ── Attendance Confirmation — Nov 15 ── */}
          <div className={`${styles.inputgrp} ${styles.checkboxgrp}`}>
            <p className={styles.checkboxlabel} style={{ marginBottom: "12px" }}>
              Will you be able to attend the live session on{" "}
              <strong>{programConfig.date}?</strong>
              <span style={{ color: "#b20a0a", marginLeft: "2px" }}>*</span>
            </p>
            <div className={styles.radioGroup}>
              <label className={`${styles.radioOption} ${formik.values.attending === "yes" ? styles.radioSelected : ""
                }`}>
                <input
                  type="radio"
                  name="attending"
                  value="yes"
                  checked={formik.values.attending === "yes"}
                  onChange={() => formik.setFieldValue("attending", "yes")}
                  onBlur={formik.handleBlur}
                />
                <span>✔ Yes, I will attend</span>
              </label>
              <label className={`${styles.radioOption} ${formik.values.attending === "no" ? styles.radioSelectedNo : ""
                }`}>
                <input
                  type="radio"
                  name="attending"
                  value="no"
                  checked={formik.values.attending === "no"}
                  onChange={() => formik.setFieldValue("attending", "no")}
                  onBlur={formik.handleBlur}
                />
                <span>✖ No, I cannot attend</span>
              </label>
            </div>
            {formik.touched.attending && formik.errors.attending && (
              <small style={{ fontSize: "12px", color: "#dc3545", display: "block", marginTop: "6px" }}>
                {formik.errors.attending}
              </small>
            )}
          </div>

          {/* ── Submit ── */}
          {paymentError && (
            <small style={{ fontSize: "13px", color: "#dc3545", display: "block", marginTop: "8px", textAlign: "center" }}>
              {paymentError}
            </small>
          )}
          <div className={`mt-4 d-md-flex justify-content-center`}>
            <Button
              name={registrationOpen ? `PAY ₹${programConfig.fee} & REGISTER` : "JOIN WAITLIST"}
              type={"submit"}
              disabled={processing}
            />
          </div>
        </form>
      </div>

      {/* ── Processing Popup ── */}
      <Popup open={processing} closeOnOutsideClick={false}>
        <div className={styles.loadingPopup}>
          <h4>
            {'\u26A0\uFE0F'}{" "}
            Processing Your Payment...
          </h4>
          <p>Please wait. Do not close or refresh this page.</p>
        </div>
      </Popup>
    </>
  );
};

export default ContactForm;