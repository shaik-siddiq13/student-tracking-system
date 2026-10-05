import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function StudentSkills() {
  const { apiRequest } = useAuth();

  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/students/dashboard");

      if (!response.ok) {
        throw new Error("Failed to load dashboard data");
      }

      const data = await response.json();

      console.log("Skills dashboard data:", data);

      setPerformance(data?.performance || null);

    } catch (err) {
      console.error("Failed to load skills:", err);

      setError(
        err.message || "Unable to load your skills."
      );

      setPerformance(null);

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // SKILLS
  // =====================================================

  const skills = [
    {
      name: "Python",
      key: "python_score",
      icon: "🐍",
    },
    {
      name: "SQL",
      key: "sql_score",
      icon: "🗄️",
    },
    {
      name: "PySpark",
      key: "pyspark_score",
      icon: "⚡",
    },
    {
      name: "AWS",
      key: "aws_score",
      icon: "☁️",
    },
    {
      name: "Data Engineering",
      key: "data_engineering_score",
      icon: "📊",
    },
    {
      name: "Communication",
      key: "communication_score",
      icon: "💬",
    },
  ];


  // =====================================================
  // GET SCORE
  // =====================================================

  const getScore = (key) => {
    if (!performance) {
      return 0;
    }

    const value = performance[key];

    if (
      value === null ||
      value === undefined
    ) {
      return 0;
    }

    return Number(value);
  };


  // =====================================================
  // SKILL LEVEL
  // =====================================================

  const getSkillLevel = (score) => {

    if (score >= 90) {
      return "Excellent";
    }

    if (score >= 75) {
      return "Good";
    }

    if (score >= 60) {
      return "Average";
    }

    if (score > 0) {
      return "Needs Improvement";
    }

    return "Not Assessed";
  };


  // =====================================================
  // PROGRESS
  // =====================================================

  const getProgressWidth = (score) => {
    return `${Math.min(
      Math.max(score, 0),
      100
    )}%`;
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.page}>

        <div style={styles.loadingCard}>

          <div style={styles.loadingIcon}>
            🎓
          </div>

          <h2 style={styles.loadingTitle}>
            Loading Skills...
          </h2>

          <p style={styles.loadingText}>
            Please wait while we load your skill information.
          </p>

        </div>

      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div style={styles.page}>

        <div style={styles.errorCard}>

          <div style={styles.errorIcon}>
            ⚠️
          </div>

          <h2 style={styles.errorTitle}>
            Unable to Load Skills
          </h2>

          <p style={styles.errorText}>
            {error}
          </p>

          <button
            type="button"
            onClick={loadSkills}
            style={styles.retryButton}
          >
            🔄 Retry
          </button>

        </div>

      </div>
    );
  }


  return (
    <div style={styles.page}>

      <div style={styles.container}>


        {/* =================================================
            HEADER
            ================================================= */}

        <div style={styles.header}>

          <div>

            <h1 style={styles.title}>
              My Skills
            </h1>

            <p style={styles.subtitle}>
              View your current technical and professional skill levels.
            </p>

          </div>


          <button
            type="button"
            onClick={loadSkills}
            style={styles.refreshButton}
          >
            🔄 Refresh
          </button>

        </div>


        {/* =================================================
            OVERALL SCORE
            ================================================= */}

        <div style={styles.overallCard}>

          <div style={styles.overallLeft}>

            <div style={styles.overallIcon}>
              ⭐
            </div>

            <div>

              <h2 style={styles.overallTitle}>
                Overall Skill Score
              </h2>

              <p style={styles.overallDescription}>
                Your overall performance across assessed skills.
              </p>

            </div>

          </div>


          <div style={styles.overallScore}>

            {performance?.overall_score ?? 0}

            <span style={styles.scoreOutOf}>
              /100
            </span>

          </div>

        </div>


        {/* =================================================
            SKILL ASSESSMENT
            ================================================= */}

        <div style={styles.section}>

          <div style={styles.sectionHeader}>

            <div>

              <h2 style={styles.sectionTitle}>
                Skill Assessment
              </h2>

              <p style={styles.sectionDescription}>
                Your latest scores for each assessed skill.
              </p>

            </div>

          </div>


          {performance ? (

            <div style={styles.skillsGrid}>

              {skills.map((skill) => {

                const score =
                  getScore(skill.key);

                const level =
                  getSkillLevel(score);

                return (

                  <div
                    key={skill.key}
                    style={styles.skillCard}
                  >

                    <div style={styles.skillTop}>

                      <div style={styles.skillNameContainer}>

                        <div style={styles.skillIcon}>
                          {skill.icon}
                        </div>

                        <div>

                          <h3 style={styles.skillName}>
                            {skill.name}
                          </h3>

                          <span style={styles.skillLevel}>
                            {level}
                          </span>

                        </div>

                      </div>


                      <div style={styles.skillScore}>

                        {score}

                        <span style={styles.skillScoreOutOf}>
                          /100
                        </span>

                      </div>

                    </div>


                    <div style={styles.progressBackground}>

                      <div
                        style={{
                          ...styles.progressBar,
                          width:
                            getProgressWidth(score),
                        }}
                      />

                    </div>

                  </div>

                );

              })}

            </div>

          ) : (

            <div style={styles.emptyCard}>

              <div style={styles.emptyIcon}>
                📚
              </div>

              <h3 style={styles.emptyTitle}>
                No Skill Assessments Yet
              </h3>

              <p style={styles.emptyText}>
                Your skill scores will appear here after
                assessments are recorded by the admin.
              </p>

            </div>

          )}

        </div>


        {/* =================================================
            ASSESSMENT SUMMARY
            ================================================= */}

        {performance && (

          <div style={styles.summaryGrid}>


            {/* ASSESSMENTS */}

            <div style={styles.summaryCard}>

              <div style={styles.summaryIcon}>
                📝
              </div>

              <div>

                <p style={styles.summaryLabel}>
                  Assessments
                </p>

                <h3 style={styles.summaryValue}>
                  {performance.assessment_count ?? 0}
                </h3>

              </div>

            </div>


            {/* MOCK INTERVIEWS */}

            <div style={styles.summaryCard}>

              <div style={styles.summaryIcon}>
                🎤
              </div>

              <div>

                <p style={styles.summaryLabel}>
                  Mock Interviews
                </p>

                <h3 style={styles.summaryValue}>
                  {performance.mock_interview_count ?? 0}
                </h3>

              </div>

            </div>


            {/* OVERALL SCORE */}

            <div style={styles.summaryCard}>

              <div style={styles.summaryIcon}>
                🏆
              </div>

              <div>

                <p style={styles.summaryLabel}>
                  Overall Score
                </p>

                <h3 style={styles.summaryValue}>

                  {performance.overall_score ?? 0}

                  <span style={styles.smallScore}>
                    /100
                  </span>

                </h3>

              </div>

            </div>


          </div>

        )}

      </div>

    </div>
  );
}


