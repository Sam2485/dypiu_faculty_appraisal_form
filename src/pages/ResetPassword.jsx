import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APP_INFO } from "../constants/formConfig";
import { supabase } from "../services/supabase";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ensureRecoverySession = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(exchangeError.message);
          setReady(false);
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setReady(true);
        return;
      }

      setError("This reset link is invalid or expired. Please request a new one.");
      setReady(false);
    };

    ensureRecoverySession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setReady(true);
        setError("");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setMessage("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setMessage("");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    setMessage("Password updated successfully. Redirecting to login...");

    setTimeout(() => navigate("/login", { replace: true }), 1200);
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.logoBox}>
          <img src="/dypiu.jpeg" alt="University Logo" style={{ height: 52 }} />
        </div>

        <h3 style={s.title}>Reset Password</h3>
        <p style={s.sub}>{APP_INFO.PORTAL_NAME}</p>

        {error && <div style={s.error}>{error}</div>}
        {message && <div style={s.success}>{message}</div>}

        <form onSubmit={handleUpdatePassword}>
          <label style={s.label}>New Password</label>
          <input
            style={s.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            disabled={!ready || loading}
          />

          <label style={s.label}>Confirm Password</label>
          <input
            style={s.input}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            disabled={!ready || loading}
          />

          <button style={{ ...s.btn, opacity: !ready || loading ? 0.7 : 1 }} disabled={!ready || loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div style={s.back}>
          <Link to="/login" style={s.link}>Back to login</Link>
        </div>
      </div>
    </div>
  );
}

const s = {
  wrap: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #dbeafe 0%, #e2e8f0 55%, #f8fafc 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  card: {
    width: "100%",
    maxWidth: 390,
    background: "rgba(15, 23, 42, 0.96)",
    borderRadius: 14,
    padding: "34px 34px 30px",
    boxShadow: "0 22px 56px rgba(15,23,42,0.28)",
  },
  logoBox: {
    background: "white",
    borderRadius: 6,
    padding: "9px 12px",
    display: "inline-block",
    marginBottom: 20,
  },
  title: {
    color: "#f1f5f9",
    margin: "0 0 4px",
    fontSize: 18,
  },
  sub: {
    color: "#64748b",
    margin: "0 0 22px",
    fontSize: 12,
  },
  label: {
    display: "block",
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 7,
    color: "#f1f5f9",
    marginBottom: 16,
    boxSizing: "border-box",
    outline: "none",
  },
  btn: {
    width: "100%",
    padding: "12px 14px",
    background: "#1a6fe0",
    color: "white",
    border: "none",
    borderRadius: 7,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  error: {
    background: "rgba(220,50,50,0.18)",
    border: "1px solid rgba(220,50,50,0.4)",
    color: "#fca5a5",
    padding: "9px 12px",
    borderRadius: 5,
    fontSize: 12,
    marginBottom: 14,
  },
  success: {
    background: "rgba(34,197,94,0.14)",
    border: "1px solid rgba(34,197,94,0.35)",
    color: "#86efac",
    padding: "9px 12px",
    borderRadius: 5,
    fontSize: 12,
    marginBottom: 14,
  },
  back: {
    marginTop: 18,
    textAlign: "center",
  },
  link: {
    color: "#38bdf8",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 13,
  },
};
