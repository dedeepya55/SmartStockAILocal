import { useState } from "react";
import styles from "../DashboardCSS/MainContent.module.css";
import { checkMisplaced } from "../../../api/api";

const MisplacedProducts = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
      setResultImage(null);
      setResultData(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return alert("Please select an image");

    const formData = new FormData();
    formData.append("productImage", selectedImage);

    try {
      setLoading(true);
      const data = await checkMisplaced(formData);

      setResultImage(data.image);
      setResultData(data.results);
    } catch (err) {
      console.error(err);
      alert("Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>AI – Misplaced Products</h2>

      {/* Upload Section */}
      <div className={styles.uploadBox}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <img src={preview} alt="Preview" className={styles.previewImage} />
        )}
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Check"}
        </button>
      </div>

      {/* Result Section */}
      {resultImage && (
        <div className={styles.resultCard}>
          <h3>Annotated Result</h3>
          <img
            src={`${API_BASE}${resultImage}`}
            alt="AI Result"
            className={styles.resultImage}
          />
        </div>
      )}

      {/* Detection Table */}
      {resultData && (
  <div className={styles.resultCard}>
    <h3>Detection Summary</h3>

    <div
      className={
        resultData.status === "INCORRECT"
          ? styles.incorrectStatus
          : styles.correctStatus
      }
    >
      Overall Status: {resultData.status}
    </div>

    <div className={styles.rowSection}>
      {resultData.messages.map((msg, index) => {
        const isMisplaced = msg.toLowerCase().includes("misplaced");

        return (
          <div
            key={index}
            className={
              isMisplaced ? styles.rowMisplaced : styles.rowCorrect
            }
          >
            {msg}
          </div>
        );
      })}
    </div>
  </div>
)}

    </div>
  );
};

export default MisplacedProducts;
