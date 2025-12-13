ESTORA Headless WooCommerce — 项目进度说明

本文用于阶段性总结目前 Headless WooCommerce 架构已完成的内容、关键技术决策、以及已改动 / 新增的文件。
目的是：
	•	明确当前系统“已完成什么”
	•	避免后续重复踩坑
	•	为下一阶段（Checkout / Orders / Profile 深度对接）提供清晰起点

⸻

一、总体架构状态（当前结论）

结论一句话：

✅ 用户体系（注册 / 登录 / JWT / 数据库写入）已完全打通
⚠️ 电商核心闭环（Checkout / Orders / Address）尚未实现
⚠️ Cart 与 Order 仍处于“展示级”阶段

当前技术架构
	•	前端：React + Vite（完全 Headless）
	•	后端：WordPress + WooCommerce
	•	通信方式：
	•	Woo Store API（产品 / Cart / Checkout 预备）
	•	自定义 REST API（/wp-json/estora/v1/*）
	•	认证方案：JWT（免费插件 + LiteSpeed 兼容修复）
	•	开发环境：
	•	Frontend：http://localhost:5173
	•	Backend：https://estora.au

⸻

二、已完成的核心功能（✅ 已验证）

1️⃣ 用户注册（Headless）
	•	成功实现 匿名注册（无需 WordPress 后台表单）
	•	新用户可写入：
	•	*_users
	•	*_usermeta
	•	自动分配角色：customer
	•	与 WooCommerce Customer 同步

后端接口：

POST /wp-json/estora/v1/register


⸻

2️⃣ 用户登录（JWT）
	•	使用 JWT 插件标准端点
	•	成功获取 token
	•	成功通过 token 识别当前用户

登录流程：

POST /wp-json/jwt-auth/v1/token
→ 返回 token
→ Authorization: Bearer <token>
→ GET /wp-json/estora/v1/me


⸻

3️⃣ 当前用户信息（替代 wp/v2/users/me）

⚠️ 明确结论：wp/v2/users/me 在 JWT 场景下不可用（403）

	•	已实现自定义端点，完全兼容 JWT

后端接口：

GET /wp-json/estora/v1/me

	•	校验方式：is_user_logged_in()
	•	返回字段：
	•	id
	•	email
	•	username
	•	firstName / lastName
	•	displayName

⸻

4️⃣ JWT + LiteSpeed 兼容问题（已解决）

已确认并修复的问题：
	•	LiteSpeed / cPanel 环境下：
	•	Authorization header 不自动进入 PHP
	•	导致 JWT 报错：jwt_auth_bad_config

解决方案（已生效）：
	•	在 wp-config.php 中增加兜底逻辑
	•	确保 $_SERVER['HTTP_AUTHORIZATION'] 可用

⸻

5️⃣ CORS（Headless 开发支持）
	•	允许 http://localhost:5173 访问 WordPress REST API
	•	支持 credentials（JWT / Cart Token）
	•	正确处理 OPTIONS 预检请求

⸻

三、前端已完成的页面与逻辑

Auth 相关
	•	✅ Login.jsx
	•	JWT 登录
	•	拉取 /estora/v1/me
	•	写入 localStorage：authToken / user
	•	✅ Signup.jsx
	•	注册 → 自动登录 → Profile
	•	完整错误处理
	•	✅ Profile.jsx
	•	登录 / 未登录 UI 分离
	•	当前仅展示用户基础信息（Orders / Address 为占位）

⸻

四、后端新增 / 修改文件（重要）

1️⃣ wp-content/mu-plugins/estora.cors.php（核心）

当前最重要的 Headless 后端文件

包含功能：
	•	CORS 处理（本地开发）
	•	用户注册接口
	•	当前用户接口 /me

新增 REST Routes：

POST /wp-json/estora/v1/register
GET  /wp-json/estora/v1/me


⸻

2️⃣ wp-config.php（修改）
	•	配置 JWT Secret Key
	•	增加 LiteSpeed Authorization 兜底逻辑

⸻

五、前端新增 / 修改文件（关键）

新增 / 核心文件
	•	src/lib/http.js
	•	统一 HTTP 封装
	•	自动注入 WordPress Base URL
	•	自动注入 Authorization header
	•	错误统一处理
	•	src/store/cartStore.js
	•	当前仍为本地状态（待升级为 Woo Cart）

⸻

主要修改文件
	•	src/pages/auth/Login.jsx
	•	src/pages/auth/Signup.jsx
	•	src/pages/Profile.jsx
	•	src/App.jsx

⸻

六、已明确「不要再用」的方案（重要共识）
	•	❌ wp/v2/users/me
	•	❌ 直接在前端调用 wc/v3/orders
	•	❌ 在前端保存敏感 Woo REST Key

⸻

七、当前未完成但已明确的下一步（TODO）

🔜 第一优先级（电商闭环）
	•	Headless Checkout（wc/store/v1/checkout）
	•	Cart → Order 创建
	•	Payment（先用 COD / 测试网关）

🔜 第二优先级（用户中心）
	•	Orders 列表（/estora/v1/orders）
	•	Addresses 读取 / 写入
	•	Profile 页面真实数据接入

🔜 第三优先级（稳定性 & 安全）
	•	注册接口限流 / 防刷
	•	CORS 白名单生产化
	•	JWT 过期处理

⸻

八、阶段性里程碑总结

🎉 你已经完成了 Headless WooCommerce 最难的 30%

接下来所有工作都是：
	•	明确 API
	•	明确数据结构
	•	确定 UX 流程

下一步建议从：Checkout 开始。

⸻

（最后更新时间：2025-12-13）