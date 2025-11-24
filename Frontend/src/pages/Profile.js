import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getApiUrl, getCookie } from "@/App";
import { toast } from "sonner";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    fetchUserProfile();
    setupScrollAnimations();
  }, []);

  const setupScrollAnimations = () => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.dataset.animateId]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate-id]').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  };

  const fetchUserProfile = async () => {
    try {
      const token = getCookie('access_token');
      const response = await fetch(getApiUrl('profile'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      
      // Mock additional data for showcase
      setUser({
        ...data,
        bio: "Horror enthusiast and thrill seeker. Exploring the darkest corners of digital experiences.",
        level: 15,
        xp: 3750,
        nextLevelXp: 5000,
        joinDate: "January 2024",
        location: "Digital Realm",
        achievements: [
          { id: 1, name: "First Blood", description: "Completed your first experience", icon: "🩸", rarity: "common", unlockedAt: "2024-01-15" },
          { id: 2, name: "Fearless Explorer", description: "Completed 10 horror experiences", icon: "🛡️", rarity: "rare", unlockedAt: "2024-02-20" },
          { id: 3, name: "Night Survivor", description: "Survived overnight challenge", icon: "🌙", rarity: "epic", unlockedAt: "2024-03-10" },
          { id: 4, name: "Scream Master", description: "Recorded the loudest scream", icon: "📢", rarity: "legendary", unlockedAt: "2024-03-25" },
          { id: 5, name: "Ghost Hunter", description: "Found 50 paranormal clues", icon: "👻", rarity: "rare", unlockedAt: "2024-04-05" },
          { id: 6, name: "Brave Heart", description: "Completed extreme difficulty", icon: "❤️", rarity: "epic", unlockedAt: "2024-04-20" },
        ],
        stats: {
          experiencesCompleted: 25,
          hoursSpent: 47,
          averageHeartRate: 142,
          scaresReceived: 183,
          friendsScared: 12,
          favoriteCategory: "Paranormal"
        },
        badges: [
          { name: "Early Adopter", color: "from-blue-500 to-blue-600" },
          { name: "Premium Member", color: "from-yellow-500 to-yellow-600" },
          { name: "Community Hero", color: "from-purple-500 to-purple-600" },
          { name: "Top Reviewer", color: "from-pink-500 to-pink-600" },
        ],
        recentActivity: [
          { action: "Completed", target: "Haunted Asylum Tour", time: "2 days ago", icon: "✅" },
          { action: "Unlocked", target: "Scream Master Achievement", time: "5 days ago", icon: "🏆" },
          { action: "Joined", target: "Midnight Horror Marathon", time: "1 week ago", icon: "🎭" },
        ]
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: "from-gray-500 to-gray-600",
      rare: "from-blue-500 to-blue-600",
      epic: "from-purple-500 to-purple-600",
      legendary: "from-yellow-500 to-orange-600"
    };
    return colors[rarity] || colors.common;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
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
                <span className="text-2xl">💀</span>
              </div>
              <span className="text-2xl font-bold display-font gradient-text">FearFactory</span>
            </Link>

            <Link to="/dashboard">
              <button className="px-6 py-2 rounded-lg border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 transition-all" data-testid="back-to-dashboard">
                ← Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Profile Banner */}
      <div className="relative h-64 bg-gradient-to-r from-emerald-900/30 via-emerald-800/20 to-emerald-900/30 border-b border-emerald-500/20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-end pb-8">
          {/* Profile Picture */}
          <div className="relative" data-animate-id="profile-pic" className={`transition-all duration-1000 ${visibleElements.has('profile-pic') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center border-4 border-zinc-900 shadow-2xl relative overflow-hidden">
              <span className="text-6xl font-bold text-white">{user?.username?.charAt(0).toUpperCase()}</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            {/* Level Badge */}
            <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-4 border-zinc-900 shadow-lg">
              <span className="text-sm font-bold text-zinc-900">{user?.level}</span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="ml-6 flex-1" data-animate-id="basic-info" className={`transition-all duration-1000 delay-100 ${visibleElements.has('basic-info') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              {user?.username}
              <span className="text-2xl">✨</span>
            </h1>
            <p className="text-gray-400 mb-2">{user?.bio}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span>📍</span>
                <span className="text-gray-400">{user?.location}</span>
              </span>
              <span className="flex items-center gap-1">
                <span>📅</span>
                <span className="text-gray-400">Joined {user?.joinDate}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                {user?.membership}
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-2" data-animate-id="badges" className={`transition-all duration-1000 delay-200 ${visibleElements.has('badges') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {user?.badges?.map((badge, idx) => (
              <div
                key={idx}
                className={`px-4 py-2 rounded-lg bg-gradient-to-r ${badge.color} text-white text-xs font-semibold shadow-lg transform hover:scale-105 transition-transform`}
                title={badge.name}
              >
                {badge.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-4 relative z-10" data-animate-id="xp-bar" className={`transition-all duration-1000 ${visibleElements.has('xp-bar') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="glass-effect rounded-xl p-4 border border-emerald-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Experience Points</span>
            <span className="text-sm font-semibold text-emerald-400">{user?.xp} / {user?.nextLevelXp} XP</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 relative overflow-hidden"
              style={{ width: `${(user?.xp / user?.nextLevelXp) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto" data-animate-id="tabs" className={`transition-all duration-1000 ${visibleElements.has('tabs') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {['overview', 'achievements', 'stats', 'activity'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeSection === section
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50'
                  : 'glass-effect border border-emerald-500/20 text-gray-400 hover:text-emerald-400'
              }`}
              data-testid={`tab-${section}`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4" data-animate-id="stats-grid">
                {[
                  { label: "Experiences", value: user?.stats.experiencesCompleted, icon: "🎭", color: "from-blue-500 to-blue-600" },
                  { label: "Hours Spent", value: user?.stats.hoursSpent, icon: "⏰", color: "from-purple-500 to-purple-600" },
                  { label: "Avg Heart Rate", value: user?.stats.averageHeartRate, icon: "💓", color: "from-red-500 to-red-600" },
                  { label: "Scares Received", value: user?.stats.scaresReceived, icon: "😱", color: "from-yellow-500 to-orange-600" },
                  { label: "Friends Scared", value: user?.stats.friendsScared, icon: "👥", color: "from-green-500 to-green-600" },
                  { label: "Favorite", value: user?.stats.favoriteCategory, icon: "⭐", color: "from-pink-500 to-pink-600" },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className={`glass-effect rounded-xl p-6 border border-emerald-500/20 transform hover:scale-105 transition-all duration-300`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                    data-testid={`stat-${idx}`}
                  >
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Top Achievements Preview */}
              <div className="glass-effect rounded-2xl p-6 border border-emerald-500/20" data-animate-id="top-achievements">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>🏆</span>
                  Top Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user?.achievements.slice(0, 4).map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} transform hover:scale-105 transition-all`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{achievement.name}</h4>
                          <p className="text-sm text-white/80 mt-1">{achievement.description}</p>
                          <p className="text-xs text-white/60 mt-2">Unlocked: {achievement.unlockedAt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity Sidebar */}
            <div className="space-y-6" data-animate-id="activity-sidebar">
              <div className="glass-effect rounded-2xl p-6 border border-emerald-500/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>📜</span>
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {user?.recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors">
                      <div className="text-2xl">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="text-emerald-400 font-semibold">{activity.action}</span>
                          {' '}
                          <span className="text-gray-300">{activity.target}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile Tags */}
              <div className="glass-effect rounded-2xl p-6 border border-emerald-500/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>🏷️</span>
                  Profile Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user?.profile_tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Section */}
        {activeSection === 'achievements' && (
          <div className="space-y-6" data-animate-id="achievements-section">
            <div className="glass-effect rounded-2xl p-6 border border-emerald-500/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  <span>🏆</span>
                  All Achievements
                </h2>
                <span className="text-gray-400">Unlocked {user?.achievements.length} / 50</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user?.achievements.map((achievement, idx) => (
                  <div
                    key={achievement.id}
                    className={`p-6 rounded-2xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} transform hover:scale-105 transition-all shadow-lg`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">{achievement.icon}</div>
                      <h4 className="text-xl font-bold text-white mb-2">{achievement.name}</h4>
                      <p className="text-sm text-white/80 mb-3">{achievement.description}</p>
                      <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase">
                        {achievement.rarity}
                      </div>
                      <p className="text-xs text-white/60 mt-3">Unlocked {achievement.unlockedAt}</p>
                    </div>
                  </div>
                ))}

                {/* Locked Achievements */}
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={`locked-${idx}`}
                    className="p-6 rounded-2xl bg-zinc-800/50 border-2 border-dashed border-zinc-700 text-center opacity-50 hover:opacity-70 transition-opacity"
                  >
                    <div className="text-6xl mb-4 filter grayscale">🔒</div>
                    <h4 className="text-xl font-bold text-gray-500 mb-2">Locked</h4>
                    <p className="text-sm text-gray-600">Complete more experiences to unlock</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        {activeSection === 'stats' && (
          <div className="space-y-6" data-animate-id="stats-section">
            <div className="glass-effect rounded-2xl p-8 border border-emerald-500/20">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <span>📊</span>
                Detailed Statistics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Fear Level Chart */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Fear Level Progress</h3>
                  <div className="space-y-4">
                    {[
                      { level: 'Beginner', percentage: 100, color: 'bg-gray-500' },
                      { level: 'Nervous', percentage: 100, color: 'bg-blue-500' },
                      { level: 'Brave', percentage: 100, color: 'bg-green-500' },
                      { level: 'Fearless', percentage: 75, color: 'bg-yellow-500' },
                      { level: 'Master', percentage: 20, color: 'bg-red-500' },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.level}</span>
                          <span>{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Breakdown */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Experience Categories</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Paranormal', count: 8, color: 'from-purple-500 to-purple-600' },
                      { name: 'Psychological', count: 6, color: 'from-blue-500 to-blue-600' },
                      { name: 'Gore', count: 5, color: 'from-red-500 to-red-600' },
                      { name: 'Supernatural', count: 4, color: 'from-green-500 to-green-600' },
                      { name: 'Mystery', count: 2, color: 'from-yellow-500 to-yellow-600' },
                    ].map((category, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-lg glass-effect border border-emerald-500/20">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-emerald-400">{category.count}</span>
                          <div className={`w-24 h-2 rounded-full bg-gradient-to-r ${category.color}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Section */}
        {activeSection === 'activity' && (
          <div className="glass-effect rounded-2xl p-8 border border-emerald-500/20" data-animate-id="activity-section">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <span>📈</span>
              Activity Timeline
            </h2>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-emerald-500" />

              <div className="space-y-8">
                {user?.recentActivity.map((activity, idx) => (
                  <div key={idx} className="relative flex items-start gap-6 ml-16">
                    {/* Timeline Dot */}
                    <div className="absolute -left-16 w-16 flex justify-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-lg shadow-lg shadow-emerald-500/50">
                        {activity.icon}
                      </div>
                    </div>

                    {/* Activity Card */}
                    <div className="flex-1 glass-effect rounded-xl p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold">
                          <span className="text-emerald-400">{activity.action}</span>
                          {' '}
                          {activity.target}
                        </h4>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                      <p className="text-gray-400 text-sm">You've made great progress on your horror journey!</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
