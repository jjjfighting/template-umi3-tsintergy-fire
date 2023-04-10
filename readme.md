# template-umi3-tsintergy-fire

## 简单介绍

- 这是配合template-abc脚手架的一个指定模板，用于快速生成类似 山东-火电 项目的基础文件（不包含业务代码）


## 搭建自定义模板

- 在gitlab中创建一个新的Demo
- 把需要生成的模板文件内容，放在./template目录下
- index.js中export出prompts，给template-abc执行，得出的answers用于回填/替代./template内的某些内容
- ./template目录下内容， <%= attribute %> 会被answers中的attribute替换。
- 根据第三、第四点，改造./template文件

- eg： 搭建了ads-template-province， gitlab地址为 http://git.tsintergy.com:8070/frontend/adss-template-province
- 命令行输入 npx template-abc  frontend/adss-template-province ./my-province
- 即可得到my-province项目

## TODO

- ./index.js中，添加生命周期钩子函数，用于template-abc解析当前模板文件时运行。