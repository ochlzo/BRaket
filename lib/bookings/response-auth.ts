type BookingResponseViewer = {
  id: string;
} | null;

type BookingResponseTarget = {
  talentUserId: string;
};

export function canViewBookingResponse(
  viewer: BookingResponseViewer,
  booking: BookingResponseTarget,
) {
  return viewer?.id === booking.talentUserId;
}
