const Paths = {
  home: (eventId = ":eventId") => `/matching-event/${eventId}`,
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
  bio: (eventId = ":eventId", userId = ":userId") =>
    `${Paths.enrollingPhase(eventId, userId)}/bio`,
  uploadPhoto: (eventId = ":eventId", userId = ":userId") => {
    return `${Paths.enrollingPhase(eventId, userId)}/photos`;
  },
  profileBasic: (userId = ":userId") => `${Paths.enrollingPhase(userId)}/basic`,
};

export default Paths;
