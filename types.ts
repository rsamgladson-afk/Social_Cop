export enum ReportCategory {
  Road = 'Road',
  Garbage = 'Garbage',
  CrimeSafety = 'Crime/Safety',
  Construction = 'Construction',
  Utilities = 'Utilities',
  Environment = 'Environment',
}

export enum ReportStatus {
  Reported = 'Reported',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
}

export interface LocationCoords {
  lat: number;
  lng: number;
}

export interface ResolutionDetails {
  photo: string;
  notes?: string;
  timestamp: Date;
  locationCoords: LocationCoords;
  adminId: string;
}

export interface Report {
  id: string;
  userId: string;
  userName: string;
  category: ReportCategory;
  photo?: string;
  location: string; // User-friendly address or description
  locationCoords: LocationCoords;
  description: string;
  status: ReportStatus;
  timestamp: Date;
  resolutionDetails?: ResolutionDetails;
}

export interface EmergencyContact {
  id:string;
  name: string;
  phone: string;
}

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  password?: string;
  emergencyContacts: EmergencyContact[];
}

export enum View {
  Landing,
  Login,
  AdminLogin,
  Signup,
  Home,
  ReportIssue,
  Profile,
  ManageContacts,
  AdminDashboard,
  OnboardingContacts,
}