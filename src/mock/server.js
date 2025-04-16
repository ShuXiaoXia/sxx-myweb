import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// 为 Node 环境配置 MSW
export const server = setupServer(...handlers);
