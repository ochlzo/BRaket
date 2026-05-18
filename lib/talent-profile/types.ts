import type { ProficiencyLevel } from "@prisma/client";

export type TalentProfileSocialLink = {
  href: string;
  label: string;
};

export type TalentProfileSkill = {
  level: ProficiencyLevel;
  name: string;
};

export type TalentProfileMediaItem = {
  id: string;
  url: string;
};

export type TalentProfileServiceItem = {
  categories: string[];
  description: string;
  id: string;
  maxPrice: number;
  media: TalentProfileMediaItem[];
  minPrice: number;
  priceUnit: string;
  title: string;
};

export type TalentProfilePortfolioItem = {
  createdAt: string;
  description: string;
  id: string;
  media: TalentProfileMediaItem[];
  title: string;
  updatedAt: string;
};

export type TalentProfileReviewItem = {
  bookingServiceTitle: string;
  comment: string;
  createdAt: string;
  id: string;
  rating: number;
  reviewerName: string;
};

export type TalentProfileBoost = {
  badgeLabel: string;
  expiresAt: string;
  features: string[];
  name: string;
  slug: string;
  visibilityRank: number;
};

export type TalentProfilePageData = {
  activeBoost: TalentProfileBoost | null;
  authId: string;
  avatarUrl: string;
  backgroundImageUrl: string;
  bio: string;
  college: string;
  course: string;
  displayName: string;
  email: string;
  facebookUrl: string;
  firstName: string;
  githubUrl: string;
  headline: string;
  instagramUrl: string;
  isVerified: boolean;
  joinedLabel: string;
  lastName: string;
  linkedinUrl: string;
  portfolio: TalentProfilePortfolioItem[];
  receivedReviews: TalentProfileReviewItem[];
  reputationLabel: string;
  services: TalentProfileServiceItem[];
  talentAvgRating: number | null;
  talentReviewCount: number;
  totalProjectsCompleted: number;
  userId: string;
  skills: TalentProfileSkill[];
  socialLinks: TalentProfileSocialLink[];
  username: string;
  website: string;
  xUrl: string;
  yearLevel: number | null;
};

export type TalentProfilePageSource = {
  activeBoost?: TalentProfileBoost | null;
  user: {
    authId: string;
    avatarUrl: string | null;
    background_img_url: string | null;
    createdAt: Date;
    email: string;
    facebook_url: string | null;
    firstName: string | null;
    github_url: string | null;
    instagram_url: string | null;
    is_verified: boolean;
    lastName: string | null;
    linkedin_url: string | null;
    userId: string;
    username: string | null;
    x_url: string | null;
    TalentBookings: Array<{
      status: string;
    }>;
    TalentReviewsReceived: Array<{
      comment: string;
      createdAt: Date;
      rating: number;
      reviewId: string;
      Booking: {
        Service: {
          title: string;
        };
      };
      Reviewer: {
        firstName: string | null;
        lastName: string | null;
        username: string | null;
      };
    }>;
  };
  talentProfile: {
    bio: string;
    college: string;
    completed_commissions_count: number;
    course: string;
    headline: string;
    talent_avg_rating: number | null;
    talent_review_count: number;
    website: string | null;
    year_level: number;
    TalentSkills: Array<{
      proficiencyLevel: ProficiencyLevel;
      Skill: { name: string };
    }>;
    Services: Array<{
      description: string;
      maxPrice: { toString: () => string };
      minPrice: { toString: () => string };
      priceUnit: string;
      ServiceCategories: Array<{
        Category: { name: string };
      }>;
      ServiceMedia: Array<{
        mediaUrl: string;
        serviceDetailId: string;
      }>;
      serviceId: string;
      title: string;
    }>;
    TalentPortfolio: Array<{
      createdAt: Date;
      description: string;
      talent_portfolio_id: string;
      TalentPortfolioMedia: Array<{
        media_url: string;
        tportfolio_media_id: string;
      }>;
      title: string;
      updatedAt: Date;
    }>;
  } | null;
};
