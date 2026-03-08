import { useState, useEffect, useRef } from "react";
import { getBatches, getFilterOptions } from "../../../api/api"; // Your API functions
import styles from "../DashboardCSS/DashboardBatches.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import {useOutletContext} from "react-router-dom";

const DashboardBatches = () => {
    const API_BASE = import.meta.env.VITE_BACKEND_URL;

    const { user } = useOutletContext();
    console.log(user?.role);

    /* DATA STATES */
    const [rawBatches, setRawBatches] = useState([]);
    const [filteredBatches, setFilteredBatches] = useState([]);
    const [loading, setLoading] = useState(true);

    /* FILTER OPTIONS */
    const [warehouses, setWarehouses] = useState([]);
    const [statuses, setStatuses] = useState([]);

    /* FILTER STATES */
    const [filterWarehouse, setFilterWarehouse] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
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
    const totalPages = Math.max(1, Math.ceil(filteredBatches.length / itemsPerPage));
    const batches = filteredBatches.slice(
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

    /* ADD BATCH MODAL */
    const [showAddBatch, setShowAddBatch] = useState(false);
    const [newBatch, setNewBatch] = useState({
        batchId: "",
        productSKU: "",
        warehouse: warehouses[0] || "",
        quantity: 0,
        arrivalDate: "",
        expiryDate: "",
    });
    const [saving, setSaving] = useState(false);

    const addNewBatch = async () => {
        if (!newBatch.batchId || !newBatch.productSKU || !newBatch.warehouse || !newBatch.quantity || !newBatch.arrivalDate) {
            alert("Please fill required fields.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/batches`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    batchId: newBatch.batchId,
                    productSKU: newBatch.productSKU,
                    warehouse: newBatch.warehouse,
                    quantity: Number(newBatch.quantity),
                    arrivalDate: newBatch.arrivalDate,
                    expiryDate: newBatch.expiryDate || null,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setRawBatches((prev) => [...prev, data]);
                setShowAddBatch(false);
                setNewBatch({
                    batchId: "",
                    productSKU: "",
                    warehouse: warehouses[0] || "",
                    quantity: 0,
                    arrivalDate: "",
                    expiryDate: "",
                });
            } else {
                alert("Error adding batch: " + data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to add batch");
        } finally {
            setSaving(false);
        }
    };

    const toggleDropdown = (name) => setOpenDropdown(openDropdown === name ? null : name);
    const getBatchStatus = (qty) => (qty === 0 ? "Out of Stock" : "In Stock");

    /* FETCH BATCHES */
    useEffect(() => {
        const fetchBatches = async () => {
            setLoading(true);
            try {
                const res = await getBatches();
                setRawBatches(res.data.data || []);
            } catch (err) {
                console.error(err);
                setRawBatches([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBatches();
    }, []);

    /* FILTERED LIST */
    useEffect(() => {
        let list = rawBatches;
        if (filterWarehouse !== "All") list = list.filter((b) => b.warehouse === filterWarehouse);
        if (filterStatus !== "All") list = list.filter((b) => getBatchStatus(b.quantity) === filterStatus);
        setFilteredBatches(list);
        setCurrentPage(1);
    }, [rawBatches, filterWarehouse, filterStatus]);

    /* FETCH FILTER OPTIONS */
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await getFilterOptions();
                setWarehouses(res.data.warehouses || []);
                setStatuses(res.data.status || ["In Stock", "Out of Stock"]);
                setNewBatch((prev) => ({ ...prev, warehouse: res.data.warehouses?.[0] || "" }));
            } catch (err) {
                console.error(err);
            }
        };
        fetchFilters();
    }, []);

    return (
        <div className={styles.dashboard}>
            {/* HEADER & FILTERS */}
            <div className={styles.header}>
                <h2>Product Batches</h2>

                <div className={styles.actions} ref={dropdownsRef}>
                    {(user?.role === "admin" || user?.role === "manager") && (
                        <button className={styles.addBatchBtn} onClick={() => setShowAddBatch(true)}>
                            + Add Batch
                        </button>
                    )}

                    {/* Warehouse Filter */}
                    <div className={styles.dropdownWrapper}>
                        <button onClick={() => toggleDropdown("warehouse")}>
                            {filterWarehouse} <FontAwesomeIcon icon={faAngleDown} />
                        </button>
                        {openDropdown === "warehouse" && (
                            <ul className={styles.dropdown}>
                                {warehouses.map((wh) => (
                                    <li
                                        key={wh}
                                        onClick={() => {
                                            setFilterWarehouse(wh);
                                            setOpenDropdown(null);
                                        }}
                                    >
                                        {wh}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Status Filter */}
                    <div className={styles.dropdownWrapper}>
                        <button onClick={() => toggleDropdown("status")}>
                            {filterStatus} <FontAwesomeIcon icon={faAngleDown} />
                        </button>
                        {openDropdown === "status" && (
                            <ul className={styles.dropdown}>
                                {statuses.map((st) => (
                                    <li
                                        key={st}
                                        onClick={() => {
                                            setFilterStatus(st);
                                            setOpenDropdown(null);
                                        }}
                                    >
                                        {st}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Clear Filters */}
                    <button
                        className={styles.clearBtn}
                        onClick={() => {
                            setFilterWarehouse("All");
                            setFilterStatus("All");
                        }}
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* ADD BATCH MODAL */}
            {showAddBatch  && (user?.role === "admin" || user?.role === "manager") &&  (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Add New Batch</h3>

                        <div className={styles.formGroup}>
                            <label>Batch ID</label>
                            <input
                                type="text"
                                value={newBatch.batchId}
                                onChange={(e) => setNewBatch({ ...newBatch, batchId: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Product SKU</label>
                            <input
                                type="text"
                                value={newBatch.productSKU}
                                onChange={(e) => setNewBatch({ ...newBatch, productSKU: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Warehouse</label>
                            <select
                                value={newBatch.warehouse}
                                onChange={(e) => setNewBatch({ ...newBatch, warehouse: e.target.value })}
                            >
                                {warehouses.map((wh) => (
                                    <option key={wh} value={wh}>
                                        {wh}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Quantity</label>
                            <input
                                type="number"
                                value={newBatch.quantity}
                                onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Arrival Date</label>
                            <input
                                type="date"
                                value={newBatch.arrivalDate}
                                onChange={(e) => setNewBatch({ ...newBatch, arrivalDate: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Expiry Date</label>
                            <input
                                type="date"
                                value={newBatch.expiryDate}
                                onChange={(e) => setNewBatch({ ...newBatch, expiryDate: e.target.value })}
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <button onClick={() => setShowAddBatch(false)}>Cancel</button>
                            {user?.role === "admin" || user?.role === "manager" ?(
                            <button onClick={addNewBatch} disabled={saving}>
                                {saving ? "Saving..." : "Add Batch"}
                            </button>
                                ):null}
                        </div>
                    </div>
                </div>
            )}

            {/* TABLE */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Batch ID</th>
                        <th>SKU</th>
                        <th>Title</th>
                        <th>Image</th>
                        <th>Warehouse</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Arrival</th>
                        <th>Expiry</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="9">Loading...</td>
                        </tr>
                    ) : batches.length === 0 ? (
                        <tr>
                            <td colSpan="9">No batches found</td>
                        </tr>
                    ) : (
                        batches.map((b) => (
                            <tr key={b._id}>
                                <td>{b.batchId}</td>
                                <td>{b.productSKU}</td>
                                <td>{b.productInfo?.Title}</td>
                                <td>
                                    {b.productInfo?.Image ? (
                                        <img
                                            src={
                                                b.productInfo.Image.startsWith("http")
                                                    ? b.productInfo.Image
                                                    : `${API_BASE}${b.productInfo.Image}`
                                            }
                                            alt={b.productInfo.Title}
                                        />
                                    ) : (
                                        "No Image"
                                    )}
                                </td>
                                <td>{b.warehouse}</td>
                                <td>{b.quantity}</td>
                                <td>
                    <span
                        className={`${styles.stock} ${
                            styles[getBatchStatus(b.quantity).replace(/\s/g, "")]
                        }`}
                    >
                      {getBatchStatus(b.quantity)}
                    </span>
                                </td>
                                <td>{new Date(b.arrivalDate).toLocaleDateString()}</td>
                                <td>{b.expiryDate ? new Date(b.expiryDate).toLocaleDateString() : "-"}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            {filteredBatches.length > itemsPerPage && (
                <div className={styles.pagination}>
                    <button
                        className={styles.arrowBtn}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
                                    className={`${styles.pageBtn} ${currentPage === num ? styles.activePage : ""}`}
                                    onClick={() => setCurrentPage(num)}
                                >
                                    {num}
                                </button>
                            )
                    )}

                    <button
                        className={styles.arrowBtn}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
};

export default DashboardBatches;