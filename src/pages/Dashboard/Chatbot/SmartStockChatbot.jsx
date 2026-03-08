import { useState } from "react";
import styles from "./SmartStockChatbot.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faXmark, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { askAI } from "../../../api/api";

const SmartStockChatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 I’m SmartStock Assistant. Ask me anything about inventory." }
  ]);

  const sendMessage = async (question) => {
    if (!question.trim()) return;

    const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

    setMessages((prev) => [...prev, { from: "user", text: question }]);
    setInput("");

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
    } catch {
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

              {/* Input */}
              <div className={styles.inputArea}>
                <input
                    type="text"
                    placeholder="Ask about stock, orders, alerts..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage(input);
                    }}
                />

                <button onClick={() => sendMessage(input)}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
        )}
      </>
  );
};

export default SmartStockChatbot;