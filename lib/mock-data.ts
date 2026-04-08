/* ══════════════════════════════════════════════════
   BRaket MVP – Mock data store
   UI-only: no database, all state in-memory
   ══════════════════════════════════════════════════ */

import type {
  Booking,
  Category,
  ClientProfile,
  Review,
  ServiceListing,
  TalentProfile,
} from "@/lib/types";

/* ── Categories ── */
export const categories: Category[] = [
  { slug: "web-development", label: "Web Development", emoji: "💻" },
  { slug: "graphic-design", label: "Graphic Design", emoji: "🎨" },
  { slug: "photography", label: "Photography", emoji: "📷" },
  { slug: "video-editing", label: "Video Editing", emoji: "🎬" },
  { slug: "ui-ux-design", label: "UI/UX Design", emoji: "🖥️" },
  { slug: "content-writing", label: "Content Writing", emoji: "✍️" },
  { slug: "social-media", label: "Social Media", emoji: "📱" },
  { slug: "music-audio", label: "Music & Audio", emoji: "🎵" },
  { slug: "digital-marketing", label: "Digital Marketing", emoji: "📈" },
  { slug: "business-consulting", label: "Business Consulting", emoji: "💼" },
];

/* ── Talent profiles ── */
export const talents: TalentProfile[] = [
  {
    id: "t1",
    userId: "u1",
    username: "maria-santos",
    firstName: "Maria",
    lastName: "Santos",
    email: "maria.santos@bicol-u.edu.ph",
    avatarUrl: "/images/avatar_maria.png",
    bio: "Passionate UI/UX designer with 3+ years of experience creating intuitive digital experiences. I specialize in mobile-first design and accessible interfaces. Currently pursuing a degree in Information Technology at Bicol University.",
    role: "talent",
    headline: "UI/UX Designer & Prototyping Specialist",
    location: "Legazpi City",
    minRate: 500,
    maxRate: 800,
    skills: [
      { name: "Figma", level: "expert" },
      { name: "Adobe XD", level: "expert" },
      { name: "Prototyping", level: "expert" },
      { name: "User Research", level: "intermediate" },
      { name: "Wireframing", level: "expert" },
      { name: "Design Systems", level: "intermediate" },
    ],
    rating: 4.9,
    reviewCount: 87,
    available: true,
    servicesCount: 3,
    completedProjects: 42,
    verified: true,
    phone: "+63 917 123 4567",
    socials: { facebook: "maria.santos.bu", instagram: "@maria.designs" },
    createdAt: "2024-08-15T00:00:00Z",
  },
  {
    id: "t2",
    userId: "u2",
    username: "john-reyes",
    firstName: "John",
    lastName: "Reyes",
    email: "john.reyes@bicol-u.edu.ph",
    avatarUrl: "/images/avatar_john.png",
    bio: "Full-stack developer specializing in React, Next.js, and Node.js. I love building performant and scalable web applications. Dean's List awardee at Bicol University's College of Science.",
    role: "talent",
    headline: "Full Stack Developer",
    location: "Daraga",
    minRate: 800,
    maxRate: 1200,
    skills: [
      { name: "React", level: "expert" },
      { name: "Next.js", level: "expert" },
      { name: "Node.js", level: "expert" },
      { name: "TypeScript", level: "expert" },
      { name: "MongoDB", level: "intermediate" },
      { name: "Tailwind CSS", level: "expert" },
    ],
    rating: 5.0,
    reviewCount: 124,
    available: true,
    servicesCount: 4,
    completedProjects: 68,
    verified: true,
    phone: "+63 918 234 5678",
    socials: { facebook: "john.reyes.dev", instagram: "@john.codes" },
    createdAt: "2024-06-10T00:00:00Z",
  },
  {
    id: "t3",
    userId: "u3",
    username: "ana-cruz",
    firstName: "Ana",
    lastName: "Cruz",
    email: "ana.cruz@bicol-u.edu.ph",
    avatarUrl: "/images/avatar_ana.png",
    bio: "Creative content writer and SEO specialist. I craft engaging blog posts, website copy, and marketing materials that connect with audiences. Journalism major at Bicol University.",
    role: "talent",
    headline: "Content Writer & SEO Specialist",
    location: "Legazpi City",
    minRate: 400,
    maxRate: 600,
    skills: [
      { name: "SEO Writing", level: "expert" },
      { name: "Copywriting", level: "expert" },
      { name: "Blog Posts", level: "expert" },
      { name: "Social Media Copy", level: "intermediate" },
      { name: "Technical Writing", level: "intermediate" },
    ],
    rating: 4.8,
    reviewCount: 65,
    available: false,
    servicesCount: 2,
    completedProjects: 35,
    verified: true,
    phone: "+63 919 345 6789",
    socials: { facebook: "ana.cruz.writes", instagram: "@ana.writesstuff" },
    createdAt: "2024-09-01T00:00:00Z",
  },
  {
    id: "t4",
    userId: "u4",
    username: "carlos-mendoza",
    firstName: "Carlos",
    lastName: "Mendoza",
    email: "carlos.mendoza@bicol-u.edu.ph",
    avatarUrl: "/images/avatar_carlos.png",
    bio: "Award-winning video editor with expertise in Adobe Premiere Pro and After Effects. I create compelling visual stories for brands, events, and social media. Film & Media Arts student at Bicol University.",
    role: "talent",
    headline: "Video Editor & Motion Designer",
    location: "Tabaco City",
    minRate: 600,
    maxRate: 900,
    skills: [
      { name: "Premiere Pro", level: "expert" },
      { name: "After Effects", level: "expert" },
      { name: "Color Grading", level: "expert" },
      { name: "Motion Graphics", level: "intermediate" },
      { name: "DaVinci Resolve", level: "intermediate" },
    ],
    rating: 4.7,
    reviewCount: 52,
    available: true,
    servicesCount: 3,
    completedProjects: 28,
    verified: true,
    phone: "+63 920 456 7890",
    socials: { facebook: "carlos.edits", instagram: "@carlos.motion" },
    createdAt: "2024-07-20T00:00:00Z",
  },
  {
    id: "t5",
    userId: "u5",
    username: "sofia-reyes",
    firstName: "Sofia",
    lastName: "Reyes",
    email: "sofia.reyes@bicol-u.edu.ph",
    avatarUrl: "/images/avatar_sofia.png",
    bio: "Graphic designer with a keen eye for branding and visual identity. I create logos, marketing collaterals, and social media graphics that make brands stand out. Fine Arts major at Bicol University.",
    role: "talent",
    headline: "Graphic Designer & Brand Strategist",
    location: "Legazpi City",
    minRate: 500,
    maxRate: 750,
    skills: [
      { name: "Adobe Illustrator", level: "expert" },
      { name: "Adobe Photoshop", level: "expert" },
      { name: "Branding", level: "expert" },
      { name: "Print Design", level: "intermediate" },
      { name: "Canva", level: "expert" },
    ],
    rating: 4.9,
    reviewCount: 98,
    available: true,
    servicesCount: 4,
    completedProjects: 55,
    verified: false,
    phone: "+63 921 567 8901",
    socials: { facebook: "sofia.designs", instagram: "@sofia.graphix" },
    createdAt: "2024-05-15T00:00:00Z",
  },
  {
    id: "t6",
    userId: "u6",
    username: "miguel-torres",
    firstName: "Miguel",
    lastName: "Torres",
    email: "miguel.torres@bicol-u.edu.ph",
    avatarUrl: "/images/avatar_miguel.png",
    bio: "Professional photographer specializing in portraits, events, and product photography. I capture moments that tell stories. Fine Arts major with focus on Photography at Bicol University.",
    role: "talent",
    headline: "Professional Photographer",
    location: "Daraga",
    minRate: 1000,
    maxRate: 1500,
    skills: [
      { name: "Portrait Photography", level: "expert" },
      { name: "Event Photography", level: "expert" },
      { name: "Product Photography", level: "expert" },
      { name: "Lightroom", level: "expert" },
      { name: "Studio Lighting", level: "intermediate" },
    ],
    rating: 5.0,
    reviewCount: 76,
    available: true,
    servicesCount: 3,
    completedProjects: 44,
    verified: true,
    phone: "+63 922 678 9012",
    socials: { facebook: "miguel.shots", instagram: "@miguel.captures" },
    createdAt: "2024-04-10T00:00:00Z",
  },
];

