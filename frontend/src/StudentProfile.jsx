import { useEffect, useState } from "react";

function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/students/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Failed to load profile");
        setLoading(false);
        return;
      }

      console.log("Profile data:", data);

      setProfile(data);
      setLoading(false);
    } catch (error) {
      console.error("Profile error:", error);
      setError("Cannot connect to backend");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingIcon}>⏳</div>
        <h2>Loading Profile...</h2>
        <p>Please wait while we fetch your information.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        <div style={styles.errorIcon}>⚠️</div>
        <h2>Unable to load profile</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.error}>
        <h2>No profile information available</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* ========================= */}
      {/* PAGE HEADER */}
      {/* ========================= */}

      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>
            My Profile
          </h1>

          <p style={styles.pageSubtitle}>
            View your personal and academic information
          </p>
        </div>
      </div>


      {/* ========================= */}
      {/* PROFILE HEADER */}
      {/* ========================= */}

      <section style={styles.profileCard}>

        <div style={styles.avatar}>
          {profile.first_name
            ? profile.first_name.charAt(0).toUpperCase()
            : "S"}
        </div>

        <div style={styles.profileMain}>

          <h2 style={styles.profileName}>
            {profile.first_name}{" "}
            {profile.last_name || ""}
          </h2>

          <p style={styles.profileEmail}>
            {profile.email}
          </p>

          <div style={styles.profileTags}>

            <span style={styles.status}>
              {profile.current_status || "ACTIVE"}
            </span>

            <span style={styles.courseTag}>
              {profile.course_name || "Data Engineer"}
            </span>

          </div>

        </div>

      </section>


      {/* ========================= */}
      {/* PERSONAL INFORMATION */}
      {/* ========================= */}

      <section style={styles.card}>

        <h2 style={styles.sectionTitle}>
          👤 Personal Information
        </h2>

        <div style={styles.grid}>

          <InfoItem
            label="First Name"
            value={profile.first_name}
          />

          <InfoItem
            label="Last Name"
            value={profile.last_name}
          />

          <InfoItem
            label="Email"
            value={profile.email}
          />

          <InfoItem
            label="Phone"
            value={profile.phone}
          />

          <InfoItem
            label="Date of Birth"
            value={profile.date_of_birth}
          />

          <InfoItem
            label="Gender"
            value={profile.gender}
          />

        </div>

      </section>


      {/* ========================= */}
      {/* ACADEMIC INFORMATION */}
      {/* ========================= */}

      <section style={styles.card}>

        <h2 style={styles.sectionTitle}>
          🎓 Academic Information
        </h2>

        <div style={styles.grid}>

          <InfoItem
            label="Qualification"
            value={profile.qualification}
          />

          <InfoItem
            label="College"
            value={profile.college_name}
          />

          <InfoItem
            label="Graduation Year"
            value={profile.graduation_year}
          />

          <InfoItem
            label="Batch"
            value={profile.batch_name}
          />

          <InfoItem
            label="Course"
            value={profile.course_name}
          />

          <InfoItem
            label="Student Status"
            value={profile.current_status}
          />

        </div>

      </section>


      {/* ========================= */}
      {/* ABOUT ME */}
      {/* ========================= */}

      <section style={styles.card}>

        <h2 style={styles.sectionTitle}>
          📝 About Me
        </h2>

        <div style={styles.bioBox}>

          <p style={styles.bio}>
            {profile.bio ||
              "No bio information has been added yet."}
          </p>

        </div>

      </section>

    </div>
  );
}


/* ================================= */
/* INFO ITEM */
/* ================================= */

function InfoItem({ label, value }) {
  return (
    <div style={styles.infoItem}>

      <p style={styles.infoLabel}>
        {label}
      </p>

      <p style={styles.infoValue}>
        {value !== null &&
        value !== undefined &&
        value !== ""
          ? value
          : "Not provided"}
      </p>

    </div>
  );
}


/* ================================= */
/* STYLES */
/* ================================= */

const styles = {

  page: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  /* PAGE HEADER */

  pageHeader: {
    marginBottom: "25px",
  },

  pageTitle: {
    margin: 0,
    fontSize: "28px",
    color: "#1f2937",
  },

  pageSubtitle: {
    margin: "7px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  /* PROFILE CARD */

  profileCard: {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    gap: "25px",
    marginBottom: "25px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
  },

  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "36px",
    fontWeight: "bold",
    flexShrink: 0,
  },

  profileMain: {
    flex: 1,
  },

  profileName: {
    margin: 0,
    fontSize: "25px",
    color: "#111827",
  },

  profileEmail: {
    margin: "6px 0 12px",
    color: "#6b7280",
  },

  profileTags: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  status: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "20px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: "bold",
  },

  courseTag: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "20px",
    background: "#dbeafe",
    color: "#1e40af",
    fontSize: "12px",
    fontWeight: "bold",
  },

  /* CARD */

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "25px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
  },

  sectionTitle: {
    margin: "0 0 20px",
    color: "#1f2937",
    fontSize: "19px",
  },

  /* GRID */

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },

  /* INFO ITEM */

  infoItem: {
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "9px",
    border: "1px solid #eef2f7",
  },

  infoLabel: {
    margin: 0,
    fontSize: "12px",
    fontWeight: "bold",
    color: "#6b7280",
    textTransform: "uppercase",
  },

  infoValue: {
    margin: "7px 0 0",
    fontSize: "15px",
    color: "#1f2937",
    fontWeight: "500",
  },

  /* BIO */

  bioBox: {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "9px",
    border: "1px solid #eef2f7",
  },

  bio: {
    margin: 0,
    lineHeight: "1.7",
    color: "#4b5563",
    fontSize: "15px",
  },

  /* LOADING */

  loading: {
    minHeight: "500px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#374151",
  },

  loadingIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  /* ERROR */

  error: {
    background: "white",
    padding: "50px",
    borderRadius: "12px",
    textAlign: "center",
    color: "#374151",
  },

  errorIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },
};

export default StudentProfile;