import ky, { HTTPError } from "ky";

const apiClient = ky.create({
  prefixUrl:
    process.env.NODE_ENV === "production"
      ? "/api"
      : `http://${window.location.hostname}:4000/api`,
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token") || "",
  },
  hooks: {
    beforeRequest: [
      (options) => {
        options.headers.set(
          "Authorization",
          localStorage.getItem("token") || ""
        );
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
        return response;
      },
    ],
  },
});

export default apiClient;
