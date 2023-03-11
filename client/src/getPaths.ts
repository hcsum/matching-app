const Paths = {
  home: (eventId = ":eventId") => `/matching-event/${eventId}`,
  profile: (eventId = ":eventId", userId = ":userId") =>
    `${Paths.home(eventId)}/user/${userId}/profile-form`,
  bio: (eventId = ":eventId", userId = ":userId") =>
    `${Paths.home(eventId)}/user/${userId}/bio-form`,
  photo: (eventId = ":eventId", userId = ":userId") =>
    `${Paths.home(eventId)}/user/${userId}/upload-photo`,
  userHome: (userId = ":userId") => `/user/${userId}`,
  uploadPhoto: () => `/upload-photos`,
  pickingPage: (eventId = ":eventId", userId = ":userId") => {
    return `/matching-event/${eventId}/user/${userId}/picking`;
  },
};

export default Paths;
