const Paths = {
  home: (eventId = ":eventId") => `/matching-event/${eventId}`,
  registration: (eventId = ":eventId") =>
    `${Paths.home(eventId)}/registration-form`,
  bio: (eventId = ":eventId", userId = ":userId") =>
    `${Paths.home(eventId)}/bio-form/${userId}`,
};

export default Paths;
