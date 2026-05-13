/* ══════════════════════════════════════════════════
   BRaket MVP – TypeScript type definitions
   ══════════════════════════════════════════════════ */

/* ── Auth & Users ── */
export type UserRole = "client" | "talent";

export interface User {
  id: string;
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  initials: string;
  bio: string;
  role: UserRole;
  createdAt: string;
  phone?: string;
  socials?: { facebook?: string; instagram?: string; twitter?: string };
}

export interface TalentProfile extends User {
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
  verified: boolean;
  portfolio?: PortfolioItem[];
}

export interface ClientProfile extends User {
  role: "client";
  company?: string;
  projectsPosted: number;
}

/* ── Skills ── */
export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

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

/* ── Reviews ── */
export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  client: ClientProfile;
  talentId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

/* ── Portfolio ── */
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

/* ── Helpers ── */
export interface NavItem {
  href: string;
  label: string;
  icon?: string;
}
