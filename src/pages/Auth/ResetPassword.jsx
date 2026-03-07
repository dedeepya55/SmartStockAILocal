import { useState } from "react";
import styles from "./Login.module.css";
import { resetPassword } from "../../api/api";

const ResetPassword = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setError("");
    if (!newPassword || !confirmPassword) return setError("Enter both fields");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");

    setLoading(true);
    try {
      const res = await resetPassword({ email, newPassword, confirmPassword });
      alert(res.data.message);
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
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
          <h2 className={styles.title}>Reset Password</h2>
          <p className={styles.subtitle}>Set your new password to continue.</p>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputGroup}>
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className={styles.loginBtn} onClick={handleResetPassword} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ResetPassword;
