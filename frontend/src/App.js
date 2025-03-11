// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { TicketProvider } from './context/TicketContext';
import { UserProvider } from './context/UserContext';

// Components
import PrivateRoute from './components/common/PrivateRoute';
import MainLayout from './components/layout/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProjectListPage from './pages/projects/ProjectListPage';
import ProjectDetailsPage from './pages/projects/ProjectDetailsPage';
import ProjectFormPage from './pages/projects/ProjectFormPage';
import TicketListPage from './pages/tickets/TicketListPage';
import TicketDetailsPage from './pages/tickets/TicketDetailsPage';
import TicketFormPage from './pages/tickets/TicketFormPage';
import UserListPage from './pages/users/UserListPage';
import UserProfilePage from './pages/users/UserProfilePage';
// import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <ProjectProvider>
          <TicketProvider>
            <Router>
              <ToastContainer position="top-right" autoClose={3000} />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes */}
                <Route element={<PrivateRoute />}>
                  <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    
                    {/* Project routes */}
                    <Route path="/projects" element={<ProjectListPage />} />
                    <Route path="/projects/new" element={<ProjectFormPage />} />
                    <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                    <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
                    
                    {/* Ticket routes */}
                    <Route path="/tickets" element={<TicketListPage />} />
                    <Route path="/tickets/new" element={<TicketFormPage />} />
                    <Route path="/tickets/:id" element={<TicketDetailsPage />} />
                    <Route path="/tickets/:id/edit" element={<TicketFormPage />} />
                    
                    {/* User routes */}
                    <Route path="/users" element={<UserListPage />} />
                    <Route path="/profile" element={<UserProfilePage />} />
                  </Route>
                </Route>

                {/* 404 route */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}
              </Routes>
            </Router>
          </TicketProvider>
        </ProjectProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;