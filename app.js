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
  pluginData = [];
//插件化不可避
//首先读取data下所有文件夹中的package.json
logger.info("Starting ZenScript Maker...");
logger.info("Loading settings...");
//读取设置
var settings = JSON.parse(fs.readFileSync(dir + "\\settings.json"));
function getConfig(attr) {
  return settings[attr]
}
if (getConfig('address') == '127.0.0.1' || getConfig('address') == 'localhost') {
  logger.info("Starting server... at port:" + getConfig('port'));
  var zms = require('./server');
  zms.startServer(getConfig('port'), logger);

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
        pluginList.push(data);
        //TODO
      }
    });
    logger.info("Plugins loading completed");
    //logger.debug(pluginList);
    //logger.debug(JSON.stringify(pluginList));
    ipcMain.on('request-mod-list', function (event, args){
      logger.info(JSON.stringify(pluginList));
      //返回json啊，雪藏
      event.returnValue(1);
    });
    //
  });
} else {
  logger.info("Connecting to server... At " + getConfig('address') + ':' + getConfig('port'));
}

createWindow();

function createWindow() {
  const electron = require('electron');
  const app = electron.app;
  const BrowserWindow = electron.BrowserWindow;

  var window = null;

  app.on('ready', function () {
    window = new BrowserWindow({width: 800, height: 600});
    //window.loadURL(getConfig('address') + ':' + getConfig('port'));
    window.loadURL('http://127.0.0.1:12450/index.html');
    //window.webContents.openDevTools();
  });
}
