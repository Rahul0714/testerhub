import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Search,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  User,
  LogOut,
  MessageSquare,
} from "lucide-react";

function Home() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [patterns, setPatterns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch patterns from the backend
  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pattern");
        setPatterns(res.data);
      } catch (err) {
        console.error(err);
        // Fallback dummy data
        setPatterns([
          {
            _id: "1",
            title: "Crochet Amigurumi Bunny",
            creator: { username: "CreatorJane" },
            category: "other",
            skillLevel: "beginner",
            completionTime: "less than 1 week",
            positions: 2,
            applicants: ["TesterAlice"],
            postedDate: new Date("2025-03-01"),
          },
          {
            _id: "2",
            title: "Knit Blanket",
            creator: { username: "CreatorMike" },
            category: "home-decor",
            skillLevel: "intermediate",
            completionTime: "1-2 months",
            positions: 3,
            applicants: [],
            postedDate: new Date("2025-03-15"),
          },
        ]);
      }
    };
    fetchPatterns();
  }, []);

  // Pattern categories (adapted from jobCategories)
  const patternCategories = [
    { name: "Amigurumi", count: "1.2k", icon: "🧸" },
    { name: "Blankets", count: "856", icon: "🛏️" },
    { name: "Home Decor", count: "943", icon: "🖼️" },
    { name: "Garments", count: "677", icon: "👕" },
    { name: "Accessories", count: "323", icon: "🎀" },
    { name: "Kitchen and Dining", count: "589", icon: "🍽️" },
    { name: "Seasonal Designs", count: "766", icon: "🎁" },
    { name: "Pet Items", count: "445", icon: "🐾" },
  ];

  // Filter patterns based on search query
  const filteredPatterns = patterns.filter(
    (pattern) =>
      pattern.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("token")
    ? JSON.parse(atob(localStorage.getItem("token").split(".")[1])).role
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Pattern TesterHub
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-gray-900 hover:text-blue-600">
                  Find Patterns
                </Link>
                <Link
                  to={userRole === "creator" ? "/creator" : "/tester"}
                  className="text-gray-500 hover:text-blue-600"
                >
                  Dashboard
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {userId ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full bg-gray-100"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {userRole === "creator" ? "Creator" : "Tester"}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 border">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">
                          {userRole === "creator"
                            ? "Creator Profile"
                            : "Tester Profile"}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          to={
                            userRole === "creator"
                              ? `/profile/creator/${userId}`
                              : `/profile/tester/${userId}`
                          }
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <User size={16} />
                          View Profile
                        </Link>
                        <Link
                          to={`/chat/${userId}/${
                            patterns[0]?.creator._id || "dummy"
                          }`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <MessageSquare size={16} />
                          Messages
                        </Link>
                      </div>
                      <div className="border-t py-1">
                        <button
                          onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Where Pattern Creators Find Reliable Testers
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Explore and test patterns from talented creators
            </p>
            <div className="bg-white rounded-lg p-2 flex flex-wrap md:flex-nowrap gap-2 shadow-lg">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Pattern title or category"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Pattern Categories */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Pattern Categories
            </h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {patternCategories.map((category) => (
              <div
                key={category.name}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="text-3xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">
                  {category.count} patterns
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Patterns */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Newest Pattern Tests
            </h2>
            <Link
              to="/tester"
              className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4">
            {filteredPatterns.map((pattern) => (
              <div
                key={pattern._id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${pattern.creator.username}`}
                    alt={pattern.creator.username}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {pattern.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <User size={16} />
                        {pattern.creator.username}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {pattern.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {new Date(pattern.postedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-semibold">
                        {pattern.skillLevel}
                      </span>
                      <span className="text-sm text-gray-500">
                        {pattern.applicants.length} applicants
                      </span>
                    </div>
                  </div>
                  <Link
                    to={userId ? `/chat/${userId}/${pattern.creator._id}` : "/"}
                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;