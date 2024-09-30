import ky from "ky";

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
          localStorage.getItem("access_token") || ""
        );
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          window.location.href = "/";
        }
        if (response.status === 403) {
          window.location.href = "/";
        }
        return response;
      },
    ],
  },
});

export default apiClient;
