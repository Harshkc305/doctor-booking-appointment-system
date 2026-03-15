import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom"; // Link use karein for better navigation
import { register } from "../../Redux/AuthSlice";

export default function Register() {
  const [user, setUser] = useState({
    name: "", email: "", password: "", phone: "",
    age: "", gender: "", address: "", image: null
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { redirectlogin } = useSelector((s) => s.auth);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setUser({ ...user, image: files[0] });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const validate = () => {
    let errors = {};
    if (!user.name) errors.name = "Full name is required";
    if (!user.email) errors.email = "Valid email is required";
    if (!user.phone) errors.phone = "Phone number is required";
    if (!user.password) errors.password = "Password must be at least 6 characters";
    if (!user.age) errors.age = "Please enter your age";
    if (!user.gender) errors.gender = "Gender selection is required";
    if (!user.address) errors.address = "Residential address is required";
    if (!user.image) errors.image = "Profile picture is required";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      Object.keys(user).forEach(key => formData.append(key, user[key]));
      dispatch(register(formData));
    }
  };

  useEffect(() => {
    if (redirectlogin) navigate(redirectlogin);
  }, [navigate, redirectlogin]);

  return (
    <div className="register-page bg-light py-5 mt-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="card border-0 shadow-lg overflow-hidden">
              <div className="row g-0">
                {/* Left Side: Visual/Branding Section */}
                <div className="col-lg-5 d-none d-lg-block bg-primary text-white p-5 text-center d-flex flex-column justify-content-center">
                  <div className="mb-4">
                    <i className="bi bi-heart-pulse-fill" style={{ fontSize: "4rem" }}></i>
                  </div>
                  <h2 className="fw-bold mb-3">Join DocBook</h2>
                  <p className="lead">Create an account to book appointments, manage your health records, and connect with top specialists.</p>
                  <div className="mt-4">
                    <p>Already have an account?</p>
                    <Link to="/login" className="btn btn-outline-light rounded-pill px-4">Login Here</Link>
                  </div>
                </div>

                {/* Right Side: Form Section */}
                <div className="col-lg-7 p-4 p-md-5 bg-white">
                  <div className="text-center text-lg-start mb-4">
                    <h3 className="fw-bold text-dark">Patient Registration</h3>
                    <p className="text-muted small">Please fill in your details correctly to register.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="row g-3">
                    {/* Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><i className="bi bi-person text-primary"></i></span>
                        <input type="text" className={`form-control bg-light border-start-0 ${errors.name ? 'is-invalid' : ''}`} name="name" placeholder="John Doe" value={user.name} onChange={handleChange} />
                      </div>
                      {errors.name && <div className="invalid-feedback d-block small">{errors.name}</div>}
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope text-primary"></i></span>
                        <input type="email" className={`form-control bg-light border-start-0 ${errors.email ? 'is-invalid' : ''}`} name="email" placeholder="name@example.com" value={user.email} onChange={handleChange} />
                      </div>
                      {errors.email && <div className="invalid-feedback d-block small">{errors.email}</div>}
                    </div>

                    {/* Phone & Age */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Phone Number</label>
                      <input type="text" className="form-control bg-light" name="phone" placeholder="+1 234..." value={user.phone} onChange={handleChange} />
                      {errors.phone && <small className="text-danger small">{errors.phone}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Age</label>
                      <input type="number" className="form-control bg-light" name="age" value={user.age} onChange={handleChange} />
                      {errors.age && <small className="text-danger small">{errors.age}</small>}
                    </div>

                    {/* Gender & Image */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Gender</label>
                      <select className="form-select bg-light" name="gender" value={user.gender} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && <small className="text-danger small">{errors.gender}</small>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Profile Picture</label>
                      <input type="file" className="form-control bg-light" name="image" onChange={handleChange} />
                      {errors.image && <small className="text-danger small">{errors.image}</small>}
                    </div>

                    {/* Password */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Create Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock text-primary"></i></span>
                        <input type="password" className="form-control bg-light border-start-0" name="password" placeholder="••••••••" value={user.password} onChange={handleChange} />
                      </div>
                      {errors.password && <small className="text-danger small">{errors.password}</small>}
                    </div>

                    {/* Address */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Full Address</label>
                      <textarea className="form-control bg-light" name="address" rows="2" placeholder="Street, City, Zip" value={user.address} onChange={handleChange}></textarea>
                      {errors.address && <small className="text-danger small">{errors.address}</small>}
                    </div>

                    <div className="col-12 mt-4">
                      <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
                        Create Account
                      </button>
                    </div>

                    <div className="col-12 text-center d-lg-none mt-3">
                      <p className="small text-muted">Already have an account? <Link to="/login" className="text-primary fw-bold">Login</Link></p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}