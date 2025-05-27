---

## ✅ 基础类 Demo（WebBench 基本功能）

### ✅ Demo 1：标准本地压力测试（10 并发，30 秒）
```bash
webbench -c 10 -t 30 http://127.0.0.1:8080/
```

### ✅ Demo 2：测试不同并发数对性能的影响（对比分析）
```bash
webbench -c 1 -t 20 http://127.0.0.1:8080/
webbench -c 10 -t 20 http://127.0.0.1:8080/
webbench -c 100 -t 20 http://127.0.0.1:8080/
```
👉 **用表格或图表展示对比结果，效果更直观！**

---

## 💡 场景类 Demo（模拟真实 Web 环境）

### ✅ Demo 3：对静态文件进行测试（如图片、JS、CSS）

```bash
webbench -c 20 -t 15 http://127.0.0.1:8080/style.css
```

### ✅ Demo 4：测试含大文件（模拟下载压力）

```bash
webbench -c 10 -t 20 http://127.0.0.1:8080/large-file.zip
```

### ✅ Demo 5：对外网服务器发起压力测试（教学展示用）

```bash
webbench -c 10 -t 10 http://example.com/
```

⚠️**注意：此类测试请只做演示，别持续对外网造成压力。**

---

## 📊 对比类 Demo（与其他工具结果对比）

### ✅ Demo 6：WebBench vs ApacheBench

```bash
# WebBench
webbench -c 50 -t 10 http://127.0.0.1:8080/

# ApacheBench（ab）
ab -n 500 -c 50 http://127.0.0.1:8080/
```

👉 可以从输出结果中比较：吞吐量、并发支持、易用性

---

## 📦 脚本类 Demo（自动化批量测试）

### ✅ Demo 7：测试不同并发数并自动生成结果

```bash
#!/bin/bash
for c in 5 10 20 40 80; do
    echo "并发数 $c:"
    webbench -c $c -t 15 http://127.0.0.1:8080/
    echo "-----------------------------"
done
```

### ✅ Demo 8：将结果保存到日志中分析

```bash
webbench -c 10 -t 20 http://127.0.0.1:8080/ > result_10c.txt
```

---

## 🧪 深度类 Demo（性能瓶颈分析）

### ✅ Demo 9：逐渐增加并发找服务器极限

```bash
for c in 10 20 30 40 50 60 70 80 90 100; do
    echo "当前并发：$c"
    webbench -c $c -t 10 http://127.0.0.1:8080/
done
```

👉 观察在哪个并发数后，失败请求明显增多或速度骤降

---

## 🧩 创意类 Demo（组合其他工具或可视化）

### ✅ Demo 10：结合 Python 脚本解析结果并绘图（简单示例）

```python
import matplotlib.pyplot as plt

# 假设收集了一些手动或脚本执行的请求结果
concurrent_users = [1, 5, 10, 20, 50]
requests_per_min = [200, 850, 1600, 3000, 2700]

plt.plot(concurrent_users, requests_per_min, marker='o')
plt.title("WebBench 吞吐量 vs 并发用户")
plt.xlabel("并发用户数")
plt.ylabel("每分钟请求数")
plt.grid(True)
plt.show()
```

---

## 💬 附加内容建议（适合汇报中穿插讲解）

| 维度            | WebBench       | ApacheBench | wrk            |
| --------------- | -------------- | ----------- | -------------- |
| 操作系统支持    | Linux          | 多平台      | Linux/macOS    |
| 是否支持 POST   | ❌             | ✅          | ✅             |
| 多线程/进程模型 | 多进程         | 单线程      | 多线程         |
| 易用性          | 非常简单       | 较复杂      | 较复杂         |
| 输出信息        | 简洁           | 丰富        | 极其详细       |
| 实际使用建议    | 教学、轻量测试 | 实战测试    | 高并发性能测试 |

---

### 一、基础压力测试：模拟并发请求，验证基础性能

#### **Demo 1：静态页面吞吐量测试（最经典场景）**

