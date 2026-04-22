// === OMS Type Definitions ===

export type UserRole = "customer" | "admin" | "technician";

export type OutageStatus = "pending" | "approved" | "in_progress" | "resolved" | "rejected";

export type OutageType = "electricity" | "internet" | "water";

export type Priority = "low" | "medium" | "high";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  specialization?: string; // for technicians
  createdAt: string;
}

export interface Outage {
  id: string;
  title: string;
  description: string;
  location: string;
  type: OutageType;
  status: OutageStatus;
  priority: Priority;
  reportedBy: string; // user id
  reportedByName: string;
  assignedTo?: string; // technician user id
  assignedToName?: string;
  resolutionNotes?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalOutages: number;
  pending: number;
  inProgress: number;
  resolved: number;
  byType: { type: OutageType; count: number }[];
  byPriority: { priority: Priority; count: number }[];
  recentTrend: { date: string; count: number }[];
}
