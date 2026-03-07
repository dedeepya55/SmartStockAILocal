import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

import {
  getProductBySKU,
  getInventoryAnalytics,
  updateProductBySKU,
  getProducts,
} from "../../../api/api";

import styles from "../DashboardCSS/Inventory.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faAngleDown } from "@fortawesome/free-solid-svg-icons";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { TextField, IconButton } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Inventory = () => {
  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const { search: headerSearch = "" } = useOutletContext();
  const [sku, setSku] = useState("");
  const [product, setProduct] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [trendType, setTrendType] = useState("yearly");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trendDropdownRef = useRef(null);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14; // Adjust number per page

  // Sync header search to SKU field
  useEffect(() => {
    if (headerSearch.trim()) setSku(headerSearch.trim());
  }, [headerSearch]);

  // Fetch all products on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await getProducts({ limit: 1000 });
        setAllProducts(res.data.products);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchAll();
  }, []);

  // Search
  const handleSearch = async () => {
    if (!sku) return;
    try {
      setError("");
      const productRes = await getProductBySKU(sku);
      const analyticsRes = await getInventoryAnalytics(sku);
      setProduct(productRes.data);
      setAnalytics(analyticsRes.data);
      setEditData(productRes.data);
    } catch {
      setProduct(null);
      setAnalytics(null);
      setError("Product not found");
    }
  };

  // Edit change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Update product
  const handleUpdate = async () => {
    try {
      setError("");
      setSuccessMsg("");

      const payload = {
        ...product,
        ...editData,
        QTY: editData.QTY ? Number(editData.QTY) : product.QTY,
        Price: editData.Price ? Number(editData.Price) : product.Price,
        minStock: editData.minStock ? Number(editData.minStock) : product.minStock,
        maxStock: editData.maxStock ? Number(editData.maxStock) : product.maxStock,
        inQty: editData.inQty ? Number(editData.inQty) : undefined,
        outQty: editData.outQty ? Number(editData.outQty) : undefined,
        lastModified: new Date(),
      };

      await updateProductBySKU(payload.SKU, payload);
      setSuccessMsg("Product updated successfully!");
      handleSearch();
    } catch {
      setError("Update failed");
    }
  };


