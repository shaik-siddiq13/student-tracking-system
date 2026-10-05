import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function StudentDashboard() {
  const { apiRequest } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const dashboardResponse = await apiRequest(
        "/students/dashboard",
        {
          method: "GET",
        }
      );

      const dashboardData = await dashboardResponse.json();

      if (!dashboardResponse.ok) {
        throw new Error(
          dashboardData.detail || "Failed to load dashboard"
        );
      }

      const interviewsResponse = await apiRequest(
        "/students/interviews",
        {
          method: "GET",
        }
      );

      const interviewsData = await interviewsResponse.json();

      if (!interviewsResponse.ok) {
        throw new Error(
          interviewsData.detail || "Failed to load interviews"
        );
      }

      setDashboard(dashboardData);

      setInterviews(
        Array.isArray(interviewsData.interviews)
          ? interviewsData.interviews
          : []
      );
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.message || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =========================================================
  // DATE HELPERS
  // =========================================================

  const getInterviewDate = (date) => {
    if (!date) return null;

    const value = String(date);
    const parts = value.split("-");

    if (parts.length !== 3) return null;

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (
      Number.isNaN(year) ||
      Number.isNaN(month) ||
      Number.isNaN(day)
    ) {
      return null;
    }

    const result = new Date(year, month - 1, day);
    result.setHours(0, 0, 0, 0);

    return result;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const interviewDate = getInterviewDate(date);

    if (!interviewDate) {
      return String(date);
    }

    return interviewDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // DATA
  // =========================================================

  const student = dashboard?.student || {};
  const performance = dashboard?.performance || {};

  const employment = Array.isArray(dashboard?.employment)
    ? dashboard.employment[0] || null
    : dashboard?.employment || null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingInterviews = interviews.filter((interview) => {
    const date = getInterviewDate(interview.interview_date);

    return date && date >= today;
  });

  const pastInterviews = interviews.filter((interview) => {
    const date = getInterviewDate(interview.interview_date);

    return date && date < today;
  });

  const scheduledInterviews = interviews.filter(
    (interview) =>
      String(interview.status || "").toUpperCase() === "SCHEDULED"
  );

  const attendedInterviews = interviews.filter(
    (interview) =>
      String(interview.status || "").toUpperCase() === "ATTENDED"
  );

  const completedInterviews = interviews.filter(
    (interview) =>
      String(interview.status || "").toUpperCase() === "COMPLETED"
  );

  const inProgressInterviews = interviews.filter(
    (interview) =>
      String(interview.status || "")
        .toUpperCase()
        .replace("_", " ") === "IN PROGRESS"
  );

  const selectedInterviews = interviews.filter((interview) => {
    const result = String(
      interview.result || ""
    ).toUpperCase();

    return (
      result === "SELECTED" ||
      result === "PASS" ||
      result === "PASSED"
    );
  });

  const rejectedInterviews = interviews.filter((interview) => {
    const result = String(
      interview.result || ""
    ).toUpperCase();

    return (
      result === "REJECTED" ||
      result === "FAIL" ||
      result === "FAILED"
    );
  });

  const sortedUpcoming = [...upcomingInterviews].sort(
    (a, b) => {
      const dateA = getInterviewDate(a.interview_date);
      const dateB = getInterviewDate(b.interview_date);

      if (!dateA) return 1;
      if (!dateB) return -1;

      return dateA - dateB;
    }
  );

  const nextInterview =
    sortedUpcoming.length > 0
      ? sortedUpcoming[0]
      : null;

  // =========================================================
  // STATUS HELPERS
  // =========================================================

  const getStatusStyle = (status) => {
    const value = String(
      status || ""
    ).toUpperCase();

    if (value === "SCHEDULED") {
      return {
        background: "#e0edff",
        color: "#175cd3",
      };
    }

    if (value === "ATTENDED") {
      return {
        background: "#dcfae6",
        color: "#067647",
      };
    }

    if (value === "COMPLETED") {
      return {
        background: "#f4ebff",
        color: "#6941c6",
      };
    }

    if (
      value === "IN PROGRESS" ||
      value === "IN_PROGRESS"
    ) {
      return {
        background: "#fff4cc",
        color: "#b54708",
      };
    }

    return {
      background: "#f2f4f7",
      color: "#344054",
    };
  };

  const getResultStyle = (result) => {
    const value = String(
      result || ""
    ).toUpperCase();

    if (
      value === "SELECTED" ||
      value === "PASS" ||
      value === "PASSED"
    ) {
      return {
        background: "#dcfae6",
        color: "#067647",
      };
    }

    if (
      value === "REJECTED" ||
      value === "FAIL" ||
      value === "FAILED"
    ) {
      return {
        background: "#fee4e2",
        color: "#b42318",
      };
    }

    return {
      background: "#f2f4f7",
      color: "#344054",
    };
  };

  // =========================================================
  // PERFORMANCE DATA
  // =========================================================

  const skillScores = [
    {
      name: "Python",
      score: Number(performance.python_score ?? 0),
      icon: "🐍",
    },
    {
      name: "SQL",
      score: Number(performance.sql_score ?? 0),
      icon: "🗄️",
    },
    {
      name: "PySpark",
      score: Number(performance.pyspark_score ?? 0),
      icon: "⚡",
    },
    {
      name: "AWS",
      score: Number(performance.aws_score ?? 0),
      icon: "☁️",
    },
    {
      name: "Data Engineering",
      score: Number(
        performance.data_engineering_score ?? 0
      ),
      icon: "🔧",
    },
    {
      name: "Communication",
      score: Number(
        performance.communication_score ?? 0
      ),
      icon: "💬",
    },
  ];

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingLogo}>T</div>

          <div style={styles.spinner} />

          <h2 style={styles.loadingTitle}>
            Loading your dashboard
          </h2>

          <p style={styles.loadingText}>
            Preparing your latest student information...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>!</div>

          <div>
            <h2 style={styles.errorTitle}>
              Unable to load dashboard
            </h2>

            <p style={styles.errorText}>
              {error}
            </p>

            <button
              type="button"
              onClick={loadDashboard}
              style={styles.primaryButton}
            >
              ↻ Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div style={styles.page}>

      {/* =====================================================
          WELCOME HERO
      ===================================================== */}

      <section style={styles.hero}>

        <div style={styles.heroLeft}>

          <div style={styles.eyebrow}>
            <span style={styles.greenDot} />
            STUDENT PORTAL
          </div>

          <h1 style={styles.heroTitle}>
            Welcome back,{" "}
            <span style={styles.heroName}>
              {student.first_name || "Student"}
            </span>
            !
          </h1>

          <p style={styles.heroSubtitle}>
            Track your interviews, skills, performance and
            career progress from one place.
          </p>

          <div style={styles.heroMeta}>

            <div style={styles.metaItem}>
              <span style={styles.metaIcon}>🎓</span>
              <span>
                {student.course_name || "Data Engineering"}
              </span>
            </div>

            <div style={styles.metaDivider} />

            <div style={styles.metaItem}>
              <span style={styles.metaIcon}>📚</span>
              <span>
                Batch {student.batch_name || "-"}
              </span>
            </div>

            <div style={styles.metaDivider} />

            <div style={styles.metaItem}>
              <span style={styles.metaIcon}>✓</span>
              <span>
                {student.current_status || "TRAINING"}
              </span>
            </div>

          </div>
        </div>

        <div style={styles.heroRight}>

          <div style={styles.heroScoreLabel}>
            OVERALL SCORE
          </div>

          <div style={styles.heroScore}>
            {performance.overall_score ?? 0}
            <span style={styles.heroScoreMax}>
              /100
            </span>
          </div>

          <div style={styles.heroProgress}>
            <div
              style={{
                ...styles.heroProgressFill,
                width: `${Math.min(
                  Number(performance.overall_score ?? 0),
                  100
                )}%`,
              }}
            />
          </div>

          <div style={styles.heroScoreText}>
            Keep building your skills 🚀
          </div>

        </div>

      </section>

      {/* =====================================================
          QUICK STATS
      ===================================================== */}

      <section style={styles.statsGrid}>

        <StatCard
          icon="📋"
          label="Total Interviews"
          value={interviews.length}
          detail="All tracked interviews"
          iconBackground="#e8f1ff"
        />

        <StatCard
          icon="📅"
          label="Upcoming"
          value={upcomingInterviews.length}
          detail="Future interviews"
          iconBackground="#e7f8ef"
        />

        <StatCard
          icon="🏆"
          label="Selected"
          value={selectedInterviews.length}
          detail="Passed / selected"
          iconBackground="#fff4d6"
        />

        <StatCard
          icon="🎯"
          label="Assessments"
          value={performance.assessment_count ?? 0}
          detail="Completed assessments"
          iconBackground="#f4ebff"
        />

      </section>

      {/* =====================================================
          PROFILE + NEXT INTERVIEW
      ===================================================== */}

      <section style={styles.twoColumn}>

        {/* PROFILE */}

        <div style={styles.card}>

          <div style={styles.cardHeader}>

            <div>
              <div style={styles.cardEyebrow}>
                PROFILE
              </div>

              <h2 style={styles.cardTitle}>
                Student Information
              </h2>
            </div>

            <div style={styles.cardHeaderIcon}>
              👤
            </div>

          </div>

          <div style={styles.profileGrid}>

            <ProfileItem
              label="Full Name"
              value={`${student.first_name || "-"} ${
                student.last_name || ""
              }`}
            />

            <ProfileItem
              label="Email"
              value={student.email || "-"}
            />

            <ProfileItem
              label="Course"
              value={student.course_name || "-"}
            />

            <ProfileItem
              label="Batch"
              value={student.batch_name || "-"}
            />

            <ProfileItem
              label="Qualification"
              value={student.qualification || "-"}
            />

            <ProfileItem
              label="Graduation"
              value={student.graduation_year || "-"}
            />

          </div>

        </div>

        {/* NEXT INTERVIEW */}

        <div style={styles.card}>

          <div style={styles.cardHeader}>

            <div>
              <div style={styles.cardEyebrow}>
                NEXT UP
              </div>

              <h2 style={styles.cardTitle}>
                Upcoming Interview
              </h2>
            </div>

            <div style={styles.cardHeaderIcon}>
              📅
            </div>

          </div>

          {nextInterview ? (
            <div style={styles.nextInterview}>

              <div style={styles.companyBadge}>
                {String(
                  nextInterview.company_name ||
                    "C"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div style={styles.nextInterviewInfo}>

                <h3 style={styles.nextCompany}>
                  {nextInterview.company_name ||
                    "Company"}
                </h3>

                <p style={styles.nextRole}>
                  {nextInterview.role || "-"}
                </p>

                <div style={styles.nextDetails}>

                  <span>
                    📅{" "}
                    {formatDate(
                      nextInterview.interview_date
                    )}
                  </span>

                  {nextInterview.interview_type && (
                    <span>
                      🎯{" "}
                      {nextInterview.interview_type}
                    </span>
                  )}

                </div>

                <span
                  style={{
                    ...styles.badge,
                    ...getStatusStyle(
                      nextInterview.status
                    ),
                  }}
                >
                  {nextInterview.status || "SCHEDULED"}
                </span>

              </div>

            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                📭
              </div>

              <h3 style={styles.emptyTitle}>
                No upcoming interviews
              </h3>

              <p style={styles.emptyText}>
                Your next interview will appear here.
              </p>
            </div>
          )}

        </div>

      </section>

      {/* =====================================================
          INTERVIEW RESULTS
      ===================================================== */}

      <section style={styles.card}>

        <div style={styles.cardHeader}>

          <div>
            <div style={styles.cardEyebrow}>
              INTERVIEW JOURNEY
            </div>

            <h2 style={styles.cardTitle}>
              Interview Progress
            </h2>
          </div>

          <div style={styles.cardHeaderIcon}>
            📊
          </div>

        </div>

        <div style={styles.interviewStats}>

          <MiniStat
            label="Scheduled"
            value={scheduledInterviews.length}
            icon="⏰"
            background="#e8f1ff"
          />

          <MiniStat
            label="Attended"
            value={attendedInterviews.length}
            icon="✓"
            background="#e7f8ef"
          />

          <MiniStat
            label="Completed"
            value={completedInterviews.length}
            icon="✓"
            background="#f4ebff"
          />

          <MiniStat
            label="In Progress"
            value={inProgressInterviews.length}
            icon="↻"
            background="#fff4d6"
          />

          <MiniStat
            label="Selected"
            value={selectedInterviews.length}
            icon="🏆"
            background="#e7f8ef"
          />

          <MiniStat
            label="Rejected"
            value={rejectedInterviews.length}
            icon="×"
            background="#fee4e2"
          />

        </div>

      </section>

      {/* =====================================================
          PERFORMANCE
      ===================================================== */}

      <section style={styles.card}>

        <div style={styles.cardHeader}>

          <div>
            <div style={styles.cardEyebrow}>
              SKILLS & PERFORMANCE
            </div>

            <h2 style={styles.cardTitle}>
              Your Skill Performance
            </h2>
          </div>

          <div style={styles.overallPill}>
            Overall{" "}
            <strong>
              {performance.overall_score ?? 0}
            </strong>
          </div>

        </div>

        <div style={styles.skillsGrid}>

          {skillScores.map((skill) => (
            <SkillCard
              key={skill.name}
              name={skill.name}
              score={skill.score}
              icon={skill.icon}
            />
          ))}

        </div>

        <div style={styles.performanceFooter}>

          <div>
            <span style={styles.footerLabel}>
              Mock Interviews
            </span>

            <strong style={styles.footerValue}>
              {performance.mock_interview_count ?? 0}
            </strong>
          </div>

          <div>
            <span style={styles.footerLabel}>
              Assessments
            </span>

            <strong style={styles.footerValue}>
              {performance.assessment_count ?? 0}
            </strong>
          </div>

          <div>
            <span style={styles.footerLabel}>
              Average Skill Score
            </span>

            <strong style={styles.footerValue}>
              {skillScores.length > 0
                ? Math.round(
                    skillScores.reduce(
                      (sum, skill) =>
                        sum + skill.score,
                      0
                    ) / skillScores.length
                  )
                : 0}
            </strong>
          </div>

        </div>

      </section>

      {/* =====================================================
          RECENT INTERVIEWS
      ===================================================== */}

      <section style={styles.card}>

        <div style={styles.cardHeader}>

          <div>
            <div style={styles.cardEyebrow}>
              ACTIVITY
            </div>

            <h2 style={styles.cardTitle}>
              Recent Interviews
            </h2>
          </div>

          <div style={styles.cardHeaderIcon}>
            💼
          </div>

        </div>

        {interviews.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              📋
            </div>

            <h3 style={styles.emptyTitle}>
              No interviews yet
            </h3>

            <p style={styles.emptyText}>
              Interview records will appear here.
            </p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>
                <tr>
                  <th style={styles.th}>
                    COMPANY
                  </th>

                  <th style={styles.th}>
                    ROLE
                  </th>

                  <th style={styles.th}>
                    DATE
                  </th>

                  <th style={styles.th}>
                    STATUS
                  </th>

                  <th style={styles.th}>
                    RESULT
                  </th>
                </tr>
              </thead>

              <tbody>

                {interviews
                  .slice(0, 5)
                  .map((interview) => (
                    <tr
                      key={
                        interview.interview_id
                      }
                      style={styles.tr}
                    >

                      <td style={styles.td}>
                        <div style={styles.companyCell}>

                          <div style={styles.smallCompanyIcon}>
                            {String(
                              interview.company_name ||
                                "C"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <strong>
                            {interview.company_name ||
                              "-"}
                          </strong>

                        </div>
                      </td>

                      <td style={styles.td}>
                        {interview.role || "-"}
                      </td>

                      <td style={styles.td}>
                        {formatDate(
                          interview.interview_date
                        )}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.badge,
                            ...getStatusStyle(
                              interview.status
                            ),
                          }}
                        >
                          {interview.status || "-"}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.badge,
                            ...getResultStyle(
                              interview.result
                            ),
                          }}
                        >
                          {interview.result || "Pending"}
                        </span>
                      </td>

                    </tr>
                  ))}

              </tbody>

            </table>

          </div>
        )}

      </section>

      {/* =====================================================
          EMPLOYMENT
      ===================================================== */}

      {employment && (
        <section style={styles.employmentCard}>

          <div style={styles.employmentTop}>

            <div>

              <div style={styles.cardEyebrow}>
                CAREER
              </div>

              <h2 style={styles.employmentTitle}>
                Employment
              </h2>

              <p style={styles.employmentSubtitle}>
                Your current employment information
              </p>

            </div>

            <div style={styles.employmentIcon}>
              💼
            </div>

          </div>

          <div style={styles.employmentGrid}>

            <EmploymentItem
              label="Company"
              value={employment.company_name || "-"}
            />

            <EmploymentItem
              label="Role"
              value={employment.role || "-"}
            />

            <EmploymentItem
              label="Employment Type"
              value={
                employment.employment_type || "-"
              }
            />

            <EmploymentItem
              label="Start Date"
              value={formatDate(
                employment.start_date
              )}
            />

            <EmploymentItem
              label="Salary"
              value={
                employment.salary !== null &&
                employment.salary !== undefined
                  ? `₹${Number(
                      employment.salary
                    ).toLocaleString("en-IN")}`
                  : "Not specified"
              }
            />

            <EmploymentItem
              label="Location"
              value={employment.location || "-"}
            />

          </div>

          <div style={styles.currentEmployment}>

            <span style={styles.currentDot} />

            {employment.is_current
              ? "Currently employed"
              : "Previous employment"}

          </div>

        </section>
      )}

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div style={styles.footer}>
        <span>
          TTT NexGen Tracker
        </span>

        <span>
          Student Career Management Portal
        </span>
      </div>

    </div>
  );
}

