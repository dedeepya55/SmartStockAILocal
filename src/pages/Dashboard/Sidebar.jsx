import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faWarehouse,
  faBorderAll,
  faQrcode,
  faCartArrowDown,
  faTruckFast,
  faChartColumn,
  faGear,
  faCircleQuestion,
  faArrowRightFromBracket
} from "@fortawesome/free-solid-svg-icons";

import styles from "./DashboardCSS/Sidebar.module.css";

const Sidebar = ({ sidebarOpen }) => {
  const iconMap = {
    "Dashboard": faBox,
    "Inventory": faWarehouse,
    "AI – Misplaced Products": faBorderAll,
    "AI – Product Quality Check": faQrcode,
    "Orders": faCartArrowDown,
    "Shipping": faTruckFast,
    "Reports": faChartColumn,
    "Settings": faGear,
    "Help & Support": faCircleQuestion,
    "Log Out": faArrowRightFromBracket
  };

  const topMenu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Inventory", path: "/dashboard/inventory" },
    { name: "AI – Misplaced Products", path: "/dashboard/misplaced" },
    { name: "AI – Product Quality Check", path: "/dashboard/product-quality" },
    { name: "Orders", path: "/dashboard/orders" },
    { name: "Shipping", path: "/dashboard/shipping" },
    { name: "Reports", path: "/dashboard/reports" }
  ];

  const bottomMenu = [
    { name: "Settings", path: "/dashboard/settings" },
    { name: "Help & Support", path: "/dashboard/help" },
    { name: "Log Out", path: "/login", danger: true }
  ];

  const renderMenu = (menu) =>
    menu.map(({ name, path, danger }) => (
      <li key={name} className={styles.menuItem}>
        <NavLink
          to={path}
          end={name === "Dashboard"}
          className={() => `${styles.link} ${danger ? styles.danger : ""}`}
        >
          {({ isActive }) => (
            <div className={`${styles.itemBox} ${isActive ? styles.active : ""}`}>
              <FontAwesomeIcon icon={iconMap[name]} className={styles.icon} />
              <span>{name}</span>
            </div>
          )}
        </NavLink>
      </li>
    ));

  return (
    <div className={`${styles.sidebar} ${!sidebarOpen ? styles.collapsed : ""}`}>
      <ul className={styles.menu}>{renderMenu(topMenu)}</ul>
      <ul className={`${styles.menu} ${styles.bottomMenu}`}>
        {renderMenu(bottomMenu)}
      </ul>
    </div>
  );
};

export default Sidebar;