/* ── Client profiles ── */
export const clients: ClientProfile[] = [
  {
    id: "c1",
    userId: "u10",
    username: "startup-hub",
    firstName: "Alex",
    lastName: "Tan",
    email: "alex.tan@example.com",
    avatarUrl: "/images/avatar_alex.png",
    bio: "Startup founder looking for talented students to help build our brand.",
    role: "client",
    company: "Albay Startup Hub",
    projectsPosted: 5,
    phone: "+63 923 789 0123",
    socials: { facebook: "albay.startup.hub", instagram: "@albaystartup" },
    createdAt: "2024-10-01T00:00:00Z",
  },
  {
    id: "c2",
    userId: "u11",
    username: "cafe-bicolano",
    firstName: "Lisa",
    lastName: "Garcia",
    email: "lisa.garcia@example.com",
    avatarUrl: "/images/avatar_lisa.png",
    bio: "Small business owner needing help with branding and digital presence.",
    role: "client",
    company: "Café Bicolano",
    projectsPosted: 3,
    phone: "+63 924 890 1234",
    socials: { facebook: "cafe.bicolano", instagram: "@cafebicolano" },
    createdAt: "2024-11-15T00:00:00Z",
  },
];

/* ── Services ── */
export const services: ServiceListing[] = [
  {
    id: "s1",
    talentId: "t1",
    title: "Complete UI/UX Design Package",
    description: "End-to-end UI/UX design including user research, wireframing, high-fidelity mockups, and interactive prototypes. Includes up to 10 screens and 2 revision rounds.",
    category: "ui-ux-design",
    price: 3500,
    status: "published",
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2024-09-01T00:00:00Z",
  },
  {
    id: "s2",
    talentId: "t1",
    title: "Mobile App Design",
    description: "Design beautiful and functional mobile app interfaces for iOS or Android. Includes wireframes, UI design, and a clickable prototype.",
    category: "ui-ux-design",
    price: 5000,
    status: "published",
    createdAt: "2024-09-15T00:00:00Z",
    updatedAt: "2024-09-15T00:00:00Z",
  },
  {
    id: "s3",
    talentId: "t2",
    title: "Custom Website Development",
    description: "Full-stack website development with React/Next.js. Includes responsive design, SEO, and deployment. Perfect for portfolios, blogs, or landing pages.",
    category: "web-development",
    price: 8000,
    status: "published",
    createdAt: "2024-08-10T00:00:00Z",
    updatedAt: "2024-08-10T00:00:00Z",
  },
  {
    id: "s4",
    talentId: "t2",
    title: "E-Commerce Store Setup",
    description: "Complete e-commerce store built with modern technologies. Includes product catalog, shopping cart, checkout flow, and admin panel.",
    category: "web-development",
    price: 15000,
    status: "published",
    createdAt: "2024-08-20T00:00:00Z",
    updatedAt: "2024-08-20T00:00:00Z",
  },
  {
    id: "s5",
    talentId: "t3",
    title: "SEO Blog Content Package",
    description: "5 SEO-optimized blog posts (1000-1500 words each) with keyword research, meta descriptions, and internal linking strategy.",
    category: "content-writing",
    price: 2500,
    status: "published",
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2024-10-01T00:00:00Z",
  },
  {
    id: "s6",
    talentId: "t4",
    title: "Short-Form Video Editing",
    description: "Professional editing for Reels, TikTok, or YouTube Shorts. Includes cuts, transitions, text overlays, music sync, and color correction. Up to 5 videos.",
    category: "video-editing",
    price: 2000,
    status: "published",
    createdAt: "2024-09-10T00:00:00Z",
    updatedAt: "2024-09-10T00:00:00Z",
  },
  {
    id: "s7",
    talentId: "t5",
    title: "Brand Identity Package",
    description: "Complete brand identity including logo design (3 concepts), color palette, typography guide, and brand guidelines document.",
    category: "graphic-design",
    price: 4000,
    status: "published",
    createdAt: "2024-07-15T00:00:00Z",
    updatedAt: "2024-07-15T00:00:00Z",
  },
  {
    id: "s8",
    talentId: "t5",
    title: "Social Media Graphics Set",
    description: "10 custom social media graphics for Instagram, Facebook, or Twitter. Includes templates you can reuse and edit in Canva.",
    category: "graphic-design",
    price: 1500,
    status: "published",
    createdAt: "2024-08-01T00:00:00Z",
    updatedAt: "2024-08-01T00:00:00Z",
  },
  {
    id: "s9",
    talentId: "t6",
    title: "Event Photography Package",
    description: "Professional event photography (up to 4 hours). Includes 100+ edited photos delivered within 5 business days.",
    category: "photography",
    price: 5000,
    status: "published",
    createdAt: "2024-06-20T00:00:00Z",
    updatedAt: "2024-06-20T00:00:00Z",
  },
  {
    id: "s10",
    talentId: "t6",
    title: "Product Photography",
    description: "Studio-quality product photos (up to 10 products). Includes white background shots and lifestyle shots.",
    category: "photography",
    price: 3000,
    status: "published",
    createdAt: "2024-07-01T00:00:00Z",
    updatedAt: "2024-07-01T00:00:00Z",
  },
  {
    id: "s11",
    talentId: "t1",
    title: "Landing Page Wireframe",
    description: "Quick wireframe and low-fidelity prototype for a single landing page. Great for validating ideas before full design.",
    category: "ui-ux-design",
    price: 1000,
    status: "draft",
    createdAt: "2024-10-10T00:00:00Z",
    updatedAt: "2024-10-10T00:00:00Z",
  },
];

