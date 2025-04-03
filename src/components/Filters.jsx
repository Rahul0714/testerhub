import { useState } from "react";

const Filters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    skillLevel: [],
    category: [],
    completionTime: [],
  });

  const handleCheckboxChange = (e, filterType) => {
    const { value, checked } = e.target;
    setFilters((prev) => {
      const newFilter = checked
        ? [...prev[filterType], value]
        : prev[filterType].filter((item) => item !== value);
      const updatedFilters = { ...prev, [filterType]: newFilter };
      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Skill Level</h3>
        {["Beginner", "Intermediate", "Advanced"].map((level) => (
          <div key={level} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={level}
              value={level.toLowerCase()}
              onChange={(e) => handleCheckboxChange(e, "skillLevel")}
              className="mr-2"
            />
            <label htmlFor={level}>{level}</label>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Project Category</h3>
        {[
          "Apparel",
          "Home Decor",
          "Accessories",
          "Baby/Kids",
          "Pet Items",
          "Holiday/Seasonal",
          "Other",
        ].map((category) => (
          <div key={category} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={category}
              value={category.toLowerCase()}
              onChange={(e) => handleCheckboxChange(e, "category")}
              className="mr-2"
            />
            <label htmlFor={category}>{category}</label>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-medium mb-2">Completion Time</h3>
        {["Less than 1 week", "1-2 months", "2-4 months", "Flexible"].map(
          (time) => (
            <div key={time} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={time}
                value={time.toLowerCase()}
                onChange={(e) => handleCheckboxChange(e, "completionTime")}
                className="mr-2"
              />
              <label htmlFor={time}>{time}</label>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Filters;
