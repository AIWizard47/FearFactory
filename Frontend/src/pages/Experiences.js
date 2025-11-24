import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getApiUrl, getCookie } from "@/App";
import { toast } from "sonner";

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const token = getCookie('access_token');
      const response = await fetch(getApiUrl('experiences'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch experiences');
      
      const data = await response.json();
      setExperiences(data.experiences || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

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
              <Link to="/dashboard" className="text-gray-300 hover:text-emerald-400 transition-colors" data-testid="nav-dashboard">Dashboard</Link>
              <Link to="/experiences" className="text-emerald-400 font-medium" data-testid="nav-experiences">Experiences</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold display-font mb-2">
            Your <span className="gradient-text">Experiences</span>
          </h1>
          <p className="text-gray-400">Track and manage your horror adventures</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your experiences...</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="glass-effect rounded-2xl p-12 border border-emerald-500/20 text-center">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold mb-2">No Experiences Yet</h3>
            <p className="text-gray-400 mb-6">Start your journey by booking your first horror experience</p>
            <Link to="/projects">
              <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all" data-testid="browse-btn">
                Browse Experiences
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="glass-effect rounded-xl p-6 border border-emerald-500/20 card-hover" data-testid={`experience-card-${index}`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{exp.name}</h3>
                  <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                    {exp.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">📅 {exp.date} • {exp.time}</p>
                <p className="text-sm text-emerald-400">Difficulty: {exp.difficulty}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Experiences;
