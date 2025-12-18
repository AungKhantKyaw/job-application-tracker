export const getAccessToken = () => localStorage.getItem("access_token");

export const isAuthenticated = () => !!getAccessToken();

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