/* ── Bookings ── */
export const bookings: Booking[] = [
  {
    id: "b1",
    serviceId: "s1",
    service: services[0],
    clientId: "c1",
    client: clients[0],
    talentId: "t1",
    talent: talents[0],
    projectDetails: "We need a complete redesign of our startup's website. Looking for a modern, clean interface that highlights our tech products. Target audience is B2B professionals.",
    budget: 4000,
    notes: "Please use our existing brand colors (blue and white). We'd like the project done within 3 weeks.",
    status: "pending",
    createdAt: "2024-11-01T00:00:00Z",
    updatedAt: "2024-11-05T00:00:00Z",
  },
  {
    id: "b2",
    serviceId: "s7",
    service: services[6],
    clientId: "c2",
    client: clients[1],
    talentId: "t5",
    talent: talents[4],
    projectDetails: "Need a complete brand identity for our café. We want something warm, inviting, and distinctly Bicolano. The logo should incorporate local elements.",
    budget: 4500,
    status: "pending",
    createdAt: "2024-11-10T00:00:00Z",
    updatedAt: "2024-11-10T00:00:00Z",
  },
  {
    id: "b3",
    serviceId: "s3",
    service: services[2],
    clientId: "c1",
    client: clients[0],
    talentId: "t2",
    talent: talents[1],
    projectDetails: "Build a portfolio website for our startup hub to showcase member startups and their products. Should be fast, responsive, and SEO-friendly.",
    budget: 10000,
    status: "completed",
    createdAt: "2024-09-15T00:00:00Z",
    updatedAt: "2024-10-20T00:00:00Z",
  },
  {
    id: "b4",
    serviceId: "s6",
    service: services[5],
    clientId: "c2",
    client: clients[1],
    talentId: "t4",
    talent: talents[3],
    projectDetails: "Edit 5 promotional videos for our café's social media. Each video should be 30-60 seconds with upbeat music and text overlays showing our menu items.",
    budget: 2500,
    status: "accepted",
    createdAt: "2024-11-12T00:00:00Z",
    updatedAt: "2024-11-13T00:00:00Z",
  },
  {
    id: "b5",
    serviceId: "s9",
    service: services[8],
    clientId: "c1",
    client: clients[0],
    talentId: "t6",
    talent: talents[5],
    projectDetails: "Photograph our upcoming startup pitch event. Need both candid shots and professional headshots of speakers and attendees.",
    status: "pending",
    createdAt: "2024-11-14T00:00:00Z",
    updatedAt: "2024-11-14T00:00:00Z",
  },
];

