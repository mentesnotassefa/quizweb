import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserQuizHistory } from "../services/quizService"; // Import the new service function
import { auth } from "../firebase/config"; // Import auth to get the user ID
import { onAuthStateChanged } from "firebase/auth";

function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Listen for auth state changes and fetch history once user ID is available
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const history = await getUserQuizHistory(user.uid);
          setQuizHistory(history);
        } catch (error) {
          console.error("Failed to fetch quiz history:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // Redirect to home if no user is logged in
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const categories = [
    "Biology", "Chemistry", "General Knowledge", "History",
    "Mathematics", "Physics", "Social Science", "Science",
  ];

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredHistory = quizHistory.filter((quiz) =>
    quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="max-w-4xl mx-auto p-4 dark:bg-gray-900 text-center text-gray-900 dark:text-white">Loading history...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Quiz History & Topics</h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search quiz topics or history..."
          className="w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      {/* Available Categories */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Available Topics</h3>
        {filteredCategories.length > 0 ? (
          <ul className="space-y-2">
            {filteredCategories.map((cat, idx) => (
              <li key={idx} className="bg-gray-100 p-2 rounded dark:bg-gray-700 dark:text-gray-100">
                {cat}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No topics match your search. Try something like "Biology" or "History".
          </p>
        )}
      </div>

      {/* Quiz History */}
      <div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Your Quiz History</h3>
        {filteredHistory.length > 0 ? (
          <ul className="space-y-4">
            {filteredHistory.map((quiz) => (
              <li key={quiz.id} className="bg-white p-4 rounded-lg shadow dark:bg-gray-800 dark:text-gray-100">
                <p className="text-lg">
                  <strong>Category:</strong> {quiz.category}
                </p>
                <p className="text-lg">
                  <strong>Score:</strong> {quiz.score}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Date:</strong> {quiz.date}
                </p>
              </li>
            ))}
          </ul>
        ) : quizHistory.length > 0 ? (
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No history matches your search. Try a different keyword.
          </p>
        ) : (
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No quiz history yet. Take a quiz to see your results here!
          </p>
        )}
      </div>

      <Link
        to="/"
        className="mt-6 inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-900 dark:bg-gray-500 dark:hover:bg-gray-600"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default History;