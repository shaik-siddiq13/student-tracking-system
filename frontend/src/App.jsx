import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import Login from "./pages/Login";

import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentInterviews from "./pages/student/interviews/StudentInterviews";
import StudentQuestions from "./pages/student/StudentQuestions";
import StudentSkills from "./pages/student/StudentSkills";
import StudentPerformance from "./pages/student/StudentPerformance";

import AdminDashboard from "./pages/admin/AdminDashboard";


// =====================================================
// LOADING SCREEN
// =====================================================

function LoadingScreen() {
  return (
    <div style={styles.loading}>

      <div style={styles.loadingIcon}>
        🎓
      </div>

      <h2>
        TTT NexGen Tracker
      </h2>

      <p>
        Loading...
      </p>

    </div>
  );
}


// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute({
  children,
  allowedRole,
}) {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  // ---------------------------------------------------
  // LOADING
  // ---------------------------------------------------

  if (loading) {
    return <LoadingScreen />;
  }

  // ---------------------------------------------------
  // NOT AUTHENTICATED
  // ---------------------------------------------------

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ---------------------------------------------------
  // WRONG ROLE
  // ---------------------------------------------------

  if (
    allowedRole &&
    user?.role !== allowedRole
  ) {

    if (user?.role === "ADMIN") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/student/dashboard"
        replace
      />
    );
  }

  return children;
}


// =====================================================
// ROLE REDIRECT
// =====================================================

function RoleRedirect() {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  // ---------------------------------------------------
  // LOADING
  // ---------------------------------------------------

  if (loading) {
    return <LoadingScreen />;
  }

  // ---------------------------------------------------
  // NOT AUTHENTICATED
  // ---------------------------------------------------

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ---------------------------------------------------
  // ADMIN
  // ---------------------------------------------------

  if (user?.role === "ADMIN") {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  // ---------------------------------------------------
  // STUDENT
  // ---------------------------------------------------

  return (
    <Navigate
      to="/student/dashboard"
      replace
    />
  );
}


// =====================================================
// APPLICATION ROUTES
// =====================================================

function AppRoutes() {
  return (
    <Routes>

      {/* =====================================================
          LOGIN
          ===================================================== */}

      <Route
        path="/login"
        element={
          <Login />
        }
      />


      {/* =====================================================
          ROOT
          ===================================================== */}

      <Route
        path="/"
        element={
          <RoleRedirect />
        }
      />


      {/* =====================================================
          STUDENT ROUTES
          ===================================================== */}

      <Route
        path="/student"
        element={
          <ProtectedRoute
            allowedRole="STUDENT"
          >
            <StudentLayout />
          </ProtectedRoute>
        }
      >

        {/* =================================================
            STUDENT ROOT
            /student
            ================================================= */}

        <Route
          index
          element={
            <Navigate
              to="/student/dashboard"
              replace
            />
          }
        />


        {/* =================================================
            DASHBOARD
            /student/dashboard
            ================================================= */}

        <Route
          path="dashboard"
          element={
            <StudentDashboard />
          }
        />


        {/* =================================================
            PROFILE
            /student/profile
            ================================================= */}

        <Route
          path="profile"
          element={
            <StudentProfile />
          }
        />


        {/* =================================================
            INTERVIEWS
            /student/interviews
            ================================================= */}

        <Route
          path="interviews"
          element={
            <StudentInterviews />
          }
        />


        {/* =================================================
            INTERVIEW QUESTIONS
            /student/questions
            ================================================= */}

        <Route
          path="questions"
          element={
            <StudentQuestions />
          }
        />


        {/* =================================================
            SKILLS
            /student/skills
            ================================================= */}

        <Route
          path="skills"
          element={
            <StudentSkills />
          }
        />


        {/* =================================================
            PERFORMANCE
            /student/performance
            ================================================= */}

        <Route
          path="performance"
          element={
            <StudentPerformance />
          }
        />

      </Route>


      {/* =====================================================
          ADMIN ROUTES
          ===================================================== */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute
            allowedRole="ADMIN"
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          UNKNOWN ROUTE
          ===================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}


// =====================================================
// MAIN APP
// =====================================================

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <AppRoutes />

      </AuthProvider>

    </BrowserRouter>
  );
}


// =====================================================
// GLOBAL STYLES
// =====================================================

const styles = {

  page: {
    minHeight: "100vh",
    padding: "50px",
    boxSizing: "border-box",
    background: "#f4f7fb",
    fontFamily:
      "Arial, sans-serif",
    color: "#1f2937",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f7fb",
    color: "#1f2937",
    fontFamily:
      "Arial, sans-serif",
  },

  loadingIcon: {
    fontSize: "55px",
    marginBottom: "10px",
  },

};


// =====================================================
// EXPORT
// =====================================================

export default App;