/* ── Reviews ── */
export const reviews: Review[] = [
  {
    id: "r1",
    bookingId: "b3",
    clientId: "c1",
    client: clients[0],
    talentId: "t2",
    rating: 5,
    comment: "John delivered an outstanding portfolio website. The design was modern, the code was clean, and he communicated throughout the project. Would definitely hire again!",
    createdAt: "2024-10-22T00:00:00Z",
  },
  {
    id: "r2",
    bookingId: "b3",
    clientId: "c1",
    client: clients[0],
    talentId: "t1",
    rating: 5,
    comment: "Maria's UI/UX work was phenomenal. She exceeded my expectations with her attention to detail and creative solutions.",
    createdAt: "2024-10-25T00:00:00Z",
  },
  {
    id: "r3",
    bookingId: "b3",
    clientId: "c2",
    client: clients[1],
    talentId: "t5",
    rating: 4,
    comment: "Sofia created a beautiful brand identity for our café. The logo perfectly captured our Bicolano heritage.",
    createdAt: "2024-11-01T00:00:00Z",
  },
];

/* ── Helper functions ── */
export function getTalentByUsername(username: string): TalentProfile | undefined {
  return talents.find((t) => t.username === username);
}

export function getTalentById(id: string): TalentProfile | undefined {
  return talents.find((t) => t.id === id);
}

export function getServiceById(id: string): ServiceListing | undefined {
  return services.find((s) => s.id === id);
}

export function getServicesByTalent(talentId: string): ServiceListing[] {
  return services.filter((s) => s.talentId === talentId && s.status === "published");
}

export function getBookingsByClient(clientId: string): Booking[] {
  return bookings.filter((b) => b.clientId === clientId);
}

export function getBookingsByTalent(talentId: string): Booking[] {
  return bookings.filter((b) => b.talentId === talentId);
}

export function getReviewsByTalent(talentId: string): Review[] {
  return reviews.filter((r) => r.talentId === talentId);
}

export function getCategoryLabel(slug: string): string {
  return categories.find((c) => c.slug === slug)?.label ?? slug;
}

export function getPendingTalents(): TalentProfile[] {
  return talents.filter((t) => !t.verified);
}

export function getAllUsers(): (TalentProfile | ClientProfile)[] {
  return [...talents, ...clients];
}

/* ── Mock current user (toggle to test different views) ── */
export const mockCurrentUser = {
  id: "u10",
  email: "alex.tan@example.com",
  role: "client",
  isOnboarded: true,
};

export const mockCurrentClientProfile = clients[0];
export const mockCurrentTalentProfile = talents[0];
