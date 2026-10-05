import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


// =====================================================
// STUDENT PERFORMANCE
// =====================================================

function StudentPerformance() {
  const { apiRequest } = useAuth();

  // ===================================================
  // STATE
  // ===================================================

  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===================================================
  // LOAD PERFORMANCE
  // ===================================================

  const loadPerformance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest(
        "/students/dashboard"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load performance data"
        );
      }

      const data = await response.json();

      console.log(
        "Performance dashboard data:",
        data
      );

      setPerformance(
        data?.performance || null
      );

    } catch (error) {
      console.error(
        "Performance loading error:",
        error
      );

      setError(
        error.message ||
          "Unable to load performance data"
      );

    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadPerformance();
  }, []);

  // ===================================================
  // SKILLS DATA
  // ===================================================

  const skills = useMemo(() => {
    if (!performance) {
      return [];
    }

    return [
      {
        name: "Python",
        shortName: "Python",
        score:
          Number(performance.python_score) || 0,
        icon: "🐍",
      },
      {
        name: "SQL",
        shortName: "SQL",
        score:
          Number(performance.sql_score) || 0,
        icon: "🗄️",
      },
      {
        name: "PySpark",
        shortName: "PySpark",
        score:
          Number(performance.pyspark_score) || 0,
        icon: "⚡",
      },
      {
        name: "AWS",
        shortName: "AWS",
        score:
          Number(performance.aws_score) || 0,
        icon: "☁️",
      },
      {
        name: "Data Engineering",
        shortName: "Data Engineering",
        score:
          Number(
            performance.data_engineering_score
          ) || 0,
        icon: "🔧",
      },
      {
        name: "Communication",
        shortName: "Communication",
        score:
          Number(
            performance.communication_score
          ) || 0,
        icon: "💬",
      },
    ];
  }, [performance]);

  // ===================================================
  // PERFORMANCE LEVEL
  // ===================================================

  const getPerformanceLevel = (score) => {
    const numericScore = Number(score) || 0;

    if (numericScore >= 90) {
      return "Excellent";
    }

    if (numericScore >= 80) {
      return "Very Good";
    }

    if (numericScore >= 70) {
      return "Good";
    }

    if (numericScore >= 60) {
      return "Needs Improvement";
    }

    return "Beginner";
  };

  // ===================================================
  // LEVEL DESCRIPTION
  // ===================================================

  const getLevelDescription = (score) => {
    const numericScore = Number(score) || 0;

    if (numericScore >= 90) {
      return "Excellent performance. Keep maintaining this level.";
    }

    if (numericScore >= 80) {
      return "Very good performance. Continue practicing consistently.";
    }

    if (numericScore >= 70) {
      return "Good foundation. More practice can improve your score.";
    }

    if (numericScore >= 60) {
      return "Needs improvement. Focus on practice and interview preparation.";
    }

    return "Keep learning and practicing to build your skills.";
  };

  // ===================================================
  // SCORE COLOR
  // ===================================================

  const getScoreColor = (score) => {
    const numericScore = Number(score) || 0;

    if (numericScore >= 90) {
      return "#16a34a";
    }

    if (numericScore >= 80) {
      return "#2563eb";
    }

    if (numericScore >= 70) {
      return "#d97706";
    }

    return "#dc2626";
  };

  // ===================================================
  // SCORE BACKGROUND
  // ===================================================

  const getScoreBackground = (score) => {
    const numericScore = Number(score) || 0;

    if (numericScore >= 90) {
      return "#f0fdf4";
    }

    if (numericScore >= 80) {
      return "#eff6ff";
    }

    if (numericScore >= 70) {
      return "#fffbeb";
    }

    return "#fef2f2";
  };

  // ===================================================
  // BEST SKILL
  // ===================================================

  const bestSkill = useMemo(() => {
    if (!skills.length) {
      return null;
    }

    return skills.reduce(
      (best, current) =>
        current.score > best.score
          ? current
          : best,
      skills[0]
    );
  }, [skills]);

  // ===================================================
  // WEAKEST SKILL
  // ===================================================

  const weakestSkill = useMemo(() => {
    if (!skills.length) {
      return null;
    }

    return skills.reduce(
      (weakest, current) =>
        current.score < weakest.score
          ? current
          : weakest,
      skills[0]
    );
  }, [skills]);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingCircle}>
          <span style={styles.loadingIcon}>
            📊
          </span>
        </div>

        <h2 style={styles.loadingTitle}>
          Loading Performance
        </h2>

        <p style={styles.loadingText}>
          Please wait while we load your
          performance data.
        </p>
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>
            ⚠️
          </div>

          <h2 style={styles.errorTitle}>
            Unable to Load Performance
          </h2>

          <p style={styles.errorText}>
            {error}
          </p>

          <button
            type="button"
            onClick={loadPerformance}
            style={styles.retryButton}
          >
            ↻ Try Again
          </button>
        </div>
      </div>
    );
  }

  // ===================================================
  // NO DATA
  // ===================================================

  if (!performance) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>
            📊
          </div>

          <h2 style={styles.emptyTitle}>
            No Performance Data
          </h2>

          <p style={styles.emptyText}>
            Performance information is not
            available yet.
          </p>

          <button
            type="button"
            onClick={loadPerformance}
            style={styles.retryButton}
          >
            ↻ Refresh
          </button>
        </div>
      </div>
    );
  }

  // ===================================================
  // VALUES
  // ===================================================

  const overallScore =
    Number(performance.overall_score) || 0;

  const assessmentCount =
    Number(performance.assessment_count) || 0;

  const mockInterviewCount =
    Number(
      performance.mock_interview_count
    ) || 0;

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div style={styles.page}>

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div style={styles.pageHeader}>

        <div style={styles.pageHeaderLeft}>

          <div style={styles.pageHeaderIcon}>
            📊
          </div>

          <div>
            <h1 style={styles.title}>
              My Performance
            </h1>

            <p style={styles.subtitle}>
              Track your technical skills,
              assessments and interview
              preparation progress.
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={loadPerformance}
          style={styles.refreshButton}
        >
          <span style={styles.refreshIcon}>
            ↻
          </span>

          Refresh
        </button>

      </div>


      {/* =================================================
          OVERALL PERFORMANCE
      ================================================= */}

      <div style={styles.overallSection}>

        <div style={styles.overallMain}>

          <div style={styles.overallTop}>

            <div>

              <div style={styles.overallLabel}>
                OVERALL PERFORMANCE
              </div>

              <div style={styles.scoreLine}>

                <span style={styles.bigScore}>
                  {overallScore}
                </span>

                <span style={styles.outOf}>
                  /100
                </span>

              </div>

            </div>

            <div
              style={{
                ...styles.trophyBox,
                background:
                  getScoreBackground(
                    overallScore
                  ),
              }}
            >
              🏆
            </div>

          </div>


          {/* Progress */}

          <div style={styles.overallProgressBackground}>

            <div
              style={{
                ...styles.overallProgressFill,
                width: `${Math.min(
                  overallScore,
                  100
                )}%`,
                background:
                  getScoreColor(
                    overallScore
                  ),
              }}
            />

          </div>


          <div style={styles.overallBottom}>

            <div
              style={{
                ...styles.performanceBadge,
                color:
                  getScoreColor(
                    overallScore
                  ),
                background:
                  getScoreBackground(
                    overallScore
                  ),
              }}
            >
              {getPerformanceLevel(
                overallScore
              )}
            </div>

            <span style={styles.performanceDescription}>
              {getLevelDescription(
                overallScore
              )}
            </span>

          </div>

        </div>


        {/* Assessment */}

        <div style={styles.summaryStat}>

          <div style={styles.summaryStatIcon}>
            📝
          </div>

          <div>

            <div style={styles.summaryStatLabel}>
              ASSESSMENTS
            </div>

            <div style={styles.summaryStatNumber}>
              {assessmentCount}
            </div>

            <div style={styles.summaryStatText}>
              Skill assessments completed
            </div>

          </div>

        </div>


        {/* Mock Interviews */}

        <div style={styles.summaryStat}>

          <div style={styles.summaryStatIcon}>
            🎤
          </div>

          <div>

            <div style={styles.summaryStatLabel}>
              MOCK INTERVIEWS
            </div>

            <div style={styles.summaryStatNumber}>
              {mockInterviewCount}
            </div>

            <div style={styles.summaryStatText}>
              Mock interviews completed
            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          SKILL PERFORMANCE
      ================================================= */}

      <div style={styles.sectionCard}>

        <div style={styles.sectionHeader}>

          <div>

            <h2 style={styles.sectionTitle}>
              Skill Performance
            </h2>

            <p style={styles.sectionSubtitle}>
              Your current scores across
              important Data Engineering skills.
            </p>

          </div>

          <div style={styles.skillCountBadge}>
            {skills.length} Skills
          </div>

        </div>


        <div style={styles.skillGrid}>

          {skills.map((skill) => (

            <div
              key={skill.name}
              style={styles.skillCard}
            >

              {/* Skill top */}

              <div style={styles.skillTop}>

                <div style={styles.skillInfo}>

                  <div style={styles.skillIcon}>
                    {skill.icon}
                  </div>

                  <div>

                    <div style={styles.skillName}>
                      {skill.name}
                    </div>

                    <div style={styles.skillLevel}>
                      {getPerformanceLevel(
                        skill.score
                      )}
                    </div>

                  </div>

                </div>


                <div
                  style={{
                    ...styles.skillScore,
                    color:
                      getScoreColor(
                        skill.score
                      ),
                  }}
                >
                  {skill.score}
                  <span style={styles.skillScoreMax}>
                    /100
                  </span>
                </div>

              </div>


              {/* Progress */}

              <div style={styles.skillProgressBackground}>

                <div
                  style={{
                    ...styles.skillProgressFill,
                    width: `${Math.min(
                      skill.score,
                      100
                    )}%`,
                    background:
                      getScoreColor(
                        skill.score
                      ),
                  }}
                />

              </div>


              {/* Footer */}

              <div style={styles.skillFooter}>

                <span>
                  Performance
                </span>

                <strong>
                  {skill.score}%
                </strong>

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* =================================================
          PERFORMANCE CHART
      ================================================= */}

      <div style={styles.sectionCard}>

        <div style={styles.sectionHeader}>

          <div>

            <h2 style={styles.sectionTitle}>
              Performance Overview
            </h2>

            <p style={styles.sectionSubtitle}>
              Comparison of your current skill
              scores.
            </p>

          </div>

        </div>


        <div style={styles.chartContainer}>

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={skills}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 25,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="shortName"
                tick={{
                  fontSize: 12,
                  fill: "#64748b",
                }}
                axisLine={{
                  stroke: "#cbd5e1",
                }}
                tickLine={false}
                interval={0}
              />

              <YAxis
                domain={[0, 100]}
                ticks={[
                  0,
                  20,
                  40,
                  60,
                  80,
                  100,
                ]}
                tick={{
                  fontSize: 12,
                  fill: "#64748b",
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{
                  fill: "#f1f5f9",
                }}
                contentStyle={{
                  borderRadius: "10px",
                  border:
                    "1px solid #e2e8f0",
                  boxShadow:
                    "0 5px 15px rgba(15,23,42,0.08)",
                }}
                formatter={(value) => [
                  `${value}/100`,
                  "Score",
                ]}
              />

              <Bar
                dataKey="score"
                name="Score"
                fill="#2563eb"
                radius={[
                  7,
                  7,
                  0,
                  0,
                ]}
                barSize={42}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* =================================================
          INSIGHTS
      ================================================= */}

      <div style={styles.insightGrid}>

        {/* Strongest Skill */}

        <div style={styles.insightCard}>

          <div style={styles.insightIconBox}>
            💪
          </div>

          <div style={styles.insightContent}>

            <div style={styles.insightLabel}>
              STRONGEST SKILL
            </div>

            {bestSkill ? (
              <>
                <div style={styles.insightSkillName}>
                  {bestSkill.name}
                </div>

                <p style={styles.insightText}>
                  You scored{" "}
                  <strong>
                    {bestSkill.score}/100
                  </strong>{" "}
                  in this skill. Keep
                  maintaining your current
                  preparation level.
                </p>
              </>
            ) : (
              <p style={styles.insightText}>
                No skill data available.
              </p>
            )}

          </div>

        </div>


        {/* Focus Area */}

        <div style={styles.insightCard}>

          <div style={styles.focusIconBox}>
            🎯
          </div>

          <div style={styles.insightContent}>

            <div style={styles.insightLabel}>
              FOCUS AREA
            </div>

            {weakestSkill ? (
              <>
                <div style={styles.insightSkillName}>
                  {weakestSkill.name}
                </div>

                <p style={styles.insightText}>
                  Your current score is{" "}
                  <strong>
                    {weakestSkill.score}/100
                  </strong>
                  . Spend additional practice
                  time on this area.
                </p>
              </>
            ) : (
              <p style={styles.insightText}>
                No skill data available.
              </p>
            )}

          </div>

        </div>

      </div>


      {/* =================================================
          PREPARATION SUMMARY
      ================================================= */}

      <div style={styles.summaryCard}>

        <div style={styles.summaryRocket}>
          🚀
        </div>

        <div style={styles.summaryContent}>

          <div style={styles.summaryLabel}>
            INTERVIEW READINESS
          </div>

          <h2 style={styles.summaryTitle}>
            Interview Preparation Summary
          </h2>

          <p style={styles.summaryText}>
            Your overall performance score is{" "}
            <strong>
              {overallScore}/100
            </strong>
            . You have completed{" "}
            <strong>
              {assessmentCount}
            </strong>{" "}
            assessments and{" "}
            <strong>
              {mockInterviewCount}
            </strong>{" "}
            mock interviews. Continue
            practicing your technical skills
            and focus especially on{" "}
            <strong>
              {weakestSkill?.name ||
                "your weaker areas"}
            </strong>
            .
          </p>

        </div>

        <div style={styles.readinessBadge}>
          {getPerformanceLevel(
            overallScore
          )}
        </div>

      </div>

    </div>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles = {

  // ===================================================
  // PAGE
  // ===================================================

  page: {
    width: "100%",
    minHeight: "100vh",
    padding: "30px",
    boxSizing: "border-box",
    background: "#f8fafc",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
  },


  // ===================================================
  // PAGE HEADER
  // ===================================================

  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  pageHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  pageHeaderIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    border: "1px solid #dbeafe",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "750",
    color: "#111827",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    margin: "5px 0 0",
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.5",
  },

  refreshButton: {
    height: "42px",
    padding: "0 17px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #dbe2ea",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "650",
    cursor: "pointer",
    boxShadow:
      "0 2px 6px rgba(15,23,42,0.04)",
  },

  refreshIcon: {
    fontSize: "18px",
    lineHeight: 1,
  },


  // ===================================================
  // OVERALL SECTION
  // ===================================================

  overallSection: {
    display: "grid",
    gridTemplateColumns:
      "minmax(320px, 2fr) repeat(2, minmax(210px, 1fr))",
    gap: "16px",
    marginBottom: "22px",
  },

  overallMain: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "22px",
    boxShadow:
      "0 3px 10px rgba(15,23,42,0.04)",
  },

  overallTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  overallLabel: {
    fontSize: "11px",
    fontWeight: "750",
    color: "#64748b",
    letterSpacing: "0.9px",
  },

  scoreLine: {
    display: "flex",
    alignItems: "baseline",
    marginTop: "5px",
  },

  bigScore: {
    fontSize: "43px",
    lineHeight: 1,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: "-1.5px",
  },

  outOf: {
    marginLeft: "4px",
    fontSize: "18px",
    fontWeight: "550",
    color: "#94a3b8",
  },

  trophyBox: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },

  overallProgressBackground: {
    width: "100%",
    height: "9px",
    marginTop: "21px",
    borderRadius: "999px",
    overflow: "hidden",
    background: "#e2e8f0",
  },

  overallProgressFill: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.5s ease",
  },

  overallBottom: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "13px",
    flexWrap: "wrap",
  },

  performanceBadge: {
    padding: "5px 9px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "750",
  },

  performanceDescription: {
    fontSize: "11px",
    color: "#64748b",
  },


  // ===================================================
  // SUMMARY STAT
  // ===================================================

  summaryStat: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "22px",
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    boxShadow:
      "0 3px 10px rgba(15,23,42,0.04)",
  },

  summaryStatIcon: {
    width: "44px",
    height: "44px",
    minWidth: "44px",
    borderRadius: "10px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },

  summaryStatLabel: {
    fontSize: "10px",
    fontWeight: "750",
    color: "#94a3b8",
    letterSpacing: "0.8px",
  },

  summaryStatNumber: {
    marginTop: "5px",
    fontSize: "31px",
    lineHeight: 1,
    fontWeight: "800",
    color: "#111827",
  },

  summaryStatText: {
    marginTop: "6px",
    fontSize: "11px",
    color: "#64748b",
    lineHeight: "1.4",
  },


  // ===================================================
  // SECTION CARD
  // ===================================================

  sectionCard: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "22px",
    marginBottom: "22px",
    boxSizing: "border-box",
    boxShadow:
      "0 3px 10px rgba(15,23,42,0.04)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "750",
    color: "#111827",
    letterSpacing: "-0.2px",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    fontSize: "12px",
    color: "#64748b",
  },

  skillCountBadge: {
    padding: "6px 10px",
    borderRadius: "7px",
    background: "#f1f5f9",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "650",
  },


  // ===================================================
  // SKILLS
  // ===================================================

  skillGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(280px, 1fr))",
    gap: "14px",
  },

  skillCard: {
    padding: "17px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "11px",
  },

  skillTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "13px",
  },

  skillInfo: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    minWidth: 0,
  },

  skillIcon: {
    width: "38px",
    height: "38px",
    minWidth: "38px",
    borderRadius: "9px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  skillName: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#334155",
  },

  skillLevel: {
    marginTop: "3px",
    fontSize: "10px",
    color: "#94a3b8",
    fontWeight: "550",
  },

  skillScore: {
    fontSize: "17px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  skillScoreMax: {
    fontSize: "11px",
    color: "#94a3b8",
    fontWeight: "550",
  },

  skillProgressBackground: {
    height: "7px",
    width: "100%",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },

  skillProgressFill: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.5s ease",
  },

  skillFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "8px",
    fontSize: "10px",
    color: "#94a3b8",
  },


  // ===================================================
  // CHART
  // ===================================================

  chartContainer: {
    width: "100%",
    height: "340px",
  },


  // ===================================================
  // INSIGHTS
  // ===================================================

  insightGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(280px, 1fr))",
    gap: "16px",
    marginBottom: "22px",
  },

  insightCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    boxShadow:
      "0 3px 10px rgba(15,23,42,0.04)",
  },

  insightIconBox: {
    width: "45px",
    height: "45px",
    minWidth: "45px",
    borderRadius: "11px",
    background: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  focusIconBox: {
    width: "45px",
    height: "45px",
    minWidth: "45px",
    borderRadius: "11px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  insightContent: {
    minWidth: 0,
  },

  insightLabel: {
    fontSize: "10px",
    fontWeight: "750",
    color: "#94a3b8",
    letterSpacing: "0.8px",
  },

  insightSkillName: {
    marginTop: "4px",
    fontSize: "18px",
    fontWeight: "800",
    color: "#111827",
  },

  insightText: {
    margin: "6px 0 0",
    fontSize: "12px",
    lineHeight: "1.6",
    color: "#64748b",
  },


  // ===================================================
  // SUMMARY
  // ===================================================

  summaryCard: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "21px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxSizing: "border-box",
    boxShadow:
      "0 3px 10px rgba(15,23,42,0.04)",
  },

  summaryRocket: {
    width: "48px",
    height: "48px",
    minWidth: "48px",
    borderRadius: "12px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },

  summaryContent: {
    flex: 1,
    minWidth: 0,
  },

  summaryLabel: {
    fontSize: "10px",
    fontWeight: "750",
    color: "#2563eb",
    letterSpacing: "0.8px",
  },

  summaryTitle: {
    margin: "3px 0 0",
    fontSize: "17px",
    fontWeight: "750",
    color: "#111827",
  },

  summaryText: {
    margin: "6px 0 0",
    fontSize: "12px",
    lineHeight: "1.65",
    color: "#64748b",
  },

  readinessBadge: {
    padding: "8px 12px",
    borderRadius: "8px",
    background: "#eff6ff",
    color: "#2563eb",
    fontSize: "11px",
    fontWeight: "750",
    whiteSpace: "nowrap",
  },


  // ===================================================
  // LOADING
  // ===================================================

  loadingContainer: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    background: "#f8fafc",
    boxSizing: "border-box",
  },

  loadingCircle: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "15px",
  },

  loadingIcon: {
    fontSize: "30px",
  },

  loadingTitle: {
    margin: "0 0 6px",
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
  },

  loadingText: {
    margin: 0,
    fontSize: "13px",
    color: "#64748b",
  },


  // ===================================================
  // ERROR
  // ===================================================

  errorCard: {
    maxWidth: "480px",
    margin: "70px auto",
    padding: "35px",
    textAlign: "center",
    background: "#ffffff",
    border: "1px solid #fecaca",
    borderRadius: "14px",
    boxSizing: "border-box",
  },

  errorIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  errorTitle: {
    margin: "0 0 9px",
    fontSize: "20px",
    color: "#991b1b",
  },

  errorText: {
    margin: "0 0 20px",
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.6",
  },


  // ===================================================
  // EMPTY
  // ===================================================

  emptyCard: {
    maxWidth: "480px",
    margin: "70px auto",
    padding: "35px",
    textAlign: "center",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    boxSizing: "border-box",
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  emptyTitle: {
    margin: "0 0 9px",
    fontSize: "20px",
    color: "#334155",
  },

  emptyText: {
    margin: "0 0 20px",
    fontSize: "13px",
    color: "#64748b",
  },


  // ===================================================
  // RETRY
  // ===================================================

  retryButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "650",
    cursor: "pointer",
  },
};


export default StudentPerformance;