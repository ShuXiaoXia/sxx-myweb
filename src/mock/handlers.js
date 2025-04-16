import { http, HttpResponse } from "msw";
// 模拟用户数据库
const users = [
  {
    id: 1,
    username: "user1",
    password: "password1",
  },
  {
    id: 2,
    username: "user2",
    password: "password2",
  },
];

export const handlers = [
  // 注册接口
  http.post("http://localhost:9527/api/register", async ({ request }) => {
    const { username, password } = await request.json();

    // 简单验证
    if (!username || !password) {
      return HttpResponse.json(
        { message: "Username and password are required" },
        { status: 402 },
      );
    }

    // 检查用户是否已存在
    const userExists = users.some((user) => user.username === username);
    if (userExists) {
      return HttpResponse.json(
        { message: "User already exists" },
        { status: 409 },
      );
    }

    // 创建新用户
    const newUser = {
      id: users.length + 1,
      username,
      password, // 注意: 实际应用中永远不要明文存储密码
    };

    users.push(newUser);

    return HttpResponse.json(
      {
        message: "User registered successfully",
        token: "mock-jwt-token",
        user: {
          id: newUser.id,
          username: newUser.username,
        },
      },
      { status: 201 },
    );
  }),

  // 登录接口
  http.post("/api/login", async ({ request }) => {
    const { username, password } = await request.json();

    // 查找用户
    const user = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      return HttpResponse.json(
        { message: "Invalid username or password" },
        { status: 401 },
      );
    }

    // 模拟返回 token
    return HttpResponse.json(
      {
        message: "Login successful",
        token: "mock-jwt-token",
        user: { id: user.id, username: user.username },
      },
      { status: 200 },
    );
  }),

  // 获取当前用户信息
  http.get("/api/user", async ({ request }) => {
    // 模拟检查授权头
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 在实际应用中，这里会验证 JWT token
    // 这里我们只是模拟返回第一个用户
    const user = users.find((u) => u.id === request.id);

    if (!user) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 });
    }

    return HttpResponse.json(
      {
        user: { id: user.id, username: user.username },
      },
      { status: 200 },
    );
  }),
];
