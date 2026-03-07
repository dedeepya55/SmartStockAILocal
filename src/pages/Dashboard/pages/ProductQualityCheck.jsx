import { useState } from "react";
import styles from "../DashboardCSS/MainContent.module.css";
import { qualityCheckAPI, API_BASE } from "../../../api/api";

function ProductQualityCheck() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [outputImageUrl, setOutputImageUrl] = useState("");
  const [loading, setLoading] = useState(false);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));

    // Reset previous results
    setStatus("");
    setResultMessage("");
    setOutputImageUrl("");
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("productImage", image);

    setLoading(true);

    try {
      const res = await qualityCheckAPI(formData);
      const data = res.data;

      setStatus(data.status);
      setResultMessage(data.message);
      setOutputImageUrl(`${API_BASE}${data.output_image_path}`);
    } catch (err) {
      console.error(err);
      setStatus("ERROR");
      setResultMessage("❌ Error checking product");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>AI – Product Quality Check</h2>

      {/* Upload Section */}
      <div className={styles.uploadBox}>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className={styles.previewImage}
          />
        )}

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "🔄 Checking Product..." : "Check Product"}
        </button>
      </div>

      {/* Status Section */}
      {status && (
        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <span>Overall Status</span>

            <span
              className={
                status === "NOT_OK"
                  ? styles.badgeDanger
                  : status === "OK"
                  ? styles.badgeSuccess
                  : styles.badgeError
              }
            >
              {status === "NOT_OK"
                ? "DEFECTIVE"
                : status === "OK"
                ? "APPROVED"
                : "ERROR"}
            </span>
          </div>

          <div
            className={
              status === "NOT_OK"
                ? styles.incorrectStatus
                : status === "OK"
                ? styles.correctStatus
                : styles.errorStatus
            }
          >
            {resultMessage}
          </div>
        </div>
      )}
      {/* AI Output Image */}
      {outputImageUrl && (
        <div className={styles.resultCard}>
          <h3>AI Detection Output</h3>
          <img
            src={outputImageUrl}
            alt="AI Result"
            className={styles.resultImage}
          />
        </div>
      )}
    </div>
  );
}

export default ProductQualityCheck;
