import { useState } from "react";
import styles from "./SmartStockChatbot.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faXmark } from "@fortawesome/free-solid-svg-icons";
import { askAI } from "../../../api/api";

const QUICK_QUESTIONS = [
  "Show low-stock items",
  "Which products are out of stock",
  "Show all active alerts",
  "Misplaced products"
];

const SmartStockChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 I’m SmartStock Assistant. How can I help you?" }
  ]);

  const handleQuestionClick = async (question) => {
    const token = localStorage.getItem("token");

    setMessages((prev) => [...prev, { from: "user", text: question }]);

    try {
      const res = await askAI(question, token);

      if (Array.isArray(res.data)) {
        const list = res.data
          .map((item) =>
            item.Title
              ? `• ${item.Title} (Qty: ${item.QTY ?? "N/A"})`
              : `• ${item.message}`
          )
          .join("\n");

        setMessages((prev) => [
          ...prev,
          { from: "bot", text: `${res.message}\n${list}` }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: res.message }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Failed to fetch AI response." }
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className={styles.floatingBtn} onClick={() => setOpen(true)}>
        <FontAwesomeIcon icon={faComments} />
      </div>

      {/* Chat Window */}
      {open && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <span>SmartStock AI</span>
            <FontAwesomeIcon icon={faXmark} onClick={() => setOpen(false)} />
          </div>

          <div className={styles.body}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`${styles.msg} ${
                  m.from === "bot" ? styles.bot : styles.user
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className={styles.quickQuestions}>
            {QUICK_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => handleQuestionClick(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SmartStockChatbot;
