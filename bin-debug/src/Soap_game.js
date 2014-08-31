var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by Administrator on 2014/8/22.
*/
var Soap_game = (function (_super) {
    __extends(Soap_game, _super);
    function Soap_game() {
        Soap_game.instance = this;
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    //这个类初始化后运行的函数
    Soap_game.prototype.onAddToStage = function (event) {
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    };

    //配置文件加载完成,开始预加载资源组。o
    Soap_game.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    };

    //资源组加载进度
    Soap_game.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };

    //资源组加载完成
    Soap_game.prototype.onResourceLoadComplete = function (event) {
        this.stage.removeChild(this.loadingView);
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);

        //游戏开始
        this.start_game();
    };

    //游戏开始
    Soap_game.prototype.start_game = function () {
        this.soap_account = 0;
        this.soap_time = 15;

        this.my_drawRect();
        this.init_soap_array();
        this.init_soap_account_text();
        this.init_soap_time_text();
        this.init_timer();
    };

    //初始化soap影片剪辑
    Soap_game.prototype.init_soap_array = function () {
        this.soap_array = [];
        var soap = new Soap(this.random_position().x, this.random_position().y);
        soap.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.on_soap_touch, soap);
        this.soap_array.push(soap);
        this.stage.addChild(soap);
    };

    //初始化soap_account_text 文本
    Soap_game.prototype.init_soap_account_text = function () {
        this.soap_account_text = new egret.TextField();
        this.addChild(this.soap_account_text);
        this.soap_account_text.x = 20;
        this.soap_account_text.y = 30;
        this.soap_account_text.fontFamily = "KaiTi";
        this.soap_account_text.textColor = "#000000";
        this.soap_account_text.text = "捡到肥皂次数：0";
    };

    //初始化soap_account_text 文本
    Soap_game.prototype.init_soap_time_text = function () {
        this.soap_time_text = new egret.TextField();
        this.addChild(this.soap_time_text);
        this.soap_time_text.x = 20;
        this.soap_time_text.y = 70;
        this.soap_time_text.fontFamily = "KaiTi";
        this.soap_time_text.textColor = "#000000";
        this.soap_time_text.text = "离捡肥皂结束时间：15";
    };

    //初始化timer计时器
    Soap_game.prototype.init_timer = function () {
        //创建一个计时器对象
        this.timer = new egret.Timer(0);

        //注册事件侦听器
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);

        //开始计时
        this.timer.start();
    };

    //点击soap触发的函数
    Soap_game.prototype.on_soap_touch = function (event) {
        console.log(Soap_game.instance);

        console.log(this);
        //肥皂切换切换位置
        //var position = this.random_position();
        //        this.x = position.x;
        //        this.y = position.y;
        //捡肥皂数增加
        //        this.soap_account++;
        //        this.soap_account_text.text = "捡到肥皂次数：" + this.soap_account;
    };

    //timer 每次间隔出发的函数
    Soap_game.prototype.timerFunc = function () {
        //console.log(2);
        if (this.soap_time != 0) {
            this.soap_time--;
            this.soap_time_text.text = "离捡肥皂结束时间：" + this.soap_time;
        }
    };

    //timer结束时执行的函数
    Soap_game.prototype.timerComFunc = function () {
        //alert("捡肥皂时间到……");
    };

    //返回一个随机位置对象
    Soap_game.prototype.random_position = function () {
        //生成一个随机0到11的随机数
        var random = Math.floor(Math.random() * 9);

        var x = random % 3 * 160 + 30;
        var y = Math.floor(random / 3) * 200 + 65 + 130;

        return { x: x, y: y };
    };

    //画一个3*4的矩形
    Soap_game.prototype.my_drawRect = function () {
        for (var i = 0; i < 4; i++) {
            var shp = new egret.Shape();
            shp.graphics.lineStyle(1, 0x555555);
            shp.graphics.moveTo(0, 200 * i + 130);
            shp.graphics.lineTo(480, 200 * i + 130);
            shp.graphics.endFill();
            this.addChild(shp);
        }

        for (var i = 0; i < 2; i++) {
            var shp = new egret.Shape();
            shp.graphics.lineStyle(1, 0x555555);
            shp.graphics.moveTo(160 * (i + 1), 130);
            shp.graphics.lineTo(160 * (i + 1), 730);
            shp.graphics.endFill();
            this.addChild(shp);
        }
    };
    return Soap_game;
})(egret.DisplayObjectContainer);
Soap_game.prototype.__class__ = "Soap_game";