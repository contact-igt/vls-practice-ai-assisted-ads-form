"use client";

import { NavbarLink } from "@/constants/navlink";
import React, { useEffect } from "react";
import styles from "./styles.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <>
      <section className={styles.info_section}>
        <div className={`${styles.info_container}`}>
          <div className="container">
            <div className={styles.info_main}>
              <div className="row">
                <div className="col-lg-5 col-md-6 col-12 mb-4 mb-md-0">
                  <div className={styles.info_logo}>
                    <a className={styles.brandlogo} href="/">
                      <img src={"/assets/home/vls_logo.png"} alt="logo" />
                    </a>
                  </div>
                  <p>
                    VLS law academy as a coaching institute for Law graduates
                    assisting them to scale up the Judicial services exams and UGC (Junior
                    research fellowship/ lectureship for law)
                  </p>
                </div>
                <div className="col-lg-2 col-md-3 col-12 mt-3 mt-md-0">
                  <div className={styles.info_link_box}>
                    <h5>Explore</h5>
                    <ul style={{ marginLeft: "0px" }}>
                      {NavbarLink.slice(0, 4).map((i) => (
                        <li className=" footernav  active" key={i?.id}>
                          <a className="" href={i?.link}>
                            {i?.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-lg-2 col-md-3 col-12 mt-3 mt-md-0">
                  <h5>Follow us on</h5>
                  <div className={styles.social_box}>
                    <a
                      href="https://www.youtube.com/@VLSLAWACADEMY"
                      target="_blank"
                      className="sbflex"
                    >
                      <Image
                        src="/assets/home/youtube.png"
                        className="img-fluid yt"
                        width={20}
                        height={20}
                        alt="youtube"
                      />
                      <p>Youtube</p>
                    </a>
                    <a
                      href="https://www.instagram.com/vlslawacademy/"
                      target="_blank"
                      className="sbflex"
                    >
                      <Image
                        src="/assets/home/instagram.png"
                        className="img-fluid insta"
                        width={20}
                        height={20}
                        alt="instagram"
                      />
                      <p>Instagram</p>
                    </a>
                    <a
                      href="https://www.linkedin.com/company/105212369/admin/dashboard/"
                      target="_blank"
                      className="sbflex"
                    >
                      <Image
                        src="/assets/home/linkedin.png"
                        className="img-fluid linked"
                        width={20}
                        height={20}
                        alt="linkedin"
                      />
                      <p>Linkedin</p>
                    </a>
                    <a
                      href="https://www.facebook.com/vlslawacademy"
                      target="_blank"
                      className="sbflex"
                    >
                      <Image
                        src="/assets/home/facebook.png"
                        className="img-fluid face"
                        width={20}
                        height={20}
                        alt="facebook"
                      />
                      <p>Facebook</p>
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-12 mt-3 mt-md-5 mt-lg-0">
                  <div className={styles.info_link_box}>
                    <h5>Contact Us</h5>
                    <a
                      className={styles.address_box}
                      target="_blank"
                      href="https://maps.app.goo.gl/zwL1sgrgFjKqKJKA8"
                    >
                      <Image
                        src="/assets/home/pin.png"
                        className="img-fluid face"
                        width={20}
                        height={20}
                        alt="location-pin"
                      />
                      <p>
                        <span>Address :</span> No. 1910, 2nd Floor, H Block 5th
                        Street, 12th Main Road, Anna Nagar West, Chennai
                      </p>
                    </a>
                    <div
                      className={styles.address_box}
                      style={{ paddingTop: "15px" }}
                    >
                      <Image
                        src="/assets/home/call.png"
                        className="img-fluid face"
                        width={20}
                        height={20}
                        alt="call-icon"
                      />
                      <p>
                        <a href="tel:+919500207811" style={{ color: "inherit", textDecoration: "none" }}>+91 95002 07811</a>,
                        <a href="tel:+919500025216" style={{ color: "inherit", textDecoration: "none" }}> +91 95000 25216</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footer_section}>
            <div className="container">
              <div className="d-md-flex justify-content-between ">
                <p className="text-md-start text-center">
                  &copy; <span id="displayYear"></span>
                  {new Date().getFullYear()} VLS Law Academy. All rights
                  reserved.
                </p>
                <div
                  className={`${styles.footer_terms} text-center text-md-end mt-3 mt-md-0`}
                >
                  <a
                    href="https://www.vlslawacademy.com/terms-and-conditions"
                    target="_blank"
                  >
                    Terms
                  </a>
                  <a
                    href="https://www.vlslawacademy.com/privacy-policy"
                    target="_blank"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.whatsappicon}>
        <a href="http://wa.me/+919500025216" target="blank">
          <Image
            src={"/assets/home/whatsapp.png"}
            width={60}
            height={60}
            alt="whtasapp-logo"
          />
        </a>
      </div>
    </>
  );
};

export default Footer;
