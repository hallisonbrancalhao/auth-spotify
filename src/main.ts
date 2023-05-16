const CLIENT_ID = "b076e1e46db54514a8fc0ede65822538";
const REDIRECT_URI = "http://localhost:5173/callback";
const SCOPES = "user-read-email user-read-private";

const authEndpoint = "https://accounts.spotify.com/authorize";
const responseType = "token";
const query = (selector: string): HTMLElement =>
  document.querySelector(selector);

const getAccessToken = (): string | null => {
  const hash = window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      const parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});

  return hash.access_token;
};

const login = (): void => {
  const authUrl = `${authEndpoint}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${encodeURIComponent(SCOPES)}&response_type=${responseType}`;
  window.location.href = authUrl;
};

const fetchProfile = async (accessToken: string): Promise<void> => {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.ok) {
    const profile = await response.json();
    query("#displayName").innerText = profile.display_name;
    query("#id").innerText = profile.id;
    query("#email").innerText = profile.email;
    query("#uri").innerText = profile.uri;
    query("#uri").setAttribute("href", profile.external_urls.spotify);
    query("#url").innerText = profile.href;
    query("#url").setAttribute("href", profile.href);
    const imgUrlElement = query("#imgUrl") as HTMLImageElement;
    imgUrlElement.src = profile.images[0]?.url;
    console.log("fetchProfile : imgUrlElement:", imgUrlElement);
  } else {
    console.error("Erro ao buscar perfil do Spotify:", response.statusText);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const accessToken = getAccessToken();
  if (accessToken) {
    fetchProfile(accessToken);
  } else {
    query("#login").addEventListener("click", login);
  }
});