// =========================================================
// STYLES
// =========================================================

const styles = {

  page: {
    minHeight: "100vh",
    padding: "30px",
    background: "#f4f7fb",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
    color: "#1f2937",
  },


  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },


  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },


  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "700",
  },


  subtitle: {
    margin: "8px 0 0",
    color: "#6b7280",
    fontSize: "15px",
  },


  refreshButton: {
    border: "none",
    borderRadius: "8px",
    padding: "11px 18px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },


  overallCard: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "25px",
    marginBottom: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    boxShadow:
      "0 2px 10px rgba(0, 0, 0, 0.06)",
    flexWrap: "wrap",
  },


  overallLeft: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },


  overallIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff7ed",
    fontSize: "25px",
  },


  overallTitle: {
    margin: 0,
    fontSize: "20px",
  },


  overallDescription: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },


  overallScore: {
    fontSize: "38px",
    fontWeight: "700",
    color: "#2563eb",
  },


  scoreOutOf: {
    fontSize: "16px",
    color: "#6b7280",
    fontWeight: "400",
  },


  section: {
    marginBottom: "25px",
  },


  sectionHeader: {
    marginBottom: "15px",
  },


  sectionTitle: {
    margin: 0,
    fontSize: "22px",
  },


  sectionDescription: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },


  skillsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "18px",
  },


  skillCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow:
      "0 2px 10px rgba(0, 0, 0, 0.05)",
  },


  skillTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "16px",
  },


  skillNameContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },


  skillIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },


  skillName: {
    margin: 0,
    fontSize: "16px",
  },


  skillLevel: {
    display: "inline-block",
    marginTop: "4px",
    fontSize: "12px",
    color: "#6b7280",
  },


  skillScore: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#2563eb",
  },


  skillScoreOutOf: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "400",
  },


  progressBackground: {
    width: "100%",
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "999px",
    overflow: "hidden",
  },


  progressBar: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "999px",
    transition: "width 0.4s ease",
  },


  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },


  summaryCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow:
      "0 2px 10px rgba(0, 0, 0, 0.05)",
  },


  summaryIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "10px",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },


  summaryLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },


  summaryValue: {
    margin: "4px 0 0",
    fontSize: "24px",
  },


  smallScore: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "400",
  },


  emptyCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "45px 25px",
    textAlign: "center",
    boxShadow:
      "0 2px 10px rgba(0, 0, 0, 0.05)",
  },


  emptyIcon: {
    fontSize: "42px",
  },


  emptyTitle: {
    margin: "12px 0 5px",
  },


  emptyText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },


  loadingCard: {
    maxWidth: "500px",
    margin: "100px auto",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow:
      "0 2px 10px rgba(0, 0, 0, 0.06)",
  },


  loadingIcon: {
    fontSize: "45px",
  },


  loadingTitle: {
    margin: "15px 0 8px",
  },


  loadingText: {
    margin: 0,
    color: "#6b7280",
  },


  errorCard: {
    maxWidth: "500px",
    margin: "100px auto",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow:
      "0 2px 10px rgba(0, 0, 0, 0.06)",
  },


  errorIcon: {
    fontSize: "45px",
  },


  errorTitle: {
    margin: "15px 0 8px",
  },


  errorText: {
    margin: "0 0 20px",
    color: "#dc2626",
  },


  retryButton: {
    border: "none",
    borderRadius: "8px",
    padding: "11px 18px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

};


export default StudentSkills;
