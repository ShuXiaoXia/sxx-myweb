<template>
  <nav class="navbar" ref="navbarRef">
    <!-- Logo 部分 -->
    <div class="navbar-logo" @click="goToHome">
      <img :src="logoUrl" alt="网站Logo" class="logo-image" />
      <span class="logo-text">MySite</span>
    </div>

    <!-- 导航链接 -->
    <div class="nav-links">
      <router-link to="/" class="nav-link">首页</router-link>
      <router-link to="/about" class="nav-link">关于</router-link>
      <router-link to="/contact" class="nav-link">联系我们</router-link>
    </div>

    <!-- 用户操作区域 -->
    <div class="user-actions">
      <!-- 已登录状态 -->
      <template v-if="isLoggedIn">
        <div class="user-profile" @click="toggleDropdown">
          <img
            :src="user.avatar || defaultAvatar"
            alt="用户头像"
            class="avatar"
          />
          <span class="username">{{ user.name || "用户" }}</span>
          <div v-if="showDropdown" class="dropdown-menu">
            <router-link to="/profile" class="dropdown-item"
              >个人中心</router-link
            >
            <router-link to="/settings" class="dropdown-item">设置</router-link>
            <button @click="logout" class="dropdown-item">退出登录</button>
          </div>
        </div>
      </template>

      <!-- 未登录状态 -->
      <template v-else>
        <button @click="openLoginModal" class="auth-button login-button">
          登录
        </button>
        <button @click="openRegisterModal" class="auth-button register-button">
          注册
        </button>
      </template>
    </div>

    <!-- 登录模态框 -->
    <!-- <LoginModal
      v-if="showLoginModal"
      @close="closeLoginModal"
      @login-success="handleLoginSuccess"
    /> -->

    <!-- 注册模态框 -->
    <!-- <RegisterModal
      v-if="showRegisterModal"
      @close="closeRegisterModal"
      @register-success="handleRegisterSuccess"
    /> -->
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
// import LoginModal from "@/components/LoginModal.vue";
// import RegisterModal from "@/components/RegisterModal.vue";

// 静态资源导入
import logoUrl from "@/assets/images/wechat-qrcode-placeholder.jpg";
import defaultAvatar from "@/assets/images/wechat-qrcode-placeholder.jpg";

const router = useRouter();
const userStore = useUserStore();

// 响应式状态
const showDropdown = ref(false);
const showLoginModal = ref(false);
const showRegisterModal = ref(false);

// 计算属性
const isLoggedIn = computed(() => userStore.isAuthenticated);
const user = computed(() => userStore.currentUser);

// 方法
const goToHome = () => {
  router.push("/");
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const openLoginModal = () => {
  showLoginModal.value = true;
  showRegisterModal.value = false;
};

const closeLoginModal = () => {
  showLoginModal.value = false;
};

const openRegisterModal = () => {
  showRegisterModal.value = true;
  showLoginModal.value = false;
};

const closeRegisterModal = () => {
  showRegisterModal.value = false;
};

const handleLoginSuccess = (userData) => {
  userStore.login(userData);
  closeLoginModal();
};

const handleRegisterSuccess = (userData) => {
  userStore.login(userData);
  closeRegisterModal();
};

const logout = () => {
  userStore.logout();
  showDropdown.value = false;
  router.push("/");
};

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  const userProfile = document.querySelector(".user-profile");
  if (userProfile && !userProfile.contains(event.target)) {
    showDropdown.value = false;
  }
};

onMounted(async () => {
  // await nextTick(); // 等待 DOM 更新
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.logo-image {
  height: 40px;
  width: auto;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #42b983;
}

.nav-link.router-link-exact-active {
  color: #42b983;
  border-bottom: 2px solid #42b983;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.login-button {
  background-color: transparent;
  border: 1px solid #42b983;
  color: #42b983;
}

.login-button:hover {
  background-color: rgba(66, 185, 131, 0.1);
}

.register-button {
  background-color: #42b983;
  border: 1px solid #42b983;
  color: white;
}

.register-button:hover {
  background-color: #3aa876;
  border-color: #3aa876;
}

.user-profile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #42b983;
}

.username {
  font-weight: 500;
  color: #2c3e50;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  overflow: hidden;
  z-index: 1001;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #2c3e50;
  transition: background-color 0.3s;
  text-align: left;
  width: 100%;
  background: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}
</style>
