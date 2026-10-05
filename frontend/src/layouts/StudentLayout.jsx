import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StudentLayout() {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/student/dashboard",
      icon: "🏠",
    },
    {
      label: "My Profile",
      path: "/student/profile",
      icon: "👤",
    },
    {
      label: "My Interviews",
      path: "/student/interviews",
      icon: "💼",
    },
    {
      label: "Interview Questions",
      path: "/student/questions",
      icon: "📝",
    },
    {
      label: "My Skills",
      path: "/student/skills",
      icon: "🎯",
    },
    {
      label: "Performance",
      path: "/student/performance",
      icon: "📊",
    },
  ];

  const displayName =
    user?.first_name ||
    user?.username ||
    "Student";

  const avatarLetter =
    displayName.charAt(0).toUpperCase();

  return (
    <div style={styles.container}>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside style={styles.sidebar}>

        {/* ===================================================
            LOGO
        =================================================== */}

        <div style={styles.logoSection}>
          <img
            src="https://tweaktalent.com/images/logo.png"
            alt="Tweak Talent Technologies"
            style={styles.logoImage}
          />
        </div>


        {/* ===================================================
            STUDENT PROFILE
        =================================================== */}

        <div style={styles.profileSection}>

          <div style={styles.avatar}>
            {avatarLetter}
          </div>

          <div style={styles.profileDetails}>

            <div style={styles.profileName}>
              {displayName}
            </div>

            <div style={styles.profileRole}>
              Student
            </div>

          </div>

          <div style={styles.onlineDot}></div>

        </div>


        {/* ===================================================
            MENU TITLE
        =================================================== */}

        <div style={styles.menuTitle}>
          MENU
        </div>


        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <nav style={styles.navigation}>

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.navLink,

                ...(isActive
                  ? styles.activeNavLink
                  : {}),
              })}
            >

              {({ isActive }) => (
                <>
                  {/* ICON */}

                  <span
                    style={{
                      ...styles.navIconBox,

                      ...(isActive
                        ? styles.activeNavIconBox
                        : {}),
                    }}
                  >
                    {item.icon}
                  </span>


                  {/* TEXT */}

                  <span style={styles.navText}>
                    {item.label}
                  </span>


                  {/* ARROW */}

                  <span
                    style={{
                      ...styles.navArrow,

                      opacity: isActive
                        ? 1
                        : 0,
                    }}
                  >
                    ›
                  </span>
                </>
              )}

            </NavLink>
          ))}

        </nav>


        {/* ===================================================
            SIDEBAR BOTTOM
        =================================================== */}

        <div style={styles.sidebarBottom}>

          {/* HELP */}

          <div style={styles.helpBox}>

            <div style={styles.helpIcon}>
              ?
            </div>

            <div>

              <div style={styles.helpTitle}>
                Need Help?
              </div>

              <div style={styles.helpText}>
                Contact your administrator
              </div>

            </div>

          </div>


          {/* LOGOUT */}

          <button
            type="button"
            onClick={logout}
            style={styles.logoutButton}
          >

            <span style={styles.logoutIcon}>
              🚪
            </span>

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main style={styles.main}>

        {/* ===================================================
            HEADER
        =================================================== */}

        <header style={styles.header}>

          <div style={styles.headerLeft}>

            <div style={styles.headerAccent}></div>

            <div>

              <div style={styles.headerTitle}>
                TTT NexGen Tracker
              </div>

              <div style={styles.headerSubtitle}>
                Student Management Portal
              </div>

            </div>

          </div>


          {/* =================================================
              HEADER RIGHT
          ================================================= */}

          <div style={styles.headerRight}>

            <div style={styles.headerWelcome}>

              <span style={styles.welcomeLabel}>
                Welcome back,
              </span>

              <strong style={styles.welcomeName}>
                {displayName}
              </strong>

            </div>

            <div style={styles.headerAvatar}>
              {avatarLetter}
            </div>

          </div>

        </header>


        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <div style={styles.content}>
          <Outlet />
        </div>

      </main>

    </div>
  );
}


