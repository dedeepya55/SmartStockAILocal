import { useState } from "react";
import styles from "../DashboardCSS/settings.module.css";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@smartstock.ai",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    defectAlerts: true,
    darkMode: false,
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleToggle = (key) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Settings</h2>

      {/* Profile Settings */}
      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>Profile Information</h3>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
          />
        </div>

        <button className={styles.button} onClick={handleSave}>
          Save Profile
        </button>
      </div>

      {/* Password Settings */}
      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>Change Password</h3>

        <div className={styles.formGroup}>
          <label>Current Password</label>
          <input
            type="password"
            name="current"
            value={password.current}
            onChange={handlePasswordChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>New Password</label>
          <input
            type="password"
            name="new"
            value={password.new}
            onChange={handlePasswordChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirm"
            value={password.confirm}
            onChange={handlePasswordChange}
          />
        </div>

        <button className={styles.button} onClick={handleSave}>
          Update Password
        </button>
      </div>

      {/* Preferences */}
      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>Preferences</h3>

        <div className={styles.toggleRow}>
          <span>Email Notifications</span>
          <div
            className={`${styles.toggle} ${
              preferences.emailNotifications ? styles.active : ""
            }`}
            onClick={() => handleToggle("emailNotifications")}
          >
            <div className={styles.circle}></div>
          </div>
        </div>

        <div className={styles.toggleRow}>
          <span>Defect Alerts</span>
          <div
            className={`${styles.toggle} ${
              preferences.defectAlerts ? styles.active : ""
            }`}
            onClick={() => handleToggle("defectAlerts")}
          >
            <div className={styles.circle}></div>
          </div>
        </div>

        <div className={styles.toggleRow}>
          <span>Dark Mode</span>
          <div
            className={`${styles.toggle} ${
              preferences.darkMode ? styles.active : ""
            }`}
            onClick={() => handleToggle("darkMode")}
          >
            <div className={styles.circle}></div>
          </div>
        </div>

        <button className={styles.button} onClick={handleSave}>
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default Settings;
