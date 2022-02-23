import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="fixed w-screen bg-black font-bold text-2xl px-6 py-4 text-white z-10">
      <h1>
        <Link to="/">Cartographer</Link>
      </h1>
    </div>
  );
};

export default Navbar;
