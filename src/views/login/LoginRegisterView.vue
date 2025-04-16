<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- 顶部标题和切换按钮 -->
      <div class="auth-header">
        <div class="auth-switch">
          <span
            :class="{ active: activeTab === 'phone' }"
            @click="activeTab = 'phone'"
            >手机号{{ isLoginMode ? "登录" : "注册" }}</span
          >
          <span>|</span>
          <span
            :class="{ active: activeTab === 'account' }"
            @click="activeTab = 'account'"
            >密码{{ isLoginMode ? "登录" : "注册" }}</span
          >
          <!-- <span
            :class="{ active: activeTab === 'wechat' }"
            @click="activeTab = 'wechat'"
            >微信{{ isLoginMode ? "登录" : "注册" }}</span
          > -->
        </div>
      </div>

      <!-- 手机号登录表单 -->
      <div v-if="activeTab === 'phone'" class="phone-form">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <input
              v-model="phoneForm.phone"
              type="tel"
              placeholder="请输入手机号"
              maxlength="11"
              @blur="validatePhone"
            />
            <span class="error-message">{{ phoneErrors.phone }}</span>
          </div>

          <div class="form-group">
            <div class="sms-code-input">
              <input
                v-model="phoneForm.code"
                type="text"
                placeholder="请输入验证码"
                maxlength="6"
                @blur="validateCode"
              />
              <button
                type="button"
                class="send-code-btn"
                :disabled="isSendingCode"
                @click="sendSMSCode"
              >
                {{ codeBtnText }}
              </button>
            </div>
            <span class="error-message">{{ phoneErrors.code }}</span>
          </div>

          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? "处理中..." : isLoginMode ? "登录" : "注册" }}
          </button>
        </form>
      </div>
      <!-- 密码登录 -->
      <div v-if="activeTab === 'account'" class="account-form">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="username">用户名</label>
            <input
              type="text"
              v-model="accountForm.username"
              placeholder="请输入用户名"
              @blur="valiNameCode"
            />
            <span class="error-message">{{ accountErrors.username }}</span>
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input
              type="password"
              v-model="accountForm.password"
              placeholder="请输入密码"
              @blur="valiPasswordCode"
            />
            <span class="error-message">{{ accountErrors.password }}</span>
          </div>
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? "处理中..." : isLoginMode ? "登录" : "注册" }}
          </button>
        </form>
      </div>
      <!-- 微信登录 -->
      <div v-if="activeTab === 'wechat'" class="wechat-login">
        <div class="wechat-tip">
          <p>{{ isLoginMode ? "微信扫码登录" : "微信扫码注册" }}</p>
          <p>请使用微信扫描下方二维码</p>
        </div>
        <div class="qrcode-container">
          <!-- 这里放置微信二维码图片或生成二维码的组件 -->
          <img
            src="@/assets/images/wechat-qrcode-placeholder.jpg"
            alt="微信二维码"
          />
          <div v-if="qrcodeExpired" class="qrcode-expired">
            二维码已过期，<a href="#" @click.prevent="refreshQrcode"
              >点击刷新</a
            >
          </div>
        </div>
      </div>

      <!-- 登录方式切换 -->
      <div class="login-methods">
        <div
          v-show="!isLoginMode"
          class="method-tab"
          @click="switchMode('login')"
        >
          已有账号，去登录
        </div>
        <div
          v-show="isLoginMode"
          class="method-tab"
          @click="switchMode('register')"
        >
          没有账号，去注册
        </div>
      </div>

      <!-- 协议条款 -->
      <div class="agreement">
        <label>
          <input type="checkbox" v-model="agreed" />
          我已阅读并同意
          <a href="#" @click.prevent="showAgreement">《用户协议》</a>
          和
          <a href="#" @click.prevent="showPrivacy">《隐私政策》</a>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();

// 登录/注册模式
const isLoginMode = ref(true);
const activeTab = ref("phone"); // 'phone' 'account' 'wechat'

// 手机号表单数据
const phoneForm = reactive({
  phone: "",
  code: "",
});

// 表单错误信息
const phoneErrors = reactive({
  phone: "",
  code: "",
});

