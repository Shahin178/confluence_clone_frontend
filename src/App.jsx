import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DocumentEdit from "./components/DocumentEdit";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/edit" element={<DocumentEdit />} />
          <Route path="/edit/:id" element={<DocumentEdit />} />{" "}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
