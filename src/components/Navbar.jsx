const Navbar = ({ setActiveSection, user, onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Pattern TesterHub</h1>
        <div className="space-x-6">
          <button
            onClick={() => setActiveSection("home")}
            className="hover:underline"
          >
            Home
          </button>
          <button
            onClick={() => setActiveSection("patterns")}
            className="hover:underline"
          >
            Patterns
          </button>
          <button
            onClick={() => setActiveSection("profile")}
            className="hover:underline"
          >
            Profile
          </button>
          {user && (
            <button
              onClick={onLogout}
              className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
