const getRoutes = {
  home: () => "/",
  registration: () => "/registration-form",
  bio: (userId: string) => `/bio-form/${userId}`,
};

export default getRoutes;
