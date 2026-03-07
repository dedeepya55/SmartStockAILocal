import React, { useEffect, useRef, useState } from "react";
import './LandingCSS/MainLoginPageStatsSection.css';

const MainLoginPageStatsSection = () => {
  const stats = [
    { label: "Users", value: 10000 },
    { label: "Warehouses", value: 50000 },
    { label: "Retailers", value: 5000 },
    { label: "Accuracy Rate", value: 95, isPercent: true },
  ];

  const cardsRef = useRef([]);
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Start counter animation
            stats.forEach((stat, index) => {
              let start = 0;
              const end = stat.value;
              const duration = 1500; // 1.5 seconds
              const increment = end / (duration / 30);

              const counter = setInterval(() => {
                start += increment;
                if (start >= end) {
                  start = end;
                  clearInterval(counter);
                }
                setCounts(prev => {
                  const newCounts = [...prev];
                  newCounts[index] = Math.floor(start);
                  return newCounts;
                });
              }, 30);
            });

            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.3 }
    );

    cardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });

    return () => {
      cardsRef.current.forEach(card => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  return (
    <section id="stats">
      <h2>Our Impact</h2>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px" }}>
        {stats.map((item, index) => (
          <div
            key={index}
            className="stats-card"
            ref={el => (cardsRef.current[index] = el)}
          >
            <h3>{counts[index].toLocaleString()}{item.isPercent ? "%" : "+"}</h3>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MainLoginPageStatsSection;
