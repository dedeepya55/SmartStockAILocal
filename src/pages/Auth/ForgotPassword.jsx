import { useState } from "react";
import styles from "./Login.module.css";
import { sendOtp } from "../../api/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setError("");
    if (!email) return setError("Enter your email");

    setLoading(true);
    try {
      const res = await sendOtp({ email });
      alert(res.data.message);
      // redirect to OTP page
      window.location.href = `/otp?email=${email}`;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
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
          <h2 className={styles.title}>Forgot Password</h2>
          <p className={styles.subtitle}>Enter your email to receive an OTP.</p>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button className={styles.loginBtn} onClick={handleSendOtp} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;
