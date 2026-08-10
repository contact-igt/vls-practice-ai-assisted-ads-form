"use client";

import Button from "@/common/Button";
import styles from "./styles.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Title from "@/common/Title";
import { /* HomePage, */ programConfig } from "@/constants/Home"; // HomePage: kept for Razorpay re-enablement
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
  // const [formValues, setFormValues] = useState(null);             // Razorpay: disabled

  const registrationOpen = isRegistrationOpen(programConfig);
  const formTitle = registrationOpen ? "Reserve" : "Join";
  const formSpanTitle = registrationOpen ? "Your Seat" : "Waitlist";
  const formSubtitle = registrationOpen
    ? `Decoding of Practice \u2014 \u20B9${programConfig.fee}`
    : `Decoding of Practice \u2014 ${PRICE_ANNOUNCEMENT_TEXT}`;

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
      attending_aug15: values?.attendingAug15 || "no",
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
        "https://script.google.com/macros/s/AKfycbwVWJGKVgMdl_OJZ0u9tVjlp7eaFLQDKtfVZoM3-y0jImvQWmGEKoh9-3tSIKhQZh4A/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        }
      );
      const text = await res.text();
      console.log("Google Sheet Response:", text);
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

  // eslint-disable-next-line no-unused-vars
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

  // ── Razorpay order + payment flow (COMMENTED OUT — do not remove) ─────────
  /*
  const openRazorpay = async () => {
    if (!formValues) return;

    if (!isRegistrationOpen(programConfig)) {
      await submitWaitlist(formValues);
      return;
    }

    let order;

    try {
      const resp = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: HomePage?.razorpay?.amount }),
        // body: JSON.stringify({ amount: 1 }),
      });

      order = await resp.json();

      if (!resp.ok) {
        router.replace("/error");
        return;
      }
    } catch (error) {
      console.error("Unable to create Razorpay order", error);
      router.replace("/error");
      return;
    }

    if (typeof window === "undefined" || !window.Razorpay) {
      console.error("Razorpay checkout script is not available");
      router.replace("/error");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      // key: "rzp_test_Ss2NFtpJFLRAiw",
      amount: order.amount,
      currency: order.currency,
      name: formValues.name,
      order_id: order.id,
      description: `${HomePage?.razorpay?.title} - \u20B9${HomePage?.razorpay?.amount}`,

      handler: async (response) => {
        if (!response?.razorpay_payment_id) {
          router.replace("/error");
          return;
        }

        setProcessing(true);

        const apiPayload = {
          ...createBasePayload(formValues),
          amount: order?.amount / 100,
          razorpay_order_id: response.razorpay_order_id || "",
          razorpay_payment_id: response.razorpay_payment_id || "",
          razorpay_signature: response.razorpay_signature || "",
          payment_status: "paid",
          captured: response?.captured ? String(response.captured) : "true",
        };

        try {
          await registerUserToDB(apiPayload);
        } catch (err) {
          console.error("Database registration failed after payment:", err);
        }
        await safeSetPaymentDetails(apiPayload);

        const sessionDate =
          programConfig.sessionStatus === "announced" && programConfig.date
            ? programConfig.date
            : "Date to be announced";

        // try {
        //   await handleWhatsappMessage(
        //     `91${formValues.mobile}`,
        //     formValues.name,
        //     programConfig.fee,
        //     "Decoding of Practice - AI-Assisted Legal Practice Masterclass",
        //     sessionDate,
        //     programConfig.mode,
        //     sessionDate
        //   );
        // } catch (error) {
        //   console.error("WhatsApp notification failed after payment", error);
        // }

        const params = new URLSearchParams();
        Object.keys(apiPayload).forEach((key) =>
          params.append(key, apiPayload[key] ?? "")
        );

        const sheetSaved = await handleGoogleSheetForm(params);
        if (!sheetSaved) {
          console.error("Google Sheet registration failed after payment");
        }

        window.location.href = "/thank-you";
      },

      prefill: {
        name: formValues.name,
        contact: formValues.mobile,
      },

      theme: { color: "#b20a0a" },
    };

    const razor = new window.Razorpay(options);

    razor.on("payment.failed", () => {
      router.replace("/error");
    });

    razor.open();
  };
  */

  // ── Formik ────────────────────────────────────────────────────────────────
  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      whoAreYou: "",
      whyJoin: "",
      attendingAug15: "",
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
        .required("Please enter your profession or current role")
        .min(5, "Please write at least 5 characters")
        .max(300, "Must not exceed 300 characters"),
      whyJoin: Yup.string()
        .required("Please share what made you interested")
        .min(10, "Please write at least 10 characters")
        .max(500, "Must not exceed 500 characters"),
      attendingAug15: Yup.string()
        .oneOf(["yes", "no"], "Please select Yes or No")
        .required("Please confirm your attendance on August 15"),
    }),

    onSubmit: async (values) => {
      setProcessing(true);

      const apiPayload = {
        ...createBasePayload(values),
        // amount: 0,                   // Razorpay: kept for re-enablement
        // razorpay_order_id: "",       // Razorpay: kept for re-enablement
        // razorpay_payment_id: "",     // Razorpay: kept for re-enablement
        // razorpay_signature: "",      // Razorpay: kept for re-enablement
        // payment_status: "registered",// Razorpay: kept for re-enablement
        // captured: "",               // Razorpay: kept for re-enablement
      };

      // DB registration — commented out, re-enable when backend is active
      // try {
      //   await registerUserToDB(apiPayload);
      // } catch (err) {
      //   console.error("Database registration failed:", err);
      // }

      // localStorage — commented out, re-enable when needed
      // await safeSetPaymentDetails(apiPayload);

      // ── Google Sheet submission (active) ─────────────────────────────────
      const params = new URLSearchParams();
      Object.keys(apiPayload).forEach((key) =>
        params.append(key, apiPayload[key] ?? "")
      );

      const sheetSaved = await handleGoogleSheetForm(params);
      if (!sheetSaved) {
        console.error("Google Sheet submission failed");
      }

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

          {/* ── Profession / Role ── */}
          <div className={styles.inputgrp}>
            <label>
              Your Profession / Current Role
              <span style={{ color: "#b20a0a", marginLeft: "2px" }}>*</span>
            </label>
            <textarea
              className={`form-control ${styles.textareafield}`}
              placeholder="e.g. Advocate, Law Student, Legal Professional, In-House Counsel..."
              rows={2}
              name="whoAreYou"
              value={formik.values.whoAreYou}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className={styles.charcount}>
              {formik.values.whoAreYou.length}/300
            </div>
            {formik.touched.whoAreYou && formik.errors.whoAreYou && (
              <small style={{ fontSize: "12px", color: "#dc3545" }}>
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

          {/* ── Attendance Confirmation — Aug 15 ── */}
          <div className={`${styles.inputgrp} ${styles.checkboxgrp}`}>
            <p className={styles.checkboxlabel} style={{ marginBottom: "12px" }}>
              Will you be attending the live session on{" "}
              <strong>Saturday, 15 August 2026?</strong>
              <span style={{ color: "#b20a0a", marginLeft: "2px" }}>*</span>
            </p>
            <div className={styles.radioGroup}>
              <label className={`${styles.radioOption} ${formik.values.attendingAug15 === "yes" ? styles.radioSelected : ""
                }`}>
                <input
                  type="radio"
                  name="attendingAug15"
                  value="yes"
                  checked={formik.values.attendingAug15 === "yes"}
                  onChange={() => formik.setFieldValue("attendingAug15", "yes")}
                  onBlur={formik.handleBlur}
                />
                <span>✔ Yes, I will attend</span>
              </label>
              <label className={`${styles.radioOption} ${formik.values.attendingAug15 === "no" ? styles.radioSelectedNo : ""
                }`}>
                <input
                  type="radio"
                  name="attendingAug15"
                  value="no"
                  checked={formik.values.attendingAug15 === "no"}
                  onChange={() => formik.setFieldValue("attendingAug15", "no")}
                  onBlur={formik.handleBlur}
                />
                <span>✖ No, I cannot attend</span>
              </label>
            </div>
            {formik.touched.attendingAug15 && formik.errors.attendingAug15 && (
              <small style={{ fontSize: "12px", color: "#dc3545", display: "block", marginTop: "6px" }}>
                {formik.errors.attendingAug15}
              </small>
            )}
          </div>

          {/* ── Submit ── */}
          <div className={`mt-4 d-md-flex justify-content-center`}>
            <Button
              name={registrationOpen ? "REGISTER NOW — 15 AUG" : "JOIN WAITLIST"}
              type={"submit"}
              disabled={processing}
            />
          </div>
        </form>
      </div>

      {/* ── Razorpay Instruction Popup (COMMENTED OUT — do not remove) ── */}
      {/*
      <Popup open={instructionOpen} onClose={() => setInstructionOpen(false)}>
        <div className={styles.loadingPopup}>
          <h4>{'\u26A0\uFE0F'} Important Payment Instruction</h4>

          <h6>
            After completing the payment, please wait until you are redirected
            to the success page. Do not close or refresh this page.
          </h6>

          <p className="text-danger fw-semibold mt-2">
            If you close or refresh this page during payment, your registration
            details may not be recorded.
          </p>

          <div className="form-check mt-3 d-flex justify-content-center gap-2">
            <input
              type="checkbox"
              className="form-check-input custom-red-checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              id="agree"
            />
            <label
              className="form-check-label text-danger fw-bold"
              htmlFor="agree"
              style={{ fontSize: "14px", marginTop: "2px" }}
            >
              I understand and agree.
            </label>
          </div>

          <div
            className={`d-flex flex-md-row flex-column flex-column-reverse gap-3 mt-4 ${styles.instructionbtn}`}
          >
            <button
              className="btn btn-secondary"
              onClick={() => setInstructionOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              disabled={!agree}
              onClick={() => {
                setInstructionOpen(false);
                openRazorpay();
              }}
            >
              I Agree & Pay
            </button>
          </div>
        </div>
      </Popup>
      */}

      {/* ── Processing Popup ── */}
      <Popup open={processing} closeOnOutsideClick={false}>
        <div className={styles.loadingPopup}>
          <h4>
            {'\u26A0\uFE0F'}{" "}
            Submitting Your Registration...
          </h4>
          <p>Please wait. Do not close or refresh this page.</p>
        </div>
      </Popup>
    </>
  );
};

export default ContactForm;