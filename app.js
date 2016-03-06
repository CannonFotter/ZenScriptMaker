////var index;
////  //Init
////  //默认页
////  $('#main').load('./app/index.html');
////  //加个回调函数
////  $.getJSON('./data/index.json', function (data) {
////    index = $.makeArray(data.menu);
////  });
////  //$('.item-list-head').stickUp();
////  //菜单点击效果
////  $('#nav a').click(function (e) {
////    e.preventDefault();
////    $(this).tab('show');
////    $('#main').load('./app/' + index[0][this.id]);
////  });
////createWindow();
var log4js = require('log4js');
log4js.configure({
  appenders: [
    {type: 'console'}, //控制台输出
    {
      type: 'file', //文件输出
      filename: 'log/' + new Date().getTime() + '.log',
      maxLogSize: 1024,
      backups: 3,
      category: 'Main'
    }
  ]
});
var logger = log4js.getLogger("Main"),
  fs = require('fs');
var ipcMain = require('electron').ipcMain;
logger.setLevel('DEBUG');
var dir = process.cwd(),
  pluginDir = dir + '\\data\\',
  pluginList = [],
  pluginPath = [];
//插件化不可避
//首先读取data下所有文件夹中的package.json
logger.info("Starting ZenScript Maker...");
logger.info("Loading settings...");
//读取设置
var settings = JSON.parse(fs.readFileSync(dir + "\\settings.json"));
function getConfig(attr) {
  return settings[attr]
}
logger.info("Loading all plugins...");
fs.readdir(pluginDir, function (err, files) {
  if (err) {
    logger.error(err);
    throw err;
  }
  files.forEach(function (file) {
    if (fs.statSync(pluginDir + file).isDirectory()) {
      try {
        fs.accessSync(pluginDir + file + '\\package.json');
      } catch (e) {
        logger.warn("\"" + pluginDir + file + '\\package.json' + "\" doesn't exist!");
        return;
      }
      try {
        var data = fs.readFileSync(pluginDir + file + '\\package.json');
      } catch (e) {
        logger.error(e);
      }
      data = JSON.parse(data);
      pluginList[data.modid] = data;
      pluginPath[data.modid] = pluginDir + file + '\\';
    }
  });
  logger.info("Plugins loading completed");
  var modules = [];
  //加载所有的module
  var modList = [],
    containerList = [],
    pathList = [];
  for (var key in pluginList) {
    modList.push({
      "modid": pluginList[key]['modid'],
      "name": pluginList[key]['name']
    });
    containerList[pluginList[key]['modid']] = pluginList[key]['container'];
    pathList[pluginList[key]['modid']] = pluginList[key]['pathname'] ? pluginList[key]['pathname'] : pluginList[key]['modid'];
    //logger.info(pluginDir + pathList[key]+"\\"+pluginList[key]['script']);
    var temp = pluginList[key]['container'];
    for (var key1 in temp){
      logger.info(pluginDir + pathList[key]+"\\"+temp[key1]['script']);
      modules[key] = [];
      //modules[key][temp[key1]['id']] = pluginDir + pathList[key]+"\\"+temp[key1]['script'];
      modules[key][temp[key1]['id']] = pluginDir + pathList[key]+"\\"+temp[key1]['script'];
    }

  }
  logger.info(pathList);
  //events
  ipcMain.on('get-mod-list', function (event) {
    event.returnValue = modList;
  });
  ipcMain.on('get-container-list', function (event, arg) {
    event.returnValue = containerList[arg];
  });
  ipcMain.on('get-item-list', function (event, arg) {
    try {
      var csv = fs.readFileSync(pluginPath[arg] + pluginList[arg]['item'], 'utf-8');
    } catch (e) {
      logger.error(e);
    }
    event.returnValue = csv;
  });
  //displayName注意！！！
  //arg是数组["modid"=>"minecraft","name"=>"stone"]
  //返回路径，生无可恋了
  ipcMain.on('get-item-icon', function (event, arg) {
    event.returnValue = pluginPath[arg['modid']] + pluginList[arg['modid']]['icon'] + '\\' + arg['name'];
  });
  ipcMain.on('get-path', function (event, arg) {
    event.returnValue = pluginDir + pathList[arg]+"\\"
  });
  ipcMain.on('copy-to-clipboard', function (event, arg) {
    const clipboard = require('electron').clipboard;
    clipboard.writeText(arg, 'zenscriptmaker');
    event.returnValue = true;
  });
  ipcMain.on('search', function (event, arg) {
    event.returnValue = 1;
  });
  ipcMain.on('get-module-path', function (event, args) {
    //0:modid
    //1:container-id
    //2:jquery
    //3:opt
    var zm = modules[args[0]][args[1]];
    event.returnValue = zm;
    //var zm = require(modules[args[0]][args[1]]);
    //zm.init(args[2]);
    //event.returnValue = zm.generate(args[3]);
  });
  //
});

createWindow();

function createWindow() {
  const electron = require('electron');
  const app = electron.app;
  const BrowserWindow = electron.BrowserWindow;

  var window = null;

  app.on('ready', function () {
    window = new BrowserWindow({width: 800, height: 600});
    //window.loadURL(getConfig('address') + ':' + getConfig('port'));
    window.loadURL('file:///' + dir + '\\old.html');
    //window.webContents.openDevTools();
  });
}
