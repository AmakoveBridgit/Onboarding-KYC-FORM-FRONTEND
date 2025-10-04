import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FormList from "./components/FormList";
import FormDetails from "./components/FormDetails";
import SubmissionList from "./components/SubmissionDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormList />} />
        <Route path="/forms/:id" element={<FormDetails />} />
        <Route path="/admin/submissions" element={<SubmissionList />} />
      </Routes>
    </Router>
  );
}

export default App;
