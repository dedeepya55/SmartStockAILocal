import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import styles from "./DashboardCSS/Dashboard.module.css";
import { fetchNotifications } from  "../../api/api";
import SmartStockChatbot from "./Chatbot/SmartStockChatbot";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
    const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetch = () => {
      if (token) fetchNotifications(token).then(setNotifications);
    };

    fetch(); // initial fetch
    const interval = setInterval(fetch, 100000); // every 5 seconds
    return () => clearInterval(interval); // cleanup
  }, [token]);


  return (
    <div className={styles.dashboardLayout}>
      <Topbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        search={search}
        setSearch={setSearch}
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <div className={styles.body}>
        <Sidebar sidebarOpen={sidebarOpen} />
        <div className={styles.contentArea}>
          <Outlet context={{ search }} />
        </div>
      </div>
      <SmartStockChatbot />

    </div>
  );
};

export default Dashboard;
