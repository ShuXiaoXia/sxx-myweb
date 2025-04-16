import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: null,
    isAuthenticated: false,
  }),
  actions: {
    login(userData) {
      this.currentUser = userData;
      this.isAuthenticated = true;
    },
    logout() {
      this.currentUser = null;
      this.isAuthenticated = false;
    },
  },
});
