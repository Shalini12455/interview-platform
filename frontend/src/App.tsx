import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import InterviewSetup from "./pages/interview/InterviewSetup";
import InterviewSession from "./pages/interview/InterviewSession";
import InterviewHistory from "./pages/interview/InterviewHistory";
import ResumePage from "./pages/resume/ResumePage";
import CodingPage from "./pages/coding/CodingPage";
import CollaborationRoom from "./pages/coding/CollaborationRoom";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import DSAPractice from "./pages/coding/DSAPractice";
import SubmissionsPage from "./pages/coding/SubmissionsPage";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/setup"
          element={
            <ProtectedRoute>
              <InterviewSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/session"
          element={
            <ProtectedRoute>
              <InterviewSession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/history"
          element={
            <ProtectedRoute>
              <InterviewHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <ResumePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coding"
          element={
            <ProtectedRoute>
              <CodingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coding/room/:roomId"
          element={
            <ProtectedRoute>
              <CollaborationRoom />
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coding/practice"
          element={
            <ProtectedRoute>
              <DSAPractice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coding/submissions"
          element={
            <ProtectedRoute>
              <SubmissionsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid #334155",
          },
        }}
      />
      <AppRoutes />
    </Provider>
  );
}

export default App;
