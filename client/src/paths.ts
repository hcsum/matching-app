import { Phase } from "./api/matching-event";

const Paths = {
  home: (eventId = ":eventId") => `/matching-event/${eventId}`,
  userHome: (userId = ":userId") => `/user/${userId}`,
  eventHome: (eventId = ":eventId", userId = ":userId") => {
    return `/matching-event/${eventId}/user/${userId}`;
  },
  choosingPhase: (eventId = ":eventId", userId = ":userId") => {
    return `/matching-event/${eventId}/user/${userId}/picking`;
  },
  enrollingPhase: (userId = ":userId") => {
    return `/user/${userId}/profile`;
  },
  profileBasic: (userId = ":userId") => `${Paths.enrollingPhase(userId)}/basic`,
  bio: (userId = ":userId") => `${Paths.enrollingPhase(userId)}/bio`,
  uploadPhoto: (userId = ":userId") => {
    return `${Paths.enrollingPhase(userId)}/photos`;
  },
};

export const getMatchingEventPhasePath = (phase: Phase) => {
  switch (phase) {
    case "choosing":
      return Paths.choosingPhase;

    case "enrolling":
      return Paths.enrollingPhase;
    default:
      return Paths.home;
  }
};

export default Paths;