useEffect(() => {
  if (analytics?.monthlyTrend?.length > 0) {
    setSelectedYear(analytics.monthlyTrend[0].year);
  }
}, [analytics]);

  // Close trend dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (trendDropdownRef.current && !trendDropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const trendData = analytics
  ? trendType === "yearly"
    ? analytics.yearlyTrend
    : analytics.monthlyTrend.find(y => y.year === selectedYear)?.months || []
  : [];


  const pieData = analytics
    ? [
        { name: "Sold Units", value: analytics.soldQty, color: "#b0c4de" },
        { name: "Remaining Units", value: analytics.qty, color: "#2f4f4f" },
      ]
    : [];

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Header search filters inventory table items
  const searchTerm = (headerSearch || "").trim().toLowerCase();
  const filteredProducts =
    !searchTerm
      ? allProducts
      : allProducts.filter((p) => {
          const sku = (p.SKU || "").toLowerCase();
          const title = (p.Title || "").toLowerCase();
          const category = (p.Category || "").toLowerCase();
          return (
            sku.includes(searchTerm) ||
            title.includes(searchTerm) ||
            category.includes(searchTerm)
          );
        });

  // Reset to first page when header search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination helpers based on filtered list
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  
  useEffect(() => {
    if (trendType === "monthly" && analytics?.monthlyTrend?.length > 0) {
      setSelectedYear(analytics.monthlyTrend[0].year);
    }
  }, [trendType, analytics]);

  
  return (
    <div className={styles.inventory}>
      <h2>Product Information</h2>

      {/* SEARCH + EDIT BUTTON */}
      <div className={styles.searchBox}>
        <input
          placeholder="Enter SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        

        {product && (
          <Popup trigger={<button className={styles.editBtn}>Edit</button>} modal nested>
            {(close) => (
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h2>Edit Details</h2>
                  <IconButton onClick={close}>
                    <FontAwesomeIcon icon={faX} />
                  </IconButton>
                </div>

                {[
                  ["SKU", "SKU"],
                  ["Title", "Title"],
                  ["Category", "Category"],
                  ["Warehouse", "Warehouse"],
                ].map(([label, name]) => (
                  <div key={name}>
                    <label>{label}</label>
                    <input
                      name={name}
                      value={editData[name] || ""}
                      onChange={handleEditChange}
                    />
                  </div>
                ))}

                <label>Quantity</label>
                <input
                  type="number"
                  name="QTY"
                  value={editData.QTY || 0}
                  onChange={handleEditChange}
                />
                <label>Price</label>
                <input
                  type="number"
                  name="Price"
                  value={editData.Price || 0}
                  onChange={handleEditChange}
                />
                <label>Min Stock</label>
                <input
                  type="number"
                  name="minStock"
                  value={editData.minStock || 0}
                  onChange={handleEditChange}
                />
                <label>Max Stock</label>
                <input
                  type="number"
                  name="maxStock"
                  value={editData.maxStock || 0}
                  onChange={handleEditChange}
                />

                {/* In & Out Dates */}
                <label>In Date & Qty (optional)</label>
                <div className={styles.dateQtyRow}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={editData.inDate ? new Date(editData.inDate) : null}
                      onChange={(date) => setEditData((p) => ({ ...p, inDate: date }))}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <input
                    type="number"
                    value={editData.inQty || ""}
                    onChange={(e) => setEditData((p) => ({ ...p, inQty: e.target.value }))}
                  />
                </div>

                <label>Out Date & Qty (optional)</label>
                <div className={styles.dateQtyRow}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={editData.outDate ? new Date(editData.outDate) : null}
                      onChange={(date) => setEditData((p) => ({ ...p, outDate: date }))}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <input
                    type="number"
                    value={editData.outQty || ""}
                    onChange={(e) => setEditData((p) => ({ ...p, outQty: e.target.value }))}
                  />
                </div>

                <button
                  className={styles.submitBtn}
                  onClick={() => {
                    handleUpdate();
                    close();
                  }}
                >
                  Update
                </button>
              </div>
            )}
          </Popup>
        )}
      </div>

      {/* GRID OF ALL PRODUCTS */}
      {!product && (
        <>
          <div className={styles.allProductsGrid}>
            {paginatedProducts.map((p) => (
              <div
                key={p._id}
                className={styles.productCard}
                onClick={() => {
                  setSku(p.SKU);
                  handleSearch();
                }}
              >
                <img src={`${API_BASE}${p.Image}`} alt={p.Title} />
                <p><b>{p.SKU}</b></p>
                <p>{p.Title}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
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
        </>
      )}

      {error && <p className={styles.error}>{error}</p>}
      {successMsg && <p className={styles.success}>{successMsg}</p>}

      {/* PRODUCT DETAILS (Pie + Line Charts) */}
      {product && (
        <>
          <div className={styles.topRow}>
            <div className={styles.imBdmB}>
              <div className={styles.imageBox}>
                <img src={`${API_BASE}${product.Image}`} alt={product.Title} />
              </div>

              <div className={styles.detailsBox}>
                <p><b>SKU:</b> {product.SKU}</p>
                <p><b>Price:</b> ₹{product.Price}</p>
                <p><b>Quantity:</b> {product.QTY}</p>
                <p><b>Min:</b> {product.minStock}</p>
                <p><b>Max:</b> {product.maxStock}</p>
                <p><b>Last Modified:</b> {new Date(product.LastModified).toISOString().split("T")[0]}</p>
              </div>
            </div>

            <div className={styles.detailsPieBox}>
              <h3 className={styles.graphTitle}>Inventory Overview</h3>
              {analytics && (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      paddingAngle={3}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend layout="vertical" verticalAlign="middle" align="right" iconType="square" iconSize={20} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className={styles.bottomRow}>
            <h3 className={styles.graphTitle}>Trend Analysis</h3>
            <div className={styles.lineChartBox}>
              <div className={styles.chartFilter}>
                <div className={styles.dropdownWrapper} ref={trendDropdownRef}>
                  <button onClick={toggleDropdown}>
                    {trendType === "yearly" ? "Yearly" : "Monthly"}{" "}
                    <FontAwesomeIcon icon={faAngleDown} />
                  </button>
                  {dropdownOpen && (
                    <ul className={styles.dropdown}>
                      <li onClick={() => { setTrendType("yearly"); setDropdownOpen(false); }}>Yearly</li>
                      <li onClick={() => { setTrendType("monthly"); setDropdownOpen(false); }}>Monthly</li>
                    </ul>
                  )}
                </div>
                  {/* Year selector */}
              {trendType === "monthly" &&
                analytics?.monthlyTrend?.length > 0 && (
                  <select
                    className={styles.yearSelect}
                    value={selectedYear || ""}
                    onChange={(e) =>
                      setSelectedYear(Number(e.target.value))
                    }
                  >
                    {analytics.monthlyTrend.map((y) => (
                      <option key={y.year} value={y.year}>
                        {y.year}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
                  <XAxis
                    dataKey={trendType === "yearly" ? "year" : "month"}
                    label={{ value: trendType === "yearly" ? "Year" : "Month", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis label={{ value: "Quantity", angle: -90, position: "insideLeft", offset: 10 }} />
                  <Tooltip />
                  <Legend verticalAlign="top" align="center" height={36} />
                  <Line type="monotone" dataKey="inQty" name="In Quantity" stroke="#00C49F" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="outQty" name="Out Quantity" stroke="#FF8042" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Inventory;
