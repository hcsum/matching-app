import { Phase } from "./api/matching-event";

const Paths = {
  home: (eventId = ":eventId") => `/matching-event/${eventId}`,
  profile: (eventId = ":eventId", userId = ":userId") =>
    `${Paths.home(eventId)}/user/${userId}/profile-form`,
  bio: (eventId = ":eventId", userId = ":userId") =>
    `${Paths.home(eventId)}/user/${userId}/bio-form`,
  userHome: (userId = ":userId") => `/user/${userId}`,
  uploadPhoto: (eventId = ":eventId", userId = ":userId") => {
    return `/matching-event/${eventId}/user/${userId}/profile/photos`;
  },
  pickingPhasePage: (eventId = ":eventId", userId = ":userId") => {
    return `/matching-event/${eventId}/user/${userId}/picking`;
  },
  profilePhasePage: (eventId = ":eventId", userId = ":userId") => {
    return `/matching-event/${eventId}/user/${userId}/profile`;
  },
};

export const getMatchingEventPhasePath = (phase: Phase) => {
  switch (phase) {
    case "choosing":
      return Paths.pickingPhasePage;

    case "registration":
      return Paths.profilePhasePage;
    default:
      return Paths.home;
  }
};

export default Paths;
