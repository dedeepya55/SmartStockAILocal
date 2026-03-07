import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { getProducts ,getFilterOptions} from "../../../api/api";
import styles from "../DashboardCSS/DashboardHome.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const DashboardHome = () => {

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  /* 🔍 SEARCH FROM TOPBAR */
  const { search = "" } = useOutletContext();

  /* DATA: raw list from API + filtered list used for display */
  const [rawProducts, setRawProducts] = useState([]);
  const [allFilteredProducts, setAllFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* FILTER OPTIONS FROM BACKEND */
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [statuses, setStatuses] = useState([]);

  /* FILTER STATES */
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterWarehouse, setFilterWarehouse] = useState("All");
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownsRef = useRef(null);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownsRef.current && !dropdownsRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(allFilteredProducts.length / itemsPerPage));
  const products = allFilteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* HELPERS */
  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const getStockStatus = (qty, minStock, maxStock) => {
  if (qty === 0) return "Out of Stock";
  if (qty <= minStock) return "Low Stock";
  if (qty > minStock && qty <= maxStock) return "In Stock";
  return "Over Stock";
};

  /* FETCH PRODUCTS from API (only depends on search) */
  const FETCH_LIMIT = 500;
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getProducts({
          search,
          limit: FETCH_LIMIT,
        });
        const list = res.data.products || [];
        setRawProducts(list);
      } catch (err) {
        console.error("Fetch error:", err);
        setRawProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search]);

  /* Recompute filtered list whenever raw data or filters change */
  useEffect(() => {
    let list = rawProducts;

    const hasSearch = (search || "").trim().length > 0;

    // When searching, only filter by search (API already did that).
    // Dropdown filters (category / status / warehouse) are ignored.
    if (!hasSearch) {
      // Category filter
      if (filterCategory !== "All") {
        list = list.filter((p) => (p.Category || "") === filterCategory);
      }

      // Warehouse filter
      if (filterWarehouse !== "All") {
        list = list.filter((p) => (p.Warehouse || "") === filterWarehouse);
      }

      // Status filter (derived from QTY / minStock / maxStock)
      if (filterStatus !== "All") {
        list = list.filter(
          (p) =>
            getStockStatus(
              p.QTY,
              p.minStock,
              p.maxStock
            ) === filterStatus
        );
      }
    }

    setAllFilteredProducts(list);
    setCurrentPage(1);
  }, [rawProducts, filterCategory, filterStatus, filterWarehouse, search]);

  /* FETCH FILTER OPTIONS (ONLY ONCE) */
useEffect(() => {
  const fetchFilters = async () => {
    try {
      const res = await getFilterOptions();
      setCategories(res.data.categories || []);
      setWarehouses(res.data.warehouses || []);
      setStatuses(res.data.status || []);
    } catch (err) {
      console.error("Filter fetch error:", err);
    }
  };

  fetchFilters();
}, []);

  /* PAGINATION NUMBERS */
  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let last;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta &&
          i <= currentPage + delta)
      ) {
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

  const getButtonText = (value, label) =>
    value === "All" ? label : value;

  const handleClearFilters = () => {
    setFilterCategory("All");
    setFilterStatus("All");
    setFilterWarehouse("All");
    setOpenDropdown(null);
  };

  return (
    <div className={styles.dashboard}>
      {/* HEADER */}
      <div className={styles.header}>
        <h2>Dashboard</h2>

        <div className={styles.actions} ref={dropdownsRef}>
          {/* CATEGORY */}
          <div className={styles.dropdownWrapper}>
            <button onClick={() => toggleDropdown("category")}>
              {getButtonText(filterCategory, "Category")}
              <FontAwesomeIcon icon={faAngleDown} />
            </button>
            {openDropdown === "category" && (
              <ul className={styles.dropdown}>
                {categories.map((cat) => (
                  <li
                    key={cat}
                    onClick={() => { setFilterCategory(cat); setOpenDropdown(null); }}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* STATUS */}
          <div className={styles.dropdownWrapper}>
            <button onClick={() => toggleDropdown("status")}>
              {getButtonText(filterStatus, "Status")}
              <FontAwesomeIcon icon={faAngleDown} />
            </button>
            {openDropdown === "status" && (
              <ul className={styles.dropdown}>
                {[
                  "All",
                  "In Stock",
                  "Over Stock",
                  "Low Stock",
                  "Out of Stock",
                ].map((st) => (
                  <li
                    key={st}
                    onClick={() => { setFilterStatus(st); setOpenDropdown(null); }}
                  >
                    {st}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* WAREHOUSE */}
          <div className={styles.dropdownWrapper}>
            <button onClick={() => toggleDropdown("warehouse")}>
              {getButtonText(filterWarehouse, "Warehouse")}
              <FontAwesomeIcon icon={faAngleDown} />
            </button>
            {openDropdown === "warehouse" && (
              <ul className={styles.dropdown}>
                {warehouses.map((wh) => (
                  <li
                    key={wh}
                    onClick={() => { setFilterWarehouse(wh); setOpenDropdown(null); }}
                  >
                    {wh}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button type="button" className={styles.clearBtn} onClick={handleClearFilters}>
            Clear
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>QTY</th>
              <th>Warehouse</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Last Modified</th>
            </tr>
          </thead>

          <tbody>
            {loading && products.length === 0 ? (
              <tr>
                <td colSpan="9">Loading...</td>
              </tr>
            ) : !loading && products.length === 0 ? (
              <tr>
                <td colSpan="9">No products found</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id}>
                  <td>{p.SKU}</td>
                  <td>
                    <img
                      src={`${API_BASE}${p.Image}`}
                      alt={p.Title}
                    />
                  </td>
                  <td>{p.Title}</td>
                  <td>{p.Category}</td>
                  <td>{p.QTY}</td>
                  <td>{p.Warehouse}</td>
                  <td>₹ {p.Price}</td>
                  <td>
  <span
    className={`${styles.stock} ${
      styles[
        getStockStatus(
          p.QTY,
          p.minStock,
          p.maxStock
        ).replace(/\s/g, "")
      ]
    }`}
  >
    {getStockStatus(p.QTY, p.minStock, p.maxStock)}
  </span>
</td>

                  <td>
                    {new Date(
                      p["LastModified"]
                    ).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.arrowBtn}
            onClick={() =>
              setCurrentPage((p) => Math.max(p - 1, 1))
            }
          >
            &lt;
          </button>

          {getPaginationNumbers().map((num, idx) =>
            num === "..." ? (
              <span key={idx} className={styles.dots}>
                ...
              </span>
            ) : (
              <button
                key={idx}
                className={`${styles.pageBtn} ${
                  currentPage === num
                    ? styles.activePage
                    : ""
                }`}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            )
          )}

          <button
            className={styles.arrowBtn}
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(p + 1, totalPages)
              )
            }
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
