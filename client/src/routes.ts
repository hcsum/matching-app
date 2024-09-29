export const routes = {
  eventCover: (eventId = ":eventId") => `/matching-event/${eventId}`,
  eventCheckParticipant: (eventId = ":eventId") =>
    `/matching-event/${eventId}/check-participant`,
  userHome: (eventId = ":eventId") => `/matching-event/${eventId}/user`,
  eventHome: (eventId = ":eventId") => {
    return `/matching-event/${eventId}/event`;
  },
  userProfile: (eventId = ":eventId") =>
    `/matching-event/${eventId}/user/profile`,
  userBio: (eventId = ":eventId") => `/matching-event/${eventId}/user/bio`,
  userPhotos: (eventId = ":eventId") => {
    return `/matching-event/${eventId}/user/photos`;
  },
  loginOrSignup: (eventId = ":eventId") => `/matching-event/${eventId}/join`,
  allEvents: () => "/internals/all-events",
  eventAdmin: (eventId = ":eventId") =>
    `internals/matching-event/${eventId}/admin`,
};
