import ky from "ky";

const apiClient = ky.create({
  prefixUrl: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token") || undefined,
  },
  hooks: {
    beforeRequest: [
      (options) => {
        options.headers.set(
          "Authorization",
          String(localStorage.getItem("token"))
        );
      },
    ],
  },
});

export default apiClient;

