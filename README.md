# uploadRemote 

### 环境准备

* 安装docker
* 安装docker-compose

### 下载代码

clone 代码

```
git clone https://github.com/pangff/uploadRemote.git
```

切换到m1分支

```
cd uploadRemote
git checkout m1
```


### 配置环境变量

```
cp env .env
vim .env
```
对.env进行相关配置

* ARIA2_RPC_SECRET=XXX_SECRET  （密钥，rpc连接使用）
* ARIA2_RPC_PORT=6800 （aria2的rpc端口）
* ARIA2_LISTEN_PORT=6888 （aria2的tcp协议监听端口）
* AriaNg_PORT=6880 （AriaNg web服务的端口）
* ARIA2_GATEWAY_PORT=30000 （Aria2 Gateway web服务的端口，该服务主要针对数据进行一次清洗过滤，然后提交到aria2，避免业务层直接使用aria2）
* UPLOAD_NOTICE_URL=http://XXX_ （上传完成后，回调地址，会以http://XXX?s=1&n=filename 方式回调。s=0/1 0失败，1成功。n为回调文件名)
* RCLONE_DRIVE_NAME=oss (rclone上传的云服务名称，目前只支持oss)
* RCLONE_DRIVE_DIR=bucket/dir (云盘地址，oss上为 bucket名称/具体目录)

### 启动容器

启动容器
```
docker-compose up -d
```

查看（3个服务都正常启动即可）

```
docker ps 
```


### 配置rclone.conf

在项目根目录执行
```
cp rclone.conf.template config/rclone.conf
vim rclone.conf
```

```
[oss]
type = s3 （
provider = Alibaba
env_auth = false
access_key_id = xxx
secret_access_key = xxxx
endpoint = oss-cn-beijing.aliyuncs.com
acl = public-read
```
根据自己的情况改 access_key_id 、secret_access_key 

### 通过AriaNg Web页面测试下载上传到OSS

在浏览器访问 http://host:AriaNg_PORT/

* host 根据自己实际情况修改
* AriaNg_PORT端口为.env配置的AriaNg_PORT，是web服务的对外端口
* 然后在AriaNg设置 RPC配置里修改为正确的aria2 rpc密钥
* 进行图片上传，测试图片是否自动上传到了oss

### 通过postman通过接口进行资源下载

```
POST host:ARIA2_GATEWAY_PORT/upload

body:

urls:[{"url":"http://img.aiimg.com/uploads/userup/0909/2Z64022L38.jpg","name":"13.jpg"},{"url":"http://img.aiimg.com/uploads/userup/0909/2Z64022L38.jpg","name":"11.jpg"}]

```

### 查看回调URL是否接收回调信息

查看配置的UPLOAD_NOTICE_URL是否接收到回调消息
