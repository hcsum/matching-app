const Paths = {
  home: (eventId = ":eventId") => `/matching-event/${eventId}`,
  registration: (eventId = ":eventId") =>
    `${Paths.home(eventId)}/registration-form`,
  bio: (eventId = ":eventId", userId = ":userId") =>
    `${Paths.home(eventId)}/user/${userId}/bio-form`,
  userHome: (eventId = ":eventId", userId = ":userId") =>
    `${Paths.home(eventId)}/user/${userId}`,
};

export default Paths;
