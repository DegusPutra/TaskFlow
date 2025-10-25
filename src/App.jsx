import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectView from "./pages/ProjectView";
import ToDoList from "./pages/ToDoList";
import OpenProject from "./pages/OpenProject";
import Notifications from "./pages/Notifications";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/taskplanner" element={<ProjectView />} />
          <Route path="/todo" element={<ToDoList />} />
          <Route path="/open-project/:id" element={<OpenProject />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
