import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  provider
} from "../lib/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("Google login failed", error);
      alert("Google login failed");
    }
  };

  const loginWithEmail = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert("Please verify your email before signing in.");
        return;
      }

      alert("Login successful");
      navigate("/");
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        alert("Incorrect password.");
      } else if (error.code === "auth/user-not-found") {
        alert("No user found with this email.");
      } else {
        alert("Login failed: " + error.message);
      }
    }
  };

  const registerUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      alert("Account created. Check your email to verify before logging in.");
      setIsRegistering(false);
    } catch (error: any) {
      alert("Registration failed: " + error.message);
    }
  };

  const sendResetEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Check your inbox.");
      setShowReset(false);
    } catch (error: any) {
      alert("Error sending reset email: " + error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-gradient-to-tr from-black via-red-950 to-black text-white">
      <h1 className="text-4xl font-bold mb-8 text-red-400">Welcome to ChatFold</h1>

      <div className="flex flex-col space-y-4 w-full max-w-sm px-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded bg-white text-black placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        {!showReset && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded bg-white text-black placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        )}

        {showReset ? (
          <button
            onClick={sendResetEmail}
            className="bg-red-500 text-white font-bold px-6 py-3 rounded shadow-lg hover:bg-red-600 transition"
          >
            Send Reset Link
          </button>
        ) : isRegistering ? (
          <button
            onClick={registerUser}
            className="bg-green-500 text-black font-bold px-6 py-3 rounded shadow-lg hover:bg-green-600 transition"
          >
            Register
          </button>
        ) : (
          <button
            onClick={loginWithEmail}
            className="bg-yellow-400 text-white font-bold px-6 py-3 rounded shadow-lg hover:bg-yellow-500 transition"
          >
            Sign in with Email
          </button>
        )}

        {!showReset && (
          <div className="text-right text-sm text-white/80">
            <button onClick={() => setShowReset(true)} className="underline">
              Forgot Password?
            </button>
          </div>
        )}

        <div className="text-center text-white/70">OR</div>

        <button
          onClick={loginWithGoogle}
          className="bg-white text-white font-bold px-6 py-3 rounded shadow-lg hover:bg-gray-100 transition"
        >
          Sign in with Google
        </button>

        <div className="text-center mt-4 text-white/80">
          {isRegistering ? (
            <p>
              Already have an account?{" "}
              <button onClick={() => setIsRegistering(false)} className="underline text-red-400">
                Login
              </button>
            </p>
          ) : (
            <p>
              Don’t have an account?{" "}
              <button onClick={() => setIsRegistering(true)} className="underline text-red-400">
                Register
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
