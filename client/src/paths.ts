const Paths = {
  welcome: () => `/`,
  eventLandingPage: (eventId = ":eventId") => `/matching-event/${eventId}`,
  userHome: (userId = ":userId") => `/user/${userId}`,
  eventHome: (eventId = ":eventId", userId = ":userId") => {
    return `/matching-event/${eventId}/user/${userId}`;
  },
  choosingPhase: (eventId = ":eventId", userId = ":userId") => {
    return `/matching-event/${eventId}/user/${userId}/choosing`;
  },
  enrollingPhase: (eventId = ":eventId", userId = ":userId") => {
    return `/matching-event/${eventId}/user/${userId}/enrolling`;
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
