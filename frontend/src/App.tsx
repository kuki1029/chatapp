import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<div>No Match</div>} /> //TODO: Add 404 page
    </Routes>
  );
}

export default App;
