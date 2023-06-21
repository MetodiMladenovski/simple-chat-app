import './App.css';
import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./Components/HomePage/HomePage.jsx";
import Register from './Components/Register/Register.jsx';
import Login from './Components/Login/Login.jsx';
import ProtectedRoute from './Components/Routes/ProtectedRoute.jsx';

const App = () => {

  const navigate = useNavigate();

  function requireAuth() {
    let loggedUser = localStorage.getItem("loggedUser");
    if(loggedUser == null) {
      navigate("/login");
    }
  }

  return (
    <Routes>
        <Route
            path="/:userId"
            loader={() => requireAuth()}
            exact
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
        />
      <Route
          path="/register"
          exact
          element={
            <Register />
          }
      />
      <Route
          path="/login"
          exact
          element={
            <Login />
          }
      />
    </Routes>
  )
}
 
export default App;
