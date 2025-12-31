const getApiBaseUrl = () => {
  let hostname = window.location.hostname;

  // Remove IPv6 brackets if any
  hostname = hostname.replace("[", "").replace("]", "");
  const API = "http://localhost:8000/api";

  return `http://${hostname}:8000/api`;
};

export default getApiBaseUrl;
