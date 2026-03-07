import styles from "./DashboardCSS/MainContent.module.css";

const MainContent = () => {
  return (
    <div className={styles.main}>
      <h2>Dashboard</h2>

      <div className={styles.card}>
        <p>Inventory Products will appear here</p>
        {/* Later → ProductTable */}
      </div>
    </div>
  );
};

export default MainContent;
