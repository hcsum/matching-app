import ky from "ky";

const apiClient = ky.create({
  prefixUrl: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
    credentials: "include",
  },
});

export default apiClient;

