import { useMemo, useState } from "react";

function StudentQuestions() {
  // =====================================================
  // QUESTION DATA
  // =====================================================

  const questions = [
    // =====================================================
    // PYTHON
    // =====================================================

    {
      id: 1,
      category: "Python",
      difficulty: "Easy",
      question: "What is Python?",
      answer:
        "Python is a high-level, interpreted, general-purpose programming language. It is widely used in Data Engineering, Data Science, Web Development, Automation, and Machine Learning.",
    },
    {
      id: 2,
      category: "Python",
      difficulty: "Easy",
      question: "What is the difference between a list and a tuple?",
      answer:
        "A list is mutable, meaning its values can be changed after creation. A tuple is immutable, meaning its values cannot be changed after creation. Lists use square brackets [] and tuples use parentheses ().",
    },
    {
      id: 3,
      category: "Python",
      difficulty: "Medium",
      question: "What is a dictionary in Python?",
      answer:
        "A dictionary stores data in key-value pairs. It is mutable and allows fast lookup using keys. Example: {'name': 'Siddiq', 'role': 'Data Engineer'}.",
    },
    {
      id: 4,
      category: "Python",
      difficulty: "Medium",
      question: "What is the difference between shallow copy and deep copy?",
      answer:
        "A shallow copy creates a new outer object but keeps references to nested objects. A deep copy recursively creates copies of nested objects as well. Python provides copy.copy() for shallow copy and copy.deepcopy() for deep copy.",
    },
    {
      id: 5,
      category: "Python",
      difficulty: "Hard",
      question: "What is a generator in Python?",
      answer:
        "A generator is a function that produces values one at a time using the yield keyword instead of returning all values at once. Generators are memory efficient and are useful when processing large datasets.",
    },

    // =====================================================
    // SQL
    // =====================================================

    {
      id: 6,
      category: "SQL",
      difficulty: "Easy",
      question: "What is SQL?",
      answer:
        "SQL stands for Structured Query Language. It is used to store, retrieve, manipulate, and manage data in relational databases.",
    },
    {
      id: 7,
      category: "SQL",
      difficulty: "Easy",
      question: "What is the difference between WHERE and HAVING?",
      answer:
        "WHERE filters individual rows before GROUP BY and aggregation. HAVING filters grouped results after GROUP BY and aggregation.",
    },
    {
      id: 8,
      category: "SQL",
      difficulty: "Medium",
      question: "What is a JOIN?",
      answer:
        "A JOIN combines rows from two or more tables using a related column. Common JOIN types are INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.",
    },
    {
      id: 9,
      category: "SQL",
      difficulty: "Medium",
      question: "What is a window function?",
      answer:
        "A window function performs calculations across a set of related rows without grouping those rows into a single result row. Examples include ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), and LEAD().",
    },
    {
      id: 10,
      category: "SQL",
      difficulty: "Hard",
      question: "What is the difference between RANK(), DENSE_RANK(), and ROW_NUMBER()?",
      answer:
        "ROW_NUMBER() assigns a unique sequential number. RANK() gives the same rank to tied values and leaves gaps after ties. DENSE_RANK() gives the same rank to tied values but does not leave gaps.",
    },

    // =====================================================
    // PYSPARK
    // =====================================================

    {
      id: 11,
      category: "PySpark",
      difficulty: "Easy",
      question: "What is PySpark?",
      answer:
        "PySpark is the Python API for Apache Spark. It allows developers to process large datasets in a distributed environment using Python.",
    },
    {
      id: 12,
      category: "PySpark",
      difficulty: "Easy",
      question: "What is a DataFrame in PySpark?",
      answer:
        "A PySpark DataFrame is a distributed collection of data organized into named columns. It is similar to a table in a relational database or a pandas DataFrame.",
    },
    {
      id: 13,
      category: "PySpark",
      difficulty: "Medium",
      question: "What is the difference between transformation and action in Spark?",
      answer:
        "Transformations create a new DataFrame or RDD and are lazily evaluated. Examples include select(), filter(), and join(). Actions trigger Spark execution and return a result or write data. Examples include count(), collect(), and write operations.",
    },
    {
      id: 14,
      category: "PySpark",
      difficulty: "Medium",
      question: "What is lazy evaluation in Spark?",
      answer:
        "Spark does not immediately execute transformations. It builds a logical execution plan and executes that plan only when an action is called. This allows Spark to optimize the execution plan.",
    },
    {
      id: 15,
      category: "PySpark",
      difficulty: "Hard",
      question: "What is a broadcast join?",
      answer:
        "A broadcast join sends a small table to each executor so that Spark can join it with a large table without performing a large shuffle. It can significantly improve performance when one dataset is small enough to broadcast.",
    },

    // =====================================================
    // AWS
    // =====================================================

    {
      id: 16,
      category: "AWS",
      difficulty: "Easy",
      question: "What is Amazon S3?",
      answer:
        "Amazon S3 is an object storage service used to store files and data such as CSV, JSON, Parquet, images, backups, and logs. It is commonly used as a Data Lake storage layer.",
    },
    {
      id: 17,
      category: "AWS",
      difficulty: "Easy",
      question: "What is AWS Glue?",
      answer:
        "AWS Glue is a serverless data integration and ETL service. It can discover data using crawlers, store metadata in the Glue Data Catalog, and transform data using Glue ETL jobs.",
    },
    {
      id: 18,
      category: "AWS",
      difficulty: "Medium",
      question: "What is Amazon Athena?",
      answer:
        "Amazon Athena is a serverless interactive query service that allows users to query data directly in Amazon S3 using SQL. Athena commonly uses metadata from the AWS Glue Data Catalog.",
    },
    {
      id: 19,
      category: "AWS",
      difficulty: "Medium",
      question: "What is the difference between IAM Role and IAM Policy?",
      answer:
        "An IAM policy defines permissions such as what actions are allowed or denied on AWS resources. An IAM role is an identity that can be assumed by AWS services, users, or applications and has policies attached to it.",
    },
    {
      id: 20,
      category: "AWS",
      difficulty: "Hard",
      question: "What is AWS DMS?",
      answer:
        "AWS Database Migration Service is used to migrate and replicate data between databases and data stores. It can perform full-load migrations and ongoing change data capture depending on the configuration.",
    },

    // =====================================================
    // DATA ENGINEERING
    // =====================================================

    {
      id: 21,
      category: "Data Engineering",
      difficulty: "Easy",
      question: "What is Data Engineering?",
      answer:
        "Data Engineering focuses on designing, building, and maintaining systems that collect, process, transform, store, and deliver data for analytics and business use.",
    },
    {
      id: 22,
      category: "Data Engineering",
      difficulty: "Easy",
      question: "What is ETL?",
      answer:
        "ETL stands for Extract, Transform, Load. Data is extracted from source systems, transformed according to business rules, and then loaded into a target system such as a data warehouse or data lake.",
    },
    {
      id: 23,
      category: "Data Engineering",
      difficulty: "Medium",
      question: "What is ELT?",
      answer:
        "ELT stands for Extract, Load, Transform. Data is first extracted and loaded into a target storage or warehouse, and transformations are performed there. Modern cloud data platforms commonly use this approach.",
    },
    {
      id: 24,
      category: "Data Engineering",
      difficulty: "Medium",
      question: "What is a Data Lake?",
      answer:
        "A Data Lake is a centralized storage system that can store large volumes of structured, semi-structured, and unstructured data. Amazon S3 is commonly used as a Data Lake storage layer.",
    },
    {
      id: 25,
      category: "Data Engineering",
      difficulty: "Hard",
      question: "What is a medallion architecture?",
      answer:
        "Medallion architecture organizes data processing into layers, commonly Bronze, Silver, and Gold. Bronze contains raw data, Silver contains cleaned and transformed data, and Gold contains business-ready data.",
    },

    // =====================================================
    // MORE INTERVIEW QUESTIONS
    // =====================================================

    {
      id: 26,
      category: "SQL",
      difficulty: "Hard",
      question: "What is a CTE?",
      answer:
        "A Common Table Expression, or CTE, is a temporary named result set created using the WITH clause. It improves query readability and can be useful for breaking complex SQL logic into smaller steps.",
    },
    {
      id: 27,
      category: "Python",
      difficulty: "Hard",
      question: "What is exception handling in Python?",
      answer:
        "Exception handling allows a program to handle runtime errors without crashing unexpectedly. Python uses try, except, else, and finally blocks for exception handling.",
    },
    {
      id: 28,
      category: "PySpark",
      difficulty: "Hard",
      question: "What is a shuffle in Spark?",
      answer:
        "A shuffle occurs when Spark redistributes data across partitions, usually because data needs to be grouped or joined by a key. Shuffles can be expensive because they involve network and disk I/O.",
    },
    {
      id: 29,
      category: "AWS",
      difficulty: "Hard",
      question: "What is AWS Lambda?",
      answer:
        "AWS Lambda is a serverless compute service that runs code in response to events without requiring users to manage servers. It is commonly used for event-driven data processing.",
    },
    {
      id: 30,
      category: "Data Engineering",
      difficulty: "Hard",
      question: "What is SCD Type 2?",
      answer:
        "Slowly Changing Dimension Type 2 maintains historical versions of records. When an important attribute changes, the old record is retained and a new version is inserted with information such as effective dates or an active flag.",
    },
  ];

  // =====================================================
  // STATE
  // =====================================================

  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [
    "All",
    "Python",
    "SQL",
    "PySpark",
    "AWS",
    "Data Engineering",
  ];

  const difficulties = [
    "All",
    "Easy",
    "Medium",
    "Hard",
  ];

  // =====================================================
  // FILTER QUESTIONS
  // =====================================================

  const filteredQuestions = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return questions.filter((item) => {
      const matchesCategory =
        category === "All" ||
        item.category === category;

      const matchesDifficulty =
        difficulty === "All" ||
        item.difficulty === difficulty;

      const matchesSearch =
        !search ||
        item.question
          .toLowerCase()
          .includes(search) ||
        item.answer
          .toLowerCase()
          .includes(search) ||
        item.category
          .toLowerCase()
          .includes(search);

      return (
        matchesCategory &&
        matchesDifficulty &&
        matchesSearch
      );
    });
  }, [
    searchText,
    category,
    difficulty,
  ]);

  // =====================================================
  // TOGGLE ANSWER
  // =====================================================

  const toggleAnswer = (id) => {
    setExpandedQuestion((current) =>
      current === id ? null : id
    );
  };

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearchText("");
    setCategory("All");
    setDifficulty("All");
    setExpandedQuestion(null);
  };

  // =====================================================
  // STYLES
  // =====================================================

  const styles = {
    page: {
      padding: "30px",
      background: "#f8fafc",
      minHeight: "100vh",
    },

    header: {
      marginBottom: "25px",
    },

    title: {
      fontSize: "30px",
      fontWeight: "700",
      color: "#0f172a",
      margin: "0 0 8px 0",
    },

    subtitle: {
      fontSize: "15px",
      color: "#64748b",
      margin: 0,
    },

    filterCard: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "14px",
      padding: "20px",
      marginBottom: "25px",
      boxShadow:
        "0 2px 8px rgba(15, 23, 42, 0.04)",
    },

    filterGrid: {
      display: "grid",
      gridTemplateColumns:
        "minmax(250px, 2fr) minmax(180px, 1fr) minmax(180px, 1fr) auto",
      gap: "14px",
      alignItems: "end",
    },

    field: {
      display: "flex",
      flexDirection: "column",
      gap: "7px",
    },

    label: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#475569",
    },

    input: {
      width: "100%",
      boxSizing: "border-box",
      padding: "11px 13px",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      fontSize: "14px",
      outline: "none",
      background: "#ffffff",
    },

    select: {
      width: "100%",
      boxSizing: "border-box",
      padding: "11px 13px",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      fontSize: "14px",
      outline: "none",
      background: "#ffffff",
    },

    clearButton: {
      padding: "11px 16px",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      background: "#ffffff",
      color: "#334155",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      whiteSpace: "nowrap",
    },

    summary: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px",
      gap: "15px",
      flexWrap: "wrap",
    },

    resultCount: {
      fontSize: "15px",
      fontWeight: "600",
      color: "#334155",
    },

    categoryBadge: {
      display: "inline-block",
      padding: "5px 9px",
      borderRadius: "999px",
      background: "#eff6ff",
      color: "#1d4ed8",
      fontSize: "12px",
      fontWeight: "700",
    },

    questionCard: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "14px",
      marginBottom: "14px",
      overflow: "hidden",
      boxShadow:
        "0 2px 8px rgba(15, 23, 42, 0.04)",
    },

    questionHeader: {
      padding: "19px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "20px",
    },

    questionLeft: {
      flex: 1,
    },

    metaRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "10px",
      flexWrap: "wrap",
    },

    difficultyEasy: {
      display: "inline-block",
      padding: "5px 9px",
      borderRadius: "999px",
      background: "#ecfdf5",
      color: "#047857",
      fontSize: "12px",
      fontWeight: "700",
    },

    difficultyMedium: {
      display: "inline-block",
      padding: "5px 9px",
      borderRadius: "999px",
      background: "#fffbeb",
      color: "#b45309",
      fontSize: "12px",
      fontWeight: "700",
    },

    difficultyHard: {
      display: "inline-block",
      padding: "5px 9px",
      borderRadius: "999px",
      background: "#fef2f2",
      color: "#b91c1c",
      fontSize: "12px",
      fontWeight: "700",
    },

    questionNumber: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#94a3b8",
    },

    questionText: {
      margin: 0,
      fontSize: "17px",
      lineHeight: 1.5,
      fontWeight: "650",
      color: "#0f172a",
    },

    answerButton: {
      border: "1px solid #cbd5e1",
      background: "#ffffff",
      color: "#1e293b",
      padding: "9px 14px",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      whiteSpace: "nowrap",
    },

    answerSection: {
      borderTop: "1px solid #e2e8f0",
      padding: "18px 20px 20px",
      background: "#f8fafc",
    },

    answerTitle: {
      margin: "0 0 8px 0",
      fontSize: "13px",
      fontWeight: "700",
      color: "#475569",
    },

    answerText: {
      margin: 0,
      fontSize: "14px",
      lineHeight: 1.7,
      color: "#334155",
    },

    emptyState: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "14px",
      padding: "50px 20px",
      textAlign: "center",
    },

    emptyTitle: {
      margin: "0 0 8px 0",
      fontSize: "18px",
      fontWeight: "700",
      color: "#334155",
    },

    emptyText: {
      margin: 0,
      fontSize: "14px",
      color: "#64748b",
    },
  };

  // =====================================================
  // DIFFICULTY STYLE
  // =====================================================

  const getDifficultyStyle = (value) => {
    if (value === "Easy") {
      return styles.difficultyEasy;
    }

    if (value === "Medium") {
      return styles.difficultyMedium;
    }

    return styles.difficultyHard;
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div style={styles.page}>
      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>
        <h1 style={styles.title}>
          Interview Questions
        </h1>

        <p style={styles.subtitle}>
          Prepare for Data Engineering interviews
          with Python, SQL, PySpark, AWS and Data
          Engineering questions.
        </p>
      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div style={styles.filterCard}>
        <div style={styles.filterGrid}>
          <div style={styles.field}>
            <label style={styles.label}>
              Search Questions
            </label>

            <input
              type="text"
              placeholder="Search by question, topic or answer..."
              value={searchText}
              onChange={(event) =>
                setSearchText(
                  event.target.value
                )
              }
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Category
            </label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              style={styles.select}
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Difficulty
            </label>

            <select
              value={difficulty}
              onChange={(event) =>
                setDifficulty(
                  event.target.value
                )
              }
              style={styles.select}
            >
              {difficulties.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            style={styles.clearButton}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* =================================================
          RESULT SUMMARY
      ================================================= */}

      <div style={styles.summary}>
        <div style={styles.resultCount}>
          Showing {filteredQuestions.length} of{" "}
          {questions.length} questions
        </div>

        <div style={styles.categoryBadge}>
          {category === "All"
            ? "All Topics"
            : category}
        </div>
      </div>

      {/* =================================================
          QUESTIONS
      ================================================= */}

      {filteredQuestions.length === 0 ? (
        <div style={styles.emptyState}>
          <h3 style={styles.emptyTitle}>
            No Questions Found
          </h3>

          <p style={styles.emptyText}>
            Try changing your search text,
            category, or difficulty filter.
          </p>
        </div>
      ) : (
        filteredQuestions.map(
          (item, index) => {
            const isExpanded =
              expandedQuestion ===
              item.id;

            return (
              <div
                key={item.id}
                style={styles.questionCard}
              >
                <div
                  style={styles.questionHeader}
                >
                  <div
                    style={styles.questionLeft}
                  >
                    <div
                      style={styles.metaRow}
                    >
                      <span
                        style={
                          styles.categoryBadge
                        }
                      >
                        {item.category}
                      </span>

                      <span
                        style={getDifficultyStyle(
                          item.difficulty
                        )}
                      >
                        {item.difficulty}
                      </span>

                      <span
                        style={
                          styles.questionNumber
                        }
                      >
                        Question {index + 1}
                      </span>
                    </div>

                    <h2
                      style={styles.questionText}
                    >
                      {item.question}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toggleAnswer(item.id)
                    }
                    style={styles.answerButton}
                  >
                    {isExpanded
                      ? "Hide Answer"
                      : "View Answer"}
                  </button>
                </div>

                {isExpanded && (
                  <div
                    style={styles.answerSection}
                  >
                    <p
                      style={
                        styles.answerTitle
                      }
                    >
                      Answer
                    </p>

                    <p
                      style={styles.answerText}
                    >
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          }
        )
      )}
    </div>
  );
}

export default StudentQuestions;