// 密码表单数据
const accountForm = reactive({
  username: "",
  password: "",
});

// 密码错误信息
const accountErrors = reactive({
  username: "",
  password: "",
});

// 状态管理
const isSubmitting = ref(false);
const isSendingCode = ref(false);
const countdown = ref(0);
const agreed = ref(false);
const qrcodeExpired = ref(false);

// 计算属性：验证码按钮文本
const codeBtnText = computed(() => {
  if (isSendingCode.value) return "发送中...";
  if (countdown.value > 0) return `${countdown.value}s后重新获取`;
  return "获取验证码";
});

// 切换登录/注册模式
const switchMode = (mode) => {
  isLoginMode.value = mode === "login";
  resetPhoneForm();
};

// 重置手机表单
const resetPhoneForm = () => {
  phoneForm.phone = "";
  phoneForm.code = "";
  phoneErrors.phone = "";
  phoneErrors.code = "";
};

// 验证手机号
const validatePhone = () => {
  if (!phoneForm.phone) {
    phoneErrors.phone = "请输入手机号";
    return false;
  }
  if (!/^1[3-9]\d{9}$/.test(phoneForm.phone)) {
    phoneErrors.phone = "请输入正确的手机号";
    return false;
  }
  phoneErrors.phone = "";
  return true;
};

// 验证验证码
const validateCode = () => {
  if (!phoneForm.code) {
    phoneErrors.code = "请输入验证码";
    return false;
  }
  if (!/^\d{6}$/.test(phoneForm.code)) {
    phoneErrors.code = "验证码必须是6位数字";
    return false;
  }
  phoneErrors.code = "";
  return true;
};

// 发送短信验证码
const sendSMSCode = async () => {
  if (!validatePhone()) return;
  if (isSendingCode.value || countdown.value > 0) return;

  isSendingCode.value = true;

  try {
    // 模拟API调用
    // const res = await sendSMSCodeApi(phoneForm.phone)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    ElMessage.success("验证码已发送");
    startCountdown();
  } catch (error) {
    console.error("发送验证码失败:", error);
    ElMessage.error("发送验证码失败，请重试");
  } finally {
    isSendingCode.value = false;
  }
};

// 倒计时
let countdownTimer = null;
const startCountdown = () => {
  countdown.value = 60;
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
    }
  }, 1000);
};

// 验证用户名
const valiNameCode = () => {
  if (!accountForm.username) {
    accountErrors.username = "请输入密码";
    return false;
  }

  // 密码长度8-20位
  if (accountForm.username.length < 4 || accountForm.username.length > 12) {
    accountErrors.username = "密码长度需为4-12位";
    return false;
  }
  accountErrors.username = "";
  return true;
};

//验证密码
const valiPasswordCode = () => {
  if (!accountForm.password) {
    accountErrors.password = "请输入密码";
    return false;
  }

  // 密码长度8-20位
  if (accountForm.password.length < 8 || accountForm.password.length > 20) {
    accountErrors.password = "密码长度需为8-20位";
    return false;
  }

  // 必须包含字母和数字
  const hasLetter = /[a-zA-Z]/.test(accountForm.password);
  const hasNumber = /\d/.test(accountForm.password);

  if (!hasLetter || !hasNumber) {
    accountErrors.password = "密码需包含字母和数字";
    return false;
  }

  accountErrors.password = "";
  return true;
};

import { register } from "@/api/user";
// 处理表单提交
const handleSubmit = async () => {
  if (!agreed.value) {
    ElMessage.warning("请先同意用户协议和隐私政策");
    return;
  }
  if (activeTab.value === "phone") {
    if (!validatePhone() || !validateCode()) return;
  } else {
    if (!valiNameCode() || !valiPasswordCode()) return;
  }

  isSubmitting.value = true;

  try {
    // 模拟API调用
    // const res = isLoginMode.value
    //   ? await loginByPhoneApi(phoneForm.phone, phoneForm.code)
    //   : await registerByPhoneApi(phoneForm.phone, phoneForm.code)

    // 使用示例

    register(accountForm)
      .then((data) => {
        console.log("Registration success:", data);
      })
      .catch((error) => {
        console.error("Registration error:", error);
      });
    // await new Promise((resolve) => setTimeout(resolve, 1500));

    // ElMessage.success(isLoginMode.value ? "登录成功" : "注册成功");
    // router.push("/home"); // 跳转到首页
  } catch (error) {
    console.error(isLoginMode.value ? "登录失败" : "注册失败", error);
    ElMessage.error(
      error.message || (isLoginMode.value ? "登录失败" : "注册失败"),
    );
  } finally {
    isSubmitting.value = false;
  }
};

