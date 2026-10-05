import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
  const { apiRequest, logout } = useAuth();

  // =========================================================
  // STATE
  // =========================================================

  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");

  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const [studentDetails, setStudentDetails] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);

  const [selectedContactCompanyId, setSelectedContactCompanyId] =
    useState("");

  const [loadingBatches, setLoadingBatches] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // STUDENT SEARCH & FILTER
  // =========================================================

  const [studentSearch, setStudentSearch] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] =
    useState("ALL");

  const [studentQualificationFilter, setStudentQualificationFilter] =
    useState("ALL");

  // =========================================================
  // STUDENT PROFILE EDIT
  // =========================================================

  const [editingStudentProfile, setEditingStudentProfile] = useState(false);

  const [studentProfileForm, setStudentProfileForm] = useState({
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
    current_status: "",
  });

  // =========================================================
  // PERFORMANCE EDIT
  // =========================================================

  const [editingPerformance, setEditingPerformance] = useState(false);

  const [performanceForm, setPerformanceForm] = useState({
    python_score: "",
    sql_score: "",
    pyspark_score: "",
    aws_score: "",
    data_engineering_score: "",
    communication_score: "",
    overall_score: "",
    assessment_count: "",
    mock_interview_count: "",
  });

  // =========================================================
  // COMPANY MANAGEMENT
  // =========================================================

  const [showCompanyForm, setShowCompanyForm] = useState(false);

  const [companyForm, setCompanyForm] = useState({
    company_name: "",
    industry: "",
    location: "",
    website: "",
    description: "",
  });

  // =========================================================
  // COMPANY CONTACT MANAGEMENT
  // =========================================================

  const [showContactForm, setShowContactForm] = useState(false);

  const [contactForm, setContactForm] = useState({
    company_id: "",
    contact_name: "",
    designation: "",
    email: "",
    phone: "",
  });

  // =========================================================
  // INTERVIEW MANAGEMENT
  // =========================================================

  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [editingInterviewId, setEditingInterviewId] = useState(null);

  const [interviewForm, setInterviewForm] = useState({
    company_id: "",
    contact_id: "",
    role: "",
    interview_date: "",
    interview_type: "",
    current_round: "",
    status: "",
    result: "",
    expected_salary: "",
    location: "",
    remarks: "",
  });

  // =========================================================
  // EMPLOYMENT MANAGEMENT
  // =========================================================

  const [showEmploymentForm, setShowEmploymentForm] =
    useState(false);

  const [editingEmploymentId, setEditingEmploymentId] =
    useState(null);

  const [employmentForm, setEmploymentForm] = useState({
    company_id: "",
    company_name: "",
    role: "",
    employment_type: "",
    start_date: "",
    end_date: "",
    is_current: false,
    salary: "",
    location: "",
    remarks: "",
  });

  // =========================================================
  // FILTERED STUDENTS
  // =========================================================

  const filteredStudents = students.filter((student) => {
    const search = studentSearch.trim().toLowerCase();

    const fullName =
      `${student.first_name || ""} ${student.last_name || ""}`
        .trim()
        .toLowerCase();

    const email = (student.email || "").toLowerCase();
    const phone = (student.phone || "").toLowerCase();

    const matchesSearch =
      !search ||
      fullName.includes(search) ||
      email.includes(search) ||
      phone.includes(search);

    const matchesStatus =
      studentStatusFilter === "ALL" ||
      student.current_status === studentStatusFilter;

    const matchesQualification =
      studentQualificationFilter === "ALL" ||
      student.qualification === studentQualificationFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesQualification
    );
  });

  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  const studentStatuses = [
    ...new Set(
      students
        .map((student) => student.current_status)
        .filter(Boolean)
    ),
  ];

  const studentQualifications = [
    ...new Set(
      students
        .map((student) => student.qualification)
        .filter(Boolean)
    ),
  ];

  // =========================================================
  // LOAD INITIAL DATA
  // =========================================================

  useEffect(() => {
    loadBatches();
    loadCompanies();
  }, []);

  // =========================================================
  // LOAD STUDENTS WHEN BATCH CHANGES
  // =========================================================

  useEffect(() => {
    if (!selectedBatchId) {
      setStudents([]);
      setSelectedStudentId("");
      setStudentDetails(null);

      setStudentSearch("");
      setStudentStatusFilter("ALL");
      setStudentQualificationFilter("ALL");

      return;
    }

    loadStudents(selectedBatchId);
  }, [selectedBatchId]);

  // =========================================================
  // LOAD STUDENT DETAILS
  // =========================================================

  useEffect(() => {
    if (!selectedStudentId) {
      setStudentDetails(null);
      return;
    }

    loadStudentDetails(selectedStudentId);
  }, [selectedStudentId]);

  // =========================================================
  // LOAD BATCHES
  // =========================================================

  const loadBatches = async () => {
    try {
      setLoadingBatches(true);
      setError("");

      const response = await apiRequest("/admin/batches");

      if (!response.ok) {
        throw new Error("Failed to load batches");
      }

      const data = await response.json();

      setBatches(data.batches || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingBatches(false);
    }
  };

  // =========================================================
  // LOAD STUDENTS
  // =========================================================

  const loadStudents = async (batchId) => {
    try {
      setLoadingStudents(true);
      setError("");

      setSelectedStudentId("");
      setStudentDetails(null);

      setStudentSearch("");
      setStudentStatusFilter("ALL");
      setStudentQualificationFilter("ALL");

      const response = await apiRequest(
        `/admin/batches/${batchId}/students`
      );

      if (!response.ok) {
        throw new Error("Failed to load students");
      }

      const data = await response.json();

      setStudents(data.students || []);

      if (data.students && data.students.length > 0) {
        setSelectedStudentId(
          String(data.students[0].student_id)
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingStudents(false);
    }
  };

  // =========================================================
  // LOAD STUDENT DETAILS
  // =========================================================

  const loadStudentDetails = async (studentId) => {
    try {
      setLoadingDetails(true);
      setError("");

      const response = await apiRequest(
        `/admin/students/${studentId}/details`
      );

      if (!response.ok) {
        throw new Error("Failed to load student details");
      }

      const data = await response.json();

      setStudentDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  // =========================================================
  // LOAD COMPANIES
  // =========================================================

  const loadCompanies = async () => {
    try {
      setLoadingCompanies(true);

      const response = await apiRequest("/admin/companies");

      if (!response.ok) {
        throw new Error("Failed to load companies");
      }

      const data = await response.json();

      setCompanies(data.companies || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCompanies(false);
    }
  };

  // =========================================================
  // LOAD CONTACTS
  // =========================================================

  const loadContacts = async (companyId) => {
    if (!companyId) {
      setContacts([]);
      return;
    }

    try {
      setLoadingContacts(true);

      const response = await apiRequest(
        `/students/company-contacts/${companyId}`
      );

      if (!response.ok) {
        throw new Error("Failed to load contacts");
      }

      const data = await response.json();

      setContacts(data.contacts || []);
    } catch (err) {
      setContacts([]);
      setError(err.message);
    } finally {
      setLoadingContacts(false);
    }
  };

  // =========================================================
  // CLEAR STUDENT FILTERS
  // =========================================================

  const clearStudentFilters = () => {
    setStudentSearch("");
    setStudentStatusFilter("ALL");
    setStudentQualificationFilter("ALL");
  };

  // =========================================================
  // STUDENT PROFILE EDIT
  // =========================================================

  const startStudentProfileEdit = () => {
    const student = studentDetails?.student;

    if (!student) {
      return;
    }

    setStudentProfileForm({
      first_name: student.first_name || "",
      last_name: student.last_name || "",
      email: student.email || "",
      phone: student.phone || "",
      date_of_birth: student.date_of_birth
        ? String(student.date_of_birth).slice(0, 10)
        : "",
      gender: student.gender || "",
      qualification: student.qualification || "",
      college_name: student.college_name || "",
      graduation_year: student.graduation_year ?? "",
      bio: student.bio || "",
      current_status: student.current_status || "",
    });

    setEditingStudentProfile(true);
    setMessage("");
    setError("");
  };

  const handleStudentProfileChange = (e) => {
    const { name, value } = e.target;

    setStudentProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveStudentProfile = async () => {
    try {
      setError("");
      setMessage("");

      if (!selectedStudentId) {
        throw new Error("Please select a student");
      }

      if (!studentProfileForm.first_name.trim()) {
        throw new Error("First name is required");
      }

      if (!studentProfileForm.email.trim()) {
        throw new Error("Email is required");
      }

      const graduationYear = studentProfileForm.graduation_year
        ? Number(studentProfileForm.graduation_year)
        : null;

      if (graduationYear !== null && (Number.isNaN(graduationYear) || graduationYear < 1900 || graduationYear > 2100)) {
        throw new Error("Graduation year must be between 1900 and 2100");
      }

      const payload = {
        first_name: studentProfileForm.first_name.trim(),
        last_name: studentProfileForm.last_name.trim() || null,
        email: studentProfileForm.email.trim(),
        phone: studentProfileForm.phone.trim() || null,
        date_of_birth: studentProfileForm.date_of_birth || null,
        gender: studentProfileForm.gender || null,
        qualification: studentProfileForm.qualification.trim() || null,
        college_name: studentProfileForm.college_name.trim() || null,
        graduation_year: graduationYear,
        bio: studentProfileForm.bio.trim() || null,
        current_status: studentProfileForm.current_status || null,
      };

      const response = await apiRequest(
        `/admin/students/${selectedStudentId}/profile`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || "Failed to update student profile"
        );
      }

      setMessage("Student profile updated successfully.");
      setEditingStudentProfile(false);

      await loadStudentDetails(selectedStudentId);
      await loadStudents(selectedBatchId);
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================================================
  // PERFORMANCE
  // =========================================================

  const startPerformanceEdit = () => {
    const performance = studentDetails?.performance;

    if (!performance) {
      return;
    }

    setPerformanceForm({
      python_score: performance.python_score ?? "",
      sql_score: performance.sql_score ?? "",
      pyspark_score: performance.pyspark_score ?? "",
      aws_score: performance.aws_score ?? "",
      data_engineering_score:
        performance.data_engineering_score ?? "",
      communication_score:
        performance.communication_score ?? "",
      overall_score: performance.overall_score ?? "",
      assessment_count:
        performance.assessment_count ?? "",
      mock_interview_count:
        performance.mock_interview_count ?? "",
    });

    setEditingPerformance(true);
    setMessage("");
    setError("");
  };

  const handlePerformanceChange = (e) => {
    const { name, value } = e.target;

    setPerformanceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const savePerformance = async () => {
    if (!selectedStudentId) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const scoreFields = [
        "python_score",
        "sql_score",
        "pyspark_score",
        "aws_score",
        "data_engineering_score",
        "communication_score",
        "overall_score",
      ];

      for (const field of scoreFields) {
        const value = Number(performanceForm[field]);

        if (
          Number.isNaN(value) ||
          value < 0 ||
          value > 100
        ) {
          throw new Error(
            `${field.replaceAll("_", " ")} must be between 0 and 100`
          );
        }
      }

      const assessmentCount = Number(
        performanceForm.assessment_count
      );

      const mockInterviewCount = Number(
        performanceForm.mock_interview_count
      );

      if (
        Number.isNaN(assessmentCount) ||
        Number.isNaN(mockInterviewCount) ||
        assessmentCount < 0 ||
        mockInterviewCount < 0
      ) {
        throw new Error("Counts cannot be negative");
      }

      const payload = {
        student_id: Number(selectedStudentId),
        python_score: Number(
          performanceForm.python_score
        ),
        sql_score: Number(performanceForm.sql_score),
        pyspark_score: Number(
          performanceForm.pyspark_score
        ),
        aws_score: Number(performanceForm.aws_score),
        data_engineering_score: Number(
          performanceForm.data_engineering_score
        ),
        communication_score: Number(
          performanceForm.communication_score
        ),
        overall_score: Number(
          performanceForm.overall_score
        ),
        assessment_count: assessmentCount,
        mock_interview_count: mockInterviewCount,
      };

      const response = await apiRequest(
        "/admin/student-performance",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to save performance"
        );
      }

      setMessage(
        "Performance updated successfully."
      );

      setEditingPerformance(false);

      await loadStudentDetails(selectedStudentId);
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================================================
  // COMPANY FORM
  // =========================================================

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;

    setCompanyForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createCompany = async () => {
    try {
      setError("");
      setMessage("");

      if (!companyForm.company_name.trim()) {
        throw new Error("Company name is required");
      }

      const response = await apiRequest(
        "/admin/companies",
        {
          method: "POST",
          body: JSON.stringify(companyForm),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to create company"
        );
      }

      setMessage("Company created successfully.");

      setCompanyForm({
        company_name: "",
        industry: "",
        location: "",
        website: "",
        description: "",
      });

      setShowCompanyForm(false);

      await loadCompanies();
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================================================
  // COMPANY CONTACT FORM
  // =========================================================

  const resetContactForm = () => {
    setContactForm({
      company_id: "",
      contact_name: "",
      designation: "",
      email: "",
      phone: "",
    });

    setContacts([]);
    setSelectedContactCompanyId("");
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;

    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "company_id") {
      setSelectedContactCompanyId(value);
      loadContacts(value);
    }
  };

  const openContactForm = () => {
    setError("");
    setMessage("");

    setContactForm({
      company_id: "",
      contact_name: "",
      designation: "",
      email: "",
      phone: "",
    });

    setContacts([]);
    setSelectedContactCompanyId("");

    setShowContactForm(true);
  };

  const createContact = async () => {
    try {
      setError("");
      setMessage("");

      if (!contactForm.company_id) {
        throw new Error("Please select a company");
      }

      if (!contactForm.contact_name.trim()) {
        throw new Error("Contact name is required");
      }

      if (!contactForm.designation.trim()) {
        throw new Error("Designation is required");
      }

      if (!contactForm.email.trim()) {
        throw new Error("Email is required");
      }

      if (!contactForm.phone.trim()) {
        throw new Error("Phone is required");
      }

      const payload = {
        company_id: Number(contactForm.company_id),
        contact_name: contactForm.contact_name.trim(),
        designation: contactForm.designation.trim(),
        email: contactForm.email.trim(),
        phone: contactForm.phone.trim(),
      };

      const response = await apiRequest(
        "/admin/company-contacts",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to create company contact"
        );
      }

      setMessage(
        "Company contact created successfully."
      );

      await loadContacts(contactForm.company_id);

      setContactForm((prev) => ({
        ...prev,
        contact_name: "",
        designation: "",
        email: "",
        phone: "",
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================================================
  // INTERVIEW FORM
  // =========================================================

  const resetInterviewForm = () => {
    setInterviewForm({
      company_id: "",
      contact_id: "",
      role: "",
      interview_date: "",
      interview_type: "",
      current_round: "",
      status: "",
      result: "",
      expected_salary: "",
      location: "",
      remarks: "",
    });

    setContacts([]);
    setEditingInterviewId(null);
  };

  const openAddInterview = () => {
    resetInterviewForm();
    setShowInterviewForm(true);
    setMessage("");
    setError("");
  };

  const openEditInterview = async (interview) => {
    setEditingInterviewId(interview.interview_id);

    setInterviewForm({
      company_id: interview.company_id
        ? String(interview.company_id)
        : "",

      contact_id: interview.contact_id
        ? String(interview.contact_id)
        : "",

      role: interview.role || "",

      interview_date:
        interview.interview_date || "",

      interview_type:
        interview.interview_type || "",

      current_round:
        interview.current_round || "",

      status: interview.status || "",

      result: interview.result || "",

      expected_salary:
        interview.expected_salary !== null &&
        interview.expected_salary !== undefined
          ? String(interview.expected_salary)
          : "",

      location: interview.location || "",

      remarks: interview.remarks || "",
    });

    setShowInterviewForm(true);
    setMessage("");
    setError("");

    if (interview.company_id) {
      await loadContacts(interview.company_id);
    }
  };

  const handleInterviewChange = async (e) => {
    const { name, value } = e.target;

    if (name === "company_id") {
      const selectedCompany = companies.find(
        (company) =>
          String(company.company_id) ===
          String(value)
      );

      setInterviewForm((prev) => ({
        ...prev,
        company_id: value,
        contact_id: "",
        location: selectedCompany?.location || "",
      }));

      await loadContacts(value);

      return;
    }

    setInterviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // SAVE INTERVIEW
  // =========================================================

  const saveInterview = async () => {
    try {
      setError("");
      setMessage("");

      if (!selectedStudentId) {
        throw new Error("Please select a student");
      }

      if (!interviewForm.company_id) {
        throw new Error("Please select a company");
      }

      if (!interviewForm.role.trim()) {
        throw new Error("Role is required");
      }

      if (!interviewForm.interview_date) {
        throw new Error(
          "Interview date is required"
        );
      }

      if (!interviewForm.interview_type) {
        throw new Error(
          "Interview type is required"
        );
      }

      if (!interviewForm.current_round) {
        throw new Error(
          "Current round is required"
        );
      }

      if (!interviewForm.status) {
        throw new Error("Status is required");
      }

      const payload = {
        student_id: Number(selectedStudentId),

        company_id: Number(
          interviewForm.company_id
        ),

        contact_id: interviewForm.contact_id
          ? Number(interviewForm.contact_id)
          : null,

        role: interviewForm.role,

        interview_date:
          interviewForm.interview_date,

        interview_type:
          interviewForm.interview_type,

        current_round:
          interviewForm.current_round,

        status: interviewForm.status,

        result:
          interviewForm.result || null,

        expected_salary:
          interviewForm.expected_salary
            ? Number(
                interviewForm.expected_salary
              )
            : null,

        location:
          interviewForm.location || null,

        remarks:
          interviewForm.remarks || null,
      };

      let response;

      if (editingInterviewId) {
        response = await apiRequest(
          `/admin/interviews/${editingInterviewId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await apiRequest(
          "/admin/interviews",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to save interview"
        );
      }

      setMessage(
        editingInterviewId
          ? "Interview updated successfully."
          : "Interview added successfully."
      );

      setShowInterviewForm(false);
      resetInterviewForm();

      await loadStudentDetails(
        selectedStudentId
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================================================
  // DELETE INTERVIEW
  // =========================================================

  const deleteInterview = async (interviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await apiRequest(
        `/admin/interviews/${interviewId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to delete interview"
        );
      }

      setMessage(
        "Interview deleted successfully."
      );

      await loadStudentDetails(
        selectedStudentId
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================================================
  // EMPLOYMENT FORM
  // =========================================================

  const resetEmploymentForm = () => {
    setEmploymentForm({
      company_id: "",
      company_name: "",
      role: "",
      employment_type: "",
      start_date: "",
      end_date: "",
      is_current: false,
      salary: "",
      location: "",
      remarks: "",
    });

    setEditingEmploymentId(null);
  };

  const openAddEmployment = () => {
    resetEmploymentForm();

    setShowEmploymentForm(true);
    setMessage("");
    setError("");
  };

  const openEditEmployment = (employment) => {
    setEditingEmploymentId(
      employment.employment_id
    );

    setEmploymentForm({
      company_id: employment.company_id
        ? String(employment.company_id)
        : "",

      company_name:
        employment.company_name || "",

      role: employment.role || "",

      employment_type:
        employment.employment_type || "",

      start_date:
        employment.start_date || "",

      end_date:
        employment.end_date || "",

      is_current:
        Boolean(employment.is_current),

      salary:
        employment.salary !== null &&
        employment.salary !== undefined
          ? String(employment.salary)
          : "",

      location:
        employment.location || "",

      remarks:
        employment.remarks || "",
    });

    setShowEmploymentForm(true);
    setMessage("");
    setError("");
  };

  const handleEmploymentChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    if (name === "company_id") {
      const selectedCompany =
        companies.find(
          (company) =>
            String(company.company_id) ===
            String(value)
        );

      setEmploymentForm((prev) => ({
        ...prev,
        company_id: value,
        company_name:
          selectedCompany?.company_name || "",
        location:
          selectedCompany?.location || "",
      }));

      return;
    }

    if (name === "is_current") {
      setEmploymentForm((prev) => ({
        ...prev,
        is_current: checked,
        end_date: checked
          ? ""
          : prev.end_date,
      }));

      return;
    }

    setEmploymentForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =========================================================
  // SAVE EMPLOYMENT
  // =========================================================

  const saveEmployment = async () => {
    try {
      setError("");
      setMessage("");

      if (!selectedStudentId) {
        throw new Error(
          "Please select a student"
        );
      }

      if (!employmentForm.company_id) {
        throw new Error(
          "Please select a company"
        );
      }

      if (!employmentForm.company_name.trim()) {
        throw new Error(
          "Company name is required"
        );
      }

      if (!employmentForm.role.trim()) {
        throw new Error("Role is required");
      }

      if (!employmentForm.employment_type) {
        throw new Error(
          "Employment type is required"
        );
      }

      if (!employmentForm.start_date) {
        throw new Error(
          "Start date is required"
        );
      }

      if (
        employmentForm.salary !== "" &&
        Number(employmentForm.salary) < 0
      ) {
        throw new Error(
          "Salary cannot be negative"
        );
      }

      const payload = {
        student_id: Number(
          selectedStudentId
        ),

        company_id:
          employmentForm.company_id
            ? Number(
                employmentForm.company_id
              )
            : null,

        company_name:
          employmentForm.company_name,

        role: employmentForm.role,

        employment_type:
          employmentForm.employment_type,

        start_date:
          employmentForm.start_date,

        end_date:
          employmentForm.is_current
            ? null
            : employmentForm.end_date ||
              null,

        is_current:
          employmentForm.is_current,

        salary:
          employmentForm.salary !== ""
            ? Number(
                employmentForm.salary
              )
            : null,

        location:
          employmentForm.location ||
          null,

        remarks:
          employmentForm.remarks ||
          null,
      };

      let response;

      if (editingEmploymentId) {
        response = await apiRequest(
          `/admin/employment/${editingEmploymentId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await apiRequest(
          "/admin/employment",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to save employment"
        );
      }

      setMessage(
        editingEmploymentId
          ? "Employment updated successfully."
          : "Employment added successfully."
      );

      setShowEmploymentForm(false);
      resetEmploymentForm();

      await loadStudentDetails(
        selectedStudentId
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================================================
  // DELETE EMPLOYMENT
  // =========================================================

  const deleteEmployment = async (
    employmentId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employment record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await apiRequest(
        `/admin/employment/${employmentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Failed to delete employment"
        );
      }

      setMessage(
        "Employment deleted successfully."
      );

      await loadStudentDetails(
        selectedStudentId
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const getCompanyName = (companyId) => {
    const company = companies.find(
      (item) =>
        Number(item.company_id) ===
        Number(companyId)
    );

    return company?.company_name || "";
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ===================================================
            HEADER
        =================================================== */}

        <div style={styles.header}>
          <div style={styles.headerBrand}>
            <div style={styles.brandMark}>TT</div>
            <div>
              <div style={styles.eyebrow}>TTT NEXGEN TRACKER</div>
              <h1 style={styles.title}>Admin Dashboard</h1>
              <p style={styles.subtitle}>Manage students, performance, interviews and placements from one workspace.</p>
            </div>
          </div>
          <div style={styles.headerActions}>
            <div style={styles.adminChip}><span style={styles.adminDot}></span><span>Administrator</span></div>
            <button onClick={logout} style={styles.logoutButton}>Logout</button>
          </div>
        </div>

        <div style={styles.statGrid}>
          <div style={styles.statCard}><div style={styles.statIcon}>👥</div><div><div style={styles.statLabel}>Students</div><div style={styles.statValue}>{students.length}</div></div><div style={styles.statHint}>Selected batch</div></div>
          <div style={styles.statCard}><div style={styles.statIcon}>🏢</div><div><div style={styles.statLabel}>Companies</div><div style={styles.statValue}>{companies.length}</div></div><div style={styles.statHint}>Available partners</div></div>
          <div style={styles.statCard}><div style={styles.statIcon}>💼</div><div><div style={styles.statLabel}>Interviews</div><div style={styles.statValue}>{studentDetails?.interviews?.length || 0}</div></div><div style={styles.statHint}>Selected student</div></div>
          <div style={styles.statCard}><div style={styles.statIcon}>🎯</div><div><div style={styles.statLabel}>Employment</div><div style={styles.statValue}>{studentDetails?.employment?.length || 0}</div></div><div style={styles.statHint}>Career records</div></div>
        </div>

        {/* ===================================================
            MESSAGES
        =================================================== */}

        {message && (
          <div style={styles.successMessage}>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* ===================================================
            BATCH SECTION
        =================================================== */}

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>
            Select Batch
          </h2>

          <select
            value={selectedBatchId}
            onChange={(e) =>
              setSelectedBatchId(
                e.target.value
              )
            }
            style={styles.input}
          >
            <option value="">
              {loadingBatches
                ? "Loading batches..."
                : "Select Batch"}
            </option>

            {batches.map((batch) => (
              <option
                key={batch.batch_id}
                value={batch.batch_id}
              >
                Batch {batch.batch_name} -{" "}
                {batch.course_name}
              </option>
            ))}
          </select>
        </div>

        {/* ===================================================
            STUDENT SECTION
        =================================================== */}

        {selectedBatchId && (
          <div style={styles.card}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>
                  Select Student
                </h2>

                <p
                  style={
                    styles.sectionDescription
                  }
                >
                  Search and filter students
                  in the selected batch.
                </p>
              </div>

              {students.length > 0 && (
                <div
                  style={
                    styles.studentCount
                  }
                >
                  Showing{" "}
                  {filteredStudents.length}{" "}
                  of {students.length}
                </div>
              )}
            </div>

            {loadingStudents ? (
              <p>Loading students...</p>
            ) : students.length === 0 ? (
              <p>
                No students found in this
                batch.
              </p>
            ) : (
              <>
                <div
                  style={styles.filterBox}
                >
                  <div
                    style={styles.filterGrid}
                  >
                    <div
                      style={
                        styles.searchField
                      }
                    >
                      <label
                        style={styles.label}
                      >
                        Search Student
                      </label>

                      <input
                        type="text"
                        value={studentSearch}
                        onChange={(e) =>
                          setStudentSearch(
                            e.target.value
                          )
                        }
                        style={styles.input}
                        placeholder="Name, email or phone"
                      />
                    </div>

                    <div>
                      <label
                        style={styles.label}
                      >
                        Status
                      </label>

                      <select
                        value={
                          studentStatusFilter
                        }
                        onChange={(e) =>
                          setStudentStatusFilter(
                            e.target.value
                          )
                        }
                        style={styles.input}
                      >
                        <option value="ALL">
                          All Statuses
                        </option>

                        {studentStatuses.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div>
                      <label
                        style={styles.label}
                      >
                        Qualification
                      </label>

                      <select
                        value={
                          studentQualificationFilter
                        }
                        onChange={(e) =>
                          setStudentQualificationFilter(
                            e.target.value
                          )
                        }
                        style={styles.input}
                      >
                        <option value="ALL">
                          All Qualifications
                        </option>

                        {studentQualifications.map(
                          (qualification) => (
                            <option
                              key={
                                qualification
                              }
                              value={
                                qualification
                              }
                            >
                              {qualification}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div
                      style={
                        styles.filterButtonContainer
                      }
                    >
                      <button
                        style={
                          styles.secondaryButton
                        }
                        onClick={
                          clearStudentFilters
                        }
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>

                {filteredStudents.length ===
                0 ? (
                  <div
                    style={styles.noResults}
                  >
                    <p
                      style={
                        styles.noResultsText
                      }
                    >
                      No students match your
                      search or filters.
                    </p>

                    <button
                      style={
                        styles.secondaryButton
                      }
                      onClick={
                        clearStudentFilters
                      }
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <select
                    value={
                      selectedStudentId
                    }
                    onChange={(e) =>
                      setSelectedStudentId(
                        e.target.value
                      )
                    }
                    style={styles.input}
                  >
                    {filteredStudents.map(
                      (student) => (
                        <option
                          key={
                            student.student_id
                          }
                          value={
                            student.student_id
                          }
                        >
                          {student.first_name}{" "}
                          {student.last_name} —{" "}
                          {student.email}
                        </option>
                      )
                    )}
                  </select>
                )}

                {filteredStudents.length >
                  0 && (
                  <div
                    style={
                      styles.studentList
                    }
                  >
                    {filteredStudents.map(
                      (student) => (
                        <button
                          key={
                            student.student_id
                          }
                          type="button"
                          onClick={() =>
                            setSelectedStudentId(
                              String(
                                student.student_id
                              )
                            )
                          }
                          style={{
                            ...styles.studentListItem,
                            ...(String(
                              selectedStudentId
                            ) ===
                            String(
                              student.student_id
                            )
                              ? styles.studentListItemActive
                              : {}),
                          }}
                        >
                          <div
                            style={
                              styles.studentListName
                            }
                          >
                            {student.first_name}{" "}
                            {student.last_name}
                          </div>

                          <div
                            style={
                              styles.studentListDetails
                            }
                          >
                            <span>
                              {student.email ||
                                "-"}
                            </span>

                            <span>
                              {student.qualification ||
                                "-"}
                            </span>

                            <span
                              style={{
                                ...styles.smallBadge,
                                ...getStudentStatusStyle(
                                  student.current_status
                                ),
                              }}
                            >
                              {student.current_status ||
                                "-"}
                            </span>
                          </div>
                        </button>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ===================================================
            STUDENT DETAILS
        =================================================== */}

        {loadingDetails && (
          <div style={styles.card}>
            <p>
              Loading student details...
            </p>
          </div>
        )}

        {studentDetails &&
          !loadingDetails && (
            <>
              {/* PROFILE */}

              <div style={styles.card}>
                <div
                  style={styles.sectionHeader}
                >
                  <h2
                    style={styles.sectionTitle}
                  >
                    Student Profile
                  </h2>

                  {!editingStudentProfile && (
                    <button
                      style={styles.primaryButton}
                      onClick={startStudentProfileEdit}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {editingStudentProfile && (
                  <div style={styles.profileEditBox}>
                    <div style={styles.formGrid}>
                      <div>
                        <label style={styles.label}>First Name *</label>
                        <input
                          style={styles.input}
                          name="first_name"
                          value={studentProfileForm.first_name}
                          onChange={handleStudentProfileChange}
                        />
                      </div>

                      <div>
                        <label style={styles.label}>Last Name</label>
                        <input
                          style={styles.input}
                          name="last_name"
                          value={studentProfileForm.last_name}
                          onChange={handleStudentProfileChange}
                        />
                      </div>

                      <div>
                        <label style={styles.label}>Email *</label>
                        <input
                          type="email"
                          style={styles.input}
                          name="email"
                          value={studentProfileForm.email}
                          onChange={handleStudentProfileChange}
                        />
                      </div>

                      <div>
                        <label style={styles.label}>Phone</label>
                        <input
                          style={styles.input}
                          name="phone"
                          value={studentProfileForm.phone}
                          onChange={handleStudentProfileChange}
                        />
                      </div>

                      <div>
                        <label style={styles.label}>Date of Birth</label>
                        <input
                          type="date"
                          style={styles.input}
                          name="date_of_birth"
                          value={studentProfileForm.date_of_birth}
                          onChange={handleStudentProfileChange}
                        />
                      </div>

                      <div>
                        <label style={styles.label}>Gender</label>
                        <select
                          style={styles.input}
                          name="gender"
                          value={studentProfileForm.gender}
                          onChange={handleStudentProfileChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label style={styles.label}>Qualification</label>
                        <input
                          style={styles.input}
                          name="qualification"
                          value={studentProfileForm.qualification}
                          onChange={handleStudentProfileChange}
                        />
                      </div>

                      <div>
                        <label style={styles.label}>College Name</label>
                        <input
                          style={styles.input}
                          name="college_name"
                          value={studentProfileForm.college_name}
                          onChange={handleStudentProfileChange}
                        />
                      </div>

                      <div>
                        <label style={styles.label}>Graduation Year</label>
                        <input
                          type="number"
                          style={styles.input}
                          name="graduation_year"
                          value={studentProfileForm.graduation_year}
                          onChange={handleStudentProfileChange}
                        />
                      </div>

                      <div>
                        <label style={styles.label}>Status</label>
                        <select
                          style={styles.input}
                          name="current_status"
                          value={studentProfileForm.current_status}
                          onChange={handleStudentProfileChange}
                        >
                          <option value="">Select Status</option>
                          <option value="TRAINING">TRAINING</option>
                          <option value="PLACED">PLACED</option>
                          <option value="EMPLOYED">EMPLOYED</option>
                          <option value="DROPPED">DROPPED</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginTop: "18px" }}>
                      <label style={styles.label}>Bio</label>
                      <textarea
                        style={styles.textarea}
                        name="bio"
                        rows="4"
                        value={studentProfileForm.bio}
                        onChange={handleStudentProfileChange}
                      />
                    </div>

                    <div style={styles.formActions}>
                      <button
                        style={styles.secondaryButton}
                        onClick={() => setEditingStudentProfile(false)}
                      >
                        Cancel
                      </button>

                      <button
                        style={styles.primaryButton}
                        onClick={saveStudentProfile}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                <div style={styles.grid}>
                  <InfoItem
                    label="Name"
                    value={`${studentDetails.student.first_name} ${studentDetails.student.last_name}`}
                  />

                  <InfoItem
                    label="Email"
                    value={
                      studentDetails.student
                        .email
                    }
                  />

                  <InfoItem
                    label="Phone"
                    value={
                      studentDetails.student
                        .phone
                    }
                  />

                  <InfoItem
                    label="Batch"
                    value={
                      studentDetails.student
                        .batch_name
                    }
                  />

                  <InfoItem
                    label="Course"
                    value={
                      studentDetails.student
                        .course_name
                    }
                  />

                  <InfoItem
                    label="Qualification"
                    value={
                      studentDetails.student
                        .qualification
                    }
                  />

                  <InfoItem
                    label="Graduation Year"
                    value={
                      studentDetails.student
                        .graduation_year
                    }
                  />

                  <InfoItem
                    label="College"
                    value={
                      studentDetails.student
                        .college_name
                    }
                  />

                  <InfoItem
                    label="Date of Birth"
                    value={
                      studentDetails.student
                        .date_of_birth
                    }
                  />

                  <InfoItem
                    label="Gender"
                    value={
                      studentDetails.student
                        .gender
                    }
                  />

                  <InfoItem
                    label="Status"
                    value={
                      studentDetails.student
                        .current_status
                    }
                  />

                  <InfoItem
                    label="Bio"
                    value={
                      studentDetails.student.bio
                    }
                  />
                </div>
              </div>

              {/* PERFORMANCE */}

              <div style={styles.card}>
                <div
                  style={styles.sectionHeader}
                >
                  <h2
                    style={styles.sectionTitle}
                  >
                    Performance
                  </h2>

                  {!editingPerformance && (
                    <button
                      style={
                        styles.primaryButton
                      }
                      onClick={
                        startPerformanceEdit
                      }
                    >
                      Edit Performance
                    </button>
                  )}
                </div>

                {editingPerformance ? (
                  <>
                    <div
                      style={
                        styles.performanceGrid
                      }
                    >
                      {[
                        [
                          "python_score",
                          "Python",
                        ],
                        [
                          "sql_score",
                          "SQL",
                        ],
                        [
                          "pyspark_score",
                          "PySpark",
                        ],
                        [
                          "aws_score",
                          "AWS",
                        ],
                        [
                          "data_engineering_score",
                          "Data Engineering",
                        ],
                        [
                          "communication_score",
                          "Communication",
                        ],
                        [
                          "overall_score",
                          "Overall",
                        ],
                      ].map(
                        ([name, label]) => (
                          <div key={name}>
                            <label
                              style={
                                styles.label
                              }
                            >
                              {label}
                            </label>

                            <input
                              type="number"
                              min="0"
                              max="100"
                              name={name}
                              value={
                                performanceForm[
                                  name
                                ]
                              }
                              onChange={
                                handlePerformanceChange
                              }
                              style={
                                styles.input
                              }
                            />
                          </div>
                        )
                      )}

                      <div>
                        <label
                          style={styles.label}
                        >
                          Assessments
                        </label>

                        <input
                          type="number"
                          min="0"
                          name="assessment_count"
                          value={
                            performanceForm.assessment_count
                          }
                          onChange={
                            handlePerformanceChange
                          }
                          style={
                            styles.input
                          }
                        />
                      </div>

                      <div>
                        <label
                          style={styles.label}
                        >
                          Mock Interviews
                        </label>

                        <input
                          type="number"
                          min="0"
                          name="mock_interview_count"
                          value={
                            performanceForm.mock_interview_count
                          }
                          onChange={
                            handlePerformanceChange
                          }
                          style={
                            styles.input
                          }
                        />
                      </div>
                    </div>

                    <div
                      style={styles.buttonRow}
                    >
                      <button
                        style={
                          styles.primaryButton
                        }
                        onClick={
                          savePerformance
                        }
                      >
                        Save Performance
                      </button>

                      <button
                        style={
                          styles.secondaryButton
                        }
                        onClick={() =>
                          setEditingPerformance(
                            false
                          )
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : studentDetails.performance ? (
                  <div
                    style={
                      styles.performanceGrid
                    }
                  >
                    <ScoreCard
                      label="Python"
                      value={
                        studentDetails
                          .performance
                          .python_score
                      }
                    />

                    <ScoreCard
                      label="SQL"
                      value={
                        studentDetails
                          .performance
                          .sql_score
                      }
                    />

                    <ScoreCard
                      label="PySpark"
                      value={
                        studentDetails
                          .performance
                          .pyspark_score
                      }
                    />

                    <ScoreCard
                      label="AWS"
                      value={
                        studentDetails
                          .performance
                          .aws_score
                      }
                    />

                    <ScoreCard
                      label="Data Engineering"
                      value={
                        studentDetails
                          .performance
                          .data_engineering_score
                      }
                    />

                    <ScoreCard
                      label="Communication"
                      value={
                        studentDetails
                          .performance
                          .communication_score
                      }
                    />

                    <ScoreCard
                      label="Overall"
                      value={
                        studentDetails
                          .performance
                          .overall_score
                      }
                    />

                    <ScoreCard
                      label="Assessments"
                      value={
                        studentDetails
                          .performance
                          .assessment_count
                      }
                      suffix=""
                    />

                    <ScoreCard
                      label="Mock Interviews"
                      value={
                        studentDetails
                          .performance
                          .mock_interview_count
                      }
                      suffix=""
                    />
                  </div>
                ) : (
                  <p>
                    No performance data available.
                  </p>
                )}
              </div>

              {/* INTERVIEWS */}

              <div style={styles.card}>
                <div
                  style={styles.sectionHeader}
                >
                  <div>
                    <h2
                      style={styles.sectionTitle}
                    >
                      Interviews
                    </h2>

                    <p
                      style={
                        styles.sectionDescription
                      }
                    >
                      Add, edit and delete
                      interviews for this
                      student.
                    </p>
                  </div>

                  <button
                    style={
                      styles.primaryButton
                    }
                    onClick={
                      openAddInterview
                    }
                  >
                    + Add Interview
                  </button>
                </div>

                {studentDetails.interviews &&
                studentDetails.interviews.length >
                  0 ? (
                  <div
                    style={
                      styles.tableWrapper
                    }
                  >
                    <table
                      style={styles.table}
                    >
                      <thead>
                        <tr>
                          <th
                            style={styles.th}
                          >
                            Company
                          </th>

                          <th
                            style={styles.th}
                          >
                            Role
                          </th>

                          <th
                            style={styles.th}
                          >
                            Date
                          </th>

                          <th
                            style={styles.th}
                          >
                            Type
                          </th>

                          <th
                            style={styles.th}
                          >
                            Round
                          </th>

                          <th
                            style={styles.th}
                          >
                            Status
                          </th>

                          <th
                            style={styles.th}
                          >
                            Result
                          </th>

                          <th
                            style={styles.th}
                          >
                            Salary
                          </th>

                          <th
                            style={styles.th}
                          >
                            Location
                          </th>

                          <th
                            style={styles.th}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {studentDetails.interviews.map(
                          (interview) => (
                            <tr
                              key={
                                interview.interview_id
                              }
                            >
                              <td
                                style={
                                  styles.td
                                }
                              >
                                {
                                  interview.company_name
                                }
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {interview.role}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {
                                  interview.interview_date
                                }
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {
                                  interview.interview_type
                                }
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {
                                  interview.current_round
                                }
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                <span
                                  style={{
                                    ...styles.badge,
                                    ...getStatusStyle(
                                      interview.status
                                    ),
                                  }}
                                >
                                  {
                                    interview.status
                                  }
                                </span>
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {interview.result ||
                                  "-"}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {interview.expected_salary
                                  ? `₹${Number(
                                      interview.expected_salary
                                    ).toLocaleString()}`
                                  : "-"}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {interview.location ||
                                  "-"}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                <div
                                  style={
                                    styles.actionRow
                                  }
                                >
                                  <button
                                    style={
                                      styles.editButton
                                    }
                                    onClick={() =>
                                      openEditInterview(
                                        interview
                                      )
                                    }
                                  >
                                    Edit
                                  </button>

                                  <button
                                    style={
                                      styles.deleteButton
                                    }
                                    onClick={() =>
                                      deleteInterview(
                                        interview.interview_id
                                      )
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div
                    style={styles.emptyState}
                  >
                    <p>
                      No interviews found.
                    </p>

                    <button
                      style={
                        styles.primaryButton
                      }
                      onClick={
                        openAddInterview
                      }
                    >
                      + Add First Interview
                    </button>
                  </div>
                )}
              </div>

              {/* EMPLOYMENT */}

              <div style={styles.card}>
                <div
                  style={styles.sectionHeader}
                >
                  <div>
                    <h2
                      style={styles.sectionTitle}
                    >
                      Employment
                    </h2>

                    <p
                      style={
                        styles.sectionDescription
                      }
                    >
                      Manage employment history
                      for this student.
                    </p>
                  </div>

                  <button
                    style={
                      styles.primaryButton
                    }
                    onClick={
                      openAddEmployment
                    }
                  >
                    + Add Employment
                  </button>
                </div>

                {studentDetails.employment &&
                studentDetails.employment.length >
                  0 ? (
                  <div
                    style={
                      styles.tableWrapper
                    }
                  >
                    <table
                      style={styles.table}
                    >
                      <thead>
                        <tr>
                          <th
                            style={styles.th}
                          >
                            Company
                          </th>

                          <th
                            style={styles.th}
                          >
                            Role
                          </th>

                          <th
                            style={styles.th}
                          >
                            Type
                          </th>

                          <th
                            style={styles.th}
                          >
                            Start Date
                          </th>

                          <th
                            style={styles.th}
                          >
                            End Date
                          </th>

                          <th
                            style={styles.th}
                          >
                            Salary
                          </th>

                          <th
                            style={styles.th}
                          >
                            Location
                          </th>

                          <th
                            style={styles.th}
                          >
                            Current
                          </th>

                          <th
                            style={styles.th}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {studentDetails.employment.map(
                          (employment) => (
                            <tr
                              key={
                                employment.employment_id
                              }
                            >
                              <td
                                style={
                                  styles.td
                                }
                              >
                                {employment.company_name ||
                                  "-"}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {employment.role ||
                                  "-"}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {employment.employment_type ||
                                  "-"}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {employment.start_date ||
                                  "-"}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {employment.end_date ||
                                  "-"}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {employment.salary !==
                                  null &&
                                employment.salary !==
                                  undefined
                                  ? `₹${Number(
                                      employment.salary
                                    ).toLocaleString()}`
                                  : "-"}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {employment.location ||
                                  "-"}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                <span
                                  style={{
                                    ...styles.badge,
                                    ...(employment.is_current
                                      ? styles.statusAttended
                                      : styles.statusCancelled),
                                  }}
                                >
                                  {employment.is_current
                                    ? "CURRENT"
                                    : "ENDED"}
                                </span>
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                <div
                                  style={
                                    styles.actionRow
                                  }
                                >
                                  <button
                                    style={
                                      styles.editButton
                                    }
                                    onClick={() =>
                                      openEditEmployment(
                                        employment
                                      )
                                    }
                                  >
                                    Edit
                                  </button>

                                  <button
                                    style={
                                      styles.deleteButton
                                    }
                                    onClick={() =>
                                      deleteEmployment(
                                        employment.employment_id
                                      )
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div
                    style={styles.emptyState}
                  >
                    <p>
                      No employment records found.
                    </p>

                    <button
                      style={
                        styles.primaryButton
                      }
                      onClick={
                        openAddEmployment
                      }
                    >
                      + Add First Employment
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

        {/* =====================================================
            COMPANY MANAGEMENT
        ===================================================== */}

        <div style={styles.card}>
          <div
            style={styles.sectionHeader}
          >
            <div>
              <h2
                style={styles.sectionTitle}
              >
                Company Management
              </h2>

              <p
                style={
                  styles.sectionDescription
                }
              >
                Add companies that can be
                used for interviews and
                employment.
              </p>
            </div>

            <button
              style={styles.primaryButton}
              onClick={() =>
                setShowCompanyForm(
                  !showCompanyForm
                )
              }
            >
              {showCompanyForm
                ? "Close"
                : "+ Add Company"}
            </button>
          </div>

          {showCompanyForm && (
            <div style={styles.formBox}>
              <div style={styles.formGrid}>
                <div>
                  <label
                    style={styles.label}
                  >
                    Company Name
                  </label>

                  <input
                    name="company_name"
                    value={
                      companyForm.company_name
                    }
                    onChange={
                      handleCompanyChange
                    }
                    style={styles.input}
                    placeholder="TCS"
                  />
                </div>

                <div>
                  <label
                    style={styles.label}
                  >
                    Industry
                  </label>

                  <input
                    name="industry"
                    value={
                      companyForm.industry
                    }
                    onChange={
                      handleCompanyChange
                    }
                    style={styles.input}
                    placeholder="IT Services"
                  />
                </div>

                <div>
                  <label
                    style={styles.label}
                  >
                    Location
                  </label>

                  <input
                    name="location"
                    value={
                      companyForm.location
                    }
                    onChange={
                      handleCompanyChange
                    }
                    style={styles.input}
                    placeholder="Hyderabad"
                  />
                </div>

                <div>
                  <label
                    style={styles.label}
                  >
                    Website
                  </label>

                  <input
                    name="website"
                    value={
                      companyForm.website
                    }
                    onChange={
                      handleCompanyChange
                    }
                    style={styles.input}
                    placeholder="https://example.com"
                  />
                </div>

                <div
                  style={styles.fullWidth}
                >
                  <label
                    style={styles.label}
                  >
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      companyForm.description
                    }
                    onChange={
                      handleCompanyChange
                    }
                    style={styles.textarea}
                    rows="3"
                  />
                </div>
              </div>

              <button
                style={styles.primaryButton}
                onClick={createCompany}
              >
                Save Company
              </button>
            </div>
          )}

          {companies.length > 0 && (
            <div style={styles.companyList}>
              {companies.map((company) => (
                <div
                  key={
                    company.company_id
                  }
                  style={styles.companyItem}
                >
                  <strong>
                    {company.company_name}
                  </strong>

                  <span>
                    {company.industry ||
                      "IT Services"}
                  </span>

                  <span>
                    {company.location ||
                      "-"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* =====================================================
            COMPANY CONTACTS
        ===================================================== */}

        <div style={styles.card}>
          <div
            style={styles.sectionHeader}
          >
            <div>
              <h2
                style={styles.sectionTitle}
              >
                Company Contacts
              </h2>

              <p
                style={
                  styles.sectionDescription
                }
              >
                Manage HR and company contacts
                used for interviews.
              </p>
            </div>

            <button
              style={styles.primaryButton}
              onClick={() => {
                if (showContactForm) {
                  setShowContactForm(false);
                  resetContactForm();
                } else {
                  openContactForm();
                }
              }}
            >
              {showContactForm
                ? "Close"
                : "+ Add Contact"}
            </button>
          </div>

          {/* CONTACT FORM */}

          {showContactForm && (
            <div style={styles.formBox}>
              <div style={styles.formGrid}>

                {/* COMPANY */}

                <div>
                  <label
                    style={styles.label}
                  >
                    Company *
                  </label>

                  <select
                    name="company_id"
                    value={
                      contactForm.company_id
                    }
                    onChange={
                      handleContactChange
                    }
                    style={styles.input}
                  >
                    <option value="">
                      Select Company
                    </option>

                    {companies.map(
                      (company) => (
                        <option
                          key={
                            company.company_id
                          }
                          value={
                            company.company_id
                          }
                        >
                          {
                            company.company_name
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* CONTACT NAME */}

                <div>
                  <label
                    style={styles.label}
                  >
                    Contact Name *
                  </label>

                  <input
                    name="contact_name"
                    value={
                      contactForm.contact_name
                    }
                    onChange={
                      handleContactChange
                    }
                    style={styles.input}
                    placeholder="Rahul Kumar"
                  />
                </div>

                {/* DESIGNATION */}

                <div>
                  <label
                    style={styles.label}
                  >
                    Designation *
                  </label>

                  <input
                    name="designation"
                    value={
                      contactForm.designation
                    }
                    onChange={
                      handleContactChange
                    }
                    style={styles.input}
                    placeholder="HR Manager"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    style={styles.label}
                  >
                    Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      contactForm.email
                    }
                    onChange={
                      handleContactChange
                    }
                    style={styles.input}
                    placeholder="rahul@example.com"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label
                    style={styles.label}
                  >
                    Phone *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={
                      contactForm.phone
                    }
                    onChange={
                      handleContactChange
                    }
                    style={styles.input}
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div style={styles.buttonRow}>
                <button
                  style={styles.primaryButton}
                  onClick={createContact}
                >
                  Save Contact
                </button>

                <button
                  style={styles.secondaryButton}
                  onClick={() => {
                    setShowContactForm(false);
                    resetContactForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* CONTACT COMPANY SELECTOR */}

          <div style={styles.contactViewer}>
            <label style={styles.label}>
              View Contacts For Company
            </label>

            <select
              value={
                selectedContactCompanyId
              }
              onChange={(e) => {
                const value = e.target.value;

                setSelectedContactCompanyId(
                  value
                );

                loadContacts(value);
              }}
              style={styles.input}
            >
              <option value="">
                Select Company
              </option>

              {companies.map((company) => (
                <option
                  key={company.company_id}
                  value={company.company_id}
                >
                  {company.company_name}
                </option>
              ))}
            </select>
          </div>

          {/* CONTACT LIST */}

          {selectedContactCompanyId && (
            <div style={styles.contactsList}>
              {loadingContacts ? (
                <p>
                  Loading contacts...
                </p>
              ) : contacts.length === 0 ? (
                <div
                  style={styles.emptyState}
                >
                  <p>
                    No contacts found for{" "}
                    {getCompanyName(
                      selectedContactCompanyId
                    )}
                    .
                  </p>

                  <button
                    style={
                      styles.primaryButton
                    }
                    onClick={() =>
                      setShowContactForm(true)
                    }
                  >
                    + Add First Contact
                  </button>
                </div>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={
                      contact.contact_id
                    }
                    style={
                      styles.contactItem
                    }
                  >
                    <div
                      style={
                        styles.contactMain
                      }
                    >
                      <strong>
                        {
                          contact.contact_name
                        }
                      </strong>

                      <span>
                        {
                          contact.designation
                        }
                      </span>
                    </div>

                    <div
                      style={
                        styles.contactDetails
                      }
                    >
                      <span>
                        📧{" "}
                        {contact.email ||
                          "-"}
                      </span>

                      <span>
                        📞{" "}
                        {contact.phone ||
                          "-"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* =======================================================
          INTERVIEW MODAL
      ======================================================= */}

      {showInterviewForm && (
        <div
          style={styles.modalOverlay}
        >
          <div style={styles.modal}>
            <div
              style={styles.modalHeader}
            >
              <div>
                <h2
                  style={styles.modalTitle}
                >
                  {editingInterviewId
                    ? "Edit Interview"
                    : "Add Interview"}
                </h2>

                <p
                  style={
                    styles.sectionDescription
                  }
                >
                  Student:{" "}
                  {
                    studentDetails?.student
                      ?.first_name
                  }{" "}
                  {
                    studentDetails?.student
                      ?.last_name
                  }
                </p>
              </div>

              <button
                style={styles.closeButton}
                onClick={() => {
                  setShowInterviewForm(
                    false
                  );
                  resetInterviewForm();
                }}
              >
                ×
              </button>
            </div>

            <div style={styles.formGrid}>

              {/* COMPANY */}

              <div>
                <label
                  style={styles.label}
                >
                  Company *
                </label>

                <select
                  name="company_id"
                  value={
                    interviewForm.company_id
                  }
                  onChange={
                    handleInterviewChange
                  }
                  style={styles.input}
                >
                  <option value="">
                    Select Company
                  </option>

                  {companies.map(
                    (company) => (
                      <option
                        key={
                          company.company_id
                        }
                        value={
                          company.company_id
                        }
                      >
                        {
                          company.company_name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* CONTACT */}

              <div>
                <label
                  style={styles.label}
                >
                  Contact
                </label>

                <select
                  name="contact_id"
                  value={
                    interviewForm.contact_id
                  }
                  onChange={
                    handleInterviewChange
                  }
                  style={styles.input}
                  disabled={
                    !interviewForm.company_id
                  }
                >
                  <option value="">
                    Select Contact
                  </option>

                  {contacts.map(
                    (contact) => (
                      <option
                        key={
                          contact.contact_id
                        }
                        value={
                          contact.contact_id
                        }
                      >
                        {
                          contact.contact_name
                        }
                        {contact.designation
                          ? ` - ${contact.designation}`
                          : ""}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* ROLE */}

              <div>
                <label
                  style={styles.label}
                >
                  Role *
                </label>

                <input
                  name="role"
                  value={
                    interviewForm.role
                  }
                  onChange={
                    handleInterviewChange
                  }
                  style={styles.input}
                  placeholder="Data Engineer"
                />
              </div>

              {/* DATE */}

              <div>
                <label
                  style={styles.label}
                >
                  Interview Date *
                </label>

                <input
                  type="date"
                  name="interview_date"
                  value={
                    interviewForm.interview_date
                  }
                  onChange={
                    handleInterviewChange
                  }
                  style={styles.input}
                />
              </div>

              {/* INTERVIEW TYPE */}

              <div>
                <label
                  style={styles.label}
                >
                  Interview Type *
                </label>

                <select
                  name="interview_type"
                  value={
                    interviewForm.interview_type
                  }
                  onChange={
                    handleInterviewChange
                  }
                  style={styles.input}
                >
                  <option value="">
                    Select Type
                  </option>

                  <option value="Technical">
                    Technical
                  </option>

                  <option value="HR">
                    HR
                  </option>

                  <option value="Managerial">
                    Managerial
                  </option>

                  <option value="Aptitude">
                    Aptitude
                  </option>

                  <option value="Assessment">
                    Assessment
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* CURRENT ROUND */}

              <div>
                <label
                  style={styles.label}
                >
                  Current Round *
                </label>

                <select
                  name="current_round"
                  value={
                    interviewForm.current_round
                  }
                  onChange={
                    handleInterviewChange
                  }
                  style={styles.input}
                >
                  <option value="">
                    Select Round
                  </option>

                  <option value="Round 1">
                    Round 1
                  </option>

                  <option value="Round 2">
                    Round 2
                  </option>

                  <option value="Round 3">
                    Round 3
                  </option>

                  <option value="Technical Round">
                    Technical Round
                  </option>

                  <option value="HR Round">
                    HR Round
                  </option>

                  <option value="Managerial Round">
                    Managerial Round
                  </option>

                  <option value="Final Round">
                    Final Round
                  </option>
                </select>
              </div>

              {/* STATUS */}

              <div>
                <label
                  style={styles.label}
                >
                  Status *
                </label>

                <select
                  name="status"
                  value={
                    interviewForm.status
                  }
                  onChange={
                    handleInterviewChange
                  }
                  style={styles.input}
                >
                  <option value="">
                    Select Status
                  </option>

                  <option value="SCHEDULED">
                    SCHEDULED
                  </option>

                  <option value="ATTENDED">
                    ATTENDED
                  </option>

                  <option value="CANCELLED">
                    CANCELLED
                  </option>

                  <option value="RESCHEDULED">
                    RESCHEDULED
                  </option>
                </select>
              </div>

              {/* RESULT */}

              <div>
                <label
                  style={styles.label}
                >
                  Result
                </label>

                <select
                  name="result"
                  value={
                    interviewForm.result
                  }
                  onChange={
                    handleInterviewChange
                  }
                  style={styles.input}
                >
                  <option value="">
                    Select Result
                  </option>

                  <option value="SELECTED">
                    SELECTED
                  </option>

                  <option value="REJECTED">
                    REJECTED
                  </option>

                  <option value="ON_HOLD">
                    ON HOLD
                  </option>

                  <option value="PENDING">
                    PENDING
                  </option>
                </select>
              </div>

              {/* SALARY */}

              <div>
                <label
                  style={styles.label}
                >
                  Expected Salary
                </label>

                <input
                  type="number"
                  min="0"
                  name="expected_salary"
                  value={
                    interviewForm.expected_salary
                  }
                  onChange={
                    handleInterviewChange
                  }
                  style={styles.input}
                  placeholder="800000"
                />
              </div>

              {/* LOCATION */}

              <div>
                <label
                  style={styles.label}
                >
                  Location
                </label>

                <input
                  name="location"
                  value={
                    interviewForm.location
                  }
                  readOnly
                  style={{
                    ...styles.input,
                    backgroundColor:
                      "#f3f4f6",
                  }}
                  placeholder="Company location"
                />

                <small
                  style={styles.helpText}
                >
                  Location comes from the
                  selected company.
                </small>
              </div>

              {/* REMARKS */}

              <div
                style={styles.fullWidth}
              >
                <label
                  style={styles.label}
                >
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={
                    interviewForm.remarks
                  }
                  onChange={
                    handleInterviewChange
                  }
                  style={styles.textarea}
                  rows="4"
                  placeholder="Interview notes..."
                />
              </div>
            </div>

            <div
              style={styles.modalFooter}
            >
              <button
                style={
                  styles.secondaryButton
                }
                onClick={() => {
                  setShowInterviewForm(
                    false
                  );
                  resetInterviewForm();
                }}
              >
                Cancel
              </button>

              <button
                style={styles.primaryButton}
                onClick={saveInterview}
              >
                {editingInterviewId
                  ? "Update Interview"
                  : "Save Interview"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          EMPLOYMENT MODAL
      ======================================================= */}

      {showEmploymentForm && (
        <div
          style={styles.modalOverlay}
        >
          <div style={styles.modal}>
            <div
              style={styles.modalHeader}
            >
              <div>
                <h2
                  style={styles.modalTitle}
                >
                  {editingEmploymentId
                    ? "Edit Employment"
                    : "Add Employment"}
                </h2>

                <p
                  style={
                    styles.sectionDescription
                  }
                >
                  Student:{" "}
                  {
                    studentDetails?.student
                      ?.first_name
                  }{" "}
                  {
                    studentDetails?.student
                      ?.last_name
                  }
                </p>
              </div>

              <button
                style={styles.closeButton}
                onClick={() => {
                  setShowEmploymentForm(
                    false
                  );
                  resetEmploymentForm();
                }}
              >
                ×
              </button>
            </div>

            <div style={styles.formGrid}>

              {/* COMPANY */}

              <div>
                <label
                  style={styles.label}
                >
                  Company *
                </label>

                <select
                  name="company_id"
                  value={
                    employmentForm.company_id
                  }
                  onChange={
                    handleEmploymentChange
                  }
                  style={styles.input}
                >
                  <option value="">
                    Select Company
                  </option>

                  {companies.map(
                    (company) => (
                      <option
                        key={
                          company.company_id
                        }
                        value={
                          company.company_id
                        }
                      >
                        {
                          company.company_name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* ROLE */}

              <div>
                <label
                  style={styles.label}
                >
                  Role *
                </label>

                <input
                  name="role"
                  value={
                    employmentForm.role
                  }
                  onChange={
                    handleEmploymentChange
                  }
                  style={styles.input}
                  placeholder="Data Engineer"
                />
              </div>

              {/* EMPLOYMENT TYPE */}

              <div>
                <label
                  style={styles.label}
                >
                  Employment Type *
                </label>

                <select
                  name="employment_type"
                  value={
                    employmentForm.employment_type
                  }
                  onChange={
                    handleEmploymentChange
                  }
                  style={styles.input}
                >
                  <option value="">
                    Select Type
                  </option>

                  <option value="Full-time">
                    Full-time
                  </option>

                  <option value="Part-time">
                    Part-time
                  </option>

                  <option value="Contract">
                    Contract
                  </option>

                  <option value="Internship">
                    Internship
                  </option>

                  <option value="Freelance">
                    Freelance
                  </option>
                </select>
              </div>

              {/* START DATE */}

              <div>
                <label
                  style={styles.label}
                >
                  Start Date *
                </label>

                <input
                  type="date"
                  name="start_date"
                  value={
                    employmentForm.start_date
                  }
                  onChange={
                    handleEmploymentChange
                  }
                  style={styles.input}
                />
              </div>

              {/* END DATE */}

              <div>
                <label
                  style={styles.label}
                >
                  End Date
                </label>

                <input
                  type="date"
                  name="end_date"
                  value={
                    employmentForm.end_date
                  }
                  onChange={
                    handleEmploymentChange
                  }
                  style={styles.input}
                  disabled={
                    employmentForm.is_current
                  }
                />
              </div>

              {/* SALARY */}

              <div>
                <label
                  style={styles.label}
                >
                  Salary
                </label>

                <input
                  type="number"
                  min="0"
                  name="salary"
                  value={
                    employmentForm.salary
                  }
                  onChange={
                    handleEmploymentChange
                  }
                  style={styles.input}
                  placeholder="600000"
                />
              </div>

              {/* LOCATION */}

              <div>
                <label
                  style={styles.label}
                >
                  Location
                </label>

                <input
                  name="location"
                  value={
                    employmentForm.location
                  }
                  onChange={
                    handleEmploymentChange
                  }
                  style={styles.input}
                  placeholder="Hyderabad"
                />
              </div>

              {/* CURRENT EMPLOYMENT */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  paddingTop: "25px",
                }}
              >
                <input
                  type="checkbox"
                  name="is_current"
                  checked={
                    employmentForm.is_current
                  }
                  onChange={
                    handleEmploymentChange
                  }
                  style={{
                    width: "18px",
                    height: "18px",
                  }}
                />

                <label
                  style={{
                    ...styles.label,
                    marginBottom: 0,
                  }}
                >
                  Currently Working Here
                </label>
              </div>

              {/* REMARKS */}

              <div
                style={styles.fullWidth}
              >
                <label
                  style={styles.label}
                >
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={
                    employmentForm.remarks
                  }
                  onChange={
                    handleEmploymentChange
                  }
                  style={styles.textarea}
                  rows="4"
                  placeholder="Employment notes..."
                />
              </div>
            </div>

            <div
              style={styles.modalFooter}
            >
              <button
                style={
                  styles.secondaryButton
                }
                onClick={() => {
                  setShowEmploymentForm(
                    false
                  );
                  resetEmploymentForm();
                }}
              >
                Cancel
              </button>

              <button
                style={styles.primaryButton}
                onClick={saveEmployment}
              >
                {editingEmploymentId
                  ? "Update Employment"
                  : "Save Employment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================
// INFO ITEM
// =============================================================

function InfoItem({ label, value }) {
  return (
    <div style={styles.infoItem}>
      <div style={styles.infoLabel}>
        {label}
      </div>

      <div style={styles.infoValue}>
        {value === null ||
        value === undefined ||
        value === ""
          ? "-"
          : value}
      </div>
    </div>
  );
}

// =============================================================
// SCORE CARD
// =============================================================

function ScoreCard({
  label,
  value,
  suffix = "/100",
}) {
  return (
    <div style={styles.scoreCard}>
      <div style={styles.scoreLabel}>
        {label}
      </div>

      <div style={styles.scoreValue}>
        {value ?? "-"}

        {value !== null &&
        value !== undefined &&
        value !== ""
          ? suffix
          : ""}
      </div>
    </div>
  );
}

// =============================================================
// INTERVIEW STATUS STYLE
// =============================================================

function getStatusStyle(status) {
  switch (status) {
    case "SCHEDULED":
      return styles.statusScheduled;

    case "ATTENDED":
      return styles.statusAttended;

    case "CANCELLED":
      return styles.statusCancelled;

    case "RESCHEDULED":
      return styles.statusRescheduled;

    default:
      return {};
  }
}

// =============================================================
// STUDENT STATUS STYLE
// =============================================================

function getStudentStatusStyle(status) {
  switch (status) {
    case "TRAINING":
      return styles.studentStatusTraining;

    case "PLACED":
      return styles.studentStatusPlaced;

    case "COMPLETED":
      return styles.studentStatusCompleted;

    case "DROPPED":
      return styles.studentStatusDropped;

    case "ACTIVE":
      return styles.studentStatusActive;

    default:
      return styles.studentStatusDefault;
  }
}

// =============================================================
// STYLES
// =============================================================

const styles = {
  page: { minHeight:"100vh", background:"#f4f7fb", padding:"28px", boxSizing:"border-box", color:"#172033", fontFamily:"Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  container: { width:"100%", maxWidth:"1500px", margin:"0 auto" },
  header: { position:"relative", overflow:"hidden", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"24px", flexWrap:"wrap", padding:"30px 34px", marginBottom:"22px", borderRadius:"24px", background:"linear-gradient(135deg,#111827 0%,#1e3a8a 55%,#2563eb 100%)", boxShadow:"0 18px 45px rgba(30,58,138,.18)", color:"white" },
  headerBrand:{display:"flex",alignItems:"center",gap:"16px",position:"relative",zIndex:1},
  brandMark:{width:"52px",height:"52px",borderRadius:"16px",display:"grid",placeItems:"center",fontWeight:"900",fontSize:"18px",background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.2)",boxShadow:"inset 0 1px 0 rgba(255,255,255,.2)"},
  eyebrow:{fontSize:"11px",fontWeight:"800",letterSpacing:"1.7px",color:"#bfdbfe",marginBottom:"5px"},
  title:{margin:0,fontSize:"30px",lineHeight:1.15,fontWeight:"850",letterSpacing:"-.7px",color:"#fff"},
  subtitle:{margin:"7px 0 0",fontSize:"13px",lineHeight:1.55,color:"#dbeafe",maxWidth:"650px"},
  headerActions:{display:"flex",alignItems:"center",gap:"10px",position:"relative",zIndex:1},
  adminChip:{display:"flex",alignItems:"center",gap:"8px",padding:"9px 13px",borderRadius:"999px",background:"rgba(255,255,255,.11)",border:"1px solid rgba(255,255,255,.16)",fontSize:"12px",fontWeight:"750",color:"#fff"},
  adminDot:{width:"8px",height:"8px",borderRadius:"50%",background:"#34d399",boxShadow:"0 0 0 4px rgba(52,211,153,.15)"},
  logoutButton:{padding:"10px 16px",borderRadius:"10px",border:"1px solid rgba(255,255,255,.18)",background:"#fff",color:"#172033",cursor:"pointer",fontWeight:"800",fontSize:"13px",boxShadow:"0 6px 15px rgba(0,0,0,.12)"},
  statGrid:{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:"16px",marginBottom:"22px"},
  statCard:{position:"relative",minHeight:"112px",padding:"19px",boxSizing:"border-box",background:"#fff",border:"1px solid #e6eaf0",borderRadius:"18px",boxShadow:"0 8px 24px rgba(15,23,42,.055)",display:"grid",gridTemplateColumns:"46px 1fr",columnGap:"13px",alignItems:"center"},
  statIcon:{width:"46px",height:"46px",borderRadius:"14px",display:"grid",placeItems:"center",background:"#eff6ff",fontSize:"21px",gridRow:"1 / span 2"},
  statLabel:{fontSize:"12px",fontWeight:"700",color:"#64748b",marginBottom:"3px"},
  statValue:{fontSize:"25px",fontWeight:"850",letterSpacing:"-.5px",color:"#111827"},
  statHint:{gridColumn:"2",fontSize:"11px",color:"#94a3b8",marginTop:"2px"},
  card:{background:"#fff",border:"1px solid #e7ebf0",borderRadius:"20px",padding:"24px",marginBottom:"18px",boxShadow:"0 7px 25px rgba(15,23,42,.045)"},
  sectionHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"14px",marginBottom:"18px",flexWrap:"wrap"},
  sectionTitle:{margin:0,fontSize:"19px",lineHeight:1.3,fontWeight:"820",color:"#111827",letterSpacing:"-.25px"},
  sectionDescription:{margin:"5px 0 0",fontSize:"12px",lineHeight:1.55,color:"#64748b"},
  studentCount:{padding:"7px 11px",borderRadius:"999px",background:"#eef4ff",color:"#315fc4",border:"1px solid #d7e4ff",fontSize:"11px",fontWeight:"800"},
  input:{width:"100%",minHeight:"44px",padding:"10px 13px",boxSizing:"border-box",border:"1px solid #d9e0e8",borderRadius:"11px",outline:"none",background:"#fbfcfe",color:"#172033",fontSize:"13px",fontWeight:"550"},
  textarea:{width:"100%",padding:"11px 13px",boxSizing:"border-box",border:"1px solid #d9e0e8",borderRadius:"11px",outline:"none",background:"#fbfcfe",color:"#172033",fontSize:"13px",lineHeight:1.55,resize:"vertical",fontFamily:"inherit"},
  label:{display:"block",marginBottom:"7px",fontSize:"11px",fontWeight:"800",color:"#475569",letterSpacing:".1px"},
  filterBox:{padding:"17px",marginBottom:"17px",background:"#f8fafc",border:"1px solid #e8edf3",borderRadius:"15px"},
  filterGrid:{display:"grid",gridTemplateColumns:"minmax(220px,2fr) minmax(160px,1fr) minmax(160px,1fr) auto",gap:"12px",alignItems:"end"},
  searchField:{minWidth:0},
  filterButtonContainer:{display:"flex",alignItems:"flex-end"},
  noResults:{textAlign:"center",padding:"28px 20px",background:"#f8fafc",borderRadius:"14px",border:"1px dashed #cbd5e1"},
  noResultsText:{margin:0,color:"#64748b",fontSize:"13px"},
  primaryButton:{padding:"10px 15px",border:"none",borderRadius:"10px",background:"linear-gradient(135deg,#2563eb,#1d4ed8)",color:"#fff",fontSize:"12px",fontWeight:"800",cursor:"pointer",boxShadow:"0 7px 15px rgba(37,99,235,.18)"},
  secondaryButton:{padding:"10px 15px",border:"1px solid #d7dee8",borderRadius:"10px",background:"#fff",color:"#334155",fontSize:"12px",fontWeight:"800",cursor:"pointer"},
  buttonRow:{display:"flex",gap:"9px",alignItems:"center",flexWrap:"wrap"},
  formGrid:{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:"16px"},
  performanceGrid:{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:"12px"},
  grid:{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(280px,.85fr)",gap:"18px"},
  fullWidth:{gridColumn:"1 / -1"},
  formActions:{display:"flex",justifyContent:"flex-end",gap:"9px",marginTop:"18px",flexWrap:"wrap"},
  profileEditBox:{padding:"20px",background:"#f8fafc",border:"1px solid #e5eaf0",borderRadius:"16px"},
  formBox:{padding:"18px",background:"#f8fafc",border:"1px solid #e6ebf1",borderRadius:"15px"},
  studentList:{display:"grid",gap:"9px",maxHeight:"430px",overflowY:"auto"},
  studentListItem:{width:"100%",textAlign:"left",padding:"14px",border:"1px solid #e4e9ef",borderRadius:"14px",background:"#fff",cursor:"pointer",boxSizing:"border-box"},
  studentListItemActive:{border:"1px solid #8db2ff",background:"#f1f6ff",boxShadow:"0 5px 14px rgba(37,99,235,.08)"},
  studentListName:{fontSize:"13px",fontWeight:"800",color:"#172033"},
  studentListDetails:{fontSize:"11px",color:"#64748b",marginTop:"4px",lineHeight:1.5},
  studentHero:{padding:"22px",marginBottom:"18px",borderRadius:"20px",background:"linear-gradient(135deg,#ffffff 0%,#f7faff 100%)",border:"1px solid #dfe7f2",boxShadow:"0 9px 28px rgba(30,64,175,.07)"},
  heroTopLine:{display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"},
  heroAvatar:{width:"62px",height:"62px",borderRadius:"18px",display:"grid",placeItems:"center",background:"linear-gradient(135deg,#2563eb,#4f46e5)",color:"white",fontSize:"20px",fontWeight:"900",boxShadow:"0 10px 20px rgba(37,99,235,.2)"},
  heroInfo:{flex:"1 1 260px"},
  heroName:{fontSize:"22px",fontWeight:"850",color:"#111827",letterSpacing:"-.35px"},
  heroMeta:{marginTop:"4px",fontSize:"12px",color:"#64748b"},
  heroContact:{marginTop:"7px",fontSize:"12px",color:"#475569"},
  heroStatus:{padding:"7px 11px",borderRadius:"999px",fontSize:"11px",fontWeight:"850",background:"#ecfdf5",color:"#047857",border:"1px solid #bbf7d0"},
  infoItem:{padding:"13px 14px",border:"1px solid #e8edf3",borderRadius:"12px",background:"#fbfcfe"},
  infoLabel:{fontSize:"10px",fontWeight:"800",textTransform:"uppercase",letterSpacing:".6px",color:"#94a3b8",marginBottom:"5px"},
  infoValue:{fontSize:"13px",fontWeight:"700",color:"#273449",wordBreak:"break-word"},
  scoreCard:{padding:"17px",borderRadius:"15px",border:"1px solid #e4eaf2",background:"linear-gradient(145deg,#fff,#f8fbff)",minHeight:"96px",boxSizing:"border-box"},
  scoreLabel:{fontSize:"11px",fontWeight:"800",color:"#64748b",textTransform:"uppercase",letterSpacing:".45px"},
  scoreValue:{fontSize:"25px",fontWeight:"900",color:"#1d4ed8",marginTop:"10px",letterSpacing:"-.5px"},
  tableWrapper:{width:"100%",overflowX:"auto",border:"1px solid #e7ebf0",borderRadius:"14px"},
  table:{width:"100%",borderCollapse:"collapse",minWidth:"900px",background:"#fff"},
  th:{padding:"12px 13px",textAlign:"left",fontSize:"10px",fontWeight:"850",textTransform:"uppercase",letterSpacing:".55px",color:"#64748b",background:"#f8fafc",borderBottom:"1px solid #e7ebf0",whiteSpace:"nowrap"},
  td:{padding:"13px",fontSize:"12px",color:"#334155",borderBottom:"1px solid #eef2f6",verticalAlign:"middle"},
  badge:{display:"inline-flex",alignItems:"center",padding:"5px 9px",borderRadius:"999px",fontSize:"10px",fontWeight:"850"},
  smallBadge:{display:"inline-flex",padding:"4px 8px",borderRadius:"999px",background:"#f1f5f9",color:"#475569",fontSize:"10px",fontWeight:"800"},
  statusScheduled:{background:"#eff6ff",color:"#1d4ed8",border:"1px solid #bfdbfe"},
  statusAttended:{background:"#ecfdf5",color:"#047857",border:"1px solid #bbf7d0"},
  statusCancelled:{background:"#fef2f2",color:"#b91c1c",border:"1px solid #fecaca"},
  statusRescheduled:{background:"#fff7ed",color:"#c2410c",border:"1px solid #fed7aa"},
  studentStatusTraining:{background:"#eff6ff",color:"#1d4ed8",border:"1px solid #bfdbfe"},
  studentStatusPlaced:{background:"#ecfdf5",color:"#047857",border:"1px solid #bbf7d0"},
  studentStatusCompleted:{background:"#f5f3ff",color:"#6d28d9",border:"1px solid #ddd6fe"},
  studentStatusDropped:{background:"#fef2f2",color:"#b91c1c",border:"1px solid #fecaca"},
  studentStatusActive:{background:"#ecfeff",color:"#0e7490",border:"1px solid #a5f3fc"},
  studentStatusDefault:{background:"#f1f5f9",color:"#475569",border:"1px solid #e2e8f0"},
  actionRow:{display:"flex",gap:"7px",alignItems:"center",flexWrap:"wrap"},
  editButton:{padding:"7px 10px",border:"1px solid #c7d7fe",borderRadius:"8px",background:"#f5f8ff",color:"#1d4ed8",fontSize:"10px",fontWeight:"850",cursor:"pointer"},
  deleteButton:{padding:"7px 10px",border:"1px solid #fecaca",borderRadius:"8px",background:"#fff7f7",color:"#b91c1c",fontSize:"10px",fontWeight:"850",cursor:"pointer"},
  companyList:{display:"grid",gap:"9px"},
  companyItem:{padding:"13px",border:"1px solid #e5eaf0",borderRadius:"12px",background:"#fff"},
  contactsList:{display:"grid",gap:"9px"},
  contactItem:{padding:"13px",border:"1px solid #e5eaf0",borderRadius:"12px",background:"#fff"},
  contactMain:{fontWeight:"800",fontSize:"12px",color:"#172033"},
  contactDetails:{fontSize:"11px",color:"#64748b",marginTop:"4px"},
  contactViewer:{padding:"14px",borderRadius:"12px",background:"#f8fafc",border:"1px solid #e7ebf0"},
  emptyState:{padding:"25px",textAlign:"center",border:"1px dashed #cbd5e1",borderRadius:"13px",background:"#f8fafc",color:"#64748b",fontSize:"12px"},
  helpText:{marginTop:"6px",fontSize:"10px",color:"#94a3b8",lineHeight:1.5},
  successMessage:{padding:"12px 15px",marginBottom:"16px",borderRadius:"12px",background:"#ecfdf5",border:"1px solid #bbf7d0",color:"#047857",fontSize:"12px",fontWeight:"750"},
  errorMessage:{padding:"12px 15px",marginBottom:"16px",borderRadius:"12px",background:"#fef2f2",border:"1px solid #fecaca",color:"#b91c1c",fontSize:"12px",fontWeight:"750"},
  modalOverlay:{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",background:"rgba(15,23,42,.55)",backdropFilter:"blur(5px)",boxSizing:"border-box"},
  modal:{width:"100%",maxWidth:"850px",maxHeight:"90vh",overflowY:"auto",background:"#fff",borderRadius:"20px",padding:"24px",boxSizing:"border-box",boxShadow:"0 25px 70px rgba(15,23,42,.28)"},
  modalHeader:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"14px",marginBottom:"20px",paddingBottom:"15px",borderBottom:"1px solid #e8edf3"},
  modalTitle:{margin:0,fontSize:"20px",fontWeight:"850",color:"#111827"},
  closeButton:{width:"34px",height:"34px",border:"1px solid #e2e8f0",borderRadius:"9px",background:"#f8fafc",color:"#475569",fontSize:"20px",cursor:"pointer"},
  modalFooter:{display:"flex",justifyContent:"flex-end",gap:"9px",paddingTop:"17px",marginTop:"18px",borderTop:"1px solid #e8edf3",flexWrap:"wrap"},
};

export default AdminDashboard;
