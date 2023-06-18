import ky from "ky";
import { getCookieValue } from "../utils/get-cookie-value";

const apiClient = ky.create({
  prefixUrl:
    process.env.NODE_ENV === "production"
      ? "/api"
      : `http://${window.location.hostname}:4000/api`,
  hooks: {
    beforeRequest: [
      (options) => {
        options.headers.set(
          "Authorization",
          getCookieValue("token") || localStorage.getItem("token") || ""
        );
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          document.cookie = "";
          window.location.href = "/";
        }
        return response;
      },
    ],
  },
});

export default apiClient;
