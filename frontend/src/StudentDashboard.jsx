import { useEffect, useState } from "react";

function StudentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("access_token");

      console.log("Token exists:", !!token);

      if (!token) {
        setError("No login token found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/students/dashboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("Dashboard status:", response.status);

      const data = await response.json();

      console.log("Dashboard response:", data);

      if (!response.ok) {
        setError(
          data.detail ||
            `Dashboard request failed with status ${response.status}`
        );
        setLoading(false);
        return;
      }

      setDashboard(data);
      setLoading(false);
    } catch (error) {
      console.error("Dashboard error:", error);
      setError("Cannot connect to backend.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.bigIcon}>⏳</div>
        <h2>Loading Dashboard...</h2>
        <p>Please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <div style={styles.bigIcon}>⚠️</div>

        <h2>Unable to load dashboard</h2>

        <p>{error}</p>

        <button
          onClick={loadDashboard}
          style={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div style={styles.center}>
        <h2>No dashboard data available</h2>
      </div>
    );
  }

  const student = dashboard.student;
  const interviews = dashboard.interviews;
  const performance = dashboard.performance;
  const employment = dashboard.employment || [];

  return (
    <div style={styles.page}>

      {/* Welcome */}
      <section style={styles.welcome}>
        <div>
          <h1 style={styles.welcomeTitle}>
            Welcome back, {student.first_name}! 👋
          </h1>

          <p style={styles.welcomeText}>
            Here is an overview of your student journey.
          </p>
        </div>

        <div style={styles.statusBox}>
          <span style={styles.statusLabel}>
            Current Status
          </span>

          <strong>
            {student.current_status}
          </strong>
        </div>
      </section>

      {/* Student Information */}
      <section style={styles.studentCard}>

        <div style={styles.avatar}>
          {student.first_name
            ? student.first_name.charAt(0).toUpperCase()
            : "S"}
        </div>

        <div>
          <h2 style={styles.studentName}>
            {student.first_name} {student.last_name}
          </h2>

          <p style={styles.email}>
            {student.email}
          </p>

          <div style={styles.details}>
            <span>
              🎓 {student.course_name}
            </span>

            <span>
              📚 Batch {student.batch_name}
            </span>
          </div>
        </div>

      </section>

      {/* Interviews */}
      <h2 style={styles.sectionTitle}>
        Interview Overview
      </h2>

      <section style={styles.statsGrid}>

        <StatCard
          icon="🎯"
          title="Total Interviews"
          value={interviews.total_interviews}
        />

        <StatCard
          icon="📅"
          title="Scheduled"
          value={interviews.scheduled_interviews}
        />

        <StatCard
          icon="✅"
          title="Completed"
          value={interviews.completed_interviews}
        />

        <StatCard
          icon="🏆"
          title="Selected"
          value={interviews.selected_interviews}
        />

      </section>

      {/* Performance */}
      {performance && (
        <>
          <h2 style={styles.sectionTitle}>
            Performance Overview
          </h2>

          <section style={styles.card}>

            <Performance
              name="Python"
              score={performance.python_score}
            />

            <Performance
              name="SQL"
              score={performance.sql_score}
            />

            <Performance
              name="PySpark"
              score={performance.pyspark_score}
            />

            <Performance
              name="AWS"
              score={performance.aws_score}
            />

            <Performance
              name="Data Engineering"
              score={performance.data_engineering_score}
            />

            <Performance
              name="Communication"
              score={performance.communication_score}
            />

            <div style={styles.overall}>
              <div>
                <p style={styles.overallLabel}>
                  Overall Score
                </p>

                <h2 style={styles.overallScore}>
                  {performance.overall_score}%
                </h2>
              </div>

              <div>
                <p>
                  Assessments:{" "}
                  <strong>
                    {performance.assessment_count}
                  </strong>
                </p>

                <p>
                  Mock Interviews:{" "}
                  <strong>
                    {performance.mock_interview_count}
                  </strong>
                </p>
              </div>
            </div>

          </section>
        </>
      )}

      {/* Employment */}
      <h2 style={styles.sectionTitle}>
        Employment
      </h2>

      <section style={styles.card}>

        {employment.length === 0 ? (

          <div style={styles.empty}>
            <div style={styles.bigIcon}>💼</div>

            <h3>No Employment Records</h3>

            <p>
              Your employment information will appear here.
            </p>
          </div>

        ) : (

          employment.map((job) => (

            <div
              key={job.employment_id}
              style={styles.job}
            >

              <div style={styles.companyIcon}>
                🏢
              </div>

              <div style={styles.jobInfo}>

                <h3 style={styles.company}>
                  {job.company_name}
                </h3>

                <p style={styles.role}>
                  {job.role}
                </p>

                <div style={styles.jobDetails}>

                  <span>
                    📍 {job.location}
                  </span>

                  <span>
                    💼 {job.employment_type}
                  </span>

                  <span>
                    📅 {job.start_date}
                  </span>

                </div>

              </div>

              <div style={styles.salary}>

                <span>
                  Annual Salary
                </span>

                <strong>
                  ₹
                  {job.salary
                    ? job.salary.toLocaleString("en-IN")
                    : "Not available"}
                </strong>

              </div>

            </div>

          ))

        )}

      </section>

    </div>
  );
}


function StatCard({ icon, title, value }) {
  return (
    <div style={styles.statCard}>

      <div style={styles.statIcon}>
        {icon}
      </div>

      <div>
        <p style={styles.statTitle}>
          {title}
        </p>

        <h2 style={styles.statValue}>
          {value}
        </h2>
      </div>

    </div>
  );
}


function Performance({ name, score }) {
  return (
    <div style={styles.performanceRow}>

      <div style={styles.performanceHeader}>
        <span>{name}</span>

        <strong>
          {score}%
        </strong>
      </div>

      <div style={styles.progressBackground}>

        <div
          style={{
            ...styles.progress,
            width: `${score}%`,
          }}
        />

      </div>

    </div>
  );
}


const styles = {

  page: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  center: {
    minHeight: "500px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#374151",
  },

  bigIcon: {
    fontSize: "45px",
    marginBottom: "10px",
  },

  retryButton: {
    marginTop: "15px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  welcome: {
    background: "#1e3a8a",
    color: "white",
    padding: "30px",
    borderRadius: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  welcomeTitle: {
    margin: 0,
    fontSize: "28px",
  },

  welcomeText: {
    margin: "8px 0 0",
    opacity: 0.8,
  },

  statusBox: {
    background: "rgba(255,255,255,0.12)",
    padding: "15px 20px",
    borderRadius: "10px",
    textAlign: "center",
  },

  statusLabel: {
    display: "block",
    fontSize: "12px",
    opacity: 0.7,
    marginBottom: "5px",
  },

  studentCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
  },

  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
    fontWeight: "bold",
  },

  studentName: {
    margin: 0,
    color: "#1f2937",
  },

  email: {
    color: "#6b7280",
    margin: "5px 0",
  },

  details: {
    display: "flex",
    gap: "25px",
    color: "#6b7280",
    fontSize: "14px",
    marginTop: "10px",
  },

  sectionTitle: {
    color: "#1f2937",
    fontSize: "20px",
    margin: "25px 0 15px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },

  statCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
  },

  statIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "10px",
    background: "#eff6ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
  },

  statTitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },

  statValue: {
    margin: "5px 0 0",
    color: "#111827",
    fontSize: "25px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
    marginBottom: "30px",
  },

  performanceRow: {
    marginBottom: "18px",
  },

  performanceHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "7px",
  },

  progressBackground: {
    height: "9px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "10px",
  },

  overall: {
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
  },

  overallLabel: {
    color: "#6b7280",
    margin: 0,
  },

  overallScore: {
    color: "#2563eb",
    margin: "5px 0",
    fontSize: "32px",
  },

  empty: {
    textAlign: "center",
    padding: "30px",
    color: "#6b7280",
  },

  job: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  companyIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "10px",
    background: "#eff6ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
  },

  jobInfo: {
    flex: 1,
  },

  company: {
    margin: 0,
    color: "#1f2937",
  },

  role: {
    margin: "5px 0",
    color: "#4b5563",
  },

  jobDetails: {
    display: "flex",
    gap: "20px",
    fontSize: "13px",
    color: "#6b7280",
    flexWrap: "wrap",
  },

  salary: {
    textAlign: "right",
    minWidth: "140px",
  },

};

export default StudentDashboard;