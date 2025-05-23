const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

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
