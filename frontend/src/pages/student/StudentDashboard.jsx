import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function StudentDashboard() {
  const { apiRequest, user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const dashboardData = await apiRequest(
        "/students/dashboard"
      );

      let interviewData = [];

      try {
        const response = await apiRequest(
          "/students/interviews"
        );

        interviewData = Array.isArray(response)
          ? response
          : response?.interviews || [];
      } catch (interviewError) {
        console.warn(
          "Interview list could not be loaded:",
          interviewError
        );
      }

      setDashboard(dashboardData);
      setInterviews(interviewData);
    } catch (err) {
      console.error(
        "Dashboard loading error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load dashboard information."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // NORMALIZE DATA
  // =========================================================

  const student =
    dashboard?.student ||
    dashboard?.student_info ||
    {};

  const performance =
    dashboard?.performance ||
    {};

  const interviewSummary =
    dashboard?.interviews ||
    {};

  const employment =
    Array.isArray(dashboard?.employment)
      ? dashboard.employment
      : [];

  // =========================================================
  // INTERVIEW HELPERS
  // =========================================================

  const getInterviewDate = (interview) => {
    return (
      interview?.interview_date ||
      interview?.scheduled_date ||
      interview?.date ||
      interview?.interview_datetime ||
      null
    );
  };

  const getCompanyName = (interview) => {
    return (
      interview?.company_name ||
      interview?.company ||
      interview?.companyName ||
      "Company"
    );
  };

  const getRole = (interview) => {
    return (
      interview?.role ||
      interview?.job_role ||
      interview?.position ||
      "Data Engineer"
    );
  };

  const getStatus = (interview) => {
    return (
      interview?.status ||
      interview?.interview_status ||
      "SCHEDULED"
    )
      .toString()
      .toUpperCase();
  };

  const getResult = (interview) => {
    return (
      interview?.result ||
      interview?.selection_status ||
      interview?.outcome ||
      null
    )
      ?.toString()
      .toUpperCase();
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatShortDate = (dateValue) => {
    if (!dateValue) {
      return "--";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
      }
    );
  };

  const getInitials = () => {
    const first =
      student?.first_name ||
      user?.first_name ||
      "";

    const last =
      student?.last_name ||
      user?.last_name ||
      "";

    const initials =
      `${first.charAt(0)}${last.charAt(0)}`
        .toUpperCase();

    return initials || "S";
  };

  // =========================================================
  // CALCULATED VALUES
  // =========================================================

  const overallScore =
    Number(
      performance?.overall_score ?? 0
    );

  const pythonScore =
    Number(
      performance?.python_score ?? 0
    );

  const sqlScore =
    Number(
      performance?.sql_score ?? 0
    );

  const pysparkScore =
    Number(
      performance?.pyspark_score ?? 0
    );

  const awsScore =
    Number(
      performance?.aws_score ?? 0
    );

  const dataEngineeringScore =
    Number(
      performance?.data_engineering_score ?? 0
    );

  const communicationScore =
    Number(
      performance?.communication_score ?? 0
    );

  const assessmentCount =
    Number(
      performance?.assessment_count ?? 0
    );

  const mockInterviewCount =
    Number(
      performance?.mock_interview_count ?? 0
    );

  const selectedCount =
    Number(
      interviewSummary?.selected_interviews ??
        0
    );

  const scheduledCount =
    Number(
      interviewSummary?.scheduled_interviews ??
        0
    );

  const completedCount =
    Number(
      interviewSummary?.completed_interviews ??
        0
    );

  const totalInterviews =
    Number(
      interviewSummary?.total_interviews ??
        interviews.length ??
        0
    );

  const rejectedCount = useMemo(() => {
    if (!interviews.length) {
      return 0;
    }

    return interviews.filter(
      (interview) =>
        getStatus(interview) === "REJECTED" ||
        getResult(interview) === "REJECTED"
    ).length;
  }, [interviews]);

  const attendedCount = useMemo(() => {
    if (!interviews.length) {
      return 0;
    }

    return interviews.filter(
      (interview) => {
        const status =
          getStatus(interview);

        return (
          status === "ATTENDED" ||
          status === "COMPLETED" ||
          status === "SELECTED"
        );
      }
    ).length;
  }, [interviews]);

  const inProgressCount = useMemo(() => {
    if (!interviews.length) {
      return 0;
    }

    return interviews.filter(
      (interview) =>
        getStatus(interview) ===
        "IN_PROGRESS"
    ).length;
  }, [interviews]);

  // =========================================================
  // UPCOMING INTERVIEW
  // =========================================================

  const upcomingInterview = useMemo(() => {
    if (!interviews.length) {
      return null;
    }

    const now = new Date();

    const upcoming = interviews
      .filter((interview) => {
        const dateValue =
          getInterviewDate(interview);

        if (!dateValue) {
          return false;
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
          return false;
        }

        const status =
          getStatus(interview);

        return (
          date >= now &&
          status !== "REJECTED" &&
          status !== "SELECTED" &&
          status !== "COMPLETED"
        );
      })
      .sort(
        (a, b) =>
          new Date(
            getInterviewDate(a)
          ) -
          new Date(
            getInterviewDate(b)
          )
      );

    return upcoming[0] || null;
  }, [interviews]);

  // =========================================================
  // FALLBACK UPCOMING INTERVIEW
  // =========================================================

  const fallbackUpcomingInterview =
    useMemo(() => {
      if (upcomingInterview) {
        return upcomingInterview;
      }

      if (!interviews.length) {
        return null;
      }

      const scheduled =
        interviews.filter(
          (interview) =>
            getStatus(interview) ===
              "SCHEDULED" ||
            getStatus(interview) ===
              "UPCOMING"
        );

      return scheduled[0] || null;
    }, [
      upcomingInterview,
      interviews,
    ]);

  // =========================================================
  // SKILLS
  // =========================================================

  const skills = [
    {
      name: "Python",
      score: pythonScore,
      icon: "🐍",
    },
    {
      name: "SQL",
      score: sqlScore,
      icon: "🗄️",
    },
    {
      name: "PySpark",
      score: pysparkScore,
      icon: "⚡",
    },
    {
      name: "AWS",
      score: awsScore,
      icon: "☁️",
    },
    {
      name: "Data Engineering",
      score: dataEngineeringScore,
      icon: "⚙️",
    },
    {
      name: "Communication",
      score: communicationScore,
      icon: "💬",
    },
  ];

  const averageSkillScore =
    skills.length
      ? Math.round(
          skills.reduce(
            (total, skill) =>
              total + skill.score,
            0
          ) / skills.length
        )
      : 0;

  // =========================================================
  // SCORE LABEL
  // =========================================================

  const getScoreLabel = (score) => {
    if (score >= 90) {
      return "Excellent";
    }

    if (score >= 75) {
      return "Strong";
    }

    if (score >= 60) {
      return "Good";
    }

    if (score >= 40) {
      return "Developing";
    }

    return "Needs Focus";
  };

  // =========================================================
  // STATUS COLORS
  // =========================================================

  const getStatusClass = (status) => {
    switch (
      status?.toUpperCase()
    ) {
      case "SELECTED":
        return "status selected";

      case "REJECTED":
        return "status rejected";

      case "ATTENDED":
        return "status attended";

      case "COMPLETED":
        return "status completed";

      case "IN_PROGRESS":
        return "status progress";

      default:
        return "status scheduled";
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <h3>
          Loading your dashboard...
        </h3>
        <p>
          Please wait while we fetch your
          latest career information.
        </p>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">
          !
        </div>

        <h2>
          Unable to load dashboard
        </h2>

        <p>
          {error}
        </p>

        <button
          className="retry-button"
          onClick={loadDashboard}
        >
          Try Again
        </button>
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="student-dashboard">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="dashboard-header">

        <div>
          <div className="eyebrow">
            STUDENT PORTAL
          </div>

          <h1>
            Welcome,{" "}
            {student?.first_name ||
              user?.first_name ||
              "Student"}
            !
          </h1>

          <p>
            Track your interviews, skills,
            performance and career progress
            from one place.
          </p>
        </div>

        <div className="header-profile">
          <div className="header-avatar">
            {getInitials()}
          </div>

          <div>
            <strong>
              {student?.first_name ||
                user?.first_name ||
                "Student"}{" "}
              {student?.last_name ||
                user?.last_name ||
                ""}
            </strong>

            <span>
              {student?.course_name ||
                "Data Engineer"}
            </span>
          </div>
        </div>

      </section>

      {/* =====================================================
          PROGRAM / STATUS
      ===================================================== */}

      <section className="profile-summary">

        <div className="summary-item">
          <span className="summary-icon">
            🎓
          </span>

          <div>
            <small>
              PROGRAM
            </small>

            <strong>
              {student?.course_name ||
                "Data Engineer"}
            </strong>
          </div>
        </div>

        <div className="summary-item">
          <span className="summary-icon">
            📚
          </span>

          <div>
            <small>
              BATCH
            </small>

            <strong>
              {student?.batch_name ||
                "--"}
            </strong>
          </div>
        </div>

        <div className="summary-item">
          <span className="summary-icon">
            ✓
          </span>

          <div>
            <small>
              CURRENT STATUS
            </small>

            <strong className="training-status">
              {student?.current_status ||
                "TRAINING"}
            </strong>
          </div>
        </div>

        <div className="summary-score">
          <div className="score-circle">
            <span>
              {overallScore}
            </span>

            <small>
              /100
            </small>
          </div>

          <div>
            <small>
              OVERALL SCORE
            </small>

            <strong>
              {getScoreLabel(
                overallScore
              )}
            </strong>
          </div>
        </div>

      </section>

      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon blue">
            💼
          </div>

          <div>
            <span>
              TOTAL INTERVIEWS
            </span>

            <strong>
              {totalInterviews}
            </strong>

            <small>
              All tracked interviews
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            📅
          </div>

          <div>
            <span>
              UPCOMING
            </span>

            <strong>
              {scheduledCount}
            </strong>

            <small>
              Scheduled interviews
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            🏆
          </div>

          <div>
            <span>
              SELECTED
            </span>

            <strong>
              {selectedCount}
            </strong>

            <small>
              Successful outcomes
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            🎯
          </div>

          <div>
            <span>
              ASSESSMENTS
            </span>

            <strong>
              {assessmentCount}
            </strong>

            <small>
              Completed assessments
            </small>
          </div>
        </div>

      </section>

      {/* =====================================================
          PROFILE + UPCOMING INTERVIEW
      ===================================================== */}

      <section className="two-column-grid">

        {/* PROFILE */}

        <div className="dashboard-card">

          <div className="card-header">
            <div>
              <span className="card-eyebrow">
                PROFILE
              </span>

              <h2>
                Student Information
              </h2>
            </div>

            <div className="card-header-icon">
              👤
            </div>
          </div>

          <div className="profile-details">

            <div>
              <span>
                Full Name
              </span>

              <strong>
                {student?.first_name ||
                  ""}{" "}
                {student?.last_name ||
                  ""}
              </strong>
            </div>

            <div>
              <span>
                Email
              </span>

              <strong>
                {student?.email ||
                  user?.email ||
                  "Not available"}
              </strong>
            </div>

            <div>
              <span>
                Course
              </span>

              <strong>
                {student?.course_name ||
                  "Data Engineer"}
              </strong>
            </div>

            <div>
              <span>
                Batch
              </span>

              <strong>
                {student?.batch_name ||
                  "--"}
              </strong>
            </div>

            <div>
              <span>
                Qualification
              </span>

              <strong>
                {student?.qualification ||
                  "--"}
              </strong>
            </div>

            <div>
              <span>
                Graduation
              </span>

              <strong>
                {student?.graduation_year ||
                  "--"}
              </strong>
            </div>

          </div>

        </div>

        {/* UPCOMING */}

        <div className="dashboard-card upcoming-card">

          <div className="card-header">
            <div>
              <span className="card-eyebrow">
                NEXT UP
              </span>

              <h2>
                Upcoming Interview
              </h2>
            </div>

            <div className="card-header-icon">
              📅
            </div>
          </div>

          {fallbackUpcomingInterview ? (
            <div className="upcoming-content">

              <div className="company-avatar">
                {getCompanyName(
                  fallbackUpcomingInterview
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="upcoming-main">

                <h3>
                  {getCompanyName(
                    fallbackUpcomingInterview
                  )}
                </h3>

                <p>
                  {getRole(
                    fallbackUpcomingInterview
                  )}
                </p>

                <div className="interview-meta">

                  <span>
                    📅{" "}
                    {formatDate(
                      getInterviewDate(
                        fallbackUpcomingInterview
                      )
                    )}
                  </span>

                  <span>
                    🎯{" "}
                    {fallbackUpcomingInterview?.interview_type ||
                      fallbackUpcomingInterview?.round_type ||
                      "Interview"}
                  </span>

                </div>

              </div>

              <div
                className={getStatusClass(
                  getStatus(
                    fallbackUpcomingInterview
                  )
                )}
              >
                {getStatus(
                  fallbackUpcomingInterview
                )}
              </div>

            </div>
          ) : (
            <div className="empty-state">

              <div>
                📅
              </div>

              <h3>
                No upcoming interviews
              </h3>

              <p>
                Your scheduled interviews
                will appear here.
              </p>

            </div>
          )}

        </div>

      </section>

      {/* =====================================================
          INTERVIEW JOURNEY
      ===================================================== */}

      <section className="dashboard-card">

        <div className="card-header">
          <div>
            <span className="card-eyebrow">
              INTERVIEW JOURNEY
            </span>

            <h2>
              Interview Progress
            </h2>
          </div>

          <div className="card-header-icon">
            📊
          </div>
        </div>

        <div className="journey-grid">

          <div className="journey-item">
            <div className="journey-icon scheduled">
              ◷
            </div>

            <strong>
              {scheduledCount}
            </strong>

            <span>
              Scheduled
            </span>
          </div>

          <div className="journey-line" />

          <div className="journey-item">
            <div className="journey-icon attended">
              ✓
            </div>

            <strong>
              {attendedCount}
            </strong>

            <span>
              Attended
            </span>
          </div>

          <div className="journey-line" />

          <div className="journey-item">
            <div className="journey-icon completed">
              ✓
            </div>

            <strong>
              {completedCount}
            </strong>

            <span>
              Completed
            </span>
          </div>

          <div className="journey-line" />

          <div className="journey-item">
            <div className="journey-icon progress">
              ↻
            </div>

            <strong>
              {inProgressCount}
            </strong>

            <span>
              In Progress
            </span>
          </div>

          <div className="journey-line" />

          <div className="journey-item">
            <div className="journey-icon selected">
              ★
            </div>

            <strong>
              {selectedCount}
            </strong>

            <span>
              Selected
            </span>
          </div>

          <div className="journey-line" />

          <div className="journey-item">
            <div className="journey-icon rejected">
              ×
            </div>

            <strong>
              {rejectedCount}
            </strong>

            <span>
              Rejected
            </span>
          </div>

        </div>

      </section>

      {/* =====================================================
          SKILLS
      ===================================================== */}

      <section className="dashboard-card">

        <div className="card-header">

          <div>
            <span className="card-eyebrow">
              SKILLS & PERFORMANCE
            </span>

            <h2>
              Your Skill Performance
            </h2>
          </div>

          <div className="skill-overview">
            <strong>
              {averageSkillScore}
            </strong>

            <span>
              Average
            </span>
          </div>

        </div>

        <div className="skills-grid">

          {skills.map(
            (skill) => (
              <div
                className="skill-card"
                key={skill.name}
              >

                <div className="skill-top">

                  <div className="skill-name">

                    <span className="skill-icon">
                      {skill.icon}
                    </span>

                    <strong>
                      {skill.name}
                    </strong>

                  </div>

                  <strong className="skill-score">
                    {skill.score}
                  </strong>

                </div>

                <div className="progress-track">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          skill.score,
                          0
                        ),
                        100
                      )}%`,
                    }}
                  />

                </div>

                <div className="skill-bottom">

                  <span>
                    {skill.score}/100
                  </span>

                  <span>
                    {getScoreLabel(
                      skill.score
                    )}
                  </span>

                </div>

              </div>
            )
          )}

        </div>

        <div className="performance-footer">

          <div>
            <span>
              Mock Interviews
            </span>

            <strong>
              {mockInterviewCount}
            </strong>
          </div>

          <div>
            <span>
              Assessments
            </span>

            <strong>
              {assessmentCount}
            </strong>
          </div>

          <div>
            <span>
              Average Skill Score
            </span>

            <strong>
              {averageSkillScore}
            </strong>
          </div>

        </div>

      </section>

      {/* =====================================================
          RECENT INTERVIEWS
      ===================================================== */}

      <section className="dashboard-card">

        <div className="card-header">

          <div>
            <span className="card-eyebrow">
              ACTIVITY
            </span>

            <h2>
              Recent Interviews
            </h2>
          </div>

          <div className="card-header-icon">
            💼
          </div>

        </div>

        {interviews.length > 0 ? (
          <div className="interview-table-wrapper">

            <table className="interview-table">

              <thead>
                <tr>
                  <th>
                    COMPANY
                  </th>

                  <th>
                    ROLE
                  </th>

                  <th>
                    DATE
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    RESULT
                  </th>
                </tr>
              </thead>

              <tbody>

                {interviews
                  .slice(0, 5)
                  .map(
                    (
                      interview,
                      index
                    ) => {

                      const status =
                        getStatus(
                          interview
                        );

                      const result =
                        getResult(
                          interview
                        );

                      return (
                        <tr
                          key={
                            interview?.interview_id ||
                            interview?.id ||
                            index
                          }
                        >

                          <td>
                            <div className="company-cell">

                              <div className="company-mini">
                                {getCompanyName(
                                  interview
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <strong>
                                {getCompanyName(
                                  interview
                                )}
                              </strong>

                            </div>
                          </td>

                          <td>
                            {getRole(
                              interview
                            )}
                          </td>

                          <td>
                            {formatShortDate(
                              getInterviewDate(
                                interview
                              )
                            )}
                          </td>

                          <td>
                            <span
                              className={getStatusClass(
                                status
                              )}
                            >
                              {status}
                            </span>
                          </td>

                          <td>
                            <span
                              className={
                                result ===
                                "SELECTED"
                                  ? "result selected"
                                  : result ===
                                      "REJECTED"
                                    ? "result rejected"
                                    : "result pending"
                              }
                            >
                              {result ||
                                "PENDING"}
                            </span>
                          </td>

                        </tr>
                      );
                    }
                  )}

              </tbody>

            </table>

          </div>
        ) : (
          <div className="empty-state">

            <div>
              💼
            </div>

            <h3>
              No interview activity yet
            </h3>

            <p>
              Your interview history
              will appear here.
            </p>

          </div>
        )}

      </section>

      {/* =====================================================
          EMPLOYMENT
      ===================================================== */}

      <section className="dashboard-card employment-card">

        <div className="card-header">

          <div>
            <span className="card-eyebrow">
              CAREER
            </span>

            <h2>
              Employment
            </h2>
          </div>

          <div className="card-header-icon">
            💼
          </div>

        </div>

        {employment.length > 0 ? (

          <div className="employment-list">

            {employment.map(
              (job, index) => (

                <div
                  className="employment-item"
                  key={
                    job?.employment_id ||
                    index
                  }
                >

                  <div className="employment-company">
                    {job?.company_name
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "C"}
                  </div>

                  <div className="employment-main">

                    <div className="employment-title">

                      <div>
                        <h3>
                          {job?.company_name ||
                            "Company"}
                        </h3>

                        <p>
                          {job?.role ||
                            "Role"}
                        </p>
                      </div>

                      {job?.is_current && (
                        <span className="current-badge">
                          CURRENTLY EMPLOYED
                        </span>
                      )}

                    </div>

                    <div className="employment-details">

                      <span>
                        💼{" "}
                        {job?.employment_type ||
                          "Full-time"}
                      </span>

                      <span>
                        📅{" "}
                        {job?.start_date
                          ? formatDate(
                              job.start_date
                            )
                          : "--"}
                      </span>

                      <span>
                        📍{" "}
                        {job?.location ||
                          "--"}
                      </span>

                      <span>
                        ₹
                        {job?.salary
                          ? Number(
                              job.salary
                            ).toLocaleString(
                              "en-IN"
                            )
                          : "--"}
                      </span>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="empty-state">

            <div>
              💼
            </div>

            <h3>
              No employment information
            </h3>

            <p>
              Your employment details
              will appear here after
              placement.
            </p>

          </div>

        )}

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="dashboard-footer">

        <strong>
          TTT NexGen Tracker
        </strong>

        <span>
          Student Career Management Portal
        </span>

      </footer>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .student-dashboard {
          width: 100%;
          min-height: 100vh;
          padding: 28px 32px 40px;
          background:
            linear-gradient(
              180deg,
              #f7f9fc 0%,
              #f3f6fa 100%
            );
          color: #172033;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 24px;
        }

        .eyebrow,
        .card-eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.3px;
          color: #64748b;
          margin-bottom: 7px;
        }

        .dashboard-header h1 {
          margin: 0;
          font-size: 30px;
          line-height: 1.2;
          font-weight: 800;
          color: #111827;
        }

        .dashboard-header p {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
        }

        .header-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          box-shadow:
            0 4px 15px rgba(
              15,
              23,
              42,
              0.04
            );
        }

        .header-avatar {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #111827;
          color: #ffffff;
          font-weight: 800;
          font-size: 14px;
        }

        .header-profile strong {
          display: block;
          color: #111827;
          font-size: 14px;
        }

        .header-profile span {
          display: block;
          margin-top: 3px;
          color: #64748b;
          font-size: 12px;
        }

        /* =====================================================
           PROFILE SUMMARY
        ===================================================== */

        .profile-summary {
          display: grid;
          grid-template-columns:
            1.3fr
            0.7fr
            1.2fr
            1fr;
          gap: 0;
          background: #111827;
          border-radius: 18px;
          padding: 6px;
          margin-bottom: 20px;
          box-shadow:
            0 12px 30px rgba(
              15,
              23,
              42,
              0.10
            );
        }

        .summary-item,
        .summary-score {
          min-height: 82px;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 15px 18px;
        }

        .summary-item + .summary-item,
        .summary-score {
          border-left: 1px solid
            rgba(
              255,
              255,
              255,
              0.10
            );
        }

        .summary-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(
            255,
            255,
            255,
            0.09
          );
          border-radius: 10px;
          font-size: 17px;
        }

        .summary-item small,
        .summary-score small {
          display: block;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }

        .summary-item strong {
          display: block;
          color: #ffffff;
          font-size: 14px;
        }

        .training-status {
          color: #86efac !important;
        }

        .summary-score {
          justify-content: flex-end;
        }

        .score-circle {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #60a5fa;
          border-radius: 50%;
          color: #ffffff;
          flex-shrink: 0;
        }

        .score-circle span {
          font-size: 16px;
          font-weight: 800;
        }

        .score-circle small {
          margin: 11px 0 0 1px;
          font-size: 8px;
        }

        .summary-score strong {
          display: block;
          color: #93c5fd;
          font-size: 13px;
        }

        /* =====================================================
           STATS
        ===================================================== */

        .stats-grid {
          display: grid;
          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );
          gap: 16px;
          margin-bottom: 20px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 18px;
          box-shadow:
            0 5px 18px rgba(
              15,
              23,
              42,
              0.04
            );
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 10px 25px rgba(
              15,
              23,
              42,
              0.08
            );
        }

        .stat-icon {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-size: 19px;
          flex-shrink: 0;
        }

        .stat-icon.blue {
          background: #eff6ff;
        }

        .stat-icon.orange {
          background: #fff7ed;
        }

        .stat-icon.green {
          background: #f0fdf4;
        }

        .stat-icon.purple {
          background: #faf5ff;
        }

        .stat-card span {
          display: block;
          color: #64748b;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.9px;
        }

        .stat-card strong {
          display: block;
          margin-top: 4px;
          font-size: 24px;
          color: #111827;
        }

        .stat-card small {
          display: block;
          margin-top: 2px;
          color: #94a3b8;
          font-size: 11px;
        }

        /* =====================================================
           GRID
        ===================================================== */

        .two-column-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1.2fr)
            minmax(0, 0.8fr);
          gap: 20px;
          margin-bottom: 20px;
        }

        /* =====================================================
           CARD
        ===================================================== */

        .dashboard-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 22px;
          margin-bottom: 20px;
          box-shadow:
            0 5px 18px rgba(
              15,
              23,
              42,
              0.04
            );
        }

        .two-column-grid
          .dashboard-card {
          margin-bottom: 0;
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
        }

        .card-header h2 {
          margin: 0;
          color: #111827;
          font-size: 18px;
          font-weight: 800;
        }

        .card-header-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 16px;
        }

        /* =====================================================
           PROFILE DETAILS
        ===================================================== */

        .profile-details {
          display: grid;
          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );
          gap: 18px 28px;
        }

        .profile-details span {
          display: block;
          color: #94a3b8;
          font-size: 11px;
          margin-bottom: 5px;
        }

        .profile-details strong {
          display: block;
          color: #1e293b;
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        /* =====================================================
           UPCOMING INTERVIEW
        ===================================================== */

        .upcoming-content {
          display: flex;
          align-items: center;
          gap: 14px;
          min-height: 115px;
        }

        .company-avatar {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #111827;
          color: #ffffff;
          border-radius: 14px;
          font-size: 20px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .upcoming-main {
          min-width: 0;
          flex: 1;
        }

        .upcoming-main h3 {
          margin: 0;
          color: #111827;
          font-size: 17px;
        }

        .upcoming-main p {
          margin: 4px 0 10px;
          color: #64748b;
          font-size: 13px;
        }

        .interview-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .interview-meta span {
          color: #64748b;
          font-size: 11px;
        }

        .status,
        .result {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .status.scheduled {
          background: #eff6ff;
          color: #2563eb;
        }

        .status.selected {
          background: #f0fdf4;
          color: #15803d;
        }

        .status.rejected {
          background: #fef2f2;
          color: #dc2626;
        }

        .status.attended,
        .status.completed {
          background: #f0fdf4;
          color: #15803d;
        }

        .status.progress {
          background: #fff7ed;
          color: #c2410c;
        }

        /* =====================================================
           INTERVIEW JOURNEY
        ===================================================== */

        .journey-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          overflow-x: auto;
          padding: 10px 0 4px;
        }

        .journey-item {
          min-width: 90px;
          text-align: center;
          flex-shrink: 0;
        }

        .journey-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 8px;
          border-radius: 50%;
          font-size: 16px;
          font-weight: 800;
        }

        .journey-icon.scheduled {
          background: #eff6ff;
          color: #2563eb;
        }

        .journey-icon.attended,
        .journey-icon.completed {
          background: #f0fdf4;
          color: #15803d;
        }

        .journey-icon.progress {
          background: #fff7ed;
          color: #c2410c;
        }

        .journey-icon.selected {
          background: #fefce8;
          color: #a16207;
        }

        .journey-icon.rejected {
          background: #fef2f2;
          color: #dc2626;
        }

        .journey-item strong {
          display: block;
          color: #111827;
          font-size: 17px;
        }

        .journey-item span {
          display: block;
          margin-top: 3px;
          color: #64748b;
          font-size: 10px;
        }

        .journey-line {
          flex: 1;
          min-width: 20px;
          height: 1px;
          background: #e2e8f0;
        }

        /* =====================================================
           SKILLS
        ===================================================== */

        .skill-overview {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .skill-overview strong {
          font-size: 22px;
          color: #111827;
        }

        .skill-overview span {
          color: #64748b;
          font-size: 11px;
        }

        .skills-grid {
          display: grid;
          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );
          gap: 14px;
        }

        .skill-card {
          padding: 15px;
          background: #f8fafc;
          border: 1px solid #edf0f4;
          border-radius: 13px;
        }

        .skill-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .skill-name {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .skill-icon {
          font-size: 17px;
        }

        .skill-name strong {
          color: #334155;
          font-size: 12px;
        }

        .skill-score {
          color: #111827;
          font-size: 16px;
        }

        .progress-track {
          width: 100%;
          height: 7px;
          margin-top: 12px;
          background: #e2e8f0;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #2563eb;
          border-radius: 999px;
          transition:
            width 0.5s ease;
        }

        .skill-bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 7px;
          color: #94a3b8;
          font-size: 10px;
        }

        .skill-bottom span:last-child {
          color: #2563eb;
          font-weight: 700;
        }

        .performance-footer {
          display: grid;
          grid-template-columns:
            repeat(
              3,
              1fr
            );
          margin-top: 18px;
          padding-top: 18px;
          border-top: 1px solid #edf0f4;
        }

        .performance-footer div {
          text-align: center;
        }

        .performance-footer div
          + div {
          border-left: 1px solid
            #edf0f4;
        }

        .performance-footer span {
          display: block;
          color: #94a3b8;
          font-size: 10px;
        }

        .performance-footer strong {
          display: block;
          margin-top: 4px;
          color: #111827;
          font-size: 18px;
        }

        /* =====================================================
           TABLE
        ===================================================== */

        .interview-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .interview-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 650px;
        }

        .interview-table th {
          padding: 11px 10px;
          text-align: left;
          color: #94a3b8;
          font-size: 9px;
          letter-spacing: 0.8px;
          font-weight: 800;
          border-bottom: 1px solid
            #e5e7eb;
        }

        .interview-table td {
          padding: 13px 10px;
          color: #475569;
          font-size: 12px;
          border-bottom: 1px solid
            #f1f5f9;
        }

        .interview-table tbody tr:last-child td {
          border-bottom: none;
        }

        .company-cell {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .company-cell strong {
          color: #1e293b;
          font-size: 12px;
        }

        .company-mini {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #111827;
          color: #ffffff;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
        }

        .result.selected {
          background: #f0fdf4;
          color: #15803d;
        }

        .result.rejected {
          background: #fef2f2;
          color: #dc2626;
        }

        .result.pending {
          background: #f8fafc;
          color: #64748b;
        }

        /* =====================================================
           EMPLOYMENT
        ===================================================== */

        .employment-item {
          display: flex;
          gap: 15px;
          padding: 18px;
          background: #f8fafc;
          border: 1px solid #edf0f4;
          border-radius: 14px;
        }

        .employment-company {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #111827;
          color: #ffffff;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .employment-main {
          flex: 1;
          min-width: 0;
        }

        .employment-title {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
        }

        .employment-title h3 {
          margin: 0;
          color: #111827;
          font-size: 15px;
        }

        .employment-title p {
          margin: 3px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .current-badge {
          padding: 5px 9px;
          background: #f0fdf4;
          color: #15803d;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .employment-details {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 13px;
        }

        .employment-details span {
          color: #64748b;
          font-size: 11px;
        }

        /* =====================================================
           EMPTY / LOADING / ERROR
        ===================================================== */

        .empty-state {
          text-align: center;
          padding: 30px 15px;
          color: #64748b;
        }

        .empty-state > div {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .empty-state h3 {
          margin: 0;
          color: #334155;
          font-size: 14px;
        }

        .empty-state p {
          margin: 5px 0 0;
          font-size: 11px;
        }

        .dashboard-loading,
        .dashboard-error {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
          background: #f7f9fc;
          color: #334155;
        }

        .dashboard-loading h3,
        .dashboard-error h2 {
          margin: 14px 0 5px;
        }

        .dashboard-loading p,
        .dashboard-error p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
        }

        .loading-spinner {
          width: 38px;
          height: 38px;
          border: 4px solid #e2e8f0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation:
            dashboard-spin
            0.8s linear infinite;
        }

        @keyframes dashboard-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .error-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fef2f2;
          color: #dc2626;
          border-radius: 50%;
          font-size: 24px;
          font-weight: 800;
        }

        .retry-button {
          margin-top: 18px;
          padding: 10px 18px;
          border: none;
          border-radius: 9px;
          background: #111827;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .retry-button:hover {
          background: #1f2937;
        }

        /* =====================================================
           FOOTER
        ===================================================== */

        .dashboard-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px 0 0;
          color: #94a3b8;
          font-size: 10px;
        }

        .dashboard-footer strong {
          color: #64748b;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (
          max-width: 1100px
        ) {

          .stats-grid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .profile-summary {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .summary-item + .summary-item,
          .summary-score {
            border-left: none;
          }

          .summary-score {
            justify-content: flex-start;
          }

          .summary-item:nth-child(
            3
          ),
          .summary-score {
            border-top: 1px solid
              rgba(
                255,
                255,
                255,
                0.10
              );
          }

        }

        @media (
          max-width: 850px
        ) {

          .student-dashboard {
            padding: 20px;
          }

          .dashboard-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .two-column-grid {
            grid-template-columns: 1fr;
          }

          .two-column-grid
            .dashboard-card {
            margin-bottom: 20px;
          }

          .skills-grid {
            grid-template-columns: 1fr;
          }

        }

        @media (
          max-width: 600px
        ) {

          .student-dashboard {
            padding: 16px;
          }

          .dashboard-header h1 {
            font-size: 24px;
          }

          .header-profile {
            width: 100%;
          }

          .profile-summary {
            grid-template-columns: 1fr;
          }

          .summary-item,
          .summary-score {
            min-height: 70px;
            border-top: 1px solid
              rgba(
                255,
                255,
                255,
                0.10
              );
          }

          .summary-item:first-child {
            border-top: none;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-card {
            padding: 17px;
          }

          .profile-details {
            grid-template-columns: 1fr;
          }

          .upcoming-content {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .journey-grid {
            justify-content: flex-start;
          }

          .performance-footer {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .performance-footer div
            + div {
            border-left: none;
            border-top: 1px solid
              #edf0f4;
            padding-top: 12px;
          }

          .employment-title {
            flex-direction: column;
          }

          .employment-details {
            flex-direction: column;
            gap: 7px;
          }

          .dashboard-footer {
            flex-direction: column;
          }

        }

      `}</style>

    </div>
  );
}

export default StudentDashboard;
