import React, { useState } from 'react';
import { View, User, Report, EmergencyContact, ReportStatus, ReportCategory, ResolutionDetails } from './types';
import { MOCK_USERS } from './constants';

import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import ReportIssueScreen from './screens/ReportIssueScreen';
import ManageContactsScreen from './screens/ManageContactsScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';

import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Landing);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [reports, setReports] = useState<Report[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const handleUserLogin = (email: string, pass: string) => {
    if (email === 'admin@socialcop.app') {
      setAuthError('Please use the Admin Portal to sign in.');
      return;
    }
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setIsAdmin(false);
      setCurrentUser(user);
      setView(View.Home);
      setAuthError(null);
    } else {
      setAuthError('Invalid email or password.');
    }
  };
  
  const handleAdminLogin = (email: string, pass: string) => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user && email === 'admin@socialcop.app') {
      setIsAdmin(true);
      setCurrentUser(user);
      setView(View.AdminDashboard);
      setAuthError(null);
    } else {
      setAuthError('Invalid admin credentials.');
    }
  };

  const handleSignup = (fullName: string, email: string, phone: string, pass: string) => {
    if (users.some(u => u.email === email)) {
      setAuthError('An account with this email already exists.');
      return;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName,
      email,
      phone,
      password: pass,
      emergencyContacts: [],
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setView(View.OnboardingContacts);
    setAuthError(null);
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setView(View.Landing);
  };
  
  const handleReportSubmit = (newReportData: Omit<Report, 'id' | 'timestamp' | 'status' | 'userId' | 'userName'>) => {
      if (!currentUser) return;
      const newReport: Report = {
          ...newReportData,
          id: `report-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.fullName,
          status: ReportStatus.Reported,
          timestamp: new Date(),
      };
      setReports([newReport, ...reports]);
      setSelectedCategory(null);
      setView(View.Profile);
  };

  const handleUpdateReportStatus = (reportId: string, newStatus: ReportStatus) => {
    setReports(prevReports => 
        prevReports.map(report => 
            report.id === reportId ? { ...report, status: newStatus } : report
        )
    );
  };

  const handleResolveReport = (reportId: string, resolutionDetails: Omit<ResolutionDetails, 'adminId'>) => {
     if (!currentUser) return;
     setReports(prevReports => 
        prevReports.map(report => 
            report.id === reportId ? { 
                ...report, 
                status: ReportStatus.Resolved,
                resolutionDetails: {
                    ...resolutionDetails,
                    adminId: currentUser.id,
                }
            } : report
        )
    );
  };

  const handleSaveContacts = (updatedContacts: EmergencyContact[]) => {
      if (!currentUser) return;
      const updatedUser = { ...currentUser, emergencyContacts: updatedContacts };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
      setView(View.Profile);
  };

  const handleOnboardingComplete = (updatedContacts: EmergencyContact[]) => {
      if (!currentUser) return;
      const updatedUser = { ...currentUser, emergencyContacts: updatedContacts };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
      setView(View.Home);
  };
  
  const handleSelectCategory = (category: ReportCategory) => {
    setSelectedCategory(category);
    setView(View.ReportIssue);
  };
  
  const handleCancelReport = () => {
    setSelectedCategory(null);
    setView(View.Home);
  };

  const renderScreen = () => {
    if (!currentUser) {
      switch (view) {
        case View.Landing:
            return <LandingScreen setView={setView} />;
        case View.AdminLogin:
            return <AdminLoginScreen onLogin={handleAdminLogin} setView={setView} loginError={authError} />;
        case View.Signup:
          return <SignupScreen onSignup={handleSignup} setView={setView} signupError={authError} />;
        case View.Login:
        default:
          return <LoginScreen onLogin={handleUserLogin} setView={setView} loginError={authError} />;
      }
    }

    if (isAdmin) {
        return <AdminDashboardScreen reports={reports} onUpdateStatus={handleUpdateReportStatus} onResolveReport={handleResolveReport} onLogout={handleLogout} />;
    }

    switch (view) {
      case View.Home:
        return <HomeScreen user={currentUser} onCategorySelect={handleSelectCategory} />;
      case View.ReportIssue:
        return <ReportIssueScreen user={currentUser} onReportSubmit={handleReportSubmit} onCancel={handleCancelReport} preselectedCategory={selectedCategory} />;
      case View.Profile:
        return <ProfileScreen user={currentUser} reports={reports} setView={setView} onLogout={handleLogout} />;
      case View.ManageContacts:
        return <ManageContactsScreen initialContacts={currentUser.emergencyContacts} onSave={handleSaveContacts} onCancel={() => setView(View.Profile)} />;
      case View.OnboardingContacts:
        return <ManageContactsScreen initialContacts={currentUser.emergencyContacts} onSave={handleOnboardingComplete} onCancel={() => setView(View.Home)} isOnboarding={true} />;
      default:
        setView(View.Home);
        return <HomeScreen user={currentUser} onCategorySelect={handleSelectCategory} />;
    }
  };

  const showNav = currentUser && !isAdmin && (view === View.Home || view === View.ReportIssue || view === View.Profile);

  return (
    <div className="h-screen w-screen font-sans">
      <main className={`h-full ${showNav ? 'pb-16' : ''}`}>
        {renderScreen()}
      </main>
      {showNav && <BottomNav currentView={view} setView={setView} />}
    </div>
  );
};

export default App;