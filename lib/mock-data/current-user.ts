import { clients } from "@/lib/mock-data/clients";
import { talents } from "@/lib/mock-data/talents";

export const mockCurrentUser = {
  id: "u10",
  email: "alex.tan@example.com",
  role: "client",
  isOnboarded: true,
};

export const mockCurrentClientProfile = clients[0];
export const mockCurrentTalentProfile = talents[0];
