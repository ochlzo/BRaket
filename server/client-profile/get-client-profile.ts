import "server-only";

import { prisma } from "@/lib/prisma";
import type { CurrentAppUser } from "@/server/users/current-user";

import { mapClientProfilePageData } from "@/lib/client-profile/mappers";
import type { ClientProfilePageData } from "@/lib/client-profile/types";

export async function getClientProfilePageData(
  currentUser: CurrentAppUser,
): Promise<ClientProfilePageData> {
  const user = await prisma.user.findUnique({
    where: {
      userId: currentUser.id,
    },
    include: {
      ClientReviewsReceived: {
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
          target: "CLIENT",
        },
      },
      TalentVerificationRequests: {
        orderBy: { reviewedAt: "desc" },
        select: { buEmail: true },
        take: 1,
        where: { status: "APPROVED" },
      },
      ClientProfile: {
        include: {
          ClientPortfolio: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              ClientPortfolioMedia: {
                orderBy: {
                  createdAt: "asc",
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return mapClientProfilePageData({
      clientProfile: null,
      user: {
        address: null,
        authId: currentUser.authId,
        avatarUrl: currentUser.avatarUrl || null,
        background_img_url: null,
        contactNum: null,
        createdAt: new Date(currentUser.createdAt),
        email: currentUser.email,
        facebook_url: null,
        firstName: currentUser.firstName || null,
        github_url: null,
        instagram_url: null,
        lastName: currentUser.lastName || null,
        linkedin_url: null,
        initials: currentUser.initials,
        userId: currentUser.id,
        username: currentUser.username || null,
        x_url: null,
        TalentVerificationRequests: [],
        ClientReviewsReceived: [],
      },
    });
  }

  return mapClientProfilePageData({
    clientProfile: user.ClientProfile,
    user: {
      address: null,
      authId: user.authId,
      avatarUrl: user.avatarUrl ?? null,
      background_img_url: user.background_img_url ?? null,
      contactNum: user.contactNum ?? null,
      createdAt: user.createdAt,
      email: user.email,
      facebook_url: user.facebook_url ?? null,
      firstName: user.firstName ?? null,
      github_url: user.github_url ?? null,
      instagram_url: user.instagram_url ?? null,
      lastName: user.lastName ?? null,
      linkedin_url: user.linkedin_url ?? null,
      initials: user.initials ?? null,
      userId: user.userId,
      username: user.username ?? null,
      x_url: user.x_url ?? null,
      TalentVerificationRequests: user.TalentVerificationRequests,
      ClientReviewsReceived: user.ClientReviewsReceived,
    },
  });
}

export async function getPublicClientProfilePageData(
  username: string,
): Promise<ClientProfilePageData | null> {
  const normalizedUsername = username.trim();

  if (!normalizedUsername) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      username: normalizedUsername,
    },
    include: {
      ClientReviewsReceived: {
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
          target: "CLIENT",
        },
      },
      ClientProfile: {
        include: {
          ClientPortfolio: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              ClientPortfolioMedia: {
                orderBy: {
                  createdAt: "asc",
                },
              },
            },
          },
        },
      },
      TalentVerificationRequests: {
        orderBy: { reviewedAt: "desc" },
        select: { buEmail: true },
        take: 1,
        where: { status: "APPROVED" },
      },
    },
  });

  if (!user) {
    return null;
  }

  return mapClientProfilePageData({
    clientProfile: user.ClientProfile,
    user: {
      address: user.address ?? null,
      authId: user.authId,
      avatarUrl: user.avatarUrl ?? null,
      background_img_url: user.background_img_url ?? null,
      ClientReviewsReceived: user.ClientReviewsReceived,
      contactNum: user.contactNum ?? null,
      createdAt: user.createdAt,
      email: user.email,
      facebook_url: user.facebook_url ?? null,
      firstName: user.firstName ?? null,
      github_url: user.github_url ?? null,
      instagram_url: user.instagram_url ?? null,
      lastName: user.lastName ?? null,
      linkedin_url: user.linkedin_url ?? null,
      initials: user.initials ?? null,
      userId: user.userId,
      username: user.username ?? null,
      x_url: user.x_url ?? null,
      TalentVerificationRequests: user.TalentVerificationRequests,
    },
  });
}
