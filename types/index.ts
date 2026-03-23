/* ══════════════════════════════════════════════════
   BRaket MVP – TypeScript type definitions
   ══════════════════════════════════════════════════ */

/* ── Auth & Users ── */
export type UserRole = "client" | "talent";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  isOnboarded: boolean;
}

export interface BaseProfile {
  id: string;
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  role: UserRole;
  createdAt: string;
}

export interface TalentProfile extends BaseProfile {
  role: "talent";
  headline: string;
  location: string;
  minRate: number;
  maxRate: number;
  skills: TalentSkill[];
  rating: number;
  reviewCount: number;
  available: boolean;
  servicesCount: number;
  completedProjects: number;
}

export interface ClientProfile extends BaseProfile {
  role: "client";
  company?: string;
  projectsPosted: number;
}

/* ── Skills ── */
export type SkillLevel = "beginner" | "intermediate" | "expert";

export interface TalentSkill {
  name: string;
  level: SkillLevel;
}

/* ── Categories ── */
export type CategorySlug =
  | "web-development"
  | "graphic-design"
  | "photography"
  | "video-editing"
  | "ui-ux-design"
  | "content-writing"
  | "social-media"
  | "music-audio"
  | "digital-marketing"
  | "business-consulting";

export interface Category {
  slug: CategorySlug;
  label: string;
  emoji: string;
}

/* ── Services ── */
export type ServiceStatus = "draft" | "published" | "paused";

export interface ServiceListing {
  id: string;
  talentId: string;
  title: string;
  description: string;
  category: CategorySlug;
  price: number;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}

/* ── Bookings ── */
export type BookingStatus =
  | "pending"
  | "accepted"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "declined";

export interface Booking {
  id: string;
  serviceId: string;
  service: ServiceListing;
  clientId: string;
  client: ClientProfile;
  talentId: string;
  talent: TalentProfile;
  projectDetails: string;
  budget?: number;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

/* ── Helpers ── */
export interface NavItem {
  href: string;
  label: string;
  icon?: string;
}
