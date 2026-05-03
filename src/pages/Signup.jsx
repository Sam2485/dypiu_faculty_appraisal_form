import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SCHOOL_CONFIG, APP_INFO } from "../constants/formConfig";
import { supabase } from "../services/supabase";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty",
    employeeId: "",
    designation: "Assistant Professor",
    department: "",
    school: "",
    qualification: "",
    experience: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.employeeId) {
      setError("Please fill in all required fields (Name, Email, Password, Employee ID).");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role,
            employeeId: formData.employeeId,
            designation: formData.designation,
            department: formData.department,
            school: formData.school,
            qualification: formData.qualification,
            experience: formData.experience,
            phone: formData.phone,
          }
        }
      });

      if (authError) throw authError;

      // Update localStorage so the Profile page can load dynamic info
      localStorage.setItem("supabaseToken", data?.session?.access_token || "dummy_token");
      localStorage.setItem("role", formData.role);
      localStorage.setItem("username", formData.email.trim().toLowerCase());
      localStorage.setItem("name", formData.name);
      localStorage.setItem("department", formData.department);
      localStorage.setItem("school", formData.school);
      localStorage.setItem("employeeId", formData.employeeId);
      localStorage.setItem("designation", formData.designation);
      localStorage.setItem("qualification", formData.qualification);
      localStorage.setItem("experience", formData.experience);
      localStorage.setItem("phone", formData.phone);
      
      const hasHod = formData.school ? (SCHOOL_CONFIG[formData.school]?.hasHod !== false) : true;
      localStorage.setItem("hasHod", hasHod ? "true" : "false");

      navigate("/profile");

    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>

        {/* ── LEFT: Branding ── */}
        <div style={s.left}>
          <div style={s.logoBox}>
            <img src="/dypiu.jpeg" alt="University Logo" style={{ height: 60 }} />
          </div>
          <h2 style={s.heading}>{APP_INFO.UNIVERSITY_NAME}, {APP_INFO.UNIVERSITY_LOCATION}</h2>
          <p style={s.desc}>
            Join the {APP_INFO.PORTAL_NAME} platform. Create your account to submit and manage your appraisals efficiently.
          </p>
        </div>

        {/* ── RIGHT: Signup form ── */}
        <div style={s.right}>
          <div style={s.formWrap}>
            <h3 style={s.welcome}>Create Account</h3>
            <p style={s.sub}>Fill in your details to get started</p>

            {error && <div style={s.error}>{error}</div>}

            <form onSubmit={handleSignup} style={s.formGrid}>
              <div style={s.inputGroup}>
                <label style={s.label}>Full Name *</label>
                <input style={s.input} type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div style={s.inputGroup}>
                <label style={s.label}>Email Address *</label>
                <input style={s.input} type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div style={s.inputGroup}>
                <label style={s.label}>Password *</label>
                <input style={s.input} type="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div style={s.inputGroup}>
                <label style={s.label}>Employee ID *</label>
                <input style={s.input} type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
              </div>

              <div style={s.inputGroup}>
                <label style={s.label}>Role</label>
                <select style={s.input} name="role" value={formData.role} onChange={handleChange}>
                  <option value="faculty">Faculty</option>
                  <option value="hod">HOD</option>
                  <option value="dean">Dean</option>
                  <option value="director">Director</option>
                  <option value="vc">Vice Chancellor</option>
                </select>
              </div>
              
              <div style={s.inputGroup}>
                <label style={s.label}>School / Faculty</label>
                <input style={s.input} type="text" name="school" placeholder="e.g. School of Engineering" value={formData.school} onChange={handleChange} />
              </div>

              <div style={s.inputGroup}>
                <label style={s.label}>Department</label>
                <input style={s.input} type="text" name="department" placeholder="e.g. CSE" value={formData.department} onChange={handleChange} />
              </div>

              <div style={s.inputGroup}>
                <label style={s.label}>Designation</label>
                <input style={s.input} type="text" name="designation" placeholder="e.g. Assistant Professor" value={formData.designation} onChange={handleChange} />
              </div>

              <div style={s.inputGroup}>
                <label style={s.label}>Qualification</label>
                <input style={s.input} type="text" name="qualification" placeholder="e.g. Ph.D, M.Tech" value={formData.qualification} onChange={handleChange} />
              </div>

              <div style={s.inputGroup}>
                <label style={s.label}>Experience (Years)</label>
                <input style={s.input} type="text" name="experience" placeholder="e.g. 10 Years" value={formData.experience} onChange={handleChange} />
              </div>

              <div style={{ ...s.inputGroup, gridColumn: "1 / -1" }}>
                <label style={s.label}>Phone Number</label>
                <input style={s.input} type="text" name="phone" placeholder="e.g. +91 98765 43210" value={formData.phone} onChange={handleChange} />
              </div>

              <button
                type="submit"
                style={{ ...s.btn, opacity: loading ? 0.7 : 1, gridColumn: "1 / -1", marginTop: 10 }}
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up →"}
              </button>
            </form>

            <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "#94a3b8" }}>
              Already have an account? <Link to="/login" style={{ color: "#38bdf8", textDecoration: "none", fontWeight: 700 }}>Log in</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Styles ───
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
    background: "rgba(15, 23, 42, 0.94)",
    borderRadius: 14,
    display: "flex",
    width: "100%",
    maxWidth: 920,
    overflow: "hidden",
    boxShadow: "0 22px 56px rgba(15,23,42,0.28)",
  },
  left: {
    flex: 1,
    padding: "40px 36px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  logoBox: {
    background: "white",
    borderRadius: 6,
    padding: "10px 14px",
    display: "inline-block",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  heading: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.25,
    fontWeight: 800,
    letterSpacing: -0.5,
    fontFamily: "Georgia, serif",
  },
  desc: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 1.6,
  },
  right: {
    flex: 1.4,
    background: "#0f172a",
    padding: "40px 50px",
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  formWrap: {
    width: "100%",
    maxWidth: 440,
    margin: "0 auto",
  },
  welcome: {
    margin: 0,
    color: "white",
    fontSize: 26,
    fontWeight: 800,
    letterSpacing: -0.5,
  },
  sub: {
    margin: "4px 0 28px",
    color: "#94a3b8",
    fontSize: 14,
  },
  error: {
    background: "#7f1d1d",
    color: "#fecaca",
    padding: "10px 14px",
    borderRadius: 6,
    fontSize: 13,
    marginBottom: 20,
    border: "1px solid #991b1b",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px 16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    display: "block",
    color: "#cbd5e1",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    color: "white",
    outline: "none",
    transition: "border 0.2s, background 0.2s",
  },
  btn: {
    width: "100%",
    background: "linear-gradient(135deg, #0ea5e9, #3b82f6)",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "13px",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(14,165,233,0.3)",
    transition: "transform 0.1s, box-shadow 0.2s",
  },
};