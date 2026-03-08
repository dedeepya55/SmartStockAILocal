import { useState, useEffect, useRef } from "react";
import styles from "./DashboardCSS/Topbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faMagnifyingGlass,
  faUser,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import {
  deleteNotification,
  fetchNotifications,
  getProfileAPI,
  updateProfileImageAPI
} from "../../api/api";

const Topbar = ({
  sidebarOpen,
  setSidebarOpen,
  search,
  setSearch,
  notifications,
  setNotifications,
    setUser
}) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  /* ================= PROFILE ================= */

  // Auto fetch profile on mount
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const data = await getProfileAPI(token);
        setProfileData(data);
        if (setUser) setUser(data);
      } catch (err) {
        console.error("Profile load failed");
      }
    };

    fetchProfile();
  }, [token]);

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  const handleProfileImageUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const data = await updateProfileImageAPI(formData, token);
      setProfileData(data);
    } catch (err) {
      console.error("Upload failed");
    }
  };

  /* ================= NOTIFICATIONS ================= */

  useEffect(() => {
    if (!token) return;

    const getNotifications = async () => {
      try {
        const data = await fetchNotifications(token);
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    getNotifications();

    const interval = setInterval(() => {
      getNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [token, setNotifications]);

  const handleBellClick = async () => {
    setShowNotifications(!showNotifications);

    if (!showNotifications) {
      try {
        const latest = await fetchNotifications(token);
        setNotifications(latest);
      } catch (err) {
        console.error("Fetch failed");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id, token);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete failed");
    }
  };

  /* ================= CLICK OUTSIDE ================= */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.topbar}>
      {/* LEFT SIDE */}
      <div className={styles.left}>
        <h2 className={styles.logo}>SmartStock AI</h2>

        <div
          className={styles.toggleButton}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FontAwesomeIcon
            icon={sidebarOpen ? faAngleLeft : faAngleRight}
          />
        </div>

        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search by SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className={styles.searchIcon}
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.right}>
        {/* NOTIFICATIONS */}
        <div
          className={styles.notificationWrapper}
          ref={notificationRef}
        >
          <div
            className={styles.notification}
            onClick={handleBellClick}
          >
            <FontAwesomeIcon icon={faBell} />
            {notifications.length > 0 && (
              <span className={styles.badge}>
                {notifications.length}
              </span>
            )}
          </div>

          {showNotifications && (
            <div className={styles.notificationDropdown}>
              {notifications.length === 0 ? (
                <p className={styles.empty}>No Notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={styles.notificationItem}
                  >
                    <span>{n.message}</span>
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => handleDelete(n._id)}
                      className={styles.deleteIcon}
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div className={styles.profileWrapper} ref={profileRef}>
          <span
            className={styles.user}
            onClick={handleProfileClick}
          >
            {profileData?.profileImage ? (
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${profileData.profileImage}`}
                alt="profile"
                className={styles.avatar}
              />
            ) : (
              <FontAwesomeIcon icon={faUser} />
            )}
          </span>

          {showProfile && profileData && (
            <div className={styles.profileDropdown}>
              <div className={styles.profileHeader}>
                <img
                  src={
                    profileData.profileImage
                        ? `${import.meta.env.VITE_BACKEND_URL}${profileData.profileImage}`
                      : "https://via.placeholder.com/80"
                  }
                  alt="profile"
                  className={styles.profileImage}
                />
                <div>
                  <h4>{profileData.email}</h4>
                  <p>{profileData.role}</p>
                </div>
              </div>

              <p className={styles.role}>
                <strong>Role:</strong> {profileData.role}
              </p>

              <label className={styles.uploadLabel}>
                Change Profile Picture
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    handleProfileImageUpload(e.target.files[0])
                  }
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
