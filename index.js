const path = require("path");
const { name, version } = require("./package.json");

// 搜集与项目名字相关的代码, prompt to fix them
// const basePath = '/sdfire';
// const API_PREFIX = '/sdfire';
// favicon: '/sdfire/image/favicon_huaneng.png',

// outputPath: '../../dist/sd-fire',
// type PROJECT_KEY_TYPE = 'sd-fire';

module.exports = {
  name,
  version,
  prompts: [
    {
      name: "name",
      type: "text",
      message: "Project name",
    },
    {
      name: "version",
      type: "text",
      message: "Project version",
      initial: '0.0.1',
    },
    {
      name: "description",
      type: "text",
      message: "Project description",
      initial: "Awesome adss project",
    },
    {
      name: "basepath",
      type: "text",
      message: "setting API_PREFIX, basePath",
      initial: (prev, values) => values.name.split('-').join(''),
    },
    {
      name: "projectkey",
      type: "text",
      message: "setting PROJECT_KEY_TYPE, part of outputPath",
      initial: (prev, values) => values.name,
    },
  ],
};
