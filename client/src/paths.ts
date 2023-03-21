import { Phase } from "./api/matching-event";

const Paths = {
  home: (eventId = ":eventId") => `/matching-event/${eventId}`,
  userHome: (userId = ":userId") => `/user/${userId}`,
  pickingPhasePage: (eventId = ":eventId", userId = ":userId") => {
    return `/matching-event/${eventId}/user/${userId}/picking`;
  },
  profilePhasePage: (eventId = ":eventId", userId = ":userId") => {
    return `/matching-event/${eventId}/user/${userId}/profile`;
  },
  profileBasic: (eventId = ":eventId", userId = ":userId") =>
    `${Paths.profilePhasePage(eventId, userId)}/basic`,
  bio: (eventId = ":eventId", userId = ":userId") =>
    `${Paths.profilePhasePage(eventId, userId)}/bio`,
  uploadPhoto: (eventId = ":eventId", userId = ":userId") => {
    return `${Paths.profilePhasePage(eventId, userId)}/photos`;
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