// =============================================================
// STAT CARD
// =============================================================

function StatCard({
  icon,
  label,
  value,
  detail,
  iconBackground,
}) {
  return (
    <div style={styles.statCard}>

      <div
        style={{
          ...styles.statIcon,
          background: iconBackground,
        }}
      >
        {icon}
      </div>

      <div style={styles.statContent}>

        <div style={styles.statLabel}>
          {label}
        </div>

        <div style={styles.statValue}>
          {value}
        </div>

        <div style={styles.statDetail}>
          {detail}
        </div>

      </div>

    </div>
  );
}

// =============================================================
// PROFILE ITEM
// =============================================================

function ProfileItem({ label, value }) {
  return (
    <div style={styles.profileItem}>

      <div style={styles.profileLabel}>
        {label}
      </div>

      <div style={styles.profileValue}>
        {value}
      </div>

    </div>
  );
}

// =============================================================
// MINI STAT
// =============================================================

function MiniStat({
  label,
  value,
  icon,
  background,
}) {
  return (
    <div style={styles.miniStat}>

      <div
        style={{
          ...styles.miniIcon,
          background,
        }}
      >
        {icon}
      </div>

      <div>

        <div style={styles.miniLabel}>
          {label}
        </div>

        <div style={styles.miniValue}>
          {value}
        </div>

      </div>

    </div>
  );
}

