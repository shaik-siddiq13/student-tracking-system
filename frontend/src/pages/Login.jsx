import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    if (!username.trim()) {
      setError("Please enter your username.");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      setLoading(false);
      return;
    }

    const result = await login(
      username.trim(),
      password
    );

    setLoading(false);

    if (!result.success) {
      setError(
        result.error ||
          "Invalid username or password."
      );
      return;
    }

    const role = result.user?.role;

    if (role === "ADMIN") {
      navigate("/admin/dashboard", {
        replace: true,
      });
    } else {
      navigate("/student/dashboard", {
        replace: true,
      });
    }
  };

  return (
    <>
      <style>{`

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          width: 100%;
          min-height: 100%;
        }

        body {
          overflow-x: hidden;
        }

        /* =====================================================
           PAGE
        ===================================================== */

        .login-page {
          width: 100%;
          height: 100vh;

          display: flex;

          overflow: hidden;

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;

          background: #f5f7fb;
        }


        /* =====================================================
           LEFT
        ===================================================== */

        .login-left {
          position: relative;

          width: 52%;

          height: 100vh;

          overflow: hidden;
        }


        /* =====================================================
           RIGHT
        ===================================================== */

        .login-right {
          position: relative;

          width: 48%;

          height: 100vh;

          display: flex;

          align-items: center;

          justify-content: center;

          overflow: hidden;
        }


        /* =====================================================
           INPUT FOCUS
        ===================================================== */

        .login-input {
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .login-input::placeholder {
          color: #a4afc0;
        }

        .login-input:focus {
          border-color: #397cff !important;

          background: #ffffff !important;

          box-shadow:
            0 0 0 3px
            rgba(57, 124, 255, 0.08);
        }


        /* =====================================================
           BUTTON
        ===================================================== */

        .login-button {
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-1px);

          box-shadow:
            0 10px 24px
            rgba(37, 99, 235, 0.23);
        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 850px) {

          .login-page {
            min-height: 100vh;

            height: auto;

            overflow-y: auto;
          }

          .login-left {
            display: none;
          }

          .login-right {
            width: 100%;

            min-height: 100vh;

            height: auto;

            padding: 35px 20px;
          }

          .login-form-area {
            max-width: 420px !important;
          }

        }


        /* =====================================================
           SMALL LAPTOP
        ===================================================== */

        @media
        (min-width: 851px)
        and (max-height: 720px) {

          .left-content {
            padding-top: 24px !important;
          }

          .left-heading {
            margin-top: 42px !important;
          }

          .left-heading h2 {
            font-size: 40px !important;
          }

          .left-description {
            margin-top: 12px !important;
          }

          .feature-list {
            margin-top: 20px !important;
            gap: 10px !important;
          }

          .feature-item {
            padding: 8px 10px !important;
          }

          .login-form-area {
            max-width: 380px !important;
          }

          .login-logo-box {
            width: 76px !important;
            height: 52px !important;
          }

          .login-logo {
            width: 70px !important;
            height: 48px !important;
          }

          .login-heading {
            margin-bottom: 17px !important;
          }

          .login-heading h1 {
            font-size: 26px !important;
          }

          .login-heading h2 {
            font-size: 23px !important;
          }

          .login-input {
            height: 42px !important;
          }

          .login-button {
            height: 42px !important;
          }

          .why-section {
            margin-top: 13px !important;
          }

        }

      `}</style>


      {/* =====================================================
          MAIN PAGE
      ===================================================== */}

      <div className="login-page">


        {/* ===================================================
            LEFT PANEL
        =================================================== */}

        <section
          className="login-left"
          style={styles.leftPanel}
        >

          {/* Background decorations */}

          <div style={styles.glowOne} />

          <div style={styles.glowTwo} />

          <div style={styles.gridPattern} />


          <div
            className="left-content"
            style={styles.leftContent}
          >


            {/* =================================================
                BRAND
            ================================================= */}

            <div style={styles.brand}>

              <div style={styles.logoBox}>

                <img
                  src="https://tweaktalent.com/images/logo.png"
                  alt="Tweak Talent Technologies"
                  style={styles.logo}
                />

              </div>


              <div style={styles.brandText}>

                <div style={styles.brandName}>
                  TTT NexGen Tracker
                </div>

                <div style={styles.brandSubtitle}>
                  Student Career & Placement Intelligence
                </div>

              </div>

            </div>


            {/* =================================================
                HEADING
            ================================================= */}

            <div
              className="left-heading"
              style={styles.leftHeading}
            >

              <div style={styles.smallLabel}>
                STUDENT CAREER PLATFORM
              </div>


              <h2 style={styles.heroTitle}>
                Your Career
                <br />

                <span style={styles.heroBlue}>
                  Journey, Smarter.
                </span>
              </h2>


              <p
                className="left-description"
                style={styles.heroDescription}
              >
                One place to track your interviews,
                strengthen your skills and prepare
                yourself for the next opportunity.
              </p>

            </div>


            {/* =================================================
                FEATURE LIST
            ================================================= */}

            <div
              className="feature-list"
              style={styles.featureList}
            >

              <Feature
                number="01"
                icon="▣"
                title="Interview Tracking"
                text="Keep your interview journey organized."
              />

              <Feature
                number="02"
                icon="▤"
                title="Interview Questions"
                text="Prepare with questions from real experiences."
              />

              <Feature
                number="03"
                icon="◈"
                title="Skill Assessment"
                text="Understand your strengths and improve."
              />

            </div>


            {/* =================================================
                BOTTOM MESSAGE
            ================================================= */}

            <div style={styles.bottomMessage}>

              <div style={styles.bottomLine} />

              <div>

                <div style={styles.bottomTitle}>
                  Better Skills
                  <span style={styles.arrow}>
                    →
                  </span>
                  Bigger Opportunities
                </div>

                <div style={styles.bottomText}>
                  Build today. Perform tomorrow.
                </div>

              </div>

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div style={styles.leftFooter}>

              <span style={styles.footerCheck}>
                ✓
              </span>

              <span>
                © 2026 TTT NexGen Tracker
              </span>

              <span style={styles.footerDot}>
                •
              </span>

              <span>
                Tweak Talent Technologies
              </span>

            </div>

          </div>

        </section>


        {/* ===================================================
            RIGHT PANEL
        =================================================== */}

        <section
          className="login-right"
          style={styles.rightPanel}
        >

          <div style={styles.rightGlowTop} />

          <div style={styles.rightGlowBottom} />


          {/* =================================================
              LOGIN CONTAINER
          ================================================= */}

          <div
            className="login-form-area"
            style={styles.loginFormArea}
          >


            {/* =================================================
                LOGO
            ================================================= */}

            <div style={styles.loginLogoArea}>

              <div
                className="login-logo-box"
                style={styles.loginLogoBox}
              >

                <img
                  className="login-logo"
                  src="https://tweaktalent.com/images/logo.png"
                  alt="Tweak Talent Technologies"
                  style={styles.loginLogo}
                />

              </div>

            </div>


            {/* =================================================
                HEADING
            ================================================= */}

            <div
              className="login-heading"
              style={styles.loginHeading}
            >

              <h2 style={styles.welcomeText}>
                Welcome to
              </h2>

              <h1 style={styles.trackerText}>
                TTT NexGen Tracker
              </h1>

              <p style={styles.loginSubtitle}>
                Sign in to continue to your
                learning journey.
              </p>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div style={styles.errorBox}>

                <span style={styles.errorIcon}>
                  !
                </span>

                <span>
                  {error}
                </span>

              </div>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <form onSubmit={handleSubmit}>


              {/* USERNAME */}

              <div style={styles.inputGroup}>

                <label style={styles.label}>
                  Username
                </label>

                <div style={styles.inputWrapper}>

                  <span style={styles.inputIcon}>
                    ♙
                  </span>

                  <input
                    className="login-input"
                    type="text"
                    value={username}
                    onChange={(event) =>
                      setUsername(
                        event.target.value
                      )
                    }
                    placeholder="Enter your username"
                    style={styles.input}
                    autoComplete="username"
                    disabled={loading}
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div style={styles.inputGroup}>

                <label style={styles.label}>
                  Password
                </label>

                <div style={styles.inputWrapper}>

                  <span style={styles.inputIcon}>
                    ◈
                  </span>

                  <input
                    className="login-input"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter your password"
                    style={styles.input}
                    autoComplete="current-password"
                    disabled={loading}
                  />

                </div>

              </div>


              {/* SIGN IN */}

              <button
                className="login-button"
                type="submit"
                disabled={loading}
                style={{
                  ...styles.loginButton,

                  ...(loading
                    ? styles.disabledButton
                    : {}),
                }}
              >

                <span>
                  {loading
                    ? "Signing in..."
                    : "Sign In"}
                </span>

                {!loading && (
                  <span style={styles.buttonArrow}>
                    →
                  </span>
                )}

              </button>

            </form>


            {/* =================================================
                WHY TTT
            ================================================= */}

            <div
              className="why-section"
              style={styles.whySection}
            >

              <span style={styles.whyLine} />

              <span style={styles.whyTitle}>
                WHY TTT NEXGEN?
              </span>

              <span style={styles.whyLine} />

            </div>


            {/* =================================================
                BENEFITS
            ================================================= */}

            <div style={styles.benefits}>

              <Benefit
                icon="✓"
                title="Secure"
                text="Access"
              />

              <Benefit
                icon="◆"
                title="Role-Based"
                text="Permissions"
              />

              <Benefit
                icon="★"
                title="Career"
                text="Focused"
              />

            </div>


            {/* =================================================
                QUOTE
            ================================================= */}

            <div style={styles.quoteSection}>

              <div style={styles.quote}>
                "Small steps every day lead to big results."
              </div>

              <div style={styles.quoteLine} />

            </div>


            {/* =================================================
                SECURITY
            ================================================= */}

            <div style={styles.security}>

              <span style={styles.securityCheck}>
                ✓
              </span>

              Secure access

              <span style={styles.securityDot}>
                •
              </span>

              Role-based permissions

            </div>

          </div>

        </section>

      </div>
    </>
  );
}


