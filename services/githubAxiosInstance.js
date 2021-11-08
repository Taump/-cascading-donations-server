import axios from "axios";

export default axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Basic ${btoa(`${process.env.GITHUB_CLIENT_ID}:${process.env.GITHUB_SECRET_KEY}`)}`,
    "User-Agent": "CASCADING DONATION",
    "Content-Type": "application/json"
  }
});