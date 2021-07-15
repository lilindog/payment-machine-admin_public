## payment-machine-admin 
这是硬件收银机的后台，仅仅用于配合收银机演示，只有简单的订单管理和商品管理。

## 目录结构
```
payment-machine-admin_public
├── .gitignore
├── build
│   ├── webpack.dev.js
│   ├── webpack.build.js
│   └── webpack.base.js
├── element-variables.scss
├── env // 这个目录配置文件
│   ├── release.env
│   ├── production.env
│   ├── development.env
│   └── comm.env
├── package-lock.json
├── package.json
├── README.md
├── scripts
│   └── release.js
└── src
    ├── tools
    ├── store
    ├── static
    ├── router
    ├── publicComponents
    ├── pages
    ├── index.js
    ├── index.html
    ├── homeChildPages
    ├── app.vue
    └── api
```

## 启动开发
先执行npm install 安装依赖。   
然后：   
* 执行 npm run dev     开启开发服务器
* 执行 npm run build   构建打包
* 执行 npm run release 发布到线上

## 配置
项目主要配置在env文件里边，comm.env为公共配置，development.env为开发时候的配置，production为打包构建配置，release为发布脚本的配置。