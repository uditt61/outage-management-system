import { User, Outage, Notification, DashboardStats } from "@/types/oms";

// === Mock Users ===
export const mockUsers: User[] = [
  { id: "u1", name: "John Customer", email: "john@example.com", role: "customer", createdAt: "2024-01-15" },
  { id: "u2", name: "Admin User", email: "admin@example.com", role: "admin", createdAt: "2024-01-01" },
  { id: "u3", name: "Mike Technician", email: "mike@example.com", role: "technician", specialization: "Electrical", createdAt: "2024-01-10" },
  { id: "u4", name: "Sara Technician", email: "sara@example.com", role: "technician", specialization: "Network", createdAt: "2024-02-01" },
  { id: "u5", name: "Jane Customer", email: "jane@example.com", role: "customer", createdAt: "2024-03-01" },
];

// === Mock Outages ===
export const mockOutages: Outage[] = [
  {
    id: "o1", title: "Power outage on Main Street", description: "Complete blackout affecting 200+ homes in the downtown area. Started around 3 PM.",
    location: "123 Main St, Downtown", type: "electricity", status: "in_progress", priority: "high",
    reportedBy: "u1", reportedByName: "John Customer", assignedTo: "u3", assignedToName: "Mike Technician",
    createdAt: "2024-03-15T10:00:00Z", updatedAt: "2024-03-15T14:00:00Z",
  },
  {
    id: "o2", title: "Internet down in Oak District", description: "Fiber optic cable damage. No internet service in Oak District neighborhood.",
    location: "Oak District, Block 4-8", type: "internet", status: "pending", priority: "medium",
    reportedBy: "u5", reportedByName: "Jane Customer",
    createdAt: "2024-03-16T08:30:00Z", updatedAt: "2024-03-16T08:30:00Z",
  },
  {
    id: "o3", title: "Water main break on Elm Ave", description: "Major water main break causing flooding and water supply interruption.",
    location: "456 Elm Ave", type: "water", status: "approved", priority: "high",
    reportedBy: "u1", reportedByName: "John Customer",
    createdAt: "2024-03-16T12:00:00Z", updatedAt: "2024-03-16T13:00:00Z",
  },
  {
    id: "o4", title: "Partial power loss in Industrial Zone", description: "Intermittent power supply affecting manufacturing units.",
    location: "Industrial Zone, Sector 7", type: "electricity", status: "resolved", priority: "medium",
    reportedBy: "u5", reportedByName: "Jane Customer", assignedTo: "u3", assignedToName: "Mike Technician",
    resolutionNotes: "Replaced faulty transformer. Full power restored.",
    createdAt: "2024-03-10T06:00:00Z", updatedAt: "2024-03-11T18:00:00Z",
  },
  {
    id: "o5", title: "Internet slowdown in Tech Park", description: "Severely degraded internet speeds affecting all tenants.",
    location: "Tech Park, Building A-C", type: "internet", status: "rejected", priority: "low",
    reportedBy: "u1", reportedByName: "John Customer",
    createdAt: "2024-03-14T09:00:00Z", updatedAt: "2024-03-14T11:00:00Z",
  },
  {
    id: "o6", title: "Water pressure drop in Riverside", description: "Significantly low water pressure in the Riverside community.",
    location: "Riverside Community", type: "water", status: "pending", priority: "low",
    reportedBy: "u5", reportedByName: "Jane Customer",
    createdAt: "2024-03-17T07:00:00Z", updatedAt: "2024-03-17T07:00:00Z",
  },
];

// === Mock Notifications ===
export const mockNotifications: Notification[] = [
  { id: "n1", userId: "u1", message: "Your outage report 'Power outage on Main Street' has been approved and assigned.", read: false, createdAt: "2024-03-15T14:00:00Z" },
  { id: "n2", userId: "u1", message: "Technician Mike is working on your reported outage.", read: true, createdAt: "2024-03-15T15:00:00Z" },
  { id: "n3", userId: "u3", message: "New outage assigned: Power outage on Main Street (High Priority)", read: false, createdAt: "2024-03-15T14:05:00Z" },
  { id: "n4", userId: "u5", message: "Your outage report 'Internet down in Oak District' is under review.", read: false, createdAt: "2024-03-16T09:00:00Z" },
];

// === Dashboard Stats ===
export const mockDashboardStats: DashboardStats = {
  totalOutages: 6,
  pending: 2,
  inProgress: 1,
  resolved: 1,
  byType: [
    { type: "electricity", count: 2 },
    { type: "internet", count: 2 },
    { type: "water", count: 2 },
  ],
  byPriority: [
    { priority: "high", count: 2 },
    { priority: "medium", count: 2 },
    { priority: "low", count: 2 },
  ],
  recentTrend: [
    { date: "Mar 10", count: 1 },
    { date: "Mar 11", count: 0 },
    { date: "Mar 12", count: 0 },
    { date: "Mar 13", count: 0 },
    { date: "Mar 14", count: 1 },
    { date: "Mar 15", count: 1 },
    { date: "Mar 16", count: 2 },
    { date: "Mar 17", count: 1 },
  ],
};
