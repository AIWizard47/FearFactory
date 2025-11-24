import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getApiUrl, setCookie, getCookie } from "@/App";
import { toast } from "sonner";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (getCookie('access_token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? 'login' : 'signup';
      const body = isLogin 
        ? { username: formData.username, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Operation failed');
      }

      if (isLogin) {
        // Store tokens
        setCookie('access_token', data.access, 1);
        setCookie('refresh_token', data.refresh, 7);
        
        toast.success("Login successful! Welcome back.");
        navigate('/dashboard');
      } else {
        toast.success("Signup successful! You can now log in.");
        setIsLogin(true);
        setFormData({ username: "", email: "", password: "" });
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <span className="text-2xl" role="img" aria-label="skull">💀</span>
          </div>
          <span className="text-3xl font-bold display-font gradient-text">FearFactory</span>
        </Link>

        {/* Form Container */}
        <div className="glass-effect rounded-2xl p-8 border border-emerald-500/20">
          {/* Tabs */}
          <div className="flex mb-8 border-b border-zinc-800">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-4 text-center font-semibold transition-all ${
                isLogin
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              data-testid="login-tab"
            >
              LOGIN
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-4 text-center font-semibold transition-all ${
                !isLogin
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              data-testid="signup-tab"
            >
              SIGN UP
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="username">USERNAME</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                data-testid="username-input"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="email">EMAIL</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                  data-testid="email-input"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="password">PASSWORD</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                required
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                data-testid="password-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="submit-btn"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                isLogin ? 'ENTER FEARFACTORY' : 'JOIN FEARFACTORY'
              )}
            </button>

            {isLogin && (
              <div className="text-center">
                <a href="#" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  Forgot your password?
                </a>
              </div>
            )}
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            By continuing, you agree to face your deepest fears
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
