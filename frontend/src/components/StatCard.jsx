function StatCard({ icon, title, value }) {
  return (
    <div style={styles.card}>
      <div style={styles.icon}>
        {icon}
      </div>

      <div>
        <p style={styles.title}>
          {title}
        </p>

        <h2 style={styles.value}>
          {value}
        </h2>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
  },

  icon: {
    width: "50px",
    height: "50px",
    borderRadius: "10px",
    background: "#eff6ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
  },

  title: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },

  value: {
    margin: "5px 0 0",
    color: "#1f2937",
    fontSize: "24px",
  },
};

export default StatCard;