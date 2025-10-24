import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectView from "./pages/ProjectView";
import ToDoList from "./pages/ToDoList";
import OpenProject from "./pages/OpenProject";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/taskplanner" element={<ProjectView />} />
        <Route path="/todo" element={<ToDoList />} />
        <Route path="/open-project/:id" element={<OpenProject />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

export default App;
