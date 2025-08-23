import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DashboardScreen } from "./screens/DashboardScreen";
import { ExpenseScreen } from "./screens/ExpenseScreen";
import { IncomeScreen } from "./screens/IncomeScreen";
import { InsightScreen } from "./screens/InsightScreen";
import UserAuthScreen from "./screens/UserAuthScreen";
import { UserContext, UserProvider } from "./context/UserContext";
import { ProfileScreen } from "./screens/ProfileScreen";
import ChatBot from './components/ChatBot';


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<AuthWrapper><UserAuthScreen /></AuthWrapper>}
          />
          <Route
            path="/home"
            element={<PrivateRoute><DashboardScreen /></PrivateRoute>}
          />
          <Route
            path="/expense"
            element={<PrivateRoute><ExpenseScreen /></PrivateRoute>}
          />
          <Route
            path="/income"
            element={<PrivateRoute><IncomeScreen /></PrivateRoute>}
          />
          <Route
            path="/insight"
            element={<PrivateRoute><InsightScreen /></PrivateRoute>}
          />
          <Route
            path="/buddy"
            element={<ChatBot />}
          />
          <Route
            path="/profile"
            element={<PrivateRoute><ProfileScreen /></PrivateRoute>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

// Simple Private Route
const PrivateRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  return user ? children : <Navigate to="/" replace />;
};

// Redirect logged-in user away from login
const AuthWrapper = ({ children }) => {
  const { user } = useContext(UserContext);
  return user ? <Navigate to="/home" replace /> : children;
};

export default App;
