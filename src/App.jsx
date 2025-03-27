import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import PatternList from "./components/PatternList";
import Filters from "./components/Filters";
import Profile from "./components/Profile";
import LoginModal from "./components/LoginModal";
import ChatPage from "./components/ChatPage";

const patterns = [
  {
    id: 1,
    title: "Amigurumi Bunny",
    type: "Crochet Amigurumi",
    positions: 2,
    compensation: "Free final pattern + 50 reward points",
    completionTime: "2 months",
    skillLevel: "Intermediate",
    initialApplicants: 3,
    postedDate: "2024-06-14",
    description: "Create a cute bunny with detailed ears and tail",
    creator: "Jane Craft",
  },
  {
    id: 2,
    title: "Cozy Winter Blanket",
    type: "Crochet Blanket",
    positions: 3,
    compensation: "Free final pattern + 75 reward points",
    completionTime: "3 months",
    skillLevel: "Advanced",
    initialApplicants: 5,
    postedDate: "2024-07-01",
    description: "Chunky blanket with cable pattern",
    creator: "Mary Knits",
  },
  {
    id: 3,
    title: "Baby Booties Set",
    type: "Crochet Baby Items",
    positions: 4,
    compensation: "Free final pattern + 30 reward points",
    completionTime: "1 month",
    skillLevel: "Beginner",
    initialApplicants: 2,
    postedDate: "2024-07-15",
    description: "Simple booties with button details",
    creator: "Sarah Stitches",
  },
  {
    id: 4,
    title: "Christmas Ornaments",
    type: "Holiday Crochet",
    positions: 2,
    compensation: "Free final pattern + 40 reward points",
    completionTime: "6 weeks",
    skillLevel: "Intermediate",
    initialApplicants: 6,
    postedDate: "2024-08-01",
    description: "Set of 5 festive ornaments",
    creator: "Holly Hooks",
  },
];

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        setIsLoginModalOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setApplications([]);
    setActiveSection("home");
  };

  const setSection = (section) => {
    setActiveSection(section);
    if (section !== "chat") setSelectedPattern(null); // Keep pattern for chat
  };

  const handleApply = (pattern) => {
    if (applications.includes(pattern.id)) {
      alert("You have already applied to this pattern!");
      return;
    }
    setSelectedPattern(pattern);
    setActiveSection("chat");
  };

  const handleChatSubmit = (patternId, { message, file }) => {
    setApplications([...applications, patternId]);
    console.log(`Application for pattern ${patternId}:`, { message, file });
    alert("Application submitted successfully!");
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar
        setActiveSection={setSection}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1">
        {activeSection === "home" && (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">
              Where Pattern Creators Find Reliable Testers
            </h1>
            <p className="text-gray-600 mb-6">
              Post, Connect & Perfect Your Patterns
            </p>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-3/4">
                <PatternList
                  onApply={handleApply}
                  applications={applications}
                  patterns={patterns}
                />
              </div>
              <div className="w-full md:w-1/4">
                <Filters />
              </div>
            </div>
          </div>
        )}
        {activeSection === "profile" && (
          <div className="container mx-auto px-4 py-8">
            <Profile
              user={user}
              applications={applications}
              patterns={patterns}
            />
          </div>
        )}
        {activeSection === "patterns" && (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Browse All Patterns</h1>
            <PatternList
              onApply={handleApply}
              applications={applications}
              patterns={patterns}
            />
          </div>
        )}
        {activeSection === "chat" && selectedPattern && (
          <ChatPage
            pattern={selectedPattern}
            user={user}
            onSubmit={handleChatSubmit}
            onBack={() => setSection("patterns")}
          />
        )}
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;
