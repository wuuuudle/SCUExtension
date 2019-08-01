# SCUExtension
四川大学教务系统chrome插件

## 功能列表
> 教务系统
>> 两周内免登陆
>>
>> 系统首页绩点计算
>> 
>> 自动填写登录验证码
>>
>> 一键评教
>>
>> ~~选课验证码过滤(开发中)~~
>>
> 
>课程中心
>> 修复chrome浏览器下姓名及退出不能点击的bug

大家有什么脑洞可以尽量提issue。

本项目已发布在chrome网上应用商店，搜索[**SCUExtension**](https://chrome.google.com/webstore/detail/scuextension/ljmkgohcdjeafplbnncbpekoomklkmen)即可。

## 更新日志
### 0.0.20
验证码识别移入background.js与页面js分离，避免阻塞页面。

添加插件更新提示。
### 0.0.19
添加功能自动填写登录验证码。

验证码识别网络由tensorflow搭建。目前识别率在99.94%。
### 0.0.18
项目由gitlab迁移至github，删除敏感数据准备开源。
