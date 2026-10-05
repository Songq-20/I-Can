# 禁欲打卡 — iPhone PWA

这是一个纯本地、无账号、无广告的打卡工具。

## iPhone 使用方法（无需 Xcode）

1. 把本文件夹部署到任意 HTTPS 静态网站。
   推荐：GitHub Pages、Cloudflare Pages、Netlify。
2. 用 iPhone 的 Safari 打开部署后的网址。
3. 点 Safari 底部“分享”按钮 → “添加到主屏幕”。
4. 以后从桌面图标打开，使用体验接近独立 App。

## 数据保存

- 数据会同时写入 localStorage 和 IndexedDB。
- App 不把任何数据上传到服务器。
- Safari 网站数据被手动清除、系统极端清理或更换设备时，本地数据仍可能丢失。
- 因此建议偶尔点击“导出备份”，把 JSON 文件保存到 iCloud Drive。
- 换设备后可用“导入备份”恢复。

## 功能

- 当前连续天数
- 每日打卡
- 最长连续
- 累计打卡
- 近 30 天完成率
- 月历
- 重置计时并保留历史
- 修改起始日
- 自定义工具名称和提醒语
- JSON 导出/导入
- PWA 离线运行

## 部署到 GitHub Pages（最省心）

1. 新建一个 GitHub 仓库。
2. 上传本文件夹里的所有文件到仓库根目录。
3. 仓库 Settings → Pages。
4. Build and deployment 选择 “Deploy from a branch”。
5. Branch 选择 `main` / `(root)`，保存。
6. 等页面给出网址后，用 iPhone Safari 打开并“添加到主屏幕”。

注意：必须通过 HTTPS 打开，PWA 的离线缓存功能才能正常工作。
