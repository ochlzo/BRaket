import "server-only";

import { prisma } from "@/lib/prisma";
import { mapTalentProfilePageData } from "@/lib/talent-profile/mappers";
import type { TalentProfilePageData } from "@/lib/talent-profile/types";
import type { CurrentAppUser } from "@/server/users/current-user";

export async function getTalentProfilePageData(
  currentUser: CurrentAppUser,
): Promise<TalentProfilePageData> {
  const user = await prisma.user.findUnique({
    where: {
      userId: currentUser.id,
    },
    include: {
      TalentBookings: {
        select: {
          status: true,
        },
        where: {
          status: "COMPLETED",
        },
      },
      TalentReviewsReceived: {
        include: {
          Booking: {
            include: {
              Service: true,
            },
          },
          Reviewer: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        where: {
          target: "TALENT",
        },
      },
      TalentProfile: {
        include: {
          TalentSkills: {
            orderBy: { createdAt: "asc" },
            include: {
              Skill: true,
            },
          },
          Services: {
            orderBy: { createdAt: "desc" },
            include: {
              ServiceCategories: {
                include: {
                  Category: true,
                },
              },
              ServiceMedia: {
                orderBy: { createdAt: "asc" },
              },
            },
          },
          TalentPortfolio: {
            orderBy: { createdAt: "desc" },
            include: {
              TalentPortfolioMedia: {
                orderBy: { createdAt: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return mapTalentProfilePageData({
      talentProfile: null,
      user: {
        authId: currentUser.authId,
        avatarUrl: currentUser.avatarUrl || null,
        background_img_url: null,
        createdAt: new Date(currentUser.createdAt),
        email: currentUser.email,
        facebook_url: null,
        firstName: currentUser.firstName || null,
        github_url: null,
        instagram_url: null,
        is_verified: currentUser.isVerified,
        lastName: currentUser.lastName || null,
        linkedin_url: null,
        userId: currentUser.id,
        username: currentUser.username || null,
        x_url: null,
        TalentBookings: [],
        TalentReviewsReceived: [],
      },
    });
  }

  return mapTalentProfilePageData({
    talentProfile: user.TalentProfile,
    user: {
      authId: user.authId,
      avatarUrl: user.avatarUrl ?? null,
      background_img_url: user.background_img_url ?? null,
      createdAt: user.createdAt,
      email: user.email,
      facebook_url: user.facebook_url ?? null,
      firstName: user.firstName ?? null,
      github_url: user.github_url ?? null,
      instagram_url: user.instagram_url ?? null,
      is_verified: user.is_verified,
      lastName: user.lastName ?? null,
      linkedin_url: user.linkedin_url ?? null,
      userId: user.userId,
      username: user.username ?? null,
      x_url: user.x_url ?? null,
      TalentBookings: user.TalentBookings,
      TalentReviewsReceived: user.TalentReviewsReceived,
    },
  });
}

export async function getPublicTalentProfilePageData(
  username: string,
): Promise<TalentProfilePageData | null> {
  const normalizedUsername = username.trim();

  if (!normalizedUsername) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      username: normalizedUsername,
    },
    include: {
      TalentBookings: {
        select: {
          status: true,
        },
        where: {
          status: "COMPLETED",
        },
      },
      TalentReviewsReceived: {
        include: {
          Booking: {
            include: {
              Service: true,
            },
          },
          Reviewer: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        where: {
          target: "TALENT",
        },
      },
      TalentProfile: {
        include: {
          Services: {
            orderBy: { createdAt: "desc" },
            include: {
              ServiceCategories: {
                include: {
                  Category: true,
                },
              },
              ServiceMedia: {
                orderBy: { createdAt: "asc" },
              },
            },
          },
          TalentPortfolio: {
            orderBy: { createdAt: "desc" },
            include: {
              TalentPortfolioMedia: {
                orderBy: { createdAt: "asc" },
              },
            },
          },
          TalentSkills: {
            orderBy: { createdAt: "asc" },
            include: {
              Skill: true,
            },
          },
        },
      },
    },
  });

  if (!user?.TalentProfile) {
    return null;
  }

  return mapTalentProfilePageData({
    talentProfile: user.TalentProfile,
    user: {
      authId: user.authId,
      avatarUrl: user.avatarUrl ?? null,
      background_img_url: user.background_img_url ?? null,
      createdAt: user.createdAt,
      email: user.email,
      facebook_url: user.facebook_url ?? null,
      firstName: user.firstName ?? null,
      github_url: user.github_url ?? null,
      instagram_url: user.instagram_url ?? null,
      is_verified: user.is_verified,
      lastName: user.lastName ?? null,
      linkedin_url: user.linkedin_url ?? null,
      TalentBookings: user.TalentBookings,
      TalentReviewsReceived: user.TalentReviewsReceived,
      userId: user.userId,
      username: user.username ?? null,
      x_url: user.x_url ?? null,
    },
  });
}
