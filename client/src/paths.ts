const Paths = {
  welcome: () => `/`,
  eventLandingPage: (eventId = ":eventId") => `/matching-event/${eventId}`,
  userHome: (userId = ":userId") => `/user/${userId}`,
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
    `${Paths.enrollingPhase(eventId, userId)}/bio`,
  userPhotos: (eventId = ":eventId", userId = ":userId") => {
    return `${Paths.enrollingPhase(eventId, userId)}/photos`;
  },
  signUp: (userId = ":userId") => `user/${userId}/sign-up`,
};

export default Paths;
