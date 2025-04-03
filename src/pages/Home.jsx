import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
import PatternList from "../components/PatternList";
import ChatModal from "../components/ChatModal";

function Home({ user, onLogout }) {
  const [patterns, setPatterns] = useState([]);
  const [filters, setFilters] = useState({
    skillLevel: [],
    category: [],
    completionTime: [],
  });
  const [selectedPattern, setSelectedPattern] = useState(null);

  useEffect(() => {
    const fetchPatterns = async () => {
      const res = await axios.get("http://localhost:5000/api/pattern");
      setPatterns(res.data);
    };
    fetchPatterns();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredPatterns = patterns.filter(
    (pattern) =>
      (filters.skillLevel.length === 0 ||
        filters.skillLevel.includes(pattern.skillLevel)) &&
      (filters.category.length === 0 ||
        filters.category.includes(pattern.category)) &&
      (filters.completionTime.length === 0 ||
        filters.completionTime.includes(pattern.completionTime))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} onLogout={onLogout} />
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <Filters onFilterChange={handleFilterChange} />
        </div>
        <div className="md:w-3/4">
          <h1 className="text-3xl font-bold mb-6">
            Where Pattern Creators Find Reliable Testers
          </h1>
          <PatternList
            patterns={filteredPatterns}
            user={user}
            onApply={setSelectedPattern}
          />
        </div>
      </div>
      <ChatModal
        isOpen={!!selectedPattern}
        onClose={() => setSelectedPattern(null)}
        pattern={selectedPattern}
      />
    </div>
  );
}

export default Home;
