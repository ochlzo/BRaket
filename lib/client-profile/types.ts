export type ClientProfileSocialLink = {
  href: string;
  label: string;
};

export type ClientProfilePortfolioMedia = {
  id: string;
  url: string;
};

export type ClientProfilePortfolioItem = {
  createdAt: string;
  description: string;
  id: string;
  media: ClientProfilePortfolioMedia[];
  title: string;
  updatedAt: string;
};

export type ClientProfileEditorValues = {
  about: string;
  avatarUrl: string;
  backgroundImageUrl: string;
  businessAddress: string;
  contactNum: string;
  facebookUrl: string;
  firstName: string;
  githubUrl: string;
  instagramUrl: string;
  lastName: string;
  linkedinUrl: string;
  organizationName: string;
  username: string;
  website: string;
  xUrl: string;
};

export type CreateClientPortfolioPostState = {
  message: string;
  ok: boolean;
  successToken?: string;
};

export type UpdateClientProfileState = {
  fieldErrors?: Partial<Record<keyof ClientProfileEditorValues, string>>;
  message: string;
  ok: boolean;
};

export type UpdateClientProfileAboutState = {
  message: string;
  ok: boolean;
};

export type UpdateClientProfileImagesState = {
  message: string;
  ok: boolean;
};

export type ClientProfilePageData = {
  about: string;
  averageRating: number | null;
  authId: string;
  avatarUrl: string;
  backgroundImageUrl: string;
  businessAddress: string;
  completedCommissionsCount: number | null;
  contactNum: string;
  displayName: string;
  email: string;
  firstName: string;
  facebookUrl: string;
  githubUrl: string;
  instagramUrl: string;
  joinedLabel: string;
  lastName: string;
  linkedinUrl: string;
  organizationName: string;
  portfolio: ClientProfilePortfolioItem[];
  reputationScore: number | null;
  reviewCount: number;
  socialLinks: ClientProfileSocialLink[];
  username: string;
  website: string;
  xUrl: string;
};

export type ClientProfilePageSource = {
  user: {
    address: string | null;
    authId: string;
    avatarUrl: string | null;
    background_img_url: string | null;
    contactNum: string | null;
    createdAt: Date;
    email: string;
    facebook_url: string | null;
    firstName: string | null;
    github_url: string | null;
    instagram_url: string | null;
    lastName: string | null;
    linkedin_url: string | null;
    initials: string | null;
    userId: string;
    username: string | null;
    x_url: string | null;
  };
  clientProfile: {
    about: string | null;
    business_address: string | null;
    client_avg_rating: number | null;
    client_profile_id: string;
    client_reputation_score: number | null;
    client_review_count: number | null;
    completed_commissions_count: number | null;
    createdAt: Date;
    organization_name: string;
    updatedAt: Date;
    website: string | null;
    ClientPortfolio: Array<{
      ClientPortfolioMedia: Array<{
        cportfolio_media_id: string;
        media_url: string;
      }>;
      client_portfolio_id: string;
      createdAt: Date;
      description: string;
      title: string;
      updatedAt: Date;
    }>;
  } | null;
};
