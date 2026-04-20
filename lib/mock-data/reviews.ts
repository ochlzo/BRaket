import type { Review } from "@/lib/types";

import { clients } from "@/lib/mock-data/clients";

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
