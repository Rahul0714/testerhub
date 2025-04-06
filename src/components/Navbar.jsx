import { useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handlePatternsClick = () => {
    if (!user) {
      // If no user, redirect to login or home
      navigate("/");
      return;
    }

    if (user.role === "creator") {
      // For creators: Show their created patterns
      navigate("/creator/patterns");
    } else if (user.role === "tester") {
      // For testers: Show available patterns to apply to
      navigate("/tester/patterns");
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div>
          <button onClick={() => navigate("/")} className="text-xl font-bold">
            PatternHub
          </button>
        </div>

        {/* Menu */}
        <div className="flex space-x-4">
          {user && (
            <>
              <button onClick={handlePatternsClick} className="hover:underline">
                Patterns
              </button>
              <button
                onClick={() =>
                  navigate(user.role === "creator" ? "/creator" : "/tester")
                }
                className="hover:underline"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate(`/profile/${user.role}/${user._id}`)}
                className="hover:underline"
              >
                Profile
              </button>
            </>
          )}
          {user ? (
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          ) : (
            <button onClick={() => navigate("/")} className="hover:underline">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
