import { Route, Routes } from "react-router-dom";
import EditMapPage from "./pages/EditMapPage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/maps/:id" element={<EditMapPage />} />
      </Routes>
    </div>
  );
};

export default App;
