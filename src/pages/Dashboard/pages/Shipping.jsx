import { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import styles from "../DashboardCSS/Shipping.module.css";
import { getOrdersAPI } from "../../../api/api";

const Shipping = () => {
  const location = useLocation();
  const { search: headerSearch = "" } = useOutletContext();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId"); // optional query param

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const ordersPerPage = 3; // same as Orders page

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrdersAPI();
        let data = res.data;

        if (orderId) {
          data = data.filter((o) => o.orderId === orderId);
        }

        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [orderId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [headerSearch]);

  // Filter by header search (orderId, shopName, status, product titles)
  const searchLower = (headerSearch || "").trim().toLowerCase();
  const filteredOrders =
    !searchLower
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

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Smart pagination numbers with "..."
  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let last;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (last) {
        if (i - last === 2) rangeWithDots.push(last + 1);
        else if (i - last !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      last = i;
    }

    return rangeWithDots;
  };

  if (loading) return <div>Loading...</div>;
  if (orders.length === 0) return <div>No shipping info found.</div>;
  if (filteredOrders.length === 0) return <div>No orders match your search.</div>;

  const getProgressIndex = (order) => {
    const statusText = (order.status || "").toLowerCase();
    const historyText = Array.isArray(order.shippingHistory)
      ? order.shippingHistory.map((s) => (s.status || "").toLowerCase()).join(" ")
      : "";

    if (statusText.includes("shipped") || historyText.includes("shipped")) return 2;
    if (statusText.includes("packed") || historyText.includes("packed")) return 1;
    return 0;
  };

  return (
    <div className={styles.main}>
      <h2>Shipping Details {orderId ? `- ${orderId}` : ""}</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Shop</th>
              <th>Order Status</th>
              <th>Progress</th>
              <th>Ordered On</th>
              <th>Total Price</th>
              <th>Items</th>
              <th>Shipping Status</th>
              <th>Shipping Time</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => {
              const history =
                order.shippingHistory && order.shippingHistory.length > 0
                  ? order.shippingHistory
                  : [{ status: "N/A", timestamp: null }];
              const progressIndex = getProgressIndex(order);

              return history.map((step, idx) => (
                <tr key={`${order._id}-${idx}`}>
                  {idx === 0 && (
                    <>
                      <td rowSpan={history.length}>{order.orderId}</td>
                      <td rowSpan={history.length}>{order.shopName}</td>
                      <td rowSpan={history.length}>
                        <span className={styles.status}>{order.status}</span>
                      </td>
                      <td rowSpan={history.length}>
                        <div className={styles.progress}>
                          {["Ordered", "Packed", "Shipped"].map((label, stepIdx) => (
                            <div
                              key={label}
                              className={`${styles.progressStep} ${
                                stepIdx <= progressIndex ? styles.activeStep : ""
                              }`}
                            >
                              <span className={styles.dot} />
                              <span className={styles.stepLabel}>{label}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td rowSpan={history.length}>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td rowSpan={history.length}>₹{order.totalPrice}</td>
                      <td rowSpan={history.length}>
                        {Array.isArray(order.items)
                          ? order.items.map((item) => item?.product?.Title).filter(Boolean).join(", ")
                          : "-"}
                      </td>
                    </>
                  )}
                  <td>{step.status}</td>
                  <td>
                    {step.timestamp ? new Date(step.timestamp).toLocaleString() : "-"}
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.arrowBtn}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            &lt;
          </button>

          {getPaginationNumbers().map((num, idx) =>
            num === "..." ? (
              <span key={idx} className={styles.dots}>...</span>
            ) : (
              <button
                key={idx}
                className={`${styles.pageBtn} ${currentPage === num ? styles.activePage : ""}`}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            )
          )}

          <button
            className={styles.arrowBtn}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default Shipping;
