const Profile = ({ user, applications, patterns }) => {
  const testerData = {
    name: user?.name || "Emily Johnson",
    bio: "Passionate crocheter with 5 years of experience specializing in amigurumi and baby items.",
    email: user?.email || "emily.j@example.com",
    skillLevel: "Advanced",
    rewardPoints: 245,
    rank: "Expert",
    appliedTestings: [
      {
        project: "Amigurumi Bunny",
        creator: "Jane Craft",
        status: "Accepted",
        appliedDate: "2024-06-20",
        completionDate: "2024-08-20",
      },
      {
        project: "Cozy Winter Blanket",
        creator: "Mary Knits",
        status: "Pending",
        appliedDate: "2024-07-05",
        completionDate: "2024-10-05",
      },
      {
        project: "Baby Booties Set",
        creator: "Sarah Stitches",
        status: "Completed",
        appliedDate: "2024-07-20",
        completionDate: "2024-08-20",
      },
    ].filter((testing) => {
      const pattern = patterns.find((p) => p.title === testing.project);
      return pattern && applications.includes(pattern.id);
    }),
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
        <div className="w-32 h-32 bg-gray-300 rounded-full mb-4 md:mr-6 md:mb-0"></div>
        <div>
          <h2 className="text-2xl font-semibold">{testerData.name}</h2>
          <p className="text-gray-600">{testerData.bio}</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>
              <span className="font-medium">Email:</span> {testerData.email}
            </p>
            <p>
              <span className="font-medium">Skill Level:</span>{" "}
              {testerData.skillLevel}
            </p>
            <p>
              <span className="font-medium">Reward Points:</span>{" "}
              {testerData.rewardPoints}
            </p>
            <p>
              <span className="font-medium">Rank:</span> {testerData.rank}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Applied Testings</h3>
        {testerData.appliedTestings.length === 0 ? (
          <p className="text-gray-600">No applications yet.</p>
        ) : (
          <div className="space-y-4">
            {testerData.appliedTestings.map((testing, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p>
                      <span className="font-medium">Project:</span>{" "}
                      {testing.project}
                    </p>
                    <p>
                      <span className="font-medium">Creator:</span>{" "}
                      {testing.creator}
                    </p>
                    <p>
                      <span className="font-medium">Applied:</span>{" "}
                      {testing.appliedDate}
                    </p>
                    <p>
                      <span className="font-medium">Due:</span>{" "}
                      {testing.completionDate}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      testing.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : testing.status === "Accepted"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {testing.status}
                  </span>
                </div>
                {testing.status !== "Pending" && (
                  <button className="mt-3 bg-gray-100 text-gray-800 px-4 py-1 rounded hover:bg-gray-200">
                    Submit Feedback
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
