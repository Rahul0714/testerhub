const PatternList = ({ onApply, applications, patterns }) => {
  return (
    <div className="space-y-6">
      {patterns.map((pattern) => {
        const totalApplicants =
          pattern.initialApplicants +
          (applications.includes(pattern.id) ? 1 : 0);
        const hasApplied = applications.includes(pattern.id);

        return (
          <div
            key={pattern.id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{pattern.title}</h2>
                <p className="text-gray-600">{pattern.type}</p>
                <p className="text-gray-500 text-sm">by {pattern.creator}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {pattern.skillLevel}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{pattern.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <p>
                <span className="font-medium">Positions:</span>{" "}
                {pattern.positions}
              </p>
              <p>
                <span className="font-medium">Applicants:</span>{" "}
                {totalApplicants}
              </p>
              <p>
                <span className="font-medium">Compensation:</span>{" "}
                {pattern.compensation}
              </p>
              <p>
                <span className="font-medium">Completion:</span>{" "}
                {pattern.completionTime}
              </p>
              <p>
                <span className="font-medium">Posted:</span>{" "}
                {pattern.postedDate}
              </p>
            </div>
            <button
              onClick={() => onApply(pattern)}
              className={`mt-4 px-4 py-2 rounded transition-colors ${
                hasApplied
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={hasApplied}
            >
              {hasApplied ? "Applied" : "Apply Now"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PatternList;
