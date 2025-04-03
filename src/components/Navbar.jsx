import { Link } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Pattern TesterHub
        </Link>
        <div className="space-x-6">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/patterns" className="hover:underline">
            Patterns
          </Link>
          {user && (
            <>
              <Link
                to={
                  user.role === "creator"
                    ? `/profile/creator/${user.id}`
                    : `/profile/tester/${user.id}`
                }
                className="hover:underline"
              >
                Profile
              </Link>
              <button
                onClick={onLogout}
                className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
