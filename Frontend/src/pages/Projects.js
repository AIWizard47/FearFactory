import { useState, useEffect, useRef  } from "react";
import { Link } from "react-router-dom";
import { getApiUrl, getCookie } from "@/App";
import { toast } from "sonner";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import ProjectDetailModal from "@/components/ProjectDetailModal";

const Projects = () => {
  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000"
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [difficulties, setFearLevels] = useState([]);
  const categories = ["all", "Horror Game", "VR Experience", "Investigation", "Paranormal", "Mystery"];



  

  useEffect(() => {
    fetch(getApiUrl("fearLevels"))
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (!data.fear_levels || !Array.isArray(data.fear_levels)) {
          console.error("Invalid response format:", data);
          return;
        }

        setFearLevels(["all", ...data.fear_levels.map(level => level.name)]);
      })
      .catch((err) => console.error("Failed to load fear levels:", err));
  }, []);


  
  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery, selectedCategory, selectedDifficulty, priceRange, sortBy]);

// 🛑 store which cursors were already loaded
  const loadedCursors = useRef(new Set());

  const loadProjects = async () => {
    if (loading) return;               // 🛑 stop if already loading
    if (cursor && loadedCursors.current.has(cursor)) return;  // 🛑 stop if cursor already loaded

    setLoading(true);

    const token = getCookie("access_token");

    const url = cursor
      ? `${getApiUrl("projects")}?cursor=${cursor}`
      : getApiUrl("projects");

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      // 🛑 Avoid pushing duplicate data
      setProjects((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const newItems = data.results.filter((p) => !ids.has(p.id));
        return [...prev, ...newItems];
      });

      // Save cursor so it’s never loaded again
      if (cursor) loadedCursors.current.add(cursor);

      // Update next cursor
      if (data.next) {
        const nextUrl = new URL(data.next);
        const nextCursor = nextUrl.searchParams.get("cursor");
        setCursor(nextCursor);
      } else {
        setCursor(null);
      }
    } catch (err) {
      console.error("Error loading projects:", err);
    }

    setLoading(false);
  };

  // Load initial
  useEffect(() => {
    loadProjects();
  }, []);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        if (cursor) loadProjects();
      }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [cursor]);

  const filterProjects = () => {
    let filtered = [...projects];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(p => p.difficulty === selectedDifficulty);
    }

    // Price range filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "difficulty":
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3, Extreme: 4 };
        filtered.sort((a, b) => (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0));
        break;
      default: // popular
        break;
    }
    setFilteredProjects(filtered);
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setPriceRange([0, 1000]);
    setSortBy("popular");
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <span className="text-2xl">💀</span>
              </div>
              <span className="text-2xl font-bold display-font gradient-text">FearFactory</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-emerald-400 transition-colors" data-testid="nav-home">Home</Link>
              <Link to="/projects" className="text-emerald-400 font-medium" data-testid="nav-projects">Projects</Link>
            </div>

            <Link to="/dashboard">
              <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all" data-testid="nav-login-btn">
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header with Search */}
      <section className="py-12 px-4 bg-gradient-to-b from-emerald-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold display-font mb-4">
              Our <span className="gradient-text">Horror</span> Projects
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore our collection of spine-chilling experiences
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for horror experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-emerald-500/20 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors text-white"
                data-testid="search-input"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="py-6 px-4 bg-zinc-900/50 border-y border-zinc-800  top-16 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Filter Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full px-4 py-3 rounded-lg glass-effect border border-emerald-500/20 flex items-center justify-center gap-2"
              data-testid="toggle-filters-btn"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>

            {/* Filters (Desktop) */}
            <div className={`${showFilters ? 'flex' : 'hidden md:flex'} flex-wrap gap-3 w-full md:w-auto`}>
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg bg-zinc-900/50 border border-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-colors"
                data-testid="category-filter"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 rounded-lg bg-zinc-900/50 border border-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-colors"
                data-testid="difficulty-filter"
              >
                {difficulties.map((diff) => (
                  console.log(diff),
                  <option key={diff} value={diff}>
                    {diff === "all" ? "FearLevel" : diff}
                  </option>
                ))}
              </select>

              {/* Price Range */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass-effect border border-emerald-500/20">
                <span className="text-sm text-gray-400">$0</span>
                <input
                  type="range"
                  min="0"
                  max={projects.reduce((max, p) => Math.max(max, p.price), 1000)}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-24"
                  data-testid="price-range"
                />
                <span className="text-sm text-emerald-400">${priceRange[1]}</span>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all") && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-2"
                  data-testid="clear-filters-btn"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-zinc-900/50 border border-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-colors"
                data-testid="sort-select"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="difficulty">FearLevel</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-center text-sm text-gray-400">
            Showing {filteredProjects.length} of {projects.length} experiences
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-effect rounded-2xl p-6 border border-emerald-500/20 animate-pulse">
                  <div className="bg-zinc-800 h-48 rounded-lg mb-4"></div>
                  <div className="bg-zinc-800 h-6 rounded mb-2"></div>
                  <div className="bg-zinc-800 h-4 rounded mb-4"></div>
                  <div className="bg-zinc-800 h-10 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-bold mb-2">No Projects Found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters or search query</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="glass-effect rounded-2xl overflow-hidden border border-emerald-500/20 card-hover cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                  data-testid={`project-card-${index}`}
                >
                  {/* Project Image */}
                  <div className="h-48 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 flex items-center justify-center relative">
                    <div className="text-6xl ">
                      <img
                        src={BASE_URL+project?.image_url}
                        alt={project?.title || "Project Image"}
                        className="w-full h-full object-cover  rounded-xl"
                      />
                    </div>
                    {project.is_premium && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500 text-yellow-400 text-xs font-semibold">
                        ⭐ Premium
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-emerald-400">FearLevel: {project.fearLevel}</span>
                      <span className="text-emerald-500 font-bold text-xl">${project.price}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProjectClick(project);
                      }}
                      className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
                      data-testid={`view-details-btn-${index}`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Loader */}
      {loading && <p className="text-center text-white mt-4">Loading...</p>}

      {/* No more pages */}
      {!cursor && !loading && (
        <p className="text-center text-gray-400 mt-4">No more projects</p>
      )}

      {/* Footer */}
      <footer className="bg-zinc-900/80 border-t border-zinc-800 py-8 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500">© 2024 FearFactory. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Projects;