// =============================================================
// SKILL CARD
// =============================================================

function SkillCard({
  name,
  score,
  icon,
}) {
  const safeScore = Math.min(
    Math.max(Number(score) || 0, 0),
    100
  );

  return (
    <div style={styles.skillCard}>

      <div style={styles.skillTop}>

        <div style={styles.skillNameWrapper}>

          <span style={styles.skillIcon}>
            {icon}
          </span>

          <span style={styles.skillName}>
            {name}
          </span>

        </div>

        <strong style={styles.skillScore}>
          {safeScore}
        </strong>

      </div>

      <div style={styles.skillBar}>
        <div
          style={{
            ...styles.skillFill,
            width: `${safeScore}%`,
          }}
        />
      </div>

      <div style={styles.skillBottom}>
        <span>
          Performance
        </span>

        <span>
          {safeScore >= 80
            ? "Excellent"
            : safeScore >= 60
            ? "Good"
            : "Needs focus"}
        </span>
      </div>

    </div>
  );
}

// =============================================================
// EMPLOYMENT ITEM
// =============================================================

function EmploymentItem({
  label,
  value,
}) {
  return (
    <div style={styles.employmentItem}>

      <div style={styles.employmentLabel}>
        {label}
      </div>

      <div style={styles.employmentValue}>
        {value}
      </div>

    </div>
  );
}

