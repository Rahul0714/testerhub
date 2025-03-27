const Filters = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Skill Level</h3>
        {["Beginner", "Intermediate", "Advanced", "Professional"].map(
          (level) => (
            <div key={level} className="flex items-center mb-2">
              <input type="checkbox" id={level} className="mr-2" />
              <label htmlFor={level}>{level}</label>
            </div>
          )
        )}
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Project Category</h3>
        {[
          { name: "Apparel", count: 124 },
          { name: "Home Decor", count: 89 },
          { name: "Accessories", count: 67 },
          { name: "Baby/Kids", count: 45 },
          { name: "Pet Items", count: 23 },
          { name: "Holiday/Seasonal", count: 78 },
          { name: "Amigurumi", count: 156 },
        ].map((category) => (
          <div key={category.name} className="flex items-center mb-2">
            <input type="checkbox" id={category.name} className="mr-2" />
            <label htmlFor={category.name}>
              {category.name} ({category.count})
            </label>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-medium mb-2">Completion Time</h3>
        {[
          { name: "Less than 1 week", count: 34 },
          { name: "1-2 months", count: 89 },
          { name: "2-4 months", count: 56 },
          { name: "Flexible", count: 45 },
        ].map((time) => (
          <div key={time.name} className="flex items-center mb-2">
            <input type="checkbox" id={time.name} className="mr-2" />
            <label htmlFor={time.name}>
              {time.name} ({time.count})
            </label>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
        Apply Filters
      </button>
    </div>
  );
};

export default Filters;
