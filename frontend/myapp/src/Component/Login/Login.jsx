import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../Redux/AuthSlice';

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { redirectHome } = useSelector((s) => s.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const validate = () => {
    let errors = {};
    if (!user.email) errors.email = "Email is required";
    if (!user.password) errors.password = "Password is required";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      dispatch(login(user));
    }
  };

  useEffect(() => {
    if (redirectHome) {
      navigate(redirectHome);
    }
  }, [navigate, redirectHome]);

  return (
    <div className="login-page bg-light py-5 mt-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10">
            <div className="card border-0 shadow-lg overflow-hidden">
              <div className="row g-0">
                
                {/* Left Side: Form Section */}
                <div className="col-lg-6 p-4 p-md-5 bg-white">
                  <div className="mb-4 text-center text-lg-start">
                    <h3 className="fw-bold text-dark">Welcome Back</h3>
                    <p className="text-muted small">Please enter your details to login.</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-envelope text-primary"></i>
                        </span>
                        <input 
                          type="email" 
                          name="email"
                          className={`form-control bg-light border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                          placeholder="name@example.com"
                          value={user.email}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.email && <small className="text-danger small">{errors.email}</small>}
                    </div>

                    {/* Password Input */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <label className="form-label fw-semibold small">Password</label>
                        <a href="#!" className="text-primary small text-decoration-none">Forgot?</a>
                      </div>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-lock text-primary"></i>
                        </span>
                        <input 
                          type="password" 
                          name="password"
                          className={`form-control bg-light border-start-0 ${errors.password ? 'is-invalid' : ''}`}
                          placeholder="••••••••"
                          value={user.password}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.password && <small className="text-danger small">{errors.password}</small>}
                    </div>

                    {/* Remember Me */}
                    <div className="mb-4 form-check">
                      <input type="checkbox" className="form-check-input" id="remember" />
                      <label className="form-check-label small text-muted" htmlFor="remember">Remember me</label>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm rounded-pill mb-3">
                      Login to Account
                    </button>

                    {/* Mobile Only: Link to Register */}
                    <div className="text-center d-lg-none">
                      <p className="small text-muted">New here? <Link to="/register" className="text-primary fw-bold">Create account</Link></p>
                    </div>
                  </form>
                </div>

                {/* Right Side: Visual/Branding Section */}
                <div className="col-lg-6 d-none d-lg-block bg-primary text-white p-5 text-center d-flex flex-column justify-content-center align-items-center">
                  <div className="mb-4">
                    <i className="bi bi-shield-check" style={{ fontSize: "4rem" }}></i>
                  </div>
                  <h2 className="fw-bold mb-3">DocBook Secure</h2>
                  <p className="px-4">Access your dashboard to manage appointments and consult with doctors securely.</p>
                  <div className="mt-4">
                    <p className="mb-2">Don't have an account?</p>
                    <Link to="/register" className="btn btn-outline-light rounded-pill px-4">Register Now</Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}