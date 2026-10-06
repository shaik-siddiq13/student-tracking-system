import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;


// =====================================================
// GET SAVED USER
// =====================================================

function getSavedUser() {
  try {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);

  } catch (error) {
    console.error(
      "Unable to parse saved user:",
      error
    );

    localStorage.removeItem("user");

    return null;
  }
}


// =====================================================
// AUTH PROVIDER
// =====================================================

export function AuthProvider({ children }) {

  const [user, setUser] = useState(
    () => getSavedUser()
  );

  const [token, setToken] = useState(
    () =>
      localStorage.getItem("access_token")
  );

  const [loading, setLoading] = useState(true);


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "user"
    );

    setToken(null);
    setUser(null);
  };


  // =====================================================
  // LOAD AUTHENTICATED USER
  // =====================================================

  useEffect(() => {

    let mounted = true;

    const loadUser = async () => {

      const savedToken =
        localStorage.getItem(
          "access_token"
        );

      const savedUser =
        getSavedUser();


      // =================================================
      // NO TOKEN
      // =================================================

      if (!savedToken) {

        if (mounted) {

          setToken(null);
          setUser(null);
          setLoading(false);
        }

        return;
      }


      // =================================================
      // RESTORE SAVED USER IMMEDIATELY
      // =================================================

      if (mounted) {

        setToken(savedToken);

        if (savedUser) {
          setUser(savedUser);
        }
      }


      try {

        // =================================================
        // VERIFY TOKEN
        // =================================================

        const response =
          await fetch(
            `${API_URL}/me`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${savedToken}`,
              },
            }
          );


        // =================================================
        // INVALID TOKEN
        // =================================================

        if (
          response.status === 401 ||
          response.status === 403
        ) {

          if (mounted) {
            logout();
          }

          return;
        }


        // =================================================
        // SERVER ERROR
        // =================================================

        if (!response.ok) {

          throw new Error(
            `Authentication request failed: ${response.status}`
          );
        }


        // =================================================
        // READ /me RESPONSE
        // =================================================

        const meData =
          await response.json();

        console.log(
          "Authenticated user response:",
          meData
        );


        // =================================================
        // SUPPORT BOTH RESPONSE FORMATS
        //
        // Format 1:
        // {
        //   "user": {
        //     "user_id": 1,
        //     "username": "siddiq",
        //     "role": "STUDENT"
        //   }
        // }
        //
        // Format 2:
        // {
        //   "user_id": 1,
        //   "username": "siddiq",
        //   "role": "STUDENT"
        // }
        // =================================================

        const authenticatedUser =
          meData?.user || meData;


        console.log(
          "FINAL AUTH USER:",
          authenticatedUser
        );


        // =================================================
        // VALIDATE USER
        // =================================================

        if (
          !authenticatedUser ||
          typeof authenticatedUser !== "object"
        ) {

          throw new Error(
            "User information not found"
          );
        }


        if (
          authenticatedUser.user_id ===
            undefined ||
          authenticatedUser.user_id ===
            null
        ) {

          throw new Error(
            "User ID not found"
          );
        }


        if (
          authenticatedUser.role ===
            undefined ||
          authenticatedUser.role ===
            null
        ) {

          throw new Error(
            "User role not found"
          );
        }


        // =================================================
        // BUILD CURRENT USER
        // =================================================

        let currentUser = {
          ...authenticatedUser,
        };


        // =================================================
        // STUDENT
        // =================================================

        if (
          authenticatedUser.role ===
          "STUDENT"
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


          // -----------------------------------------------
          // INVALID TOKEN
          // -----------------------------------------------

          if (
            studentResponse.status === 401 ||
            studentResponse.status === 403
          ) {

            if (mounted) {
              logout();
            }

            return;
          }


          // -----------------------------------------------
          // SERVER ERROR
          // -----------------------------------------------

          if (!studentResponse.ok) {

            throw new Error(
              `Unable to load student information: ${studentResponse.status}`
            );
          }


          // -----------------------------------------------
          // READ STUDENT RESPONSE
          // -----------------------------------------------

          const studentData =
            await studentResponse.json();

          console.log(
            "Student response:",
            studentData
          );


          // =================================================
          // SUPPORT BOTH STUDENT FORMATS
          // =================================================

          const student =
            studentData?.student ||
            studentData;


          // =================================================
          // VALIDATE STUDENT
          // =================================================

          if (
            !student ||
            typeof student !== "object"
          ) {

            throw new Error(
              "Student information not found"
            );
          }


          if (
            student.student_id ===
              undefined ||
            student.student_id ===
              null
          ) {

            throw new Error(
              "Student ID not found"
            );
          }


          // =================================================
          // MERGE STUDENT INFORMATION
          // =================================================

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
        // ADMIN
        // =================================================

        if (
          authenticatedUser.role ===
          "ADMIN"
        ) {

          currentUser = {
            ...authenticatedUser,
          };
        }


        // =================================================
        // SAVE FINAL USER
        // =================================================

        if (mounted) {

          setUser(currentUser);

          setToken(savedToken);

          localStorage.setItem(
            "user",
            JSON.stringify(
              currentUser
            )
          );
        }


      } catch (error) {

        console.error(
          "Authentication error:",
          error
        );


        // =================================================
        // KEEP SAVED SESSION
        // =================================================

        if (mounted) {

          if (savedUser) {

            setUser(savedUser);

          } else {

            setUser(null);
          }

          setToken(savedToken);
        }


      } finally {

        if (mounted) {
          setLoading(false);
        }
      }
    };


    loadUser();


    return () => {
      mounted = false;
    };

  }, []);


  // =====================================================
  // LOGIN
  // =====================================================

  const login = async (
    username,
    password
  ) => {

    try {

      const response =
        await fetch(
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
      // SAVE TOKEN
      // =================================================

      localStorage.setItem(
        "access_token",
        data.access_token
      );


      // =================================================
      // GET USER
      // =================================================

      const loginUser =
        data?.user || null;


      if (loginUser) {

        localStorage.setItem(
          "user",
          JSON.stringify(
            loginUser
          )
        );
      }


      // =================================================
      // UPDATE STATE
      // =================================================

      setToken(
        data.access_token
      );

      setUser(
        loginUser
      );


      return {

        success: true,

        user: loginUser,
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


    // =================================================
    // NO TOKEN
    // =================================================

    if (!currentToken) {

      throw new Error(
        "No authentication token found"
      );
    }


    const response =
      await fetch(
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
    // INVALID TOKEN
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

    <AuthContext.Provider
      value={value}
    >

      {children}

    </AuthContext.Provider>
  );
}


// =====================================================
// useAuth
// =====================================================

export function useAuth() {

  const context =
    useContext(
      AuthContext
    );


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }


  return context;
}
