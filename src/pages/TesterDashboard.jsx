import { useState, useEffect } from "react";
import axios from "axios";
import Filters from "../components/Filters";
import PatternList from "../components/PatternList";
import ChatModal from "../components/ChatModal";

function TesterDashboard({ user, onLogout }) {
  const [patterns, setPatterns] = useState([]);
  const [filters, setFilters] = useState({
    skillLevel: [],
    category: [],
    completionTime: [],
  });
  const [selectedPattern, setSelectedPattern] = useState(null);

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pattern");
        console.log("Raw API response:", res.data); // Debugging raw data
        setPatterns(res.data);
      } catch (error) {
        console.error("Error fetching patterns:", error);
        setPatterns([]); // Fallback to empty array on error
      }
    };
    fetchPatterns();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredPatterns = patterns.filter((pattern) => {
    const patternSkill = (pattern.skillLevel || "").toLowerCase().trim();
    const patternCategory = (pattern.category || "").toLowerCase().trim();
    const patternTime = (pattern.completionTime || "").toLowerCase().trim();

    const skillMatch =
      filters.skillLevel.length === 0 ||
      filters.skillLevel.includes(patternSkill);
    const categoryMatch =
      filters.category.length === 0 ||
      filters.category.includes(patternCategory);
    const timeMatch =
      filters.completionTime.length === 0 ||
      filters.completionTime.includes(patternTime);

    console.log(`Filtering ${pattern.title || pattern._id}:`, {
      patternSkill,
      patternCategory,
      patternTime,
      skillMatch,
      categoryMatch,
      timeMatch,
    });

    return skillMatch && categoryMatch && timeMatch;
  });

  console.log("Filtered patterns passed to PatternList:", filteredPatterns); // Debugging

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <Filters onFilterChange={handleFilterChange} />
        </div>
        <div className="md:w-3/4">
          <h1 className="text-3xl font-bold mb-6">
            Where Pattern Creators Find Reliable Testers
          </h1>
          {patterns.length === 0 ? (
            <p className="text-gray-500">Loading patterns...</p>
          ) : filteredPatterns.length > 0 ? (
            <>
              <p className="mb-4 text-gray-600">
                Showing {filteredPatterns.length} pattern(s)
              </p>
              <PatternList
                patterns={filteredPatterns}
                user={user}
                onApply={setSelectedPattern}
              />
            </>
          ) : (
            <p className="text-gray-500">No patterns match your filters.</p>
          )}
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

export default TesterDashboard;
