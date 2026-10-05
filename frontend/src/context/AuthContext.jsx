import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );

  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    const loadUser = async () => {
      const savedToken =
        localStorage.getItem("access_token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        // =================================================
        // STEP 1
        // GET AUTHENTICATED USER
        // =================================================

        const meResponse = await fetch(
          `${API_URL}/me`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          }
        );

        // =================================================
        // INVALID TOKEN
        // =================================================

        if (
          meResponse.status === 401 ||
          meResponse.status === 403
        ) {
          logout();
          return;
        }

        if (!meResponse.ok) {
          throw new Error(
            "Unable to load authenticated user"
          );
        }

        const meData =
          await meResponse.json();

        console.log(
          "Authenticated user:",
          meData
        );

        /*
         * Backend /me response:
         *
         * {
         *   "message": "You are authenticated",
         *   "user": {
         *      "user_id": 1,
         *      "username": "siddiq",
         *      "role": "STUDENT"
         *   }
         * }
         */

        const authenticatedUser =
          meData.user;

        if (!authenticatedUser) {
          throw new Error(
            "User information not found"
          );
        }

        // =================================================
        // STEP 2
        // SAVE BASIC USER INFORMATION
        // =================================================

        let currentUser = {
          ...authenticatedUser,
        };

        // =================================================
        // STEP 3
        // STUDENT USER
        // =================================================

        if (
          authenticatedUser.role === "STUDENT"
        ) {
          const studentResponse =
            await fetch(
              `${API_URL}/students/me`,
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${savedToken}`,
                },
              }
            );

          if (
            studentResponse.status === 401 ||
            studentResponse.status === 403
          ) {
            logout();
            return;
          }

          if (!studentResponse.ok) {
            throw new Error(
              "Unable to load student information"
            );
          }

          const studentData =
            await studentResponse.json();

          console.log(
            "Student profile:",
            studentData
          );

          /*
           * Backend returns:
           *
           * {
           *   "student": {
           *      ...
           *   }
           * }
           */

          const student =
            studentData.student;

          if (!student) {
            throw new Error(
              "Student information not found"
            );
          }

          currentUser = {
            ...authenticatedUser,

            student,

            student_id:
              student.student_id,

            first_name:
              student.first_name,

            last_name:
              student.last_name,

            email:
              student.email,

            phone:
              student.phone,

            batch_id:
              student.batch_id,

            batch_name:
              student.batch_name,

            course_name:
              student.course_name,

            current_status:
              student.current_status,

            qualification:
              student.qualification,

            graduation_year:
              student.graduation_year,
          };
        }

        // =================================================
        // STEP 4
        // ADMIN USER
        // =================================================

        /*
         * ADMIN does NOT call /students/me.
         *
         * The /me response is enough for admin:
         *
         * {
         *   user_id: 2,
         *   username: "admin",
         *   role: "ADMIN"
         * }
         */

        if (
          authenticatedUser.role === "ADMIN"
        ) {
          currentUser = {
            ...authenticatedUser,
          };
        }

        // =================================================
        // STEP 5
        // SAVE USER
        // =================================================

        setUser(currentUser);

        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );

        console.log(
          "Final current user:",
          currentUser
        );

      } catch (error) {
        console.error(
          "Authentication error:",
          error
        );

        /*
         * Do not immediately remove the token
         * for normal server/network errors.
         *
         * This allows the application to recover
         * if the backend temporarily has an issue.
         */
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // =====================================================
  // LOGIN
  // =====================================================

  const login = async (
    username,
    password
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data =
        await response.json();

      // =================================================
      // LOGIN FAILED
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Invalid username or password"
        );
      }

      console.log(
        "Login response:",
        data
      );

      // =================================================
      // SAVE JWT
      // =================================================

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      // =================================================
      // SAVE LOGIN USER
      // =================================================

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // =================================================
      // UPDATE STATE
      // =================================================

      setToken(
        data.access_token
      );

      setUser(
        data.user || null
      );

      return {
        success: true,

        user:
          data.user,
      };

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return {
        success: false,

        error:
          error.message ||
          "Login failed",
      };
    }
  };

  // =====================================================
  // AUTHENTICATED API REQUEST
  // =====================================================

  const apiRequest = async (
    endpoint,
    options = {}
  ) => {
    const currentToken =
      localStorage.getItem(
        "access_token"
      );

    if (!currentToken) {
      throw new Error(
        "No authentication token found"
      );
    }

    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,

        headers: {
          ...(options.body
            ? {
                "Content-Type":
                  "application/json",
              }
            : {}),

          ...(options.headers || {}),

          Authorization:
            `Bearer ${currentToken}`,
        },
      }
    );

    // =================================================
    // TOKEN EXPIRED / INVALID
    // =================================================

    if (
      response.status === 401 ||
      response.status === 403
    ) {
      logout();

      throw new Error(
        "Your session has expired. Please login again."
      );
    }

    return response;
  };

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = {
    user,

    token,

    loading,

    isAuthenticated:
      Boolean(token),

    login,

    logout,

    apiRequest,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =======================================================
// useAuth HOOK
// =======================================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}