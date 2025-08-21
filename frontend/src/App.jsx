import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { DashboardScreen } from "./screens/DashboardScreen";
import { ExpenseScreen } from "./screens/ExpenseScreen";
import { IncomeScreen } from "./screens/IncomeScreen";
import { InsightScreen } from "./screens/InsightScreen";
import UserAuthScreen from "./screens/UserAuthScreen";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

const AppRoutes = () => {
  // Temporary fake auth flag (replace with real user logic later)
  const isAuthenticated = false;

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/" element={<UserAuthScreen />} />
      <Route path="/home" element={<DashboardScreen />} />
      <Route path="/expense" element={<ExpenseScreen />} />
      <Route path="/income" element={<IncomeScreen />} /> 
      <Route path="/insight" element={<InsightScreen/>} />
      <Route path="/expense" element={<ExpenseScreen />} />
    </Routes>
  );
};

const Root = () => {
  const isAuthenticated = false; // stub for now
  return isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />;
};

export default App;
