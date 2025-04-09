import { useState, useEffect } from "react";
import axios from "axios";
import Filters from "../components/Filters";
import PatternList from "../components/PatternList";

function DummyPage() {
  const user = null;
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
        console.log("Fetched patterns:", res.data); // Debugging
        setPatterns(res.data);
      } catch (error) {
        console.error("Error fetching patterns:", error);
      }
    };
    fetchPatterns();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredPatterns = patterns.filter((pattern) => {
    const skillMatch =
      filters.skillLevel.length === 0 ||
      filters.skillLevel.some((level) =>
        pattern.skillLevel?.toLowerCase().includes(level)
      );
    const categoryMatch =
      filters.category.length === 0 ||
      filters.category.some((cat) =>
        pattern.category?.toLowerCase().includes(cat)
      );
    const timeMatch =
      filters.completionTime.length === 0 ||
      filters.completionTime.some((time) =>
        pattern.completionTime?.toLowerCase().includes(time)
      );

    return skillMatch && categoryMatch && timeMatch;
  });

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
          <PatternList
            patterns={filteredPatterns}
            user={user}
            onApply={setSelectedPattern}
          />
        </div>
      </div>
    </div>
  );
}

export default DummyPage;
