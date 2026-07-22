import React, { useState, useEffect } from "react";
import { Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
// നിങ്ങളുടെ ബിൽഡ് പാത്ത് അനുസരിച്ച് ഈ relative path ശരിയാണെന്ന് ഉറപ്പാക്കുക
import { BASE_URL } from "../../Redux/service/baseUrl";

function Complaints() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  useEffect(() => {
    // SessionStorage അല്ലെങ്കിൽ LocalStorage-ൽ നിന്ന് user വിവരങ്ങൾ എടുക്കുന്നു
    const storedUser = JSON.parse(sessionStorage.getItem("user")) || JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUserData({
        userName: storedUser.userName || storedUser.name || "User",
        userEmail: storedUser.userEmail || storedUser.email || "",
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData || !userData.userEmail) {
      toast.error("Please login to submit a complaint");
      return;
    }

    if (!formData.subject || !formData.message.trim()) {
      toast.warning("Please fill in all fields");
      return;
    }

    setLoading(true);

    const complaintPayload = {
      userName: userData.userName,
      userEmail: userData.userEmail,
      subject: formData.subject,
      message: formData.message,
    };

    // Session-ൽ നിന്ന് Token എടുക്കുന്നു (Backend Auth Middleware ഉണ്ടെങ്കിൽ ആവശ്യമാണ്)
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/complaints/add`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(complaintPayload),
      });

      const data = await response.json();

      if (response.ok && (data.success || response.status === 200 || response.status === 201)) {
        setLoading(false);
        setSubmitted(true);
        // Form ഫീൽഡുകൾ ക്ലിയർ ചെയ്യുന്നു
        setFormData({ subject: "", message: "" });
        toast.success("Your complaint has been sent to the admin");
      } else {
        throw new Error(data.message || "Failed to submit complaint");
      }
    } catch (error) {
      setLoading(false);
      console.error("Submission Error:", error.message);
      toast.error(error.message || "Failed to connect to backend server");
    }
  };

  // Complaint അയച്ചതിന് ശേഷമുള്ള Success Screen
  if (submitted) {
    return (
      <div className="container py-5 mt-5 text-center">
        <div className="card border-0 shadow-sm p-5 mx-auto" style={{ maxWidth: "500px", borderRadius: "20px" }}>
          <CheckCircle2 size={60} className="text-success mx-auto mb-4" />
          <h2 className="fw-bold">Thank You!</h2>
          <p className="text-muted">Your complaint has been successfully registered.</p>
          <button
            className="btn btn-success px-4 py-2 mt-3 rounded-pill fw-bold"
            onClick={() => {
              setFormData({ subject: "", message: "" });
              setSubmitted(false);
            }}
          >
            Submit Another Complaint
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-4 text-start">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card border-0 shadow-lg p-4 p-md-5" style={{ borderRadius: "25px" }}>
            <div className="text-center mb-4">
              <h2 className="fw-bold text-dark">Submit a Complaint</h2>
              <p className="text-muted small">Tell us what's wrong. We're here to help.</p>
            </div>

            {!userData && (
              <div className="alert alert-warning d-flex align-items-center gap-2 border-0 small py-2 rounded-3 mb-4">
                <AlertCircle size={18} /> Please login to identify your account.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label small fw-bold">Full Name</label>
                <input
                  type="text"
                  className="form-control bg-light border-0 py-2"
                  value={userData?.userName || ""}
                  readOnly
                  disabled
                  placeholder="Login to see your name"
                />
              </div>

              {/* Email Address */}
              <div className="mb-3">
                <label className="form-label small fw-bold">Email Address</label>
                <input
                  type="email"
                  className="form-control bg-light border-0 py-2"
                  value={userData?.userEmail || ""}
                  readOnly
                  disabled
                  placeholder="Login to see your email"
                />
              </div>

              {/* Subject */}
              <div className="mb-3">
                <label className="form-label small fw-bold">Subject</label>
                <select
                  className="form-select border-light-subtle py-2 shadow-none"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="">Choose a reason...</option>
                  <option value="Delivery Issue">Delivery Issue</option>
                  <option value="Product Quality">Product Quality</option>
                  <option value="Payment Problem">Payment Problem</option>
                  <option value="Seller Behavior">Seller Behavior</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="form-label small fw-bold">Message</label>
                <textarea
                  className="form-control border-light-subtle shadow-none"
                  rows="4"
                  placeholder="Describe your issue in detail..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-success w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm rounded-3"
                disabled={loading || !userData}
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={18} /> Submit Complaint
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Complaints;
