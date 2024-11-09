import { Route, Routes } from "react-router-dom";
import Projects from "./pages/Projects/Projects";
import Project from "./pages/Project/Project";
import "./App.css";


const App = () => {

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/project/:id" element={<Project />} />
      </Routes>
    </div>
  );
};

export default App;
