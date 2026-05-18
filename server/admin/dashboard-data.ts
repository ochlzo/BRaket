import "server-only";

import { BookingStatus, ReportStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type AdminDashboardData = {
  activeBookings: number;
  activityLogs: Array<{
    createdAt: string;
    detail: string;
    id: string;
    kind: string;
    title: string;
  }>;
  clientUsers: number;
  completedBookings: number;
  pendingApprovals: number;
  pendingReports: number;
  recentReports: Array<{
    createdAt: string;
    id: string;
    label: string;
    type: string;
  }>;
  recentUsers: Array<{
    createdAt: string;
    email: string;
    name: string;
    role: "Client" | "Talent";
  }>;
  services: number;
  talentUsers: number;
  totalBookings: number;
  totalUsers: number;
  verifiedTalents: number;
};

const activeBookingStatuses = [
  BookingStatus.PENDING,
  BookingStatus.ACCEPTED,
  BookingStatus.IN_PROGRESS,
];

function displayName(user: {
  email: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
}) {
  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return name || user.username || user.email;
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [
    totalUsers,
    talentUsers,
    verifiedTalents,
    services,
    totalBookings,
    activeBookings,
    completedBookings,
    pendingApprovals,
    pendingReports,
    recentUsers,
    recentReports,
    recentBookings,
    recentVerifications,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { is_talent: true } }),
    prisma.user.count({ where: { is_talent: true, is_verified: true } }),
    prisma.service.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: { in: activeBookingStatuses } } }),
    prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
    prisma.talentVerificationRequest.count({ where: { status: "PENDING" } }),
    prisma.contentReport.count({ where: { status: ReportStatus.PENDING } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
        email: true,
        firstName: true,
        is_talent: true,
        lastName: true,
        username: true,
      },
      take: 5,
    }),
    prisma.contentReport.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
        reportId: true,
        targetLabel: true,
        targetType: true,
      },
      take: 5,
      where: { status: ReportStatus.PENDING },
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        Client: {
          select: { email: true, firstName: true, lastName: true, username: true },
        },
        Service: { select: { title: true } },
        Talent: {
          select: { email: true, firstName: true, lastName: true, username: true },
        },
        bookingId: true,
        createdAt: true,
        status: true,
      },
      take: 5,
    }),
    prisma.talentVerificationRequest.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        User: {
          select: { email: true, firstName: true, lastName: true, username: true },
        },
        createdAt: true,
        requestId: true,
        status: true,
      },
      take: 5,
    }),
  ]);
  const activityLogs = [
    ...recentUsers.map((user) => ({
      createdAt: user.createdAt.toISOString(),
      detail: `${user.email} joined as ${user.is_talent ? "a talent" : "a client"}.`,
      id: `user-${user.email}`,
      kind: "User",
      title: displayName(user),
    })),
    ...recentReports.map((report) => ({
      createdAt: report.createdAt.toISOString(),
      detail: `${report.targetType} report submitted for ${report.targetLabel}.`,
      id: `report-${report.reportId}`,
      kind: "Report",
      title: "Content report submitted",
    })),
    ...recentBookings.map((booking) => ({
      createdAt: booking.createdAt.toISOString(),
      detail: `${displayName(booking.Client)} requested ${booking.Service.title} from ${displayName(booking.Talent)}.`,
      id: `booking-${booking.bookingId}`,
      kind: "Booking",
      title: `Booking ${booking.status.toLowerCase()}`,
    })),
    ...recentVerifications.map((request) => ({
      createdAt: request.createdAt.toISOString(),
      detail: `${displayName(request.User)} has a ${request.status.toLowerCase()} verification request.`,
      id: `verification-${request.requestId}`,
      kind: "Verification",
      title: "Talent verification activity",
    })),
  ]
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    .slice(0, 8);

  return {
    activeBookings,
    activityLogs,
    clientUsers: totalUsers - talentUsers,
    completedBookings,
    pendingApprovals,
    pendingReports,
    recentReports: recentReports.map((report) => ({
      createdAt: report.createdAt.toISOString(),
      id: report.reportId,
      label: report.targetLabel,
      type: report.targetType,
    })),
    recentUsers: recentUsers.map((user) => ({
      createdAt: user.createdAt.toISOString(),
      email: user.email,
      name: displayName(user),
      role: user.is_talent ? "Talent" : "Client",
    })),
    services,
    talentUsers,
    totalBookings,
    totalUsers,
    verifiedTalents,
  };
}
