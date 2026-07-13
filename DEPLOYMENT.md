# 自动发布说明

本项目保留 Hexo 作为生成器，但 Hexo 只在 GitHub Actions 中运行。仓库只管理 `main`：源码、Markdown、原始图片和工作流都在这个分支中；生成后的 `public/` 只作为 GitHub Pages 构建产物上传，不提交到 Git。

## 首次配置

1. 仓库默认分支设为 `main`，GitHub Pages 发布源设为 GitHub Actions。
2. `node_modules/`、`public/`、`.pages/` 和 `.deploy_git/` 不会提交。
3. 工作流使用仓库自带的 `GITHUB_TOKEN`，不需要创建个人令牌或 Actions Secret。
4. 推送后在 Actions 中观察 `Build and publish blog`。构建会验证关键旧页面和站点体积，通过后直接部署到 GitHub Pages。

## 日常发布

```powershell
git add source
git commit -m "Add blog post"
git push origin main
```

新文章继续放在 `source/_posts/`。启用了 `post_asset_folder`，文章图片应放在与 Markdown 同名的资源目录中。文章确实更新时，请手动修改 front matter 中的 `updated:`；未填写时将使用文章的 `date:`，不会被 GitHub Actions 的文件时间误改。

需要加密的文章只在 front matter 中添加 `encrypt: true`，不要填写 `password:`。构建程序会统一使用测试密码 `1qaz2wsx`。

## 本地验证（可选）

```powershell
npm ci
npm run build:ci
```

该命令会生成站点，并检查关键旧 URL 和站点体积。照片不会被压缩、重编码或修改，它也不会发布到 GitHub。

日常只需维护并推送 `main`，不需要生成或管理其他分支。