/* ===========================================================
   STYLES
=========================================================== */

const styles = {

  /* =========================================================
     CONTAINER
  ========================================================= */

  container: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",

    background: "#f3f4f6",

    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },


  /* =========================================================
     SIDEBAR
  ========================================================= */

  sidebar: {
    width: "260px",
    minHeight: "100vh",

    background: "#111827",
    color: "#ffffff",

    display: "flex",
    flexDirection: "column",

    position: "fixed",

    left: 0,
    top: 0,
    bottom: 0,

    zIndex: 100,

    boxShadow:
      "4px 0 20px rgba(0, 0, 0, 0.08)",
  },


  /* =========================================================
     LOGO SECTION
  ========================================================= */

  logoSection: {
    height: "112px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    padding: "12px 14px",

    borderBottom:
      "1px solid rgba(255,255,255,0.08)",

    boxSizing: "border-box",

    overflow: "hidden",

    flexShrink: 0,
  },


  /* =========================================================
     LOGO IMAGE
  ========================================================= */

  logoImage: {
    width: "235px",
    height: "86px",

    objectFit: "contain",
    objectPosition: "center",

    display: "block",

    maxWidth: "100%",
    maxHeight: "100%",

    flexShrink: 0,
  },


  /* =========================================================
     PROFILE
  ========================================================= */

  profileSection: {
    margin: "18px 16px 10px",

    padding: "14px",

    display: "flex",
    alignItems: "center",

    gap: "12px",

    borderRadius: "12px",

    background:
      "rgba(255,255,255,0.06)",

    border:
      "1px solid rgba(255,255,255,0.06)",

    position: "relative",
  },


  avatar: {
    width: "42px",
    height: "42px",

    minWidth: "42px",

    borderRadius: "50%",

    background: "#2563eb",

    color: "#ffffff",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "17px",
    fontWeight: "700",

    boxShadow:
      "0 4px 10px rgba(37,99,235,0.25)",
  },


  profileDetails: {
    minWidth: 0,
    flex: 1,
  },


  profileName: {
    color: "#ffffff",

    fontSize: "14px",
    fontWeight: "700",

    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },


  profileRole: {
    marginTop: "3px",

    color: "#9ca3af",

    fontSize: "12px",
  },


  onlineDot: {
    width: "8px",
    height: "8px",

    borderRadius: "50%",

    background: "#22c55e",

    position: "absolute",

    right: "13px",
    top: "13px",

    boxShadow:
      "0 0 0 3px rgba(34,197,94,0.12)",
  },


  /* =========================================================
     MENU
  ========================================================= */

  menuTitle: {
    padding: "18px 22px 8px",

    color: "#6b7280",

    fontSize: "10px",

    fontWeight: "700",

    letterSpacing: "1.2px",
  },


  /* =========================================================
     NAVIGATION
  ========================================================= */

  navigation: {
    display: "flex",
    flexDirection: "column",

    padding: "4px 12px",

    gap: "4px",

    flex: 1,
  },


  navLink: {
    minHeight: "48px",

    display: "flex",
    alignItems: "center",

    gap: "12px",

    padding: "8px 12px",

    borderRadius: "10px",

    color: "#cbd5e1",

    textDecoration: "none",

    fontSize: "14px",

    fontWeight: "500",

    transition:
      "background 0.2s ease, color 0.2s ease, transform 0.2s ease",

    boxSizing: "border-box",
  },


  activeNavLink: {
    background: "#2563eb",

    color: "#ffffff",

    boxShadow:
      "0 5px 15px rgba(37, 99, 235, 0.25)",
  },


  navIconBox: {
    width: "34px",
    height: "34px",

    minWidth: "34px",

    borderRadius: "8px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "16px",

    background:
      "rgba(255,255,255,0.05)",
  },


  activeNavIconBox: {
    background:
      "rgba(255,255,255,0.16)",
  },


  navText: {
    flex: 1,
  },


  navArrow: {
    fontSize: "21px",

    lineHeight: 1,

    color: "#ffffff",

    transition:
      "opacity 0.2s ease",
  },


  /* =========================================================
     SIDEBAR BOTTOM
  ========================================================= */

  sidebarBottom: {
    padding: "12px",

    borderTop:
      "1px solid rgba(255,255,255,0.08)",
  },


  /* =========================================================
     HELP
  ========================================================= */

  helpBox: {
    display: "flex",
    alignItems: "center",

    gap: "10px",

    padding: "12px",

    marginBottom: "10px",

    borderRadius: "10px",

    background:
      "rgba(255,255,255,0.04)",
  },


  helpIcon: {
    width: "28px",
    height: "28px",

    borderRadius: "50%",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    background: "#374151",

    color: "#d1d5db",

    fontSize: "13px",

    fontWeight: "700",
  },


  helpTitle: {
    fontSize: "12px",

    fontWeight: "600",

    color: "#e5e7eb",
  },


  helpText: {
    marginTop: "2px",

    fontSize: "10px",

    color: "#6b7280",
  },


  /* =========================================================
     LOGOUT
  ========================================================= */

  logoutButton: {
    width: "100%",

    height: "44px",

    display: "flex",
    alignItems: "center",

    gap: "12px",

    padding: "0 13px",

    border: "none",

    borderRadius: "9px",

    background:
      "rgba(255,255,255,0.04)",

    color: "#d1d5db",

    fontSize: "14px",

    fontWeight: "500",

    cursor: "pointer",

    textAlign: "left",
  },


  logoutIcon: {
    width: "30px",

    textAlign: "center",

    fontSize: "16px",
  },


  /* =========================================================
     MAIN
  ========================================================= */

  main: {
    marginLeft: "260px",

    width:
      "calc(100% - 260px)",

    minHeight: "100vh",

    boxSizing: "border-box",
  },


  /* =========================================================
     HEADER
  ========================================================= */

  header: {
    height: "86px",

    background: "#ffffff",

    borderBottom:
      "1px solid #e5e7eb",

    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    padding: "0 32px",

    boxSizing: "border-box",

    position: "sticky",

    top: 0,

    zIndex: 50,

    boxShadow:
      "0 2px 12px rgba(15, 23, 42, 0.04)",
  },


  headerLeft: {
    display: "flex",

    alignItems: "center",

    gap: "14px",
  },


  headerAccent: {
    width: "4px",

    height: "42px",

    borderRadius: "10px",

    background: "#2563eb",

    flexShrink: 0,
  },


  headerTitle: {
    fontSize: "21px",

    fontWeight: "750",

    color: "#111827",

    letterSpacing: "-0.4px",

    lineHeight: "26px",
  },


  headerSubtitle: {
    marginTop: "3px",

    fontSize: "12px",

    color: "#6b7280",

    fontWeight: "500",

    letterSpacing: "0.2px",
  },


  /* =========================================================
     HEADER RIGHT
  ========================================================= */

  headerRight: {
    display: "flex",

    alignItems: "center",

    gap: "13px",

    padding: "7px 8px 7px 14px",

    borderRadius: "14px",

    background: "#f8fafc",

    border: "1px solid #eef2f7",
  },


  headerWelcome: {
    display: "flex",

    flexDirection: "column",

    alignItems: "flex-end",

    justifyContent: "center",

    lineHeight: "normal",
  },


  welcomeLabel: {
    fontSize: "11px",

    color: "#9ca3af",

    fontWeight: "500",

    marginBottom: "2px",
  },


  welcomeName: {
    fontSize: "14px",

    color: "#111827",

    fontWeight: "700",
  },


  headerAvatar: {
    width: "40px",
    height: "40px",

    borderRadius: "12px",

    background: "#2563eb",

    color: "#ffffff",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "15px",

    fontWeight: "700",

    boxShadow:
      "0 4px 10px rgba(37, 99, 235, 0.20)",
  },


  /* =========================================================
     CONTENT
  ========================================================= */

  content: {
    padding: "28px 30px 40px",

    boxSizing: "border-box",

    width: "100%",
  },
};

export default StudentLayout;