// 微信二维码相关
const refreshQrcode = () => {
  qrcodeExpired.value = false;
  // 这里实际应该调用API获取新的二维码
  console.log("刷新微信二维码");
};

// 模拟微信扫码登录状态检查
let wechatCheckTimer = null;
onMounted(() => {
  // 如果是微信登录tab，开始检查登录状态
  if (activeTab.value === "wechat") {
    startWechatLoginCheck();
  }
});

onUnmounted(() => {
  if (wechatCheckTimer) {
    clearInterval(wechatCheckTimer);
  }
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});

const startWechatLoginCheck = () => {
  // 模拟每2秒检查一次微信登录状态
  wechatCheckTimer = setInterval(() => {
    // 实际项目中这里应该调用API检查扫码状态
    const isScanned = Math.random() > 0.8; // 模拟20%几率扫码成功
    const isExpired = Math.random() > 0.9; // 模拟10%几率二维码过期

    if (isScanned) {
      clearInterval(wechatCheckTimer);
      ElMessage.success("微信登录成功");
      router.push("/home");
    } else if (isExpired) {
      qrcodeExpired.value = true;
      clearInterval(wechatCheckTimer);
    }
  }, 2000);
};

// 协议相关
const showAgreement = () => {
  console.log("显示用户协议");
  // 实际项目中可以打开弹窗或跳转到协议页面
};

const showPrivacy = () => {
  console.log("显示隐私政策");
  // 实际项目中可以打开弹窗或跳转到隐私政策页面
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 20px;
  position: fixed;
  top: 0;
  max-width: 100vw;
  width: 100%;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  margin-top: 72px;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 30px;
}

.auth-switch span {
  margin: 0 10px;
  color: #999;
  cursor: pointer;
  font-size: 22px;
}

.auth-switch span.active {
  color: #07c160;
  font-weight: bold;
}

.form-group {
  padding-bottom: 30px;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #07c160;
  outline: none;
}

.error-message {
  color: #ee0a24;
  font-size: 12px;
  margin-top: 5px;
  display: block;
  position: absolute;
}

.sms-code-input {
  display: flex;
  gap: 10px;
}

.sms-code-input input {
  flex: 1;
}

.send-code-btn {
  padding: 0 15px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #07c160;
  font-size: 14px;
  white-space: nowrap;
}

.send-code-btn:disabled {
  color: #999;
  cursor: not-allowed;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #07c160;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
}

.submit-btn:disabled {
  background: #a0e8c3;
  cursor: not-allowed;
}

.wechat-login {
  text-align: center;
  margin: 20px 0;
}

.wechat-tip {
  margin-bottom: 20px;
  color: #666;
}

.wechat-tip p {
  margin: 5px 0;
}

.qrcode-container {
  margin: 0 auto;
  width: 200px;
  height: 200px;
  position: relative;
}

.qrcode-container img {
  width: 100%;
  height: 100%;
  border: 1px solid #eee;
}

.qrcode-expired {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
}

.qrcode-expired a {
  color: #07c160;
}

.login-methods {
  display: flex;
  justify-content: center;
  margin: 30px 0;
  gap: 30px;
}

.method-tab {
  display: flex;
  align-items: center;
  color: #999;
  cursor: pointer;
  font-size: 14px;
}

.method-tab.active {
  color: #07c160;
  font-weight: bold;
}

.method-tab i {
  margin-right: 5px;
  font-size: 18px;
}

.agreement {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-top: 20px;
}

.agreement a {
  color: #07c160;
}

.agreement input {
  margin-right: 5px;
  vertical-align: middle;
}
</style>
