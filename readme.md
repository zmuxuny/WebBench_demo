# WebBench 使用 Demo 及对比分析

以下文档从服务器配置、环境准备，到示例网站部署与 WebBench 安装，最后给出针对服务器 `http://123.249.8.194:8080/`（该服务器已经关闭） 的系列测试命令，涵盖基础场景、下载测试、对比分析、脚本化批量测试等，并附常见问题排查。

---

## 💡 配置服务器

### ✅ 服务器配置
- **操作系统**：CentOS 7.2  
- **CPU**：4 核  
- **内存**：8 GB  
- **带宽**：10 Mbps  
- **存储**：80 GB

### 服务器环境准备

1. **安全组放行 8080 端口**  
   - 登录华为云控制台，在 **弹性云服务器 → 安全组 → 配置规则** 中，添加入方向 TCP 8080，授权地址 `0.0.0.0/0`，允许外部访问。  
2. **Firewalld 放行 8080**  
   ```bash
   sudo firewall-cmd --zone=public --add-port=8080/tcp --permanent
   sudo firewall-cmd --reload
   ```  
   验证：`sudo firewall-cmd --zone=public --list-ports` 应包含 `8080/tcp`citeturn0search1。  
3. **系统更新与依赖**  
   ```bash
   sudo yum update -y
   sudo yum install -y gcc make ctags openssl-devel curl zip unzip
   ```  
4. **安装 Node.js 16.x 与 npm**  
   ```bash
   curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
   sudo yum install -y nodejs
   node -v   # v16.x.x
   npm -v    # 8.x.x
   ```  
   使用 NodeSource 源快速部署 Node.js 环境citeturn0search2。

---

## ✅ 部署网站

项目根目录统一使用 `/opt/webbench-demo`

### 1. 初始化项目
```bash
sudo mkdir -p /opt/webbench-demo
sudo chown $(whoami) /opt/webbench-demo
cd /opt/webbench-demo
npm init -y
npm install express
```

### 2. 创建服务器主文件 `server.js`
```bash
cat << 'EOF' > /opt/webbench-demo/server.js
const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = 8080;

// 全局忽略 EPIPE（可选）
process.on('uncaughtException', err => {
  if (err.code !== 'EPIPE') {
    console.error('Uncaught exception:', err);
    process.exit(1);
  }
});

// 暴露 public 目录
app.use(express.static(path.join(__dirname, 'public')));

// 下载路由：使用回调处理错误，并监听客户端中断
app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'large-file.zip');
  res.on('close', () => console.log('Download aborted by client'));
  res.download(filePath, err => {
    if (err && err.code !== 'EPIPE') {
      console.error('Download error:', err);
    }
  });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


EOF
```
- 使用 `express.static` 自动托管 `/style.css`、`/large-file.zip` 等资源citeturn0search3；`res.download()` 设置下载响应头。

### 3. 添加静态资源
```bash
mkdir -p /opt/webbench-demo/public
```

#### 3.1 首页 `index.html`
```bash
cat << 'EOF' > /opt/webbench-demo/public/index.html
<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><title>WebBench 测试</title>
<link rel="stylesheet" href="style.css"></head>
<body>
  <header><h1>WebBench 压测示例</h1></header>
  <main>
    <p>下载大文件进行测试：</p>
    <a href="/download" download>路由方式下载</a><br>
    <a href="/large-file.zip" download>静态方式下载</a>
  </main>
</body>
</html>
EOF
```

#### 3.2 样式 `style.css`
```bash
cat << 'EOF' > /opt/webbench-demo/public/style.css
*{margin:0;padding:0;}
body{font-family:Arial,sans-serif;background:#f9f9f9;color:#333;}
header{background:#4CAF50;color:#fff;padding:1em;text-align:center;}
main{padding:2em;}
a{color:#4CAF50;text-decoration:none;font-weight:bold;}
a:hover{text-decoration:underline;}
EOF
```

### 4. 生成并打包大文件
1. **创建 100 MB 临时文件**  
   ```bash
   dd if=/dev/zero of=/opt/webbench-demo/public/large-file bs=1M count=100
   ```  
   使用 `dd` 从 `/dev/zero` 生成零填充文件。
   ### 需要注意的是，为了效果，后续实验使用了手动上传的一个文件测试
2. **安装 zip（若缺失）**  
   ```bash
   sudo yum install -y zip
   ```  
  
3. **打包并清理**  
   ```bash
   cd /opt/webbench-demo/public
   zip large-file.zip large-file
   rm large-file
   ```  
   确认生成 `/opt/webbench-demo/public/large-file.zip`。

### 5. 启动服务
```bash
node /opt/webbench-demo/server.js
```
服务将在 `0.0.0.0:8080` 监听，浏览器访问 `http://123.249.8.194:8080/` 即可查看页面。

---

## ✅ 安装与验证 WebBench

1. **下载源码并编译**（在本地测试机）  
   ```bash
   wget http://home.tiscali.cz/~cz210552/distfiles/webbench-1.5.tar.gz
   tar zxvf webbench-1.5.tar.gz && cd webbench-1.5
   make && sudo make install
   ```  
   WebBench 1.5 基于 `fork()` 并支持 HTTP/1.1citeturn0search16。  
2. **验证安装**  
   ```bash
   webbench --help
   ```  
   能正常输出帮助信息即安装成功。

---

## ✅ 基础类 Demo（WebBench 基本功能）

### Demo 1：标准压力测试（10 并发，30 秒）
```bash
webbench -c 10 -t 30 http://123.249.8.194:8080/
```

### Demo 2：并发对比分析
```bash
webbench -c 1   -t 20 http://123.249.8.194:8080/
webbench -c 10  -t 20 http://123.249.8.194:8080/
webbench -c 100 -t 20 http://123.249.8.194:8080/
```

### Demo 3：下载压力测试（路由与静态）
```bash
# 路由方式下载测试
webbench -c 20 -t 30 http://123.249.8.194:8080/download

# 静态文件直接下载测试
webbench -c 20 -t 30 http://123.249.8.194:8080/large-file.zip
```  
针对下载场景的吞吐与带宽评估。

---

## 💡 场景类 Demo（模拟实际资源请求）

### Demo 4：静态资源并发（CSS/JS）
```bash
webbench -c 20 -t 15 http://123.249.8.194:8080/style.css
```

### Demo 5：对外网服务器演示（教学用，慎重）
```bash
webbench -c 10 -t 10 http://example.com/
```

---

## 📦 脚本类 Demo（自动化批量测试）

创建脚本 `run-tests.sh`：
```bash
#!/bin/bash
SITE="http://123.249.8.194:8080"
for C in 10 50 100; do
  echo ">>> 并发 $C 测试"
  webbench -c $C -t 30 $SITE/ | tee result_${C}.log
  webbench -c $C -t 30 $SITE/download | tee result_download_${C}.log
  webbench -c $C -t 30 $SITE/large-file.zip | tee result_zip_${C}.log
done
```  
同时采集首页、下载路由与静态文件的测试结果。

---
