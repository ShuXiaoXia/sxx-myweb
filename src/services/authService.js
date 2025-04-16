import api from "@/utils/api";

export const authService = {
  // 注册
  async register(userData) {
    try {
      const response = await api.post("/register", userData);
      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  },

  // 登录
  async login(credentials) {
    try {
      const response = await api.post("/login", credentials);
      // 存储 token
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  },

  // 获取当前用户信息
  async getCurrentUser() {
    try {
      const response = await api.get("/me");
      return response.user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  },

  // 登出
  logout() {
    localStorage.removeItem("token");
    // 可以在这里添加重定向到登录页的逻辑
  },

  // 错误处理
  handleAuthError(error) {
    let errorMessage = "Authentication failed";

    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = error.response.data.message || "Invalid request";
          break;
        case 401:
          errorMessage = "Unauthorized - Please login again";
          this.logout();
          break;
        case 409:
          errorMessage = "User already exists";
          break;
        default:
          errorMessage = error.response.data.message || "Authentication error";
      }
    } else if (error.request) {
      errorMessage = "No response from server";
    } else {
      errorMessage = error.message;
    }

    return new Error(errorMessage);
  },
};
