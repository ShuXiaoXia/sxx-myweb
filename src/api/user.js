import httpRequest from "@/untils/httpRequest.js";

export async function register(userData) {
  return httpRequest.post("/register", userData);
}
