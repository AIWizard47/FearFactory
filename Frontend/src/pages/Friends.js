import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl, getCookie } from "@/App";
import { toast } from "sonner";
import { Search, UserPlus, Check, X, MessageCircle, Users, Filter, Loader, RefreshCw } from 'lucide-react';

const Friends = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observerRef = useRef(null);

  // Filter states
  const [filters, setFilters] = useState({
    fearlevel: '',
    tag: '',
    achievement: '',
    membership: ''
  });

  // Data states
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!loading) {
      setupScrollAnimations();
    }
  }, [loading]);

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

    setTimeout(() => {
      document.querySelectorAll('[data-animate-id]').forEach((el) => {
        observerRef.current?.observe(el);
      });
    }, 100);

    return () => observerRef.current?.disconnect();
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchFriendList(),
        fetchPendingRequests()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load friends data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendList = async () => {
    try {
      const token = getCookie('access_token');
      const response = await fetch(getApiUrl('friendsList'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch friends');
      
      const data = await response.json();
      setAllFriends(Array.isArray(data) ? data : data.results || data.friends || []);
    } catch (error) {
      console.error('Error fetching friend list:', error);
      toast.error('Failed to load friends list');
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const token = getCookie('access_token');
      const [receivedResponse, sentResponse] = await Promise.all([
        fetch(getApiUrl('friendsPendingReceive'), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(getApiUrl('friendsPendingSend'), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      ]);

      if (!receivedResponse.ok || !sentResponse.ok) {
        throw new Error('Failed to fetch pending requests');
      }

      const receivedData = await receivedResponse.json();
      const sentData = await sentResponse.json();

      setFriendRequests(Array.isArray(receivedData) ? receivedData : receivedData.results || receivedData.requests || []);
      setSentRequests(Array.isArray(sentData) ? sentData : sentData.results || sentData.requests || []);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      toast.error('Failed to load pending requests');
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim() && !hasActiveFilters()) {
      setActiveTab('all');
      return;
    }

    setSearchLoading(true);
    try {
      const token = getCookie('access_token');
      const params = new URLSearchParams();
      
      if (searchQuery.trim()) {
        params.append('q', searchQuery);
      }
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value.trim()) {
          params.append(key, value);
        }
      });

      const response = await fetch(`${getApiUrl('friendsSearch')}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      const results = Array.isArray(data) ? data : data.results || [];
      
      const enhancedResults = results.map(user => {
        const isFriend = allFriends.some(friend => friend.user?.id === user.id || friend.id === user.id);
        const hasSentRequest = sentRequests.some(req => req.to_user?.id === user.id || req.id === user.id);
        const hasReceivedRequest = friendRequests.some(req => req.from_user?.id === user.id || req.id === user.id);
        
        let status = 'not_friend';
        if (isFriend) status = 'friend';
        else if (hasSentRequest) status = 'request_sent';
        else if (hasReceivedRequest) status = 'request_received';

        return { ...user, status };
      });

      setSearchResults(enhancedResults);
      setActiveTab('search');
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search users');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      const token = getCookie('access_token');
      const response = await fetch(getApiUrl('friendsRequest'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to_user_id: userId }),
      });

      if (!response.ok) throw new Error('Failed to send friend request');

      setSearchResults(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, status: 'request_sent' } : user
        )
      );

      const newSentRequest = {
        id: Date.now(),
        to_user: searchResults.find(user => user.id === userId)
      };
      setSentRequests(prev => [...prev, newSentRequest]);

      toast.success('Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Failed to send friend request');
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const token = getCookie('access_token');
      const response = await fetch(getApiUrl('friendsAccept'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request_id: requestId }),
      });

      if (!response.ok) throw new Error('Failed to accept friend request');

      const acceptedRequest = friendRequests.find(req => req.id === requestId);
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      
      if (acceptedRequest) {
        const newFriend = {
          id: acceptedRequest.from_user?.id || acceptedRequest.id,
          user: acceptedRequest.from_user || { username: 'Unknown User' },
          fear_level: acceptedRequest.fear_level || 'Unknown',
          status: 'online'
        };
        setAllFriends(prev => [...prev, newFriend]);
      }

      toast.success('Friend request accepted!');
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Failed to accept friend request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const token = getCookie('access_token');
      const response = await fetch(getApiUrl('friendsReject'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request_id: requestId }),
      });

      if (!response.ok) throw new Error('Failed to reject friend request');

      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      toast.success('Friend request rejected');
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error('Failed to reject friend request');
    }
  };

  const handleSearch = () => {
    searchUsers();
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value.trim() !== '');
  };

  const clearFilters = () => {
    setFilters({
      fearlevel: '',
      tag: '',
      achievement: '',
      membership: ''
    });
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateAvatar = (username) => {
    const avatars = ['👻', '🎃', '⚔️', '🔪', '💀', '👹', '🕷️', '🩸', '🐺', '🧟', '🧛', '🔮'];
    const index = username?.length ? username.length % avatars.length : 0;
    return avatars[index];
  };

  const formatUserData = (user) => {
    const username = user.user?.username || user.from_user?.username || user.to_user?.username || user.username || 'Unknown User';
    const fearLevel = user.fear_level || 'Unknown';
    
    return {
      id: user.id || user.user?.id || user.from_user?.id,
      username,
      avatar: generateAvatar(username),
      fearLevel,
      mutualFriends: Math.floor(Math.random() * 10),
      status: user.status || 'not_friend',
      tags: user.tags || [],
      achievements: user.achievements || [],
      membership: user.membership || 'Standard',
      isOnline: user.status === 'online'
    };
  };

  const getOnlineFriendsCount = () => {
    return allFriends.filter(friend => friend.status === 'online').length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading friends...</p>
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
              <Link to="/dashboard" className="text-gray-300 hover:text-emerald-400 transition-colors">Dashboard</Link>
              <Link to="/experiences" className="text-gray-300 hover:text-emerald-400 transition-colors">Experiences</Link>
              <Link to="/projects" className="text-gray-300 hover:text-emerald-400 transition-colors">Projects</Link>
              <Link to="/friends" className="text-emerald-400 font-medium">Friends</Link>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={fetchAllData}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className={`bg-gradient-to-r from-emerald-900/30 via-emerald-800/20 to-emerald-900/30 rounded-2xl p-8 mb-8 border border-emerald-500/20 transition-all duration-1000 ${visibleElements.has('welcome-banner') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} data-animate-id="welcome-banner">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Your <span className="gradient-text">Fear Friends</span>
              </h2>
              <p className="text-gray-400">Connect with fellow horror enthusiasts and build your fear squad</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by username, fear level, or tags..."
                  className="bg-zinc-800 border border-zinc-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 w-80"
                />
              </div>
              <button 
                onClick={handleSearch}
                disabled={searchLoading}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {searchLoading ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
                Search
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 rounded-lg bg-zinc-800 text-gray-300 border border-zinc-700 hover:border-emerald-500/30 transition-colors"
              >
                <Filter size={18} />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className={`mt-6 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700 transition-all duration-300 ${showFilters ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'}`}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Fear Level</label>
                  <input
                    type="text"
                    value={filters.fearlevel}
                    onChange={(e) => updateFilter('fearlevel', e.target.value)}
                    placeholder="e.g., Beginner, Advanced"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tag</label>
                  <input
                    type="text"
                    value={filters.tag}
                    onChange={(e) => updateFilter('tag', e.target.value)}
                    placeholder="e.g., Horror, Survival"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Achievement</label>
                  <input
                    type="text"
                    value={filters.achievement}
                    onChange={(e) => updateFilter('achievement', e.target.value)}
                    placeholder="e.g., Fear Master"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Membership</label>
                  <input
                    type="text"
                    value={filters.membership}
                    onChange={(e) => updateFilter('membership', e.target.value)}
                    placeholder="e.g., Premium, VIP"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button 
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Clear Filters
                </button>
                <button 
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="px-6 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transition-all duration-1000 delay-200 ${visibleElements.has('stats-grid') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} data-animate-id="stats-grid">
          {[
            { label: "Total Friends", value: allFriends.length, icon: "👥" },
            { label: "Pending Requests", value: friendRequests.length, icon: "📩" },
            { label: "Online Friends", value: getOnlineFriendsCount(), icon: "💚" }
          ].map((stat, index) => (
            <div key={index} className="glass-effect rounded-xl p-6 border border-emerald-500/20 transform hover:scale-105 transition-all duration-300">
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
          <div className={`flex border-b border-zinc-800 mb-6 transition-all duration-1000 delay-300 ${visibleElements.has('tabs') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} data-animate-id="tabs">
            {[
              { key: 'all', label: 'All Friends', icon: <Users size={18} className="inline mr-2" />, count: allFriends.length },
              { key: 'pending', label: 'Pending Requests', icon: <UserPlus size={18} className="inline mr-2" />, count: friendRequests.length },
              { key: 'search', label: 'Search Results', icon: <Search size={18} className="inline mr-2" />, count: searchResults.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 font-medium transition-all flex items-center ${
                  activeTab === tab.key
                    ? 'text-emerald-400 border-b-2 border-emerald-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {/* Friend Requests */}
            {activeTab === 'pending' && (
              <div className="space-y-6">
                {friendRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-bold mb-2 text-gray-400">No Pending Requests</h3>
                    <p className="text-gray-500">You don't have any friend requests at the moment</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {friendRequests.map((request, index) => {
                      const formattedUser = formatUserData(request);
                      return (
                        <div 
                          key={request.id} 
                          className="bg-zinc-800 rounded-xl p-6 border border-zinc-700 hover:border-emerald-500/30 transition-colors transform hover:scale-105 transition-all duration-300"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
                              {formattedUser.avatar}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-1">{formattedUser.username}</h3>
                              <div className="text-emerald-400 text-sm mb-2">Fear Level: {formattedUser.fearLevel}</div>
                              <p className="text-gray-400 text-sm">{formattedUser.mutualFriends} mutual friends</p>
                            </div>
                          </div>
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() => handleAcceptRequest(request.id)}
                              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
                            >
                              <Check size={18} />
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request.id)}
                              className="flex-1 bg-zinc-700 text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-zinc-600 transition-colors flex items-center justify-center gap-2"
                            >
                              <X size={18} />
                              Reject
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* All Friends */}
            {activeTab === 'all' && (
              <div className="space-y-6">
                {allFriends.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-bold mb-2 text-gray-400">No Friends Yet</h3>
                    <p className="text-gray-500">Start connecting with other horror enthusiasts</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {allFriends.map((friend, index) => {
                      const formattedUser = formatUserData(friend);
                      return (
                        <div 
                          key={friend.id} 
                          className="bg-zinc-800 rounded-xl p-6 border border-zinc-700 hover:border-emerald-500/30 transition-colors transform hover:scale-105 transition-all duration-300"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
                                  {formattedUser.avatar}
                                </div>
                                {formattedUser.isOnline && (
                                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-zinc-800 rounded-full"></div>
                                )}
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-white mb-1">{formattedUser.username}</h3>
                                <div className="text-emerald-400 text-sm mb-1">Fear Level: {formattedUser.fearLevel}</div>
                                <p className="text-gray-400 text-xs">{formattedUser.isOnline ? 'Online now' : 'Offline'}</p>
                              </div>
                            </div>
                            <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-3 rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all">
                              <MessageCircle size={20} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Search Results */}
            {activeTab === 'search' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Search Results {searchQuery && `for "${searchQuery}"`}
                  </h2>
                  {hasActiveFilters() && (
                    <div className="text-sm text-gray-400">
                      {Object.entries(filters).filter(([_, v]) => v.trim()).length} active filters
                    </div>
                  )}
                </div>

                {searchLoading && searchResults.length === 0 ? (
                  <div className="text-center py-12">
                    <Loader size={32} className="animate-spin mx-auto mb-4 text-emerald-400" />
                    <p className="text-gray-400">Searching users...</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold mb-2 text-gray-400">No Users Found</h3>
                    <p className="text-gray-500">Try adjusting your search terms or filters</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {searchResults.map((user, index) => {
                      const formattedUser = formatUserData(user);
                      return (
                        <div 
                          key={user.id} 
                          className="bg-zinc-800 rounded-xl p-6 border border-zinc-700 hover:border-emerald-500/30 transition-colors transform hover:scale-105 transition-all duration-300"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
                              {formattedUser.avatar}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-1">{formattedUser.username}</h3>
                              <div className="text-emerald-400 text-sm mb-2">Fear Level: {formattedUser.fearLevel}</div>
                              <div className="text-gray-400 text-sm mb-1">Membership: {formattedUser.membership}</div>
                              {formattedUser.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {formattedUser.tags.slice(0, 3).map((tag, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-zinc-700 rounded text-xs text-gray-300">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <p className="text-gray-400 text-sm mt-2">{formattedUser.mutualFriends} mutual friends</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSendRequest(user.id)}
                            disabled={formattedUser.status !== 'not_friend'}
                            className={`w-full mt-4 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                              formattedUser.status !== 'not_friend'
                                ? 'bg-zinc-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/50'
                            }`}
                          >
                            {formattedUser.status === 'request_sent' ? (
                              <>
                                <Check size={18} />
                                Request Sent
                              </>
                            ) : formattedUser.status === 'friend' ? (
                              <>
                                <Users size={18} />
                                Already Friends
                              </>
                            ) : formattedUser.status === 'request_received' ? (
                              <>
                                <UserPlus size={18} />
                                Request Received
                              </>
                            ) : (
                              <>
                                <UserPlus size={18} />
                                Send Friend Request
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Live Chat Button */}
        <button className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:scale-110">
          <MessageCircle size={28} />
        </button>
      </main>
    </div>
  );
};

export default Friends;