// ===========================================================
// FEATURE
// ===========================================================

function Feature({
  number,
  icon,
  title,
  text,
}) {
  return (

    <div
      className="feature-item"
      style={styles.featureItem}
    >

      <div style={styles.featureNumber}>
        {number}
      </div>


      <div style={styles.featureIcon}>
        {icon}
      </div>


      <div style={styles.featureContent}>

        <div style={styles.featureTitle}>
          {title}
        </div>

        <div style={styles.featureText}>
          {text}
        </div>

      </div>

    </div>

  );
}


// ===========================================================
// BENEFIT
// ===========================================================

function Benefit({
  icon,
  title,
  text,
}) {
  return (

    <div style={styles.benefit}>

      <div style={styles.benefitIcon}>
        {icon}
      </div>

      <div>

        <div style={styles.benefitTitle}>
          {title}
        </div>

        <div style={styles.benefitText}>
          {text}
        </div>

      </div>

    </div>

  );
}


// ===========================================================
// STYLES
// ===========================================================

const styles = {

  // =========================================================
  // LEFT PANEL
  // =========================================================

  leftPanel: {

    background:
      "linear-gradient(145deg, #020817 0%, #061534 60%, #071b4d 100%)",

    color: "#ffffff",

    padding:
      "30px 48px 18px",

    position: "relative",

    overflow: "hidden",
  },


  leftContent: {

    position: "relative",

    zIndex: 5,

    height: "100%",

    display: "flex",

    flexDirection: "column",
  },


  glowOne: {

    position: "absolute",

    width: "500px",

    height: "500px",

    borderRadius: "50%",

    background:
      "radial-gradient(circle, rgba(39,112,255,0.14), transparent 68%)",

    right: "-270px",

    top: "-100px",

    pointerEvents: "none",
  },


  glowTwo: {

    position: "absolute",

    width: "350px",

    height: "350px",

    borderRadius: "50%",

    background:
      "radial-gradient(circle, rgba(50,120,255,0.08), transparent 68%)",

    left: "-190px",

    bottom: "-180px",

    pointerEvents: "none",
  },


  gridPattern: {

    position: "absolute",

    inset: 0,

    opacity: 0.035,

    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",

    backgroundSize: "42px 42px",

    pointerEvents: "none",
  },


  // =========================================================
  // BRAND
  // =========================================================

  brand: {

    display: "flex",

    alignItems: "center",

    gap: "13px",
  },


  logoBox: {

    width: "65px",

    height: "52px",

    borderRadius: "9px",

    background: "#000000",

    border:
      "1px solid rgba(255,255,255,0.13)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    overflow: "hidden",

    flexShrink: 0,

    boxShadow:
      "0 7px 18px rgba(0,0,0,0.35)",
  },


  logo: {

    width: "62px",

    height: "49px",

    objectFit: "contain",
  },


  brandText: {

    borderLeft:
      "1px solid rgba(255,255,255,0.2)",

    paddingLeft: "14px",
  },


  brandName: {

    fontSize: "18px",

    fontWeight: "750",

    letterSpacing: "-0.4px",

    lineHeight: "1.2",
  },


  brandSubtitle: {

    marginTop: "4px",

    color: "#8fa6ca",

    fontSize: "8px",

    letterSpacing: "0.2px",
  },


  // =========================================================
  // LEFT HEADING
  // =========================================================

  leftHeading: {

    marginTop: "52px",

    maxWidth: "500px",
  },


  smallLabel: {

    color: "#67a3ff",

    fontSize: "8px",

    fontWeight: "750",

    letterSpacing: "1.8px",

    marginBottom: "11px",
  },


  heroTitle: {

    margin: 0,

    fontSize: "45px",

    lineHeight: "1.02",

    fontWeight: "800",

    letterSpacing: "-2.4px",
  },


  heroBlue: {

    background:
      "linear-gradient(90deg, #2d9bff, #5862ff)",

    WebkitBackgroundClip: "text",

    WebkitTextFillColor: "transparent",
  },


  heroDescription: {

    margin:
      "14px 0 0",

    maxWidth: "420px",

    color: "#aebfdc",

    fontSize: "10px",

    lineHeight: "1.65",
  },


  // =========================================================
  // FEATURES
  // =========================================================

  featureList: {

    marginTop: "23px",

    display: "flex",

    flexDirection: "column",

    gap: "9px",

    maxWidth: "470px",
  },


  featureItem: {

    display: "flex",

    alignItems: "center",

    gap: "10px",

    padding: "9px 11px",

    border:
      "1px solid rgba(91,137,205,0.12)",

    borderRadius: "9px",

    background:
      "rgba(255,255,255,0.025)",
  },


  featureNumber: {

    width: "25px",

    color: "#536f9d",

    fontSize: "7px",

    fontWeight: "700",
  },


  featureIcon: {

    width: "32px",

    height: "32px",

    borderRadius: "8px",

    background:
      "linear-gradient(145deg, #123777, #092450)",

    border:
      "1px solid rgba(75,143,255,0.24)",

    color: "#91bbff",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "13px",

    flexShrink: 0,
  },


  featureContent: {

    minWidth: 0,
  },


  featureTitle: {

    color: "#ffffff",

    fontSize: "10px",

    fontWeight: "700",
  },


  featureText: {

    marginTop: "2px",

    color: "#7f97bb",

    fontSize: "8px",
  },


  // =========================================================
  // BOTTOM MESSAGE
  // =========================================================

  bottomMessage: {

    display: "flex",

    alignItems: "center",

    gap: "11px",

    marginTop: "22px",
  },


  bottomLine: {

    width: "3px",

    height: "32px",

    borderRadius: "5px",

    background:
      "linear-gradient(180deg, #319aff, #4649ff)",
  },


  bottomTitle: {

    color: "#d7e5fb",

    fontFamily:
      "Georgia, serif",

    fontStyle: "italic",

    fontSize: "11px",
  },


  arrow: {

    color: "#459eff",

    margin:
      "0 7px",

    fontFamily:
      "Arial, sans-serif",

    fontStyle: "normal",
  },


  bottomText: {

    marginTop: "3px",

    color: "#687f9f",

    fontSize: "7px",
  },


  // =========================================================
  // FOOTER
  // =========================================================

  leftFooter: {

    marginTop: "auto",

    display: "flex",

    alignItems: "center",

    gap: "6px",

    color: "#627a9e",

    fontSize: "7px",
  },


  footerCheck: {

    width: "14px",

    height: "14px",

    border:
      "1px solid #4d6790",

    borderRadius: "50%",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "7px",

    color: "#8ba4ca",
  },


  footerDot: {

    color: "#405776",
  },


  // =========================================================
  // RIGHT PANEL
  // =========================================================

  rightPanel: {

    background:
      "linear-gradient(145deg, #fafcff 0%, #f2f5fa 100%)",

    padding:
      "25px 38px",
  },


  rightGlowTop: {

    position: "absolute",

    width: "360px",

    height: "360px",

    borderRadius: "50%",

    background:
      "radial-gradient(circle, rgba(51,116,255,0.07), transparent 68%)",

    right: "-190px",

    top: "-210px",

    pointerEvents: "none",
  },


  rightGlowBottom: {

    position: "absolute",

    width: "300px",

    height: "300px",

    borderRadius: "50%",

    background:
      "radial-gradient(circle, rgba(51,116,255,0.05), transparent 68%)",

    left: "-170px",

    bottom: "-190px",

    pointerEvents: "none",
  },


  // =========================================================
  // LOGIN AREA
  // =========================================================

  loginFormArea: {

    width: "100%",

    maxWidth: "390px",

    position: "relative",

    zIndex: 5,
  },


  // =========================================================
  // LOGIN LOGO
  // =========================================================

  loginLogoArea: {

    display: "flex",

    justifyContent: "center",

    marginBottom: "13px",
  },


  loginLogoBox: {

    width: "82px",

    height: "55px",

    borderRadius: "10px",

    background: "#000000",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    overflow: "hidden",

    boxShadow:
      "0 8px 20px rgba(0,0,0,0.13)",
  },


  loginLogo: {

    width: "76px",

    height: "51px",

    objectFit: "contain",
  },


  // =========================================================
  // LOGIN HEADING
  // =========================================================

  loginHeading: {

    textAlign: "center",

    marginBottom: "18px",
  },


  welcomeText: {

    margin: 0,

    color: "#18233f",

    fontSize: "24px",

    lineHeight: "1.1",

    fontWeight: "700",

    letterSpacing: "-0.5px",
  },


  trackerText: {

    margin:
      "3px 0 0",

    fontSize: "28px",

    lineHeight: "1.1",

    fontWeight: "800",

    letterSpacing: "-0.9px",

    background:
      "linear-gradient(90deg, #258eff, #3738ee)",

    WebkitBackgroundClip: "text",

    WebkitTextFillColor: "transparent",
  },


  loginSubtitle: {

    margin:
      "7px 0 0",

    color: "#8996aa",

    fontSize: "9px",

    lineHeight: "1.5",
  },


  // =========================================================
  // ERROR
  // =========================================================

  errorBox: {

    display: "flex",

    alignItems: "center",

    gap: "7px",

    padding:
      "8px 10px",

    marginBottom: "11px",

    borderRadius: "8px",

    background: "#fff4f4",

    border:
      "1px solid #ffd5d5",

    color: "#c52d2d",

    fontSize: "9px",
  },


  errorIcon: {

    width: "17px",

    height: "17px",

    borderRadius: "50%",

    background: "#e53935",

    color: "#ffffff",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "10px",

    fontWeight: "800",

    flexShrink: 0,
  },


  // =========================================================
  // INPUTS
  // =========================================================

  inputGroup: {

    marginBottom: "12px",
  },


  label: {

    display: "block",

    marginBottom: "5px",

    color: "#263657",

    fontSize: "9px",

    fontWeight: "700",
  },


  inputWrapper: {

    position: "relative",
  },


  inputIcon: {

    position: "absolute",

    left: "13px",

    top: "50%",

    transform:
      "translateY(-50%)",

    color: "#8190a8",

    fontSize: "13px",

    pointerEvents: "none",

    zIndex: 2,
  },


  input: {

    width: "100%",

    height: "43px",

    padding:
      "0 12px 0 38px",

    border:
      "1px solid #d6dfec",

    borderRadius: "8px",

    outline: "none",

    background: "#fbfcfe",

    color: "#17223f",

    fontSize: "10px",

    boxShadow:
      "0 2px 7px rgba(20,40,80,0.025)",
  },


  // =========================================================
  // BUTTON
  // =========================================================

  loginButton: {

    width: "100%",

    height: "43px",

    marginTop: "2px",

    border: "none",

    borderRadius: "8px",

    background:
      "linear-gradient(90deg, #287eff, #3437ef)",

    color: "#ffffff",

    fontSize: "10px",

    fontWeight: "750",

    cursor: "pointer",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "8px",

    boxShadow:
      "0 7px 17px rgba(45,95,235,0.15)",
  },


  buttonArrow: {

    fontSize: "15px",
  },


  disabledButton: {

    opacity: 0.65,

    cursor: "not-allowed",

    transform: "none",

    boxShadow: "none",
  },


  // =========================================================
  // WHY
  // =========================================================

  whySection: {

    display: "flex",

    alignItems: "center",

    gap: "8px",

    marginTop: "15px",

    marginBottom: "7px",
  },


  whyLine: {

    flex: 1,

    height: "1px",

    background: "#dfe5ee",
  },


  whyTitle: {

    color: "#8b98ab",

    fontSize: "7px",

    fontWeight: "750",

    letterSpacing: "0.9px",

    whiteSpace: "nowrap",
  },


  // =========================================================
  // BENEFITS
  // =========================================================

  benefits: {

    display: "grid",

    gridTemplateColumns:
      "repeat(3, 1fr)",

    gap: "5px",

    padding:
      "8px 6px",

    border:
      "1px solid #e7ecf4",

    borderRadius: "8px",

    background:
      "rgba(248,250,253,0.85)",
  },


  benefit: {

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "5px",
  },


  benefitIcon: {

    width: "23px",

    height: "23px",

    borderRadius: "6px",

    background: "#eaf1ff",

    color: "#3569e8",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "10px",

    fontWeight: "800",

    flexShrink: 0,
  },


  benefitTitle: {

    color: "#4c6085",

    fontSize: "7px",

    fontWeight: "750",
  },


  benefitText: {

    marginTop: "1px",

    color: "#8291aa",

    fontSize: "6px",
  },


  // =========================================================
  // QUOTE
  // =========================================================

  quoteSection: {

    textAlign: "center",

    marginTop: "9px",
  },


  quote: {

    color: "#506382",

    fontSize: "8px",

    fontStyle: "italic",

    fontFamily:
      "Georgia, serif",
  },


  quoteLine: {

    width: "30px",

    height: "2px",

    margin:
      "4px auto 0",

    borderRadius: "5px",

    background:
      "linear-gradient(90deg, #38a0ff, #3a4bea)",
  },


  // =========================================================
  // SECURITY
  // =========================================================

  security: {

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    marginTop: "7px",

    color: "#8997af",

    fontSize: "7px",
  },


  securityCheck: {

    width: "12px",

    height: "12px",

    marginRight: "4px",

    borderRadius: "50%",

    background: "#e2f8eb",

    color: "#1da257",

    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "7px",

    fontWeight: "800",
  },


  securityDot: {

    margin:
      "0 5px",

    color: "#b4bfd0",
  },

};

export default Login;