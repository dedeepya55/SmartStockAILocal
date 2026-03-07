import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "../DashboardCSS/Order.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { getOrdersAPI, API_BASE } from "../../../api/api";

const Orders = () => {
  const { search: headerSearch = "" } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [localSearch, setLocalSearch] = useState("");

  // Fetch all orders once
  useEffect(() => {
    const fetchOrders = async () => {
      try {
          const res = await getOrdersAPI();
          setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  // Effective search term: page search bar wins, then header search
  const searchLower = (localSearch || headerSearch || "").trim().toLowerCase();
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

  // Keep selected order in sync with filtered list
  useEffect(() => {
    if (filteredOrders.length === 0) {
      setSelectedOrder(null);
      return;
    }

    if (!selectedOrder || !filteredOrders.some((o) => o._id === selectedOrder._id)) {
      setSelectedOrder(filteredOrders[0]);
    }
  }, [filteredOrders, selectedOrder]);

  const formatDateTime = (value) =>
    value ? new Date(value).toLocaleString() : "-";

  return (
    <div className={styles.main}>
      <div className={styles.headerRow}>
        <h2 className={styles.ordersTitle}>Orders</h2>
        <div className={styles.pageSearch}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className={styles.pageSearchIcon}
          />
          <input
            type="text"
            placeholder="Search by order, product..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.layout}>
        {/* LEFT: Orders list */}
        <div className={styles.listPane}>
          <div className={styles.listHeader}>
            <span className={styles.listTitle}>Orders List</span>
          </div>
          {filteredOrders.length === 0 ? (
            <p className={styles.empty}>No orders found.</p>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className={`${styles.listItem} ${
                  selectedOrder?._id === order._id ? styles.activeItem : ""
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className={styles.listMain}>
                  <div>
                    <div className={styles.listOrderId}>Order ID: {order.orderId}</div>
                    <div className={styles.listShop}>{order.shopName}</div>
                  </div>
                </div>
                <div className={styles.listMeta}>
                  <span>{formatDateTime(order.orderDate)}</span>
                  <span>₹{order.totalPrice}</span>
                  <span className={styles.status}>{order.status}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT: Selected order details */}
        <div className={styles.detailPane}>
          {!selectedOrder ? (
            <p className={styles.empty}>Select an order from the list to see details.</p>
          ) : (
            <div className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <h3>Order ID: {selectedOrder.orderId}</h3>
                <div className={styles.detailHeaderRight}>
                  <span className={styles.status}>{selectedOrder.status}</span>
                  <span className={styles.detailDate}>
                    Ordered on: {formatDateTime(selectedOrder.orderDate)}
                  </span>
                </div>
              </div>

              <div className={styles.detailSummary}>
                <div>
                  <span className={styles.summaryLabel}>Shop:</span>{" "}
                  {selectedOrder.shopName}
                </div>
                <div>
                  <span className={styles.summaryLabel}>Total:</span>{" "}
                  ₹{selectedOrder.totalPrice}
                </div>
              </div>

              <h4 className={styles.itemsTitle}>Items</h4>
              <div className={styles.itemsList}>
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className={styles.itemRow}>
                    <div className={styles.itemMain}>
                      {item?.product?.Image && (
                        <img
                            src={`${API_BASE}/${item.product.Image}`}
                          alt={item?.product?.Title || "Product"}
                          className={styles.itemThumb}
                        />
                      )}
                      <div className={styles.itemText}>
                        <div className={styles.itemTitle}>
                          {item?.product?.Title}
                        </div>
                        <div className={styles.itemMeta}>
                          Category: {item?.product?.Category} · Price: ₹
                          {item?.product?.Price}
                        </div>
                      </div>
                    </div>
                    <div className={styles.itemRight}>
                      <div className={styles.itemQty}>Qty: {item.quantity}</div>
                      <div className={styles.itemSubtotal}>
                        ₹{item.quantity * (item?.product?.Price || 0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.detailTotalsRow}>
                <span className={styles.summaryLabel}>Total:</span>
                <span className={styles.detailTotalValue}>
                  ₹{selectedOrder.totalPrice}
                </span>
              </div>

              <div className={styles.detailFooter}>
                <button
                  className={styles.shippingBtn}
                  onClick={() =>
                    window.location.href = `/dashboard/shipping?orderId=${selectedOrder.orderId}`
                  }
                >
                  View Shipping Info
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
