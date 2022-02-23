import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="bg-black font-bold text-2xl px-6 py-4 text-white shadow-lg z-10 w-100">
      <h1>
        <Link to="/">Cartographer</Link>
      </h1>
    </div>
  );
};

export default Navbar;
