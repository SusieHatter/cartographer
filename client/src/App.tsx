import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import EditMapPage from "./pages/EditMapPage";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="mt-[64px] flex flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/maps/:id" element={<EditMapPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
