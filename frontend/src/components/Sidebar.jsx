function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    {
      id: "dashboard",
      icon: "🏠",
      label: "Dashboard",
    },
    {
      id: "profile",
      icon: "👤",
      label: "My Profile",
    },
    {
      id: "interviews",
      icon: "🎯",
      label: "Interviews",
    },
    {
      id: "performance",
      icon: "📊",
      label: "Performance",
    },
    {
      id: "employment",
      icon: "💼",
      label: "Employment",
    },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoSection}>
        <div style={styles.logoIcon}>🎓</div>

        <div>
          <h2 style={styles.logoTitle}>
            Student
          </h2>

          <p style={styles.logoSubtitle}>
            Tracking System
          </p>
        </div>
      </div>

      <nav style={styles.navigation}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            style={{
              ...styles.menuItem,
              ...(activePage === item.id
                ? styles.activeMenuItem
                : {}),
            }}
          >
            <span style={styles.icon}>
              {item.icon}
            </span>

            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={styles.sidebarFooter}>
        <p>Student Portal</p>
        <p>v1.0</p>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    minHeight: "100vh",
    background: "#1e3a8a",
    color: "white",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
  },

  logoSection: {
    padding: "25px 20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
  },

  logoIcon: {
    fontSize: "32px",
  },

  logoTitle: {
    margin: 0,
    fontSize: "20px",
  },

  logoSubtitle: {
    margin: "3px 0 0",
    fontSize: "12px",
    opacity: 0.7,
  },

  navigation: {
    padding: "20px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  menuItem: {
    width: "100%",
    padding: "13px 15px",
    border: "none",
    borderRadius: "8px",
    background: "transparent",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "15px",
    cursor: "pointer",
    textAlign: "left",
  },

  activeMenuItem: {
    background: "#2563eb",
    fontWeight: "bold",
  },

  icon: {
    fontSize: "18px",
    width: "25px",
  },

  sidebarFooter: {
    marginTop: "auto",
    padding: "20px",
    borderTop: "1px solid rgba(255,255,255,0.15)",
    fontSize: "12px",
    opacity: 0.6,
    display: "flex",
    justifyContent: "space-between",
  },
};

export default Sidebar;