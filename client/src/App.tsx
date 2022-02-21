import { Route, Routes } from "react-router-dom";
import EditMapPage from "./pages/EditMapPage";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/maps/:id" element={<EditMapPage />} />
      </Routes>
    </div>
  );
};

export default App;
