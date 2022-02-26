import { Navigate, Route, Routes, useParams } from "react-router-dom";
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
          <Route path="/maps/:id" element={<ValidateEditPage />} />
        </Routes>
      </div>
    </div>
  );
};

const ValidateEditPage = () => {
  const { id: idStr } = useParams();
  const id = parseInt(idStr ?? "");
  if (Number.isNaN(id)) {
    return <Navigate to="/" replace />;
  }
  return <EditMapPage id={id} />;
};

export default App;
