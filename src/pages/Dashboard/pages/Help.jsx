import { useState } from "react";
import styles from "../DashboardCSS/help.module.css";

const Help = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
  });

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your support request has been submitted!");
    setFormData({ name: "", email: "", issue: "" });
  };

  const faqs = [
    {
      question: "How does AI – Misplaced Products work?",
      answer:
        "It uses a YOLO-based detection model to identify misplaced items in shelves and highlights incorrect row placements.",
    },
    {
      question: "What does Product Quality Check do?",
      answer:
        "It analyzes uploaded images and detects defective products. If defects are found, notifications are sent to managers and workers.",
    },
    {
      question: "Why is monthly trend not showing?",
      answer:
        "Monthly trend requires transaction records with valid dates. Ensure product movements are properly logged.",
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Help & Support</h2>

      {/* FAQ Section */}
      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>Frequently Asked Questions</h3>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`${styles.faqItem} ${
              activeIndex === index ? styles.active : ""
            }`}
          >
            <div
              className={styles.question}
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span className={styles.icon}>
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>
            <div className={styles.answer}>{faq.answer}</div>
          </div>
        ))}
      </div>

      {/* Support Form */}
      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>Contact Support</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="issue"
            placeholder="Describe your issue..."
            rows="4"
            value={formData.issue}
            onChange={handleChange}
            required
          />
          <button type="submit" className={styles.button}>
            Submit Request
          </button>
        </form>
      </div>

      {/* System Info */}
      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>System Information</h3>
        <div className={styles.systemInfo}>
          <p><strong>Version:</strong> 1.0</p>
          <p><strong>AI Model:</strong> YOLOv8 Custom Trained</p>
          <p><strong>Last Updated:</strong> 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Help;
