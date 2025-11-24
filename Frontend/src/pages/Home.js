import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/App";

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const isLoggedIn = isAuthenticated();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <span className="text-2xl" role="img" aria-label="skull">💀</span>
              </div>
              <span className="text-2xl font-bold display-font gradient-text">FearFactory</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-emerald-400 transition-colors" data-testid="nav-home">Home</Link>
              <Link to="/projects" className="text-gray-300 hover:text-emerald-400 transition-colors" data-testid="nav-projects">Projects</Link>
              <a href="#about" className="text-gray-300 hover:text-emerald-400 transition-colors">About</a>
              <a href="#contact" className="text-gray-300 hover:text-emerald-400 transition-colors">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all" data-testid="nav-dashboard-btn">
                    Dashboard
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <button className="px-6 py-2 rounded-lg border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 transition-all" data-testid="nav-login-btn">
                      Login
                    </button>
                  </Link>
                  <Link to="/login">
                    <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all" data-testid="nav-signup-btn">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInLeft">
              <h1 className="text-5xl md:text-7xl font-bold display-font mb-6 leading-tight">
                Bring Your <span className="gradient-text">Nightmares</span> To Life
              </h1>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                We create thrilling horror experiences and software projects that will captivate your users. 
                From spine-chilling games to immersive applications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={isLoggedIn ? "/dashboard" : "/login"}>
                  <button className="w-full sm:w-auto px-8 py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all" data-testid="hero-start-project-btn">
                    Start Your Project
                  </button>
                </Link>
                <Link to="/projects">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-lg border-2 border-emerald-500 text-emerald-400 font-semibold text-lg hover:bg-emerald-500/10 transition-all" data-testid="hero-view-work-btn">
                    View Our Work
                  </button>
                </Link>
              </div>
            </div>

            <div className="animate-slideInRight animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative glass-effect rounded-3xl p-8 border border-emerald-500/20">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-gray-400 font-mono text-sm">System Active</span>
                    </div>
                    <pre className="text-emerald-400 font-mono text-sm overflow-hidden">
{`function createExperience() {
  const fear = captureEmotion();
  if (fear.isIntense) {
    amplify(fear);
  }
  return buildImmersion(fear);
}`}
                    </pre>
                    <div className="pt-4 flex items-center justify-between">
                      <span className="text-gray-500 text-xs">Horror Engine v2.0</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-bold display-font mb-4">
              Our <span className="gradient-text">Thrilling</span> Services
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Specialized in creating unforgettable horror experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎮",
                title: "Horror Game Development",
                description: "Create spine-chilling games that will terrify players with immersive atmospheres and AI-driven experiences.",
                features: ["Immersive atmospheres", "AI-driven mechanics", "Psychological elements"]
              },
              {
                icon: "🌐",
                title: "Haunted Web Applications",
                description: "Develop web applications with eerie interfaces and unexpected interactions that keep users engaged.",
                features: ["Dynamic animations", "Engaging UX design", "Interactive experiences"]
              },
              {
                icon: "📱",
                title: "Mobile Horror Apps",
                description: "Mobile applications that deliver thrilling experiences right in the palm of your users' hands.",
                features: ["AR experiences", "Immersive feedback", "Location-based features"]
              }
            ].map((service, index) => (
              <div key={index} className="glass-effect rounded-2xl p-8 card-hover" data-testid={`service-card-${index}`}>
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <span className="text-emerald-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={isLoggedIn ? "/dashboard" : "/login"}>
                  <button className="w-full px-6 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500 text-emerald-400 hover:bg-emerald-500/20 transition-all" data-testid={`service-learn-more-${index}`}>
                    Learn More
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold display-font mb-6">
            Ready to <span className="gradient-text">Create</span> Something Amazing?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Let us bring your darkest digital dreams to life. Our team of talented developers is waiting to create something truly extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={isLoggedIn ? "/dashboard" : "/login"}>
              <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all" data-testid="cta-start-project-btn">
                Start Your Project
              </button>
            </Link>
            <a href="#contact">
              <button className="px-8 py-4 rounded-lg border-2 border-emerald-500 text-emerald-400 font-semibold text-lg hover:bg-emerald-500/10 transition-all" data-testid="cta-contact-btn">
                Contact Us
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-zinc-900/80 border-t border-zinc-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <span className="text-lg">💀</span>
                </div>
                <span className="text-xl font-bold display-font gradient-text">FearFactory</span>
              </div>
              <p className="text-gray-400 text-sm">Creating digital experiences since 2024. We specialize in horror-themed software development.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Horror Games</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Web Applications</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Mobile Apps</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/projects" className="hover:text-emerald-400 transition-colors">Portfolio</Link></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">API Reference</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📍 Digital Realm</li>
                <li>📧 contact@fearfactory.com</li>
                <li>📞 +1 (555) 123-4567</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">© 2024 FearFactory. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
