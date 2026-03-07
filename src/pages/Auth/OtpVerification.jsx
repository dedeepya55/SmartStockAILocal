import { useState } from "react";
import styles from "./Login.module.css";
import { verifyOtp } from "../../api/api";

const OtpVerification = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    setError("");
    if (!otp) return setError("Enter OTP");

    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      alert("OTP verified!");
      window.location.href = `/reset-password?email=${email}`;
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.loginContainer} ${styles.loginSplitContainer}`}>
      <section className={styles.leftPanel}>
        <div className={styles.leftOverlay} />
        <div className={styles.brand}>SmartVision AI</div>
        <div className={styles.leftContent}>
          <h1 className={styles.heroHeading}>
            Precision
            <br />
            Warehouse
            <br />
            Intelligence.
          </h1>
          <p className={styles.heroText}>
            Optimize your inventory with AI-driven demand forecasting, real-time stock monitoring,
            and automated anomaly detection.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <strong>100%</strong>
              <span>REAL-TIME SYNC</span>
            </div>
            <div className={styles.statCard}>
              <strong>1.2M+</strong>
              <span>PRODUCTS TRACKED</span>
            </div>
            <div className={styles.statCard}>
              <strong>99.98%</strong>
              <span>ACCURACY RATE</span>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.rightPanel}>
        <div className={styles.loginBox}>
          <h2 className={styles.title}>Verify OTP</h2>
          <p className={styles.subtitle}>Enter the OTP sent to your email.</p>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputGroup}>
            <label>OTP</label>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          </div>
          <button className={styles.loginBtn} onClick={handleVerifyOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default OtpVerification;