- **测试目标**：评估服务器对静态资源（HTML/JS/CSS）的并发处理能力
- **测试命令**：
  ```bash
  webbench -c 200 -t 30 http://example.com/index.html
  ```
  - `-c 200`：200 个并发客户端（模拟同时访问的用户数）
  - `-t 30`：持续测试 30 秒
- **预期输出**：
  ```
  Speed: 18000 pages/min, 900000 bytes/sec.  # 每分钟处理 1.8 万页面，每秒传输 900KB
  Requests: 9000 succeeded, 0 failed.          # 成功率 100%
  ```
- **核心价值**：快速判断服务器在正常负载下的稳定性，适合企业官网、博客等静态站点初步性能评估。

#### **Demo 2：动态页面逻辑压力测试（含数据库/API）**

- **测试目标**：验证后端脚本（PHP/Java/CGI）在高并发下的处理能力（如用户登录、订单查询）
- **测试命令**：
  ```bash
  webbench -c 300 -t 60 http://example.com/api/user.php?uid=123
  ```
- **关键观察**：
  - 若输出 `Failed requests` 增加，可能是数据库连接池不足或代码逻辑阻塞（如同步数据库操作）
  - 对比静态页面测试结果，量化动态逻辑带来的性能损耗（通常吞吐量下降 30%-70%）
- **适用场景**：接口服务、电商商品详情页（需调用多个微服务）等动态业务场景。

### 二、协议与请求类型支持：覆盖多样化网络场景

#### **Demo 3：HTTPS 加密网站测试（SSL/TLS 性能）**

- **测试目标**：评估 HTTPS 网站在加密传输中的性能（SSL 握手耗时、加密数据吞吐量）
- **测试命令**：
  ```bash
  webbench -c 100 -t 20 https://secure.example.com/login
  ```
- **特殊说明**：
  - 若报错 `SSL connect failed`，需手动添加 CA 证书（WebBench 对 HTTPS 的支持较基础）
  - 性能对比：相同配置下，HTTPS 吞吐量约为 HTTP 的 **50%-70%**（因加密计算开销）
- **延伸思考**：如何通过优化 SSL 套件（如启用 TLS 1.3）提升性能？

#### **Demo 4：非 GET 请求测试（HEAD/POST 方法）**

- **场景 1：HEAD 请求（仅获取响应头，不下载正文）**

  ```bash
  webbench --head -c 50 -t 10 http://example.com/big-image.jpg
  ```

  - 用途：测试大文件的元数据响应速度（如 CDN 缓存是否生效）

- **场景 2：简单 POST 请求（表单提交）**
  ```bash
  echo "username=test&password=123" | webbench -c 30 -t 15 --post http://example.com/login.php
  ```
  - 通过标准输入传递 POST 数据（仅支持 URL-encoded 格式，复杂参数需手动拼接）
  - **局限性**：不支持 JSON 体、文件上传、Cookie 自动携带（需进阶工具如 JMeter）

### 三、网络环境模拟：代理、超时、极限压力

#### **Demo 5：通过代理服务器测试（验证负载均衡/CDN）**

- **测试目标**：模拟用户通过代理（Nginx/HAProxy/CDN）访问源站的性能
- **测试命令**：
  ```bash
  webbench -p cdn-proxy.com:8080 -c 150 -t 40 http://origin-server.com/video.mp4
  ```
  - `-p proxy:port`：指定代理服务器地址和端口
- **分析重点**：
  - 若代理层吞吐量低于源站，可能是代理带宽限制或连接数阈值配置过低
  - 验证代理的缓存策略是否生效（对比带缓存和无缓存的测试结果）

#### **Demo 6：极限压力测试（寻找服务器性能拐点）**

