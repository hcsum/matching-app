export const routes = {
  welcome: () => `/`,
  eventLandingPage: (eventId = ":eventId") => `/matching-event/${eventId}`,
  userHome: () => `/user`,
  userProfile: () => `/user/profile`,
  eventHome: (eventId = ":eventId", userId = ":userId") => {
    return `/matching-event/${eventId}/user/${userId}`;
  },
  enrollingPhase: (eventId = ":eventId", userId = ":userId") => {
    return `/matching-event/${eventId}/user/${userId}/enrolling`;
  },
  choosingPhase: (eventId = ":eventId", userId = ":userId") => {
    return `/matching-event/${eventId}/user/${userId}/choosing`;
  },
  matchingPhase: (eventId = ":eventId", userId = ":userId") => {
    return `/matching-event/${eventId}/user/${userId}/matching`;
  },
  userBio: (eventId = ":eventId", userId = ":userId") =>
    `${routes.enrollingPhase(eventId, userId)}/bio`,
  userPhotos: (eventId = ":eventId", userId = ":userId") => {
    return `${routes.enrollingPhase(eventId, userId)}/photos`;
  },
  loginOrSignup: (eventId = ":eventId") => `/matching-event/${eventId}/join`,
};
