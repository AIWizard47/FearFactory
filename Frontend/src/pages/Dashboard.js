import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiUrl, getCookie, deleteCookie } from "@/App";
import { toast } from "sonner";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('experiences');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = getCookie('access_token');
      const response = await fetch(getApiUrl('profile'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <span className="text-2xl" role="img" aria-label="skull">💀</span>
              </div>
              <span className="text-2xl font-bold display-font gradient-text">FearFactory</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-emerald-400 font-medium" data-testid="nav-dashboard">Dashboard</Link>
              <Link to="/experiences" className="text-gray-300 hover:text-emerald-400 transition-colors" data-testid="nav-experiences">Experiences</Link>
              <Link to="/projects" className="text-gray-300 hover:text-emerald-400 transition-colors" data-testid="nav-projects">Projects</Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
                  data-testid="profile-menu-btn"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block text-gray-300">{user?.username}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 glass-effect rounded-xl border border-emerald-500/20 shadow-lg overflow-hidden" data-testid="profile-dropdown">
                    <div className="p-4 border-b border-zinc-800 bg-gradient-to-r from-emerald-900/30 to-transparent">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {user?.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold">{user?.username}</p>
                          <p className="text-sm text-emerald-400">{user?.membership}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <button className="w-full px-4 py-2 text-left hover:bg-zinc-800 transition-colors flex items-center space-x-2" data-testid="menu-profile">
                        <span>👤</span>
                        <span>My Profile</span>
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-zinc-800 transition-colors flex items-center space-x-2" data-testid="menu-settings">
                        <span>⚙️</span>
                        <span>Settings</span>
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-zinc-800 transition-colors flex items-center space-x-2" data-testid="menu-help">
                        <span>❓</span>
                        <span>Help Center</span>
                      </button>
                      <div className="border-t border-zinc-800 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left hover:bg-zinc-800 transition-colors flex items-center space-x-2 text-red-400"
                        data-testid="menu-logout"
                      >
                        <span>🚪</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-900/30 via-emerald-800/20 to-emerald-900/30 rounded-2xl p-8 mb-8 border border-emerald-500/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, <span className="gradient-text">{user?.username}</span>!
              </h2>
              <p className="text-gray-400">Ready to explore new experiences? Your fear level: {user?.fear_level}</p>
            </div>
            <Link to="/projects">
              <button className="mt-4 md:mt-0 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all" data-testid="book-experience-btn">
                Book New Experience
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Fear Level", value: user?.fear_level || "Beginner", icon: "🎯" },
            { label: "Membership", value: user?.membership || "Free Member", icon: "👑" },
            { label: "Experiences", value: "0", icon: "🎭" }
          ].map((stat, index) => (
            <div key={index} className="glass-effect rounded-xl p-6 border border-emerald-500/20" data-testid={`stat-card-${index}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-emerald-400">{stat.value}</p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs and Content */}
        <div className="glass-effect rounded-2xl p-6 border border-emerald-500/20">
          {/* Tabs */}
          <div className="flex border-b border-zinc-800 mb-6">
            {['experiences', 'achievements', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
                data-testid={`tab-${tab}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === 'experiences' && (
              <div className="text-center py-12" data-testid="experiences-empty">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-xl font-bold mb-2">No Experiences Yet</h3>
                <p className="text-gray-400 mb-6">Start your journey by booking your first horror experience</p>
                <Link to="/projects">
                  <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all" data-testid="browse-experiences-btn">
                    Browse Experiences
                  </button>
                </Link>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="text-center py-12" data-testid="achievements-empty">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-bold mb-2">No Achievements Yet</h3>
                <p className="text-gray-400">Complete experiences to unlock achievements</p>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="text-center py-12" data-testid="activity-empty">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">No Activity Yet</h3>
                <p className="text-gray-400">Your recent activity will appear here</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
