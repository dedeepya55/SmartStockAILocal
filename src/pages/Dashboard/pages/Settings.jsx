import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../DashboardCSS/settings.module.css";
import { changePasswordAPI, addUserAPI } from "../../../api/api";

const Settings = () => {

  const { user } = useOutletContext(); // logged in user

  const [profile, setProfile] = useState({
    name: "",
    email: "",
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

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "worker",
  });

  /* -----------------------------
     Set profile from logged user
  ------------------------------*/
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  /* -----------------------------
     Profile Change
  ------------------------------*/
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  /* -----------------------------
     Password Change
  ------------------------------*/
  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  /* -----------------------------
     Update Password
  ------------------------------*/
  const handlePasswordUpdate = async () => {
    try {

      if (password.new !== password.confirm) {
        alert("New password and confirm password do not match");
        return;
      }

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const res = await changePasswordAPI(
        {
          currentPassword: password.current,
          newPassword: password.new,
          confirmPassword: password.confirm,
        },
        token
      );

      alert(res.data.message);

      setPassword({
        current: "",
        new: "",
        confirm: "",
      });

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Password update failed");
    }
  };

  /* -----------------------------
     Preferences Toggle
  ------------------------------*/
  const handleToggle = (key) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  /* -----------------------------
     New user input
  ------------------------------*/
  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  /* -----------------------------
     Add new user
  ------------------------------*/
  const handleAddUser = async () => {
    try {

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const res = await addUserAPI(newUser, token);

      alert(res.data?.message || "User added successfully");

      setNewUser({
        email: "",
        password: "",
        role: "worker",
      });

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <div className={styles.container}>

      <h2 className={styles.title}>Settings</h2>

      {/* ---------------- Profile ---------------- */}

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
            disabled
          />
        </div>

        <button className={styles.button} onClick={handleSave}>
          Save Profile
        </button>

      </div>

      {/* ---------------- Password ---------------- */}

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

        <button className={styles.button} onClick={handlePasswordUpdate}>
          Update Password
        </button>

      </div>

      {/* ---------------- Preferences ---------------- */}

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

      {/* ---------------- Add Member (Admin Only) ---------------- */}

      {user?.role === "admin" && (

        <div className={styles.card}>

          <h3 className={styles.sectionTitle}>Add New Member</h3>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleNewUserChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleNewUserChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Role</label>
            <select
              name="role"
              value={newUser.role}
              onChange={handleNewUserChange}
            >
              <option value="worker">Worker</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <button className={styles.button} onClick={handleAddUser}>
            Add Member
          </button>

        </div>

      )}

    </div>
  );
};

export default Settings;