// =============================================================
// STYLES
// =============================================================

const styles = {
  page: {
    minHeight: "100vh",
    padding: "28px",
    background:
      "linear-gradient(180deg, #f7f9fc 0%, #f3f6fa 100%)",
    boxSizing: "border-box",
    color: "#101828",
  },

  // -----------------------------------------------------------
  // LOADING
  // -----------------------------------------------------------

  loadingPage: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingCard: {
    textAlign: "center",
    background: "#ffffff",
    padding: "45px",
    borderRadius: "20px",
    border: "1px solid #e4e7ec",
    boxShadow: "0 12px 40px rgba(16, 24, 40, 0.08)",
  },

  loadingLogo: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    margin: "0 auto 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #155eef, #0b4dcc)",
    color: "#ffffff",
    fontSize: "25px",
    fontWeight: "800",
  },

  spinner: {
    width: "34px",
    height: "34px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    border: "4px solid #e4e7ec",
    borderTopColor: "#155eef",
    animation: "spin 1s linear infinite",
  },

  loadingTitle: {
    margin: 0,
    fontSize: "20px",
  },

  loadingText: {
    color: "#667085",
    marginTop: "8px",
  },

  // -----------------------------------------------------------
  // ERROR
  // -----------------------------------------------------------

  errorCard: {
    background: "#ffffff",
    border: "1px solid #fecdca",
    borderRadius: "16px",
    padding: "25px",
    display: "flex",
    alignItems: "flex-start",
    gap: "18px",
  },

  errorIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#fee4e2",
    color: "#b42318",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "800",
  },

  errorTitle: {
    margin: 0,
    fontSize: "18px",
  },

  errorText: {
    color: "#667085",
    margin: "7px 0 15px",
  },

  primaryButton: {
    border: "none",
    background: "#155eef",
    color: "#ffffff",
    padding: "10px 17px",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
  },

  // -----------------------------------------------------------
  // HERO
  // -----------------------------------------------------------

  hero: {
    display: "flex",
    justifyContent: "space-between",
    gap: "30px",
    padding: "32px",
    marginBottom: "22px",
    borderRadius: "22px",
    color: "#ffffff",
    background:
      "linear-gradient(135deg, #0b1f3a 0%, #123b6d 55%, #155eef 100%)",
    boxShadow:
      "0 18px 45px rgba(16, 52, 93, 0.18)",
    overflow: "hidden",
    position: "relative",
  },

  heroLeft: {
    flex: 1,
    minWidth: 0,
  },

  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "11px",
    letterSpacing: "1.2px",
    fontWeight: "800",
    opacity: 0.85,
    marginBottom: "12px",
  },

  greenDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#32d583",
    display: "inline-block",
  },

  heroTitle: {
    margin: 0,
    fontSize: "34px",
    lineHeight: 1.2,
    fontWeight: "800",
  },

  heroName: {
    color: "#7cc4ff",
  },

  heroSubtitle: {
    maxWidth: "650px",
    color: "#d0d5dd",
    fontSize: "15px",
    lineHeight: 1.7,
    margin: "13px 0 20px",
  },

  heroMeta: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "14px",
  },

  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#e4e7ec",
    fontSize: "13px",
    fontWeight: "600",
  },

  metaIcon: {
    fontSize: "14px",
  },

  metaDivider: {
    width: "1px",
    height: "18px",
    background: "rgba(255,255,255,0.2)",
  },

  heroRight: {
    width: "220px",
    flexShrink: 0,
    alignSelf: "center",
    padding: "20px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(10px)",
  },

  heroScoreLabel: {
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1px",
    color: "#cbd5e1",
  },

  heroScore: {
    fontSize: "42px",
    fontWeight: "800",
    margin: "5px 0 10px",
  },

  heroScoreMax: {
    fontSize: "14px",
    color: "#cbd5e1",
    fontWeight: "500",
  },

  heroProgress: {
    height: "7px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.18)",
    overflow: "hidden",
  },

  heroProgressFill: {
    height: "100%",
    borderRadius: "10px",
    background: "#32d583",
    transition: "width 0.4s ease",
  },

  heroScoreText: {
    marginTop: "10px",
    color: "#d0d5dd",
    fontSize: "12px",
  },

  // -----------------------------------------------------------
  // STAT CARDS
  // -----------------------------------------------------------

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "22px",
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e4e7ec",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow:
      "0 4px 15px rgba(16, 24, 40, 0.04)",
  },

  statIcon: {
    width: "50px",
    height: "50px",
    flexShrink: 0,
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  statContent: {
    minWidth: 0,
  },

  statLabel: {
    color: "#667085",
    fontSize: "12px",
    fontWeight: "600",
  },

  statValue: {
    fontSize: "27px",
    fontWeight: "800",
    color: "#101828",
    margin: "3px 0",
  },

  statDetail: {
    color: "#98a2b3",
    fontSize: "11px",
  },

  // -----------------------------------------------------------
  // CARDS
  // -----------------------------------------------------------

  twoColumn: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.15fr) minmax(0, 0.85fr)",
    gap: "20px",
    marginBottom: "22px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e4e7ec",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "22px",
    boxShadow:
      "0 4px 18px rgba(16, 24, 40, 0.04)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "20px",
  },

  cardEyebrow: {
    color: "#667085",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.1px",
    marginBottom: "5px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#101828",
    fontWeight: "750",
  },

  cardHeaderIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "11px",
    background: "#f2f4f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  // -----------------------------------------------------------
  // PROFILE
  // -----------------------------------------------------------

  profileGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "17px",
  },

  profileItem: {
    padding: "13px",
    borderRadius: "11px",
    background: "#f8fafc",
    border: "1px solid #eef2f6",
  },

  profileLabel: {
    color: "#98a2b3",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },

  profileValue: {
    color: "#101828",
    fontSize: "13px",
    fontWeight: "650",
    marginTop: "5px",
    wordBreak: "break-word",
  },

  // -----------------------------------------------------------
  // NEXT INTERVIEW
  // -----------------------------------------------------------

  nextInterview: {
    display: "flex",
    gap: "15px",
    padding: "18px",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg, #eff6ff, #f8fbff)",
    border: "1px solid #dbeafe",
  },

  companyBadge: {
    width: "48px",
    height: "48px",
    flexShrink: 0,
    borderRadius: "13px",
    background: "#155eef",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "800",
  },

  nextInterviewInfo: {
    minWidth: 0,
  },

  nextCompany: {
    margin: 0,
    fontSize: "17px",
    color: "#101828",
  },

  nextRole: {
    margin: "4px 0 10px",
    color: "#475467",
    fontSize: "13px",
    fontWeight: "600",
  },

  nextDetails: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    color: "#667085",
    fontSize: "12px",
    marginBottom: "11px",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 9px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },

  // -----------------------------------------------------------
  // INTERVIEW PROGRESS
  // -----------------------------------------------------------

  interviewStats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
  },

  miniStat: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "14px",
    borderRadius: "13px",
    background: "#f8fafc",
    border: "1px solid #eef2f6",
  },

  miniIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    flexShrink: 0,
  },

  miniLabel: {
    fontSize: "10px",
    color: "#667085",
    fontWeight: "600",
  },

  miniValue: {
    marginTop: "2px",
    fontSize: "20px",
    fontWeight: "800",
    color: "#101828",
  },

  // -----------------------------------------------------------
  // SKILLS
  // -----------------------------------------------------------

  skillsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "13px",
  },

  skillCard: {
    padding: "16px",
    borderRadius: "13px",
    border: "1px solid #eaecf0",
    background: "#fcfcfd",
  },

  skillTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },

  skillNameWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  skillIcon: {
    fontSize: "17px",
  },

  skillName: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#344054",
  },

  skillScore: {
    fontSize: "18px",
    color: "#155eef",
  },

  skillBar: {
    height: "7px",
    background: "#eaecf0",
    borderRadius: "10px",
    overflow: "hidden",
  },

  skillFill: {
    height: "100%",
    borderRadius: "10px",
    background:
      "linear-gradient(90deg, #155eef, #53b1fd)",
    transition: "width 0.4s ease",
  },

  skillBottom: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
    color: "#98a2b3",
    fontSize: "10px",
  },

  overallPill: {
    background: "#e8f1ff",
    color: "#175cd3",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "700",
  },

  performanceFooter: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "15px",
    marginTop: "20px",
    paddingTop: "18px",
    borderTop: "1px solid #eaecf0",
  },

  footerLabel: {
    display: "block",
    color: "#98a2b3",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  footerValue: {
    display: "block",
    marginTop: "5px",
    fontSize: "20px",
    color: "#101828",
  },

  // -----------------------------------------------------------
  // TABLE
  // -----------------------------------------------------------

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "650px",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "1px solid #eaecf0",
    color: "#667085",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.6px",
  },

  tr: {
    borderBottom: "1px solid #f2f4f7",
  },

  td: {
    padding: "14px 12px",
    color: "#475467",
    fontSize: "12px",
  },

  companyCell: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    color: "#101828",
  },

  smallCompanyIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "#e8f1ff",
    color: "#155eef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "800",
  },

  // -----------------------------------------------------------
  // EMPTY
  // -----------------------------------------------------------

  emptyState: {
    textAlign: "center",
    padding: "28px 15px",
  },

  emptyIcon: {
    fontSize: "34px",
    marginBottom: "7px",
  },

  emptyTitle: {
    margin: 0,
    fontSize: "15px",
    color: "#344054",
  },

  emptyText: {
    margin: "5px 0 0",
    color: "#98a2b3",
    fontSize: "12px",
  },

  // -----------------------------------------------------------
  // EMPLOYMENT
  // -----------------------------------------------------------

  employmentCard: {
    background:
      "linear-gradient(135deg, #f0fdf4, #ffffff)",
    border: "1px solid #bbf7d0",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "22px",
    boxShadow:
      "0 4px 18px rgba(16, 185, 129, 0.06)",
  },

  employmentTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "20px",
  },

  employmentTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#166534",
  },

  employmentSubtitle: {
    margin: "5px 0 0",
    color: "#667085",
    fontSize: "12px",
  },

  employmentIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "11px",
    background: "#dcfae6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  employmentGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "15px",
  },

  employmentItem: {
    padding: "13px",
    borderRadius: "11px",
    background: "rgba(255,255,255,0.75)",
    border: "1px solid #dcfce7",
  },

  employmentLabel: {
    color: "#667085",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  employmentValue: {
    color: "#101828",
    fontSize: "13px",
    fontWeight: "700",
    marginTop: "5px",
  },

  currentEmployment: {
    marginTop: "18px",
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "7px 11px",
    borderRadius: "999px",
    background: "#dcfae6",
    color: "#067647",
    fontSize: "11px",
    fontWeight: "700",
  },

  currentDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#12b76a",
  },

  // -----------------------------------------------------------
  // FOOTER
  // -----------------------------------------------------------

  footer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    padding: "10px 3px 2px",
    color: "#98a2b3",
    fontSize: "11px",
  },
};

export default StudentDashboard;
