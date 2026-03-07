import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { loginUser } from "../../api/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ email, password, rememberMe });
      sessionStorage.setItem("token", response.data.token);

      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
        <form className={styles.loginBox} onSubmit={handleSubmit}>
          <h2 className={styles.title}>Welcome to SmartVision AI</h2>
          <p className={styles.subtitle}>Please enter your credentials to access the dashboard.</p>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.options}>
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />{" "}
              Remember me
            </label>
            <button type="button" className={styles.forgot} onClick={() => navigate("/forgot-password")}>
              Forgot password?
            </button>
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;