import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail 
} from "../firebase/config";
import "../AuthForm.css";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/category"); // Redirect after successful login
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // You can add user profile creation here if needed
        navigate("/category");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="auth-container">
        <h2>Reset Password</h2>
        
        {resetEmailSent ? (
          <>
            <p className="success-message">
              Password reset email sent to <strong>{email}</strong>. 
              Please check your inbox.
            </p>
            <button 
              onClick={() => {
                setShowForgotPassword(false);
                setResetEmailSent(false);
              }}
              className="auth-button"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <p>Enter your email to receive a password reset link</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleForgotPassword();
            }}>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <button 
              onClick={() => setShowForgotPassword(false)}
              className="text-button"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      
      <form onSubmit={handleAuthSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          {loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
        </button>
      </form>
      
      {error && <p className="error-message">{error}</p>}
      
      <div className="auth-actions">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-button"
        >
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
        </button>
        
        {isLogin && (
          <button 
            onClick={() => setShowForgotPassword(true)}
            className="text-button"
          >
            Forgot Password?
          </button>
        )}
      </div>
    </div>
  );
}

export default AuthPage;