const Paths = {
  home: (eventId = ":eventId") => `/matching-event/${eventId}`,
  profile: (eventId = ":eventId", userId = ":userId") =>
    `${Paths.home(eventId)}/profile-form/${userId}`,
  bio: (eventId = ":eventId", userId = ":userId") =>
    `${Paths.home(eventId)}/user/${userId}/bio-form`,
  userHome: (userId = ":userId") => `/user/${userId}`,
};

export default Paths;