- **测试目标**：逐步增加并发数，确定服务器的最大承载能力（吞吐量下降或错误率突增的临界点）
- **分阶段测试命令**：
  1. **正常负载**（成功率 100%）：
     ```bash
     webbench -c 500 -t 20 http://server.com  # 观察基线性能
     ```
  2. **压力递增**（每次增加 500 并发）：
     ```bash
     webbench -c 1000 -t 20 http://server.com  # 可能出现轻微延迟
     webbench -c 2000 -t 20 http://server.com  # 失败率开始上升（如 1%-5%）
     ```
  3. **极限冲击**（模拟突发流量）：
     ```bash
     webbench -f -c 5000 -t 10 http://server.com  # -f 强制不等待响应，瞬间发起大量请求
     ```
- **关键指标**：
  - **拐点判断**：当失败率超过 **5%** 或吞吐量下降 **20%** 以上时，视为服务器瓶颈点

### 四、高级功能与扩展：结合系统监控与对比分析

#### **Demo 7：多维度性能分析（结合系统资源监控）**

- **测试流程**：
  1. **启动压力测试**：
     ```bash
     webbench -c 1000 -t 60 http://web-server.com  # 持续高负载
     ```
  2. **同步监控服务器**：
     - CPU 使用率：`top -d 2`（关注 `%Cpu(s)` 中 `user` 和 `sys` 占比，若超过 80% 可能存在瓶颈）
     - 内存占用：`free -h`（警惕 Swap 分区使用，说明内存不足）
     - 网络 I/O：`iftop -i eth0`（检查出口带宽是否跑满）
  - **典型关联场景**：
    - 若 CPU 100% 但吞吐量未达预期：可能是单线程处理或锁竞争（如 Python GIL）
    - 若内存不足：导致频繁页面交换，响应时间暴涨

#### **Demo 8：工具对比测试（WebBench vs Apache ab）**

- **同一场景测试命令**：
  1. **WebBench 简洁模式**：
     ```bash
     webbench -c 100 -t 30 http://example.com  # 输出核心指标：吞吐量、成功率
     ```
  2. **Apache ab 详细模式**：
     ```bash
     ab -n 30000 -c 100 http://example.com/index.html  # 输出分位数响应时间（如 50%、95% 耗时）
     ```
- **结果对比表**：  
  | **指标** | **WebBench** | **Apache ab** |  
  |------------------|-------------------------------|-----------------------------|  
  | 学习成本 | 低（5 个核心参数） | 中（需理解总请求数、并发数）|  
  | 输出深度 | 仅吞吐量+成功率 | 包含响应时间分位数、错误类型 |  
  | 并发上限 | 理论 3 万（受系统文件句柄限制）| 单进程高并发可能内存溢出 |  
  | 适用场景 | 快速压力验证、教学演示 | 精准基准测试、性能调优 |

### 五、特殊场景与异常处理：复现故障与容错验证

#### **Demo 9：模拟网络异常（超时、端口错误）**

- **场景 1：自定义超时时间（识别慢响应接口）**

  ```bash
  webbench -c 50 -t 20 -T 3 http://slow-service.com/api/data  # -T 3 设超时 3 秒
  ```

  - 若接口响应超过 3 秒，计入 `Failed requests`，用于定位超时瓶颈

- **场景 2：目标端口错误（复现连接失败）**
  ```bash
  webbench -c 30 -t 10 http://example.com:8081  # 假设服务器监听 80 端口
  ```
  - 预期错误：`Connect to server failed. Total of 0 requests.`
  - 用途：演示网络配置错误对测试的影响

#### **Demo 10：跨平台部署演示（Linux 安装全流程）**

- **步骤 1：下载源码**
  ```bash
  wget http://home.tiscali.cz/cz210552/distfiles/webbench-1.5.tar.gz
  ```
- **步骤 2：编译安装**
  ```bash
  tar zxvf webbench-1.5.tar.gz
  cd webbench-1.5
  make && sudo make install  # 需 ctags 工具，缺失时先安装：yum install ctags（CentOS）
  ```
- **步骤 3：验证安装**
  ```bash
  webbench -v  # 输出版本信息即安装成功
  ```
