import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function StudentProfile() {
  const { apiRequest } = useAuth();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    qualification: "",
    college_name: "",
    graduation_year: "",
    bio: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/students/me");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load profile"
        );
      }

      const profile = data.student;

      setStudent(profile);

      setFormData({
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        date_of_birth:
          profile?.date_of_birth || "",
        gender: profile?.gender || "",
        qualification:
          profile?.qualification || "",
        college_name:
          profile?.college_name || "",
        graduation_year:
          profile?.graduation_year || "",
        bio: profile?.bio || "",
      });
    } catch (err) {
      console.error("Profile error:", err);

      setError(
        err.message || "Unable to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleEdit = () => {
    setError("");
    setSuccess("");
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      first_name: student?.first_name || "",
      last_name: student?.last_name || "",
      email: student?.email || "",
      phone: student?.phone || "",
      date_of_birth:
        student?.date_of_birth || "",
      gender: student?.gender || "",
      qualification:
        student?.qualification || "",
      college_name:
        student?.college_name || "",
      graduation_year:
        student?.graduation_year || "",
      bio: student?.bio || "",
    });

    setError("");
    setSuccess("");
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!formData.first_name.trim()) {
        throw new Error(
          "First name is required."
        );
      }

      if (!formData.email.trim()) {
        throw new Error(
          "Email is required."
        );
      }

      if (
        formData.graduation_year &&
        (
          Number(formData.graduation_year) < 1900 ||
          Number(formData.graduation_year) > 2100
        )
      ) {
        throw new Error(
          "Please enter a valid graduation year."
        );
      }

      const payload = {
        first_name:
          formData.first_name.trim(),

        last_name:
          formData.last_name.trim() || null,

        email:
          formData.email.trim(),

        phone:
          formData.phone.trim() || null,

        date_of_birth:
          formData.date_of_birth || null,

        gender:
          formData.gender.trim() || null,

        qualification:
          formData.qualification.trim() || null,

        college_name:
          formData.college_name.trim() || null,

        graduation_year:
          formData.graduation_year
            ? Number(formData.graduation_year)
            : null,

        bio:
          formData.bio.trim() || null,
      };

      console.log(
        "Profile update payload:",
        payload
      );

      const response = await apiRequest(
        "/students/profile",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      console.log(
        "Profile update response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to update profile"
        );
      }

      const updatedStudent =
        data.student;

      setStudent(updatedStudent);

      setFormData({
        first_name:
          updatedStudent?.first_name || "",

        last_name:
          updatedStudent?.last_name || "",

        email:
          updatedStudent?.email || "",

        phone:
          updatedStudent?.phone || "",

        date_of_birth:
          updatedStudent?.date_of_birth || "",

        gender:
          updatedStudent?.gender || "",

        qualification:
          updatedStudent?.qualification || "",

        college_name:
          updatedStudent?.college_name || "",

        graduation_year:
          updatedStudent?.graduation_year || "",

        bio:
          updatedStudent?.bio || "",
      });

      setEditing(false);

      setSuccess(
        "Profile updated successfully!"
      );
    } catch (err) {
      console.error(
        "Update profile error:",
        err
      );

      setError(
        err.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.loadingIcon}>
          ⏳
        </div>

        <h3>
          Loading profile...
        </h3>

        <p style={styles.loadingText}>
          Please wait...
        </p>
      </div>
    );
  }

  if (error && !student) {
    return (
      <div style={styles.errorCard}>
        <div style={styles.errorIcon}>
          ⚠️
        </div>

        <h3>
          Unable to load profile
        </h3>

        <p style={styles.errorText}>
          {error}
        </p>

        <button
          type="button"
          onClick={loadProfile}
          style={styles.retryButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  const firstName =
    student?.first_name || "";

  const lastName =
    student?.last_name || "";

  const fullName =
    (firstName + " " + lastName).trim() ||
    "Student";

  const batchNumber =
    student?.batch_name
      ? "Batch " + student.batch_name
      : "Not available";

  return (
    <div>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>
            My Profile
          </h1>

          <p style={styles.pageSubtitle}>
            View and manage your student
            information
          </p>
        </div>

        {!editing ? (
          <button
            type="button"
            onClick={handleEdit}
            style={styles.editButton}
          >
            ✏️ Edit Profile
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            style={styles.cancelButton}
          >
            ✕ Cancel
          </button>
        )}
      </div>

      {success && (
        <div style={styles.successMessage}>
          ✓ {success}
        </div>
      )}

      {error && student && (
        <div style={styles.errorMessage}>
          ⚠️ {error}
        </div>
      )}

      <div style={styles.profileCard}>
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            {fullName
              .charAt(0)
              .toUpperCase()}
          </div>

          <h2 style={styles.name}>
            {fullName}
          </h2>

          <span style={styles.status}>
            {student?.current_status ||
              "TRAINING"}
          </span>
        </div>

        <div style={styles.infoSection}>
          <h3 style={styles.sectionTitle}>
            Student Information
          </h3>

          {!editing ? (
            <div style={styles.infoGrid}>
              <InfoItem
                icon="👤"
                label="Student Name"
                value={fullName}
              />

              <InfoItem
                icon="📧"
                label="Email"
                value={
                  student?.email ||
                  "Not available"
                }
              />

              <InfoItem
                icon="📱"
                label="Phone"
                value={
                  student?.phone ||
                  "Not available"
                }
              />

              <InfoItem
                icon="🎓"
                label="Batch Number"
                value={batchNumber}
              />

              <InfoItem
                icon="💻"
                label="Course"
                value={
                  student?.course_name ||
                  "Not available"
                }
              />

              <InfoItem
                icon="📚"
                label="Qualification"
                value={
                  student?.qualification ||
                  "Not available"
                }
              />

              <InfoItem
                icon="🏫"
                label="College"
                value={
                  student?.college_name ||
                  "Not available"
                }
              />

              <InfoItem
                icon="📅"
                label="Graduation Year"
                value={
                  student?.graduation_year ||
                  "Not available"
                }
              />

              <InfoItem
                icon="🎂"
                label="Date of Birth"
                value={
                  student?.date_of_birth ||
                  "Not available"
                }
              />

              <InfoItem
                icon="⚧️"
                label="Gender"
                value={
                  student?.gender ||
                  "Not available"
                }
              />

              <InfoItem
                icon="📝"
                label="Bio"
                value={
                  student?.bio ||
                  "Not available"
                }
              />
            </div>
          ) : (
            <div>
              <div style={styles.formGrid}>
                <FormField
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />

                <FormField
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />

                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <FormField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <FormField
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />

                <FormField
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                />

                <FormField
                  label="Qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                />

                <FormField
                  label="College Name"
                  name="college_name"
                  value={formData.college_name}
                  onChange={handleChange}
                />

                <FormField
                  label="Graduation Year"
                  name="graduation_year"
                  type="number"
                  value={formData.graduation_year}
                  onChange={handleChange}
                />
              </div>

              <div style={styles.bioSection}>
                <label style={styles.formLabel}>
                  Bio
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  style={styles.textarea}
                />
              </div>

              <div style={styles.readOnlySection}>
                <h4 style={styles.readOnlyTitle}>
                  Academic Information
                </h4>

                <div style={styles.readOnlyGrid}>
                  <div style={styles.readOnlyItem}>
                    <span style={styles.readOnlyLabel}>
                      🎓 Batch Number
                    </span>

                    <span style={styles.readOnlyValue}>
                      {batchNumber}
                    </span>
                  </div>

                  <div style={styles.readOnlyItem}>
                    <span style={styles.readOnlyLabel}>
                      💻 Course
                    </span>

                    <span style={styles.readOnlyValue}>
                      {student?.course_name ||
                        "Not available"}
                    </span>
                  </div>
                </div>

                <p style={styles.readOnlyNote}>
                  Batch number and course are
                  managed by the administrator.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <div style={styles.formFooter}>
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            style={styles.cancelFormButton}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={styles.saveButton}
          >
            {saving
              ? "⏳ Saving..."
              : "💾 Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}) {
  return (
    <div style={styles.infoItem}>
      <div style={styles.infoIcon}>
        {icon}
      </div>

      <div style={styles.infoContent}>
        <div style={styles.infoLabel}>
          {label}
        </div>

        <div style={styles.infoValue}>
          {value}
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}) {
  return (
    <div style={styles.formField}>
      <label style={styles.formLabel}>
        {label}

        {required && (
          <span style={styles.required}>
            {" "}*
          </span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  pageTitle: {
    margin: 0,
    fontSize: "27px",
    fontWeight: "700",
    color: "#111827",
  },

  pageSubtitle: {
    margin: "7px 0 0",
    fontSize: "14px",
    color: "#6b7280",
  },

  editButton: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "11px 18px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  cancelButton: {
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#374151",
    padding: "10px 18px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  profileCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "15px",
    padding: "30px",
    display: "grid",
    gridTemplateColumns:
      "240px minmax(0, 1fr)",
    gap: "35px",
    boxShadow:
      "0 2px 8px rgba(15,23,42,0.04)",
  },

  avatarSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRight:
      "1px solid #e5e7eb",
    paddingRight: "30px",
  },

  avatar: {
    width: "105px",
    height: "105px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    fontWeight: "700",
    marginBottom: "15px",
  },

  name: {
    margin: 0,
    fontSize: "19px",
    color: "#111827",
    textAlign: "center",
  },

  status: {
    marginTop: "9px",
    padding: "6px 12px",
    borderRadius: "20px",
    background: "#ecfdf5",
    color: "#059669",
    fontSize: "10px",
    fontWeight: "700",
  },

  infoSection: {
    minWidth: 0,
  },

  sectionTitle: {
    margin: "0 0 22px",
    fontSize: "17px",
    color: "#111827",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px",
    background: "#f8fafc",
    borderRadius: "10px",
  },

  infoIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "9px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
    flexShrink: 0,
  },

  infoContent: {
    minWidth: 0,
  },

  infoLabel: {
    fontSize: "10px",
    color: "#9ca3af",
    marginBottom: "4px",
  },

  infoValue: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1f2937",
    wordBreak: "break-word",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  formField: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  formLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#374151",
  },

  required: {
    color: "#dc2626",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "11px 12px",
    fontSize: "13px",
    color: "#111827",
    outline: "none",
    background: "#ffffff",
  },

  bioSection: {
    marginTop: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "11px 12px",
    fontSize: "13px",
    color: "#111827",
    outline: "none",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
  },

  readOnlySection: {
    marginTop: "24px",
    padding: "18px",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
  },

  readOnlyTitle: {
    margin: "0 0 14px",
    fontSize: "13px",
    color: "#374151",
  },

  readOnlyGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },

  readOnlyItem: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "12px",
    background: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },

  readOnlyLabel: {
    fontSize: "11px",
    color: "#6b7280",
  },

  readOnlyValue: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#111827",
  },

  readOnlyNote: {
    margin: "12px 0 0",
    fontSize: "11px",
    color: "#6b7280",
  },

  formFooter: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },

  cancelFormButton: {
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#374151",
    padding: "11px 18px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  saveButton: {
    border: "none",
    background: "#059669",
    color: "#ffffff",
    padding: "11px 18px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  successMessage: {
    marginBottom: "18px",
    padding: "12px 15px",
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    borderRadius: "9px",
    color: "#047857",
    fontSize: "13px",
    fontWeight: "600",
  },

  errorMessage: {
    marginBottom: "18px",
    padding: "12px 15px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "9px",
    color: "#b91c1c",
    fontSize: "13px",
  },

  center: {
    minHeight: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingIcon: {
    fontSize: "35px",
  },

  loadingText: {
    color: "#6b7280",
    fontSize: "13px",
  },

  errorCard: {
    background: "#ffffff",
    border: "1px solid #fecaca",
    borderRadius: "14px",
    padding: "40px",
    textAlign: "center",
  },

  errorIcon: {
    fontSize: "35px",
  },

  errorText: {
    color: "#6b7280",
    fontSize: "13px",
  },

  retryButton: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default StudentProfile;
