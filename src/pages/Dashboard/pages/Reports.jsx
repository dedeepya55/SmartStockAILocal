import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../DashboardCSS/Report.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { getOrdersAPI } from "../../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faFolder,
  faTruck,
  faCircleCheck,
  faEllipsisVertical,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const { search: headerSearch = "" } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenueRange, setRevenueRange] = useState("Last 7 Days");
  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrdersAPI();
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
      finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const searchLower = (headerSearch || "").trim().toLowerCase();
  const filteredOrders = !searchLower
      ? orders
      : orders.filter((order) => {
        const matchId = (order.orderId || "").toLowerCase().includes(searchLower);
        const matchShop = (order.shopName || "").toLowerCase().includes(searchLower);
        const matchStatus = (order.status || "").toLowerCase().includes(searchLower);
        const matchItems = (order.items || []).some(
            (item) => (item?.product?.Title || "").toLowerCase().includes(searchLower)
        );
        return matchId || matchShop || matchStatus || matchItems;
      });

  const totalOrders = filteredOrders.length;
  const statusCounts = filteredOrders.reduce((acc, order) => {
    const s = order.status || "";
    const key = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const pending = statusCounts.Pending || 0;
  const shipped = statusCounts.Shipped || 0;
  const delivered = statusCounts.Delivered || 0;

  const statusLabels = Object.keys(statusCounts);
  const statusData = Object.values(statusCounts);
  const statusChartData = {
    labels: statusLabels,
    datasets: [
      {
        label: "Orders by Status",
        data: statusData,
        backgroundColor: ["#0d0d44", "#f59e0b", "#10b981"],
      },
    ],
  };

  const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const revenueByDay = {};
  filteredOrders.forEach((order) => {
    const d = new Date(order.orderDate);
    const day = d.getDay();
    const key = day === 0 ? 6 : day - 1;
    revenueByDay[key] = (revenueByDay[key] || 0) + (order.totalPrice || 0);
  });
  const revenueData = dayLabels.map((_, i) => revenueByDay[i] || 0);
  const grossRevenue = revenueData.reduce((a, b) => a + b, 0);
  const revenueChartData = {
    labels: dayLabels,
    datasets: [
      {
        label: "Revenue",
        data: revenueData,
        borderColor: "#0d0d44",
        backgroundColor: "rgba(13, 13, 68, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const activeRate = totalOrders > 0 ? Math.round(((shipped + delivered) / totalOrders) * 100) : 0;

  // Top selling products: aggregate quantity by product title from order items
  const productTotals = {};
  filteredOrders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const title = item?.product?.Title || "Unknown";
      const qty = Number(item?.quantity) || 0;
      productTotals[title] = (productTotals[title] || 0) + qty;
    });
  });
  const topSellingProducts = Object.entries(productTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

  const topSellingChartData = {
    labels: topSellingProducts.map((p) => p.name),
    datasets: [
      {
        label: "Top Selling Products",
        data: topSellingProducts.map((p) => p.quantity),
        backgroundColor: "#0d0d44",
      },
    ],
  };

  const kpiCards = [
    { icon: faCartShopping, label: "TOTAL ORDERS", value: totalOrders.toLocaleString() },
    { icon: faFolder, label: "PENDING ORDERS", value: pending.toLocaleString() },
    { icon: faTruck, label: "SHIPPED ORDERS", value: shipped.toLocaleString() },
    { icon: faCircleCheck, label: "DELIVERED ORDERS", value: delivered.toLocaleString() },
  ];

  if (loading) return <div className={styles.loading}>Loading reports...</div>;

  return (
      <div className={styles.main}>
        <h2 className={styles.mainTitle}>Reports Dashboard</h2>

        <div className={styles.summaryCards}>
          {kpiCards.map((card, idx) => (
              <div key={idx} className={styles.card}>
                <div className={styles.cardTop}>
              <span className={styles.cardIcon}>
                <FontAwesomeIcon icon={card.icon} />
              </span>
                </div>
                <p className={styles.cardLabel}>{card.label}</p>
                <p className={styles.cardValue}>{card.value}</p>
              </div>
          ))}
        </div>

        <div className={styles.panels}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Orders by Status</h3>
              <button type="button" className={styles.panelMenu} aria-label="Menu">
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </button>
            </div>
            <div className={styles.chartWrap}>
              <Bar
                  data={statusChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
              />
            </div>
            <div className={styles.legend}>
              <span className={styles.legendItem}><i style={{ background: "#0d0d44" }} /> Shipped</span>
              <span className={styles.legendItem}><i style={{ background: "#f59e0b" }} /> Pending</span>
              <span className={styles.legendItem}><i style={{ background: "#10b981" }} /> Delivered</span>
            </div>
            <div className={styles.efficiency}>
              <span className={styles.efficiencyLabel}>Active Rate</span>
              <span className={styles.efficiencyValue}>{activeRate}% Efficiency</span>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Revenue Over Time</h3>
              <div className={styles.dropdownWrap}>
                <button
                    type="button"
                    className={styles.dropdownBtn}
                    onClick={() =>
                        setRevenueRange(revenueRange === "Last 7 Days" ? "Last 30 Days" : "Last 7 Days")
                    }
                >
                  {revenueRange}
                  <FontAwesomeIcon icon={faAngleDown} />
                </button>
              </div>
            </div>
            <div className={styles.chartWrap}>
              <Line
                  data={revenueChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
              />
            </div>
            <div className={styles.revenueSummary}>
              <div>
                <span className={styles.revenueLabel}>GROSS REVENUE</span>
                <span className={styles.revenueAmount}>₹{grossRevenue.toLocaleString()}</span>
              </div>
              <div>
                <span className={styles.revenueLabel}>NET GROWTH</span>
                <span className={styles.growthUp}>+18.2%</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.topSellingSection}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Top Selling Products</h3>
            </div>
            <div className={styles.chartWrap}>
              <Bar
                  data={topSellingChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: { color: "rgba(0,0,0,0.08)" },
                        ticks: { color: "#6b7280" },
                      },
                      x: {
                        grid: { display: false },
                        ticks: { color: "#6b7280", maxRotation: 45, minRotation: 0 },
                      },
                    },
                  }}
              />
            </div>
          </div>
        </div>
      </div>
  );
};

export default Reports;