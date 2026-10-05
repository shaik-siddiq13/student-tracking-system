import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

function StudentInterviews() {
  const { apiRequest } = useAuth();

  // =====================================================
  // STATE
  // =====================================================

  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [interviews, setInterviews] = useState([]);

  const [editingInterviewId, setEditingInterviewId] =
    useState(null);

  const [formData, setFormData] = useState({
    company_id: "",
    contact_id: "",
    role: "",
    interview_date: "",
    interview_type: "Technical",
    current_round: "Round 1",
    status: "ATTENDED",
    result: "",
    expected_salary: "",
    remarks: "",
  });

  // =====================================================
  // SEARCH / FILTER STATE
  // =====================================================

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("");

  // =====================================================
  // LOADING STATE
  // =====================================================

  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingInterviews, setLoadingInterviews] =
    useState(true);

  const [saving, setSaving] = useState(false);
  const [deletingInterviewId, setDeletingInterviewId] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // GET COMPANY ID
  // =====================================================

  const getCompanyId = (company) => {
    return (
      company.company_id ??
      company.id ??
      company.companyId ??
      ""
    );
  };

  // =====================================================
  // GET CONTACT ID
  // =====================================================

  const getContactId = (contact) => {
    return (
      contact.contact_id ??
      contact.id ??
      contact.contactId ??
      ""
    );
  };

  // =====================================================
  // LOAD ALL DATA
  // =====================================================

  useEffect(() => {
    loadCompanies();
    loadInterviews();
  }, []);

  // =====================================================
  // LOAD COMPANIES
  // =====================================================

  const loadCompanies = async () => {
    try {
      setLoadingCompanies(true);

      const response = await apiRequest(
        "/students/companies"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load companies."
        );
      }

      const data = await response.json();

      const companyList = Array.isArray(data)
        ? data
        : data.companies || [];

      setCompanies(companyList);
    } catch (err) {
      console.error(
        "Companies error:",
        err
      );

      setCompanies([]);

      setError(
        err?.message ||
          "Failed to load companies."
      );
    } finally {
      setLoadingCompanies(false);
    }
  };

  // =====================================================
  // LOAD CONTACTS
  // =====================================================

  const loadContacts = async (companyId) => {
    if (!companyId) {
      setContacts([]);
      return;
    }

    try {
      setLoadingContacts(true);
      setError("");

      const response = await apiRequest(
        `/students/company-contacts/${companyId}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load HR contacts."
        );
      }

      const data = await response.json();

      const contactList = Array.isArray(data)
        ? data
        : data.contacts || [];

      setContacts(contactList);
    } catch (err) {
      console.error(
        "Contacts error:",
        err
      );

      setContacts([]);

      setError(
        err?.message ||
          "Failed to load HR contacts."
      );
    } finally {
      setLoadingContacts(false);
    }
  };

  // =====================================================
  // LOAD INTERVIEWS
  // =====================================================

  const loadInterviews = async () => {
    try {
      setLoadingInterviews(true);
      setError("");

      const response = await apiRequest(
        "/students/interviews"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load interviews."
        );
      }

      const data = await response.json();

      const interviewList = Array.isArray(data)
        ? data
        : data.interviews || [];

      setInterviews(interviewList);
    } catch (err) {
      console.error(
        "Interviews error:",
        err
      );

      setInterviews([]);

      setError(
        err?.message ||
          "Failed to load interviews."
      );
    } finally {
      setLoadingInterviews(false);
    }
  };

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setError("");
    setSuccess("");

    if (name === "company_id") {
      setFormData((previous) => ({
        ...previous,
        company_id: value,
        contact_id: "",
      }));

      loadContacts(value);

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      company_id: "",
      contact_id: "",
      role: "",
      interview_date: "",
      interview_type: "Technical",
      current_round: "Round 1",
      status: "ATTENDED",
      result: "",
      expected_salary: "",
      remarks: "",
    });

    setContacts([]);
    setEditingInterviewId(null);
  };

  // =====================================================
  // EDIT INTERVIEW
  // =====================================================

  const handleEdit = async (interview) => {
    setError("");
    setSuccess("");

    setEditingInterviewId(
      interview.interview_id
    );

    setFormData({
      company_id: interview.company_id
        ? String(interview.company_id)
        : "",

      contact_id: interview.contact_id
        ? String(interview.contact_id)
        : "",

      role: interview.role || "",

      interview_date:
        interview.interview_date
          ? String(
              interview.interview_date
            ).substring(0, 10)
          : "",

      interview_type:
        interview.interview_type ||
        "Technical",

      current_round:
        interview.current_round ||
        "Round 1",

      status:
        interview.status ||
        "ATTENDED",

      result:
        interview.result || "",

      expected_salary:
        interview.expected_salary !==
          null &&
        interview.expected_salary !==
          undefined
          ? String(
              interview.expected_salary
            )
          : "",

      remarks:
        interview.remarks || "",
    });

    await loadContacts(
      interview.company_id
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE INTERVIEW
  // =====================================================

  const handleDelete = async (interviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingInterviewId(
        interviewId
      );

      setError("");
      setSuccess("");

      const response = await apiRequest(
        `/students/interviews/${interviewId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to delete interview."
        );
      }

      if (
        editingInterviewId ===
        interviewId
      ) {
        resetForm();
      }

      setSuccess(
        "Interview deleted successfully!"
      );

      await loadInterviews();
    } catch (err) {
      console.error(
        "Delete interview error:",
        err
      );

      setError(
        err?.message ||
          "Failed to delete interview."
      );
    } finally {
      setDeletingInterviewId(null);
    }
  };

  // =====================================================
  // SUBMIT INTERVIEW
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.company_id) {
      setError(
        "Please select a company."
      );
      return;
    }

    if (!formData.role.trim()) {
      setError(
        "Please enter the job role."
      );
      return;
    }

    if (!formData.interview_date) {
      setError(
        "Please select the interview date."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        company_id: Number(
          formData.company_id
        ),

        contact_id:
          formData.contact_id
            ? Number(
                formData.contact_id
              )
            : null,

        interview_date:
          formData.interview_date,

        role: formData.role.trim(),

        interview_type:
          formData.interview_type ||
          null,

        current_round:
          formData.current_round ||
          null,

        status:
          formData.status ||
          "ATTENDED",

        result:
          formData.result || null,

        expected_salary:
          formData.expected_salary
            ? Number(
                formData.expected_salary
              )
            : null,

        remarks:
          formData.remarks.trim() ||
          null,
      };

      // =================================================
      // EDIT MODE
      // =================================================

      if (editingInterviewId) {
        const response =
          await apiRequest(
            `/students/interviews/${editingInterviewId}`,
            {
              method: "PUT",
              body: JSON.stringify(
                payload
              ),
            }
          );

        if (!response.ok) {
          let errorMessage =
            "Failed to update interview.";

          try {
            const errorData =
              await response.json();

            if (errorData.detail) {
              errorMessage =
                typeof errorData.detail ===
                "string"
                  ? errorData.detail
                  : JSON.stringify(
                      errorData.detail
                    );
            }
          } catch {
            // Ignore JSON parsing error
          }

          throw new Error(
            errorMessage
          );
        }

        const data =
          await response.json();

        console.log(
          "Interview Updated:",
          data
        );

        setSuccess(
          "Interview updated successfully!"
        );

        resetForm();

        await loadInterviews();

        return;
      }

      // =================================================
      // ADD MODE
      // =================================================

      const response =
        await apiRequest(
          "/students/interviews",
          {
            method: "POST",
            body: JSON.stringify(
              payload
            ),
          }
        );

      if (!response.ok) {
        let errorMessage =
          "Failed to save interview.";

        try {
          const errorData =
            await response.json();

          if (errorData.detail) {
            errorMessage =
              typeof errorData.detail ===
              "string"
                ? errorData.detail
                : JSON.stringify(
                    errorData.detail
                  );
          }
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(
          errorMessage
        );
      }

      const data =
        await response.json();

      console.log(
        "Interview Created:",
        data
      );

      setSuccess(
        "Interview saved successfully!"
      );

      resetForm();

      await loadInterviews();
    } catch (err) {
      console.error(
        "Interview save/update error:",
        err
      );

      setError(
        err?.message ||
          "Failed to save interview."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // SELECTED COMPANY
  // =====================================================

  const selectedCompany =
    companies.find(
      (company) =>
        String(
          getCompanyId(company)
        ) ===
        String(formData.company_id)
    );

  // =====================================================
  // SELECTED CONTACT
  // =====================================================

  const selectedContact =
    contacts.find(
      (contact) =>
        String(
          getContactId(contact)
        ) ===
        String(formData.contact_id)
    );

  // =====================================================
  // INTERVIEW SUMMARY
  // =====================================================

  const totalInterviews =
    interviews.length;

  const scheduledInterviews =
    interviews.filter(
      (interview) =>
        String(
          interview.status || ""
        ).toUpperCase() ===
        "SCHEDULED"
    ).length;

  const completedInterviews =
    interviews.filter(
      (interview) =>
        String(
          interview.status || ""
        ).toUpperCase() ===
        "COMPLETED"
    ).length;

  const selectedInterviews =
    interviews.filter(
      (interview) =>
        String(
          interview.result || ""
        ).toUpperCase() ===
        "SELECTED"
    ).length;

  const rejectedInterviews =
    interviews.filter(
      (interview) =>
        String(
          interview.result || ""
        ).toUpperCase() ===
        "REJECTED"
    ).length;

  // =====================================================
  // FILTERED INTERVIEWS
  // =====================================================

  const filteredInterviews =
    interviews.filter(
      (interview) => {
        const search =
          searchText
            .trim()
            .toLowerCase();

        const companyName =
          String(
            interview.company_name ||
              ""
          ).toLowerCase();

        const role =
          String(
            interview.role || ""
          ).toLowerCase();

        const status =
          String(
            interview.status || ""
          ).toUpperCase();

        const result =
          String(
            interview.result || ""
          ).toUpperCase();

        const matchesSearch =
          !search ||
          companyName.includes(
            search
          ) ||
          role.includes(search);

        const matchesStatus =
          !statusFilter ||
          status ===
            statusFilter;

        const matchesResult =
          !resultFilter ||
          result ===
            resultFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesResult
        );
      }
    );

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearchText("");
    setStatusFilter("");
    setResultFilter("");
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const value =
      String(date).substring(0, 10);

    const parts =
      value.split("-");

    if (parts.length === 3) {
      const year =
        Number(parts[0]);

      const month =
        Number(parts[1]);

      const day =
        Number(parts[2]);

      const dateObject =
        new Date(
          year,
          month - 1,
          day
        );

      return dateObject.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    }

    return value;
  };

  // =====================================================
  // GET INTERVIEW DATE
  // =====================================================

  const getInterviewDate = (date) => {
    if (!date) {
      return null;
    }

    const value =
      String(date).substring(0, 10);

    const parts =
      value.split("-");

    if (parts.length !== 3) {
      return null;
    }

    const year =
      Number(parts[0]);

    const month =
      Number(parts[1]);

    const day =
      Number(parts[2]);

    const result =
      new Date(
        year,
        month - 1,
        day
      );

    result.setHours(
      0,
      0,
      0,
      0
    );

    return result;
  };

  // =====================================================
  // UPCOMING / TODAY / PAST
  // =====================================================

  const getDateStatus = (date) => {
    const interviewDate =
      getInterviewDate(date);

    if (!interviewDate) {
      return {
        label: "Date unavailable",
        background: "#f3f4f6",
        color: "#6b7280",
      };
    }

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    if (
      interviewDate.getTime() ===
      today.getTime()
    ) {
      return {
        label: "Today",
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (
      interviewDate > today
    ) {
      return {
        label: "Upcoming",
        background: "#dcfce7",
        color: "#166534",
      };
    }

    return {
      label: "Past",
      background: "#f3f4f6",
      color: "#6b7280",
    };
  };

  // =====================================================
  // COMPANY WEBSITE
  // =====================================================

  const getWebsiteUrl = (website) => {
    if (!website) {
      return "";
    }

    const value =
      String(website).trim();

    if (!value) {
      return "";
    }

    if (
      /^https?:\/\//i.test(value)
    ) {
      return value;
    }

    return `https://${value}`;
  };

  // =====================================================
  // FORMAT SALARY
  // =====================================================

  const formatSalary = (salary) => {
    if (
      salary === null ||
      salary === undefined ||
      salary === ""
    ) {
      return "Not specified";
    }

    const numericSalary =
      Number(salary);

    if (
      Number.isNaN(numericSalary)
    ) {
      return "Not specified";
    }

    return `₹${numericSalary.toLocaleString(
      "en-IN"
    )}`;
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value =
      String(
        status || ""
      ).toUpperCase();

    if (value === "ATTENDED") {
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (value === "SCHEDULED") {
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    if (value === "COMPLETED") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (
      value === "IN_PROGRESS"
    ) {
      return {
        background: "#ede9fe",
        color: "#6d28d9",
      };
    }

    return {
      background: "#f3f4f6",
      color: "#374151",
    };
  };

  // =====================================================
  // RESULT STYLE
  // =====================================================

  const getResultStyle = (result) => {
    const value =
      String(
        result || ""
      ).toUpperCase();

    if (value === "SELECTED") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (value === "REJECTED") {
      return {
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    if (value === "PENDING") {
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    if (
      value === "IN_PROGRESS"
    ) {
      return {
        background: "#ede9fe",
        color: "#6d28d9",
      };
    }

    return {
      background: "#f3f4f6",
      color: "#374151",
    };
  };

  // =====================================================
  // STYLES
  // =====================================================

  const pageStyle = {
    padding: "30px",
    maxWidth: "1100px",
    margin: "0 auto",
  };

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "25px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  };

  const labelStyle = {
    fontWeight: "600",
    color: "#374151",
  };

  const inputStyle = {
    padding: "11px 12px",
    border:
      "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "15px",
    width: "100%",
    boxSizing: "border-box",
  };

  const sectionTitleStyle = {
    marginBottom: "20px",
    color: "#111827",
  };

  const summaryCardStyle = {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)",
    border:
      "1px solid #e5e7eb",
  };

  const filterInputStyle = {
    padding: "11px 12px",
    border:
      "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
    background: "#ffffff",
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div style={pageStyle}>

      {/* HEADER */}
      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            marginBottom: "8px",
            color: "#111827",
          }}
        >
          My Interviews
        </h1>

        <p
          style={{
            color: "#6b7280",
          }}
        >
          Add and track your company interview
          details.
        </p>
      </div>

      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          marginBottom: "25px",
        }}
      >

        <div style={summaryCardStyle}>
          <div
            style={{
              fontSize: "13px",
              color: "#6b7280",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Total Interviews
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: "800",
              color: "#111827",
            }}
          >
            {totalInterviews}
          </div>
        </div>

        <div style={summaryCardStyle}>
          <div
            style={{
              fontSize: "13px",
              color: "#92400e",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Scheduled
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: "800",
              color: "#d97706",
            }}
          >
            {scheduledInterviews}
          </div>
        </div>

        <div style={summaryCardStyle}>
          <div
            style={{
              fontSize: "13px",
              color: "#166534",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Completed
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: "800",
              color: "#16a34a",
            }}
          >
            {completedInterviews}
          </div>
        </div>

        <div style={summaryCardStyle}>
          <div
            style={{
              fontSize: "13px",
              color: "#166534",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Selected
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: "800",
              color: "#15803d",
            }}
          >
            {selectedInterviews}
          </div>
        </div>

        <div style={summaryCardStyle}>
          <div
            style={{
              fontSize: "13px",
              color: "#991b1b",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Rejected
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: "800",
              color: "#dc2626",
            }}
          >
            {rejectedInterviews}
          </div>
        </div>

      </div>

      {/* SUCCESS */}
      {success && (
        <div
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "14px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          {success}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "14px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          {error}
        </div>
      )}

      {/* ================================================= */}
      {/* FORM */}
      {/* ================================================= */}

      <form onSubmit={handleSubmit}>

        {/* COMPANY */}
        <div style={cardStyle}>

          <h2 style={sectionTitleStyle}>
            Company Information
          </h2>

          <div style={gridStyle}>

            <div style={fieldStyle}>

              <label style={labelStyle}>
                Company *
              </label>

              <select
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                style={inputStyle}
                disabled={loadingCompanies}
              >
                <option value="">
                  {loadingCompanies
                    ? "Loading companies..."
                    : "Select Company"}
                </option>

                {companies.map(
                  (company) => {
                    const companyId =
                      getCompanyId(
                        company
                      );

                    return (
                      <option
                        key={companyId}
                        value={companyId}
                      >
                        {company.company_name ||
                          company.name ||
                          "Unnamed Company"}
                      </option>
                    );
                  }
                )}
              </select>

            </div>

            <div style={fieldStyle}>

              <label style={labelStyle}>
                Location
              </label>

              <input
                type="text"
                value={
                  selectedCompany?.location ||
                  ""
                }
                placeholder="Company location"
                style={inputStyle}
                readOnly
              />

            </div>

          </div>
        </div>

        {/* HR CONTACT */}
        <div style={cardStyle}>

          <h2 style={sectionTitleStyle}>
            HR / Contact Information
          </h2>

          <div style={gridStyle}>

            <div style={fieldStyle}>

              <label style={labelStyle}>
                HR / Contact
              </label>

              <select
                name="contact_id"
                value={formData.contact_id}
                onChange={handleChange}
                style={inputStyle}
                disabled={
                  !formData.company_id ||
                  loadingContacts
                }
              >
                <option value="">
                  {!formData.company_id
                    ? "Select company first"
                    : loadingContacts
                    ? "Loading contacts..."
                    : contacts.length === 0
                    ? "No contacts available"
                    : "Select HR / Contact"}
                </option>

                {contacts.map(
                  (contact) => {
                    const contactId =
                      getContactId(
                        contact
                      );

                    return (
                      <option
                        key={contactId}
                        value={contactId}
                      >
                        {contact.contact_name ||
                          contact.name ||
                          "Unnamed Contact"}

                        {contact.designation
                          ? ` - ${contact.designation}`
                          : ""}
                      </option>
                    );
                  }
                )}
              </select>

            </div>

            <div style={fieldStyle}>

              <label style={labelStyle}>
                HR Email
              </label>

              <input
                type="email"
                value={
                  selectedContact?.email ||
                  ""
                }
                placeholder="HR email"
                style={inputStyle}
                readOnly
              />

            </div>

            <div style={fieldStyle}>

              <label style={labelStyle}>
                HR Phone
              </label>

              <input
                type="text"
                value={
                  selectedContact?.phone ||
                  ""
                }
                placeholder="HR phone"
                style={inputStyle}
                readOnly
              />

            </div>

          </div>
        </div>

        {/* INTERVIEW INFORMATION */}
        <div style={cardStyle}>

          <h2 style={sectionTitleStyle}>
            Interview Information
          </h2>

          <div style={gridStyle}>

            <div style={fieldStyle}>

              <label style={labelStyle}>
                Role *
              </label>

              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Example: Data Engineer"
                style={inputStyle}
              />

            </div>

            <div style={fieldStyle}>

              <label style={labelStyle}>
                Interview Date *
              </label>

              <input
                type="date"
                name="interview_date"
                value={
                  formData.interview_date
                }
                onChange={handleChange}
                style={inputStyle}
              />

            </div>

            <div style={fieldStyle}>

              <label style={labelStyle}>
                Interview Type
              </label>

              <select
                name="interview_type"
                value={
                  formData.interview_type
                }
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Technical">
                  Technical
                </option>

                <option value="HR">
                  HR
                </option>

                <option value="Managerial">
                  Managerial
                </option>

                <option value="Screening">
                  Screening
                </option>
              </select>

            </div>

            <div style={fieldStyle}>

              <label style={labelStyle}>
                Current Round
              </label>

              <select
                name="current_round"
                value={
                  formData.current_round
                }
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Round 1">
                  Round 1
                </option>

                <option value="Round 2">
                  Round 2
                </option>

                <option value="Round 3">
                  Round 3
                </option>

                <option value="HR Round">
                  HR Round
                </option>

                <option value="Final Round">
                  Final Round
                </option>
              </select>

            </div>

            <div style={fieldStyle}>

              <label style={labelStyle}>
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="ATTENDED">
                  Attended
                </option>

                <option value="SCHEDULED">
                  Scheduled
                </option>

                <option value="IN_PROGRESS">
                  In Progress
                </option>

                <option value="COMPLETED">
                  Completed
                </option>
              </select>

            </div>

            <div style={fieldStyle}>

              <label style={labelStyle}>
                Result
              </label>

              <select
                name="result"
                value={formData.result}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  Select Result
                </option>

                <option value="SELECTED">
                  Selected
                </option>

                <option value="REJECTED">
                  Rejected
                </option>

                <option value="PENDING">
                  Pending
                </option>

                <option value="IN_PROGRESS">
                  In Progress
                </option>
              </select>

            </div>

            <div style={fieldStyle}>

              <label style={labelStyle}>
                Expected Salary
              </label>

              <input
                type="number"
                name="expected_salary"
                value={
                  formData.expected_salary
                }
                onChange={handleChange}
                placeholder="Example: 600000"
                style={inputStyle}
              />

            </div>

          </div>
        </div>

        {/* REMARKS */}
        <div style={cardStyle}>

          <h2 style={sectionTitleStyle}>
            Remarks
          </h2>

          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Enter interview remarks..."
            rows="5"
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />

        </div>

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginBottom: "35px",
          }}
        >

          {editingInterviewId && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                setError("");
                setSuccess("");
              }}
              disabled={saving}
              style={{
                padding:
                  "13px 22px",
                border:
                  "1px solid #d1d5db",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#374151",
                fontSize: "16px",
                fontWeight: "600",
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              Cancel Edit
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              padding:
                "13px 28px",
              border: "none",
              borderRadius: "8px",
              background: saving
                ? "#9ca3af"
                : editingInterviewId
                ? "#16a34a"
                : "#2563eb",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: saving
                ? "not-allowed"
                : "pointer",
            }}
          >
            {saving
              ? editingInterviewId
                ? "Updating..."
                : "Saving..."
              : editingInterviewId
              ? "Update Interview"
              : "Save Interview"}
          </button>

        </div>

      </form>

      {/* ================================================= */}
      {/* INTERVIEW HISTORY */}
      {/* ================================================= */}

      <div style={cardStyle}>

        {/* HISTORY HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "20px",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >

          <div>

            <h2
              style={{
                margin: 0,
                color: "#111827",
              }}
            >
              Interview History
            </h2>

            <p
              style={{
                margin:
                  "6px 0 0",
                color: "#6b7280",
              }}
            >
              Your saved interview records.
            </p>

          </div>

          <button
            type="button"
            onClick={loadInterviews}
            disabled={
              loadingInterviews
            }
            style={{
              padding:
                "9px 16px",
              border:
                "1px solid #d1d5db",
              borderRadius: "7px",
              background:
                "#ffffff",
              color:
                "#374151",
              cursor:
                loadingInterviews
                  ? "not-allowed"
                  : "pointer",
              fontWeight:
                "600",
            }}
          >
            {loadingInterviews
              ? "Loading..."
              : "Refresh"}
          </button>

        </div>

        {/* SEARCH / FILTERS */}
        {!loadingInterviews &&
          interviews.length > 0 && (
            <div
              style={{
                background:
                  "#f9fafb",
                border:
                  "1px solid #e5e7eb",
                borderRadius:
                  "10px",
                padding: "18px",
                marginBottom:
                  "20px",
              }}
            >

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "15px",
                  alignItems:
                    "end",
                }}
              >

                {/* SEARCH */}
                <div
                  style={
                    fieldStyle
                  }
                >
                  <label
                    style={
                      labelStyle
                    }
                  >
                    🔍 Search
                  </label>

                  <input
                    type="text"
                    value={
                      searchText
                    }
                    onChange={(event) =>
                      setSearchText(
                        event.target
                          .value
                      )
                    }
                    placeholder="Company or role..."
                    style={
                      filterInputStyle
                    }
                  />
                </div>

                {/* STATUS */}
                <div
                  style={
                    fieldStyle
                  }
                >
                  <label
                    style={
                      labelStyle
                    }
                  >
                    📊 Status
                  </label>

                  <select
                    value={
                      statusFilter
                    }
                    onChange={(event) =>
                      setStatusFilter(
                        event.target
                          .value
                      )
                    }
                    style={
                      filterInputStyle
                    }
                  >
                    <option value="">
                      All Statuses
                    </option>

                    <option value="ATTENDED">
                      Attended
                    </option>

                    <option value="SCHEDULED">
                      Scheduled
                    </option>

                    <option value="IN_PROGRESS">
                      In Progress
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>
                  </select>
                </div>

                {/* RESULT */}
                <div
                  style={
                    fieldStyle
                  }
                >
                  <label
                    style={
                      labelStyle
                    }
                  >
                    🎯 Result
                  </label>

                  <select
                    value={
                      resultFilter
                    }
                    onChange={(event) =>
                      setResultFilter(
                        event.target
                          .value
                      )
                    }
                    style={
                      filterInputStyle
                    }
                  >
                    <option value="">
                      All Results
                    </option>

                    <option value="SELECTED">
                      Selected
                    </option>

                    <option value="REJECTED">
                      Rejected
                    </option>

                    <option value="PENDING">
                      Pending
                    </option>

                    <option value="IN_PROGRESS">
                      In Progress
                    </option>
                  </select>
                </div>

                {/* CLEAR */}
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  disabled={
                    !searchText &&
                    !statusFilter &&
                    !resultFilter
                  }
                  style={{
                    padding:
                      "11px 18px",
                    border:
                      "none",
                    borderRadius:
                      "7px",
                    background:
                      !searchText &&
                      !statusFilter &&
                      !resultFilter
                        ? "#d1d5db"
                        : "#4b5563",
                    color:
                      "#ffffff",
                    fontSize:
                      "14px",
                    fontWeight:
                      "600",
                    cursor:
                      !searchText &&
                      !statusFilter &&
                      !resultFilter
                        ? "not-allowed"
                        : "pointer",
                    minHeight:
                      "42px",
                  }}
                >
                  🔄 Clear Filters
                </button>

              </div>

              <div
                style={{
                  marginTop:
                    "14px",
                  color:
                    "#6b7280",
                  fontSize:
                    "14px",
                }}
              >
                Showing{" "}
                <strong
                  style={{
                    color:
                      "#111827",
                  }}
                >
                  {
                    filteredInterviews.length
                  }
                </strong>{" "}
                of{" "}
                <strong
                  style={{
                    color:
                      "#111827",
                  }}
                >
                  {interviews.length}
                </strong>{" "}
                interviews
              </div>

            </div>
          )}

        {/* LOADING */}
        {loadingInterviews && (
          <div
            style={{
              padding: "30px",
              textAlign:
                "center",
              color:
                "#6b7280",
            }}
          >
            Loading interview history...
          </div>
        )}

        {/* NO INTERVIEWS */}
        {!loadingInterviews &&
          interviews.length === 0 && (
            <div
              style={{
                padding: "30px",
                textAlign:
                  "center",
                border:
                  "1px dashed #d1d5db",
                borderRadius:
                  "10px",
                color:
                  "#6b7280",
              }}
            >
              No interviews found.
              <br />
              Add your first interview
              using the form above.
            </div>
          )}

        {/* NO FILTER MATCHES */}
        {!loadingInterviews &&
          interviews.length > 0 &&
          filteredInterviews.length ===
            0 && (
            <div
              style={{
                padding: "30px",
                textAlign:
                  "center",
                border:
                  "1px dashed #d1d5db",
                borderRadius:
                  "10px",
                color:
                  "#6b7280",
              }}
            >
              <div
                style={{
                  fontSize:
                    "18px",
                  fontWeight:
                    "700",
                  color:
                    "#374151",
                  marginBottom:
                    "8px",
                }}
              >
                No interviews match
                your filters.
              </div>

              <div
                style={{
                  marginBottom:
                    "15px",
                }}
              >
                Try changing your
                search or filters.
              </div>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                style={{
                  padding:
                    "9px 16px",
                  border:
                    "none",
                  borderRadius:
                    "7px",
                  background:
                    "#2563eb",
                  color:
                    "#ffffff",
                  fontWeight:
                    "600",
                  cursor:
                    "pointer",
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* ================================================= */}
        {/* INTERVIEW CARDS */}
        {/* ================================================= */}

        {!loadingInterviews &&
          filteredInterviews.length >
            0 && (
            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap: "18px",
              }}
            >

              {filteredInterviews.map(
                (interview) => {

                  const statusStyle =
                    getStatusStyle(
                      interview.status
                    );

                  const resultStyle =
                    getResultStyle(
                      interview.result
                    );

                  const dateStatus =
                    getDateStatus(
                      interview.interview_date
                    );

                  const websiteUrl =
                    getWebsiteUrl(
                      interview.website
                    );

                  const isDeleting =
                    deletingInterviewId ===
                    interview.interview_id;

                  return (
                    <div
                      key={
                        interview.interview_id
                      }
                      style={{
                        border:
                          "1px solid #e5e7eb",
                        borderRadius:
                          "12px",
                        padding:
                          "20px",
                        background:
                          "#ffffff",
                        boxShadow:
                          "0 2px 6px rgba(0,0,0,0.04)",
                      }}
                    >

                      {/* CARD HEADER */}
                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "flex-start",
                          gap: "15px",
                          flexWrap:
                            "wrap",
                          marginBottom:
                            "18px",
                        }}
                      >

                        <div
                          style={{
                            minWidth:
                              "220px",
                          }}
                        >

                          <h3
                            style={{
                              margin:
                                "0 0 6px",
                              color:
                                "#111827",
                              fontSize:
                                "21px",
                            }}
                          >
                            {
                              interview.company_name ||
                              "Unknown Company"
                            }
                          </h3>

                          <div
                            style={{
                              color:
                                "#2563eb",
                              fontWeight:
                                "700",
                              fontSize:
                                "16px",
                            }}
                          >
                            {
                              interview.role ||
                              "-"
                            }
                          </div>

                          {interview.location && (
                            <div
                              style={{
                                color:
                                  "#6b7280",
                                marginTop:
                                  "6px",
                              }}
                            >
                              📍{" "}
                              {
                                interview.location
                              }
                            </div>
                          )}

                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            gap:
                              "8px",
                            flexWrap:
                              "wrap",
                            alignItems:
                              "center",
                          }}
                        >

                          {/* DATE STATUS */}
                          <span
                            style={{
                              background:
                                dateStatus.background,
                              color:
                                dateStatus.color,
                              padding:
                                "6px 11px",
                              borderRadius:
                                "20px",
                              fontSize:
                                "13px",
                              fontWeight:
                                "700",
                            }}
                          >
                            {dateStatus.label}
                          </span>

                          {/* STATUS */}
                          <span
                            style={{
                              ...statusStyle,
                              padding:
                                "6px 10px",
                              borderRadius:
                                "20px",
                              fontSize:
                                "13px",
                              fontWeight:
                                "700",
                            }}
                          >
                            {String(
                              interview.status ||
                                ""
                            ).replaceAll(
                              "_",
                              " "
                            )}
                          </span>

                          {/* RESULT */}
                          {interview.result && (
                            <span
                              style={{
                                ...resultStyle,
                                padding:
                                  "6px 10px",
                                borderRadius:
                                  "20px",
                                fontSize:
                                  "13px",
                                fontWeight:
                                  "700",
                              }}
                            >
                              🎯{" "}
                              {String(
                                interview.result
                              ).replaceAll(
                                "_",
                                " "
                              )}
                            </span>
                          )}

                        </div>

                      </div>

                      {/* DATE HIGHLIGHT */}
                      <div
                        style={{
                          background:
                            dateStatus.label ===
                            "Upcoming"
                              ? "#f0fdf4"
                              : dateStatus.label ===
                                "Today"
                              ? "#eff6ff"
                              : "#f9fafb",
                          border:
                            "1px solid #e5e7eb",
                          borderRadius:
                            "9px",
                          padding:
                            "14px",
                          marginBottom:
                            "18px",
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          gap: "15px",
                          flexWrap:
                            "wrap",
                        }}
                      >

                        <div>

                          <div
                            style={{
                              color:
                                "#6b7280",
                              fontSize:
                                "13px",
                              marginBottom:
                                "4px",
                              fontWeight:
                                "600",
                            }}
                          >
                            📅 Interview Date
                          </div>

                          <div
                            style={{
                              color:
                                "#111827",
                              fontWeight:
                                "800",
                              fontSize:
                                "19px",
                            }}
                          >
                            {formatDate(
                              interview.interview_date
                            )}
                          </div>

                        </div>

                        <div
                          style={{
                            color:
                              dateStatus.color,
                            fontSize:
                              "13px",
                            fontWeight:
                              "700",
                          }}
                        >
                          {dateStatus.label ===
                            "Upcoming" &&
                            "Your interview is coming up."}

                          {dateStatus.label ===
                            "Today" &&
                            "Interview is scheduled for today."}

                          {dateStatus.label ===
                            "Past" &&
                            "Interview date has passed."}

                          {dateStatus.label ===
                            "Date unavailable" &&
                            "Interview date unavailable."}
                        </div>

                      </div>

                      {/* DETAILS */}
                      <div
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                          gap:
                            "16px",
                          marginBottom:
                            "18px",
                        }}
                      >

                        <div>
                          <div
                            style={{
                              color:
                                "#6b7280",
                              fontSize:
                                "13px",
                              marginBottom:
                                "4px",
                            }}
                          >
                            Interview Type
                          </div>

                          <div
                            style={{
                              fontWeight:
                                "600",
                              color:
                                "#111827",
                            }}
                          >
                            {
                              interview.interview_type ||
                              "-"
                            }
                          </div>
                        </div>

                        <div>
                          <div
                            style={{
                              color:
                                "#6b7280",
                              fontSize:
                                "13px",
                              marginBottom:
                                "4px",
                            }}
                          >
                            Current Round
                          </div>

                          <div
                            style={{
                              fontWeight:
                                "600",
                              color:
                                "#111827",
                            }}
                          >
                            {
                              interview.current_round ||
                              "-"
                            }
                          </div>
                        </div>

                        <div>
                          <div
                            style={{
                              color:
                                "#6b7280",
                              fontSize:
                                "13px",
                              marginBottom:
                                "4px",
                            }}
                          >
                            Expected Salary
                          </div>

                          <div
                            style={{
                              fontWeight:
                                "800",
                              color:
                                "#15803d",
                              fontSize:
                                "16px",
                            }}
                          >
                            {formatSalary(
                              interview.expected_salary
                            )}
                          </div>
                        </div>

                      </div>

                      {/* COMPANY WEBSITE */}
                      {websiteUrl && (
                        <div
                          style={{
                            borderTop:
                              "1px solid #e5e7eb",
                            paddingTop:
                              "15px",
                            marginBottom:
                              "15px",
                          }}
                        >

                          <div
                            style={{
                              color:
                                "#6b7280",
                              fontSize:
                                "13px",
                              fontWeight:
                                "600",
                              marginBottom:
                                "5px",
                            }}
                          >
                            Company Website
                          </div>

                          <a
                            href={
                              websiteUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color:
                                "#2563eb",
                              fontWeight:
                                "700",
                              textDecoration:
                                "none",
                            }}
                          >
                            🌐 Visit Company Website ↗
                          </a>

                        </div>
                      )}

                      {/* HR / CONTACT */}
                      {interview.contact_name && (
                        <div
                          style={{
                            borderTop:
                              "1px solid #e5e7eb",
                            paddingTop:
                              "16px",
                          }}
                        >

                          <div
                            style={{
                              fontWeight:
                                "700",
                              color:
                                "#111827",
                              marginBottom:
                                "8px",
                            }}
                          >
                            HR / Contact
                          </div>

                          <div
                            style={{
                              display:
                                "grid",
                              gridTemplateColumns:
                                "repeat(auto-fit, minmax(200px, 1fr))",
                              gap:
                                "10px",
                              color:
                                "#4b5563",
                              fontSize:
                                "14px",
                            }}
                          >

                            <div>
                              <strong>
                                Name:
                              </strong>{" "}
                              {
                                interview.contact_name
                              }
                            </div>

                            {interview.designation && (
                              <div>
                                <strong>
                                  Designation:
                                </strong>{" "}
                                {
                                  interview.designation
                                }
                              </div>
                            )}

                            {interview.contact_email && (
                              <div>
                                <strong>
                                  Email:
                                </strong>{" "}
                                {
                                  interview.contact_email
                                }
                              </div>
                            )}

                            {interview.contact_phone && (
                              <div>
                                <strong>
                                  Phone:
                                </strong>{" "}
                                {
                                  interview.contact_phone
                                }
                              </div>
                            )}

                          </div>

                        </div>
                      )}

                      {/* REMARKS */}
                      {interview.remarks && (
                        <div
                          style={{
                            marginTop:
                              "16px",
                            padding:
                              "12px",
                            background:
                              "#f9fafb",
                            borderRadius:
                              "7px",
                            color:
                              "#4b5563",
                            fontSize:
                              "14px",
                          }}
                        >
                          <strong>
                            Remarks:
                          </strong>{" "}
                          {
                            interview.remarks
                          }
                        </div>
                      )}

                      {/* ACTION BUTTONS */}
                      <div
                        style={{
                          borderTop:
                            "1px solid #e5e7eb",
                          marginTop:
                            "18px",
                          paddingTop:
                            "15px",
                          display:
                            "flex",
                          justifyContent:
                            "flex-end",
                          gap:
                            "10px",
                          flexWrap:
                            "wrap",
                        }}
                      >

                        {/* EDIT */}
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              interview
                            )
                          }
                          disabled={
                            saving ||
                            deletingInterviewId !==
                              null
                          }
                          style={{
                            padding:
                              "9px 18px",
                            border:
                              "none",
                            borderRadius:
                              "7px",
                            background:
                              "#2563eb",
                            color:
                              "#ffffff",
                            fontSize:
                              "14px",
                            fontWeight:
                              "600",
                            cursor:
                              saving ||
                              deletingInterviewId !==
                                null
                                ? "not-allowed"
                                : "pointer",
                            opacity:
                              saving ||
                              deletingInterviewId !==
                                null
                                ? 0.6
                                : 1,
                          }}
                        >
                          Edit Interview
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              interview.interview_id
                            )
                          }
                          disabled={
                            saving ||
                            deletingInterviewId !==
                              null
                          }
                          style={{
                            padding:
                              "9px 18px",
                            border:
                              "none",
                            borderRadius:
                              "7px",
                            background:
                              isDeleting
                                ? "#9ca3af"
                                : "#dc2626",
                            color:
                              "#ffffff",
                            fontSize:
                              "14px",
                            fontWeight:
                              "600",
                            cursor:
                              saving ||
                              deletingInterviewId !==
                                null
                                ? "not-allowed"
                                : "pointer",
                            opacity:
                              saving ||
                              deletingInterviewId !==
                                null
                                ? 0.7
                                : 1,
                          }}
                        >
                          {isDeleting
                            ? "Deleting..."
                            : "Delete Interview"}
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

      </div>

    </div>
  );
}

export default StudentInterviews;
