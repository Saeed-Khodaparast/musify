export class SpotifyAPI {
  constructor() {
    this.CLIENT_ID = "e64aaf2241684dedbf22fcb9cea58518";
    this.REDIRECT_URI = "http://localhost:5173";
    // this.REDIRECT_URI = "https://saeed-khodaparast.github.io/musify/";
    this.accessToken = null;
    this.refreshToken = null;
  }

  // Helper method to generate random string
  generateRandomString(length) {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  // Helper method to generate code challenge
  async generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  // Initialize authentication
  async initializeAuth() {
    const verifier = this.generateRandomString(128);
    const state = this.generateRandomString(16);
    localStorage.setItem("code_verifier", verifier);

    const challenge = await this.generateCodeChallenge(verifier);
    const args = new URLSearchParams({
      response_type: "code",
      client_id: this.CLIENT_ID,
      scope: "user-read-private user-read-email",
      redirect_uri: this.REDIRECT_URI,
      state: state,
      code_challenge_method: "S256",
      code_challenge: challenge,
    });

    window.location = "https://accounts.spotify.com/authorize?" + args;
  }

  // Handle the authentication callback
  async handleAuthCallback(code) {
    try {
      const verifier = localStorage.getItem("code_verifier");
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: this.CLIENT_ID,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: this.REDIRECT_URI,
          code_verifier: verifier,
        }),
      });

      const data = await response.json();
      if (data.access_token) {
        this.setTokens(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error getting token:", error);
      return false;
    }
  }

  // Set tokens and expiry
  setTokens(data) {
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    localStorage.setItem("spotify_access_token", data.access_token);
    localStorage.setItem("spotify_refresh_token", data.refresh_token);
    localStorage.setItem("token_expiry", Date.now() + data.expires_in * 1000);
  }

  // Check if token is expired
  isTokenExpired() {
    const expiry = localStorage.getItem("token_expiry");
    return expiry ? Date.now() > parseInt(expiry) : true;
  }

  // Get current access token
  getAccessToken() {
    return this.accessToken || localStorage.getItem("spotify_access_token");
  }

  // Example of how to make an API call
  async makeApiRequest(endpoint, method = "GET", body = null) {
    if (this.isTokenExpired()) {
      await this.refreshAccessToken();
    }

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });

    return response.json();
  }

  // Refresh token implementation
  async refreshAccessToken() {
    try {
      const refreshToken = localStorage.getItem("spotify_refresh_token");
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: this.CLIENT_ID,
        }),
      });

      const data = await response.json();
      if (data.access_token) {
        this.setTokens(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const spotifyApi = new SpotifyAPI();
