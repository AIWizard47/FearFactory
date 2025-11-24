import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Star, Clock, Users, Award } from "lucide-react";

const ProjectDetailModal = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock images for gallery
  const projectImages = [
    `https://images.unsplash.com/photo-1509803874385-db7c23652552?w=800&q=80`,
    `https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80`,
    `https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&q=80`,
    `https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80`,
    `https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?w=800&q=80`,
    `https://images.unsplash.com/photo-1509315811345-672d83ef2fbc?w=800&q=80`,
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };

  const features = [
    { icon: "⚡", title: "Instant Start", description: "Begin your experience immediately" },
    { icon: "🎯", title: "Expert Guides", description: "Professional horror directors" },
    { icon: "📸", title: "Photo Package", description: "Get professional photos of your experience" },
    { icon: "🏆", title: "Certificate", description: "Earn completion certificate" },
  ];

  const reviews = [
    { name: "Sarah M.", rating: 5, comment: "Absolutely terrifying! Best horror experience ever!", date: "2 days ago" },
    { name: "John D.", rating: 5, comment: "The attention to detail is incredible. Highly recommend!", date: "1 week ago" },
    { name: "Emily R.", rating: 4, comment: "Great experience, but very intense. Not for the faint-hearted!", date: "2 weeks ago" },
  ];

  const highlights = [
    "Professional actors and state-of-the-art effects",
    "Immersive storytelling with multiple storylines",
    "Safety protocols and emergency exits",
    "Age-appropriate scares (18+ only)",
    "Group discounts available",
    "Wheelchair accessible"
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm" data-testid="project-modal">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto bg-zinc-900 rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors border border-zinc-700"
            data-testid="close-modal-btn"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          {/* Image Gallery */}
          <div className="relative h-96 bg-zinc-950">
            <img
              src={projectImages[currentImageIndex]}
              alt={`Project view ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Gallery Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-zinc-900/80 hover:bg-zinc-800 flex items-center justify-center transition-all border border-emerald-500/30"
              data-testid="prev-image-btn"
            >
              <ChevronLeft className="w-6 h-6 text-emerald-400" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-zinc-900/80 hover:bg-zinc-800 flex items-center justify-center transition-all border border-emerald-500/30"
              data-testid="next-image-btn"
            >
              <ChevronRight className="w-6 h-6 text-emerald-400" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-zinc-900/80 backdrop-blur-sm text-sm border border-emerald-500/30">
              {currentImageIndex + 1} / {projectImages.length}
            </div>

            {/* Premium Badge */}
            {project.is_premium && (
              <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold text-sm shadow-lg">
                ⭐ Premium Experience
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-2 p-4 bg-zinc-950/50 overflow-x-auto">
            {projectImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentImageIndex
                    ? 'border-emerald-500 scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      90 minutes
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      1-8 people
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {project.difficulty}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-emerald-400 mb-1">${project.price}</div>
                  <div className="text-sm text-gray-500">per person</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">(127 reviews)</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>📖</span>
                About This Experience
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">{project.description}</p>
              <p className="text-gray-400 leading-relaxed">
                Step into a world where reality blurs with nightmare. This immersive horror experience 
                combines cutting-edge technology, professional actors, and psychological techniques to 
                create an unforgettable journey into fear. Are you brave enough to face what lies within?
              </p>
            </div>

            {/* Highlights */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>✨</span>
                Experience Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">✓</span>
                    <span className="text-gray-300">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>🎁</span>
                What's Included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="glass-effect rounded-xl p-4 border border-emerald-500/20 text-center hover:border-emerald-500/40 transition-all">
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>💬</span>
                Recent Reviews
              </h2>
              <div className="space-y-4">
                {reviews.map((review, idx) => (
                  <div key={idx} className="glass-effect rounded-xl p-6 border border-emerald-500/20">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{review.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Section */}
            <div className="glass-effect rounded-2xl p-6 border-2 border-emerald-500/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Ready to Book?</h3>
                  <p className="text-gray-400">Available dates: Every Friday & Saturday, 7 PM - 11 PM</p>
                </div>
                <div className="flex gap-4">
                  <button className="px-8 py-4 rounded-lg border-2 border-emerald-500 text-emerald-400 font-semibold hover:bg-emerald-500/10 transition-all" data-testid="add-to-wishlist-btn">
                    ♥ Add to Wishlist
                  </button>
                  <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all" data-testid="book-now-btn">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
