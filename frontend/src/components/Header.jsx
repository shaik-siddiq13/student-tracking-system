function Header({ title, onLogout }) {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.title}>
          {title}
        </h1>

        <p style={styles.subtitle}>
          Student Tracking System
        </p>
      </div>

      <div style={styles.rightSection}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {user.username
              ? user.username.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div>
            <p style={styles.username}>
              {user.username || "User"}
            </p>

            <p style={styles.role}>
              {user.role || "STUDENT"}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          style={styles.logoutButton}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: "80px",
    background: "white",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
    boxSizing: "border-box",
  },

  title: {
    margin: 0,
    fontSize: "24px",
    color: "#1f2937",
  },

  subtitle: {
    margin: "4px 0 0",
    color: "#6b7280",
    fontSize: "13px",
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },

  username: {
    margin: 0,
    fontWeight: "bold",
    color: "#1f2937",
  },

  role: {
    margin: "2px 0 0",
    fontSize: "11px",
    color: "#6b7280",
  },

  logoutButton: {
    padding: "9px 16px",
    border: "none",
    borderRadius: "6px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Header;