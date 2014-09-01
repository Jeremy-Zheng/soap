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
        //开启我们的监测面板
        egret.Profiler.getInstance().run();

        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    };

    //配置文件加载完成,开始预加载资源组
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
        this.soap_time = 20;
        this.account = 0;

        this.my_drawRect();
        this.init_soap_array();
        this.init_soap_account_text();
        this.init_soap_time_text();
        this.init_timer();
    };

    //游戏结束
    Soap_game.prototype.game_over = function () {
        alert("游戏结束");
    };

    //初始化soap影片剪辑
    Soap_game.prototype.init_soap_array = function () {
        this.soap_array = [];
        var soap = new Soap(this.random_position().x, this.random_position().y, 0);

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
        this.timer = new egret.Timer(25, 0);

        //注册事件侦听器
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);

        //开始计时
        this.timer.start();
    };

    //点击soap触发的函数
    Soap_game.prototype.on_soap_touch = function () {
        var this_soap = this;
        var this_soap_game = Soap_game.instance;

        /*
        * todo 如果被点击了，添加游戏分数，运行爆炸动画
        * todo 在爆炸完后，就让就这个soap移除舞台，并将is_dead设置为true
        * todo 这里没有爆炸的动画，所以就直接移除舞台并将 is_dead 设置为true
        * */
        //添加分数
        this_soap_game.soap_account++;
        this_soap_game.soap_account_text.text = "捡到肥皂次数：" + this_soap_game.soap_account;

        //将soap移除舞台
        this_soap_game.stage.removeChild(this_soap);

        //将当前soap的is_dead设置为true
        this_soap.is_dead = true;
    };

    //timer 每次间隔出发的函数
    Soap_game.prototype.timerFunc = function () {
        //循环计时器
        this.account++;

        //判断时间是否显示减小
        if (this.account % 40 == 0) {
            this.soap_time--;
            this.soap_time_text.text = "离捡肥皂结束时间：" + this.soap_time;
        }

        //如果时间走到第20秒就结束游戏
        if (this.account == 800) {
            this.game_over();
        }

        for (var i = 0; i < this.soap_array.length; i++) {
            if (this.soap_array[i].is_dead)
                this.soap_array.splice(i, 1);
        }

        //前10秒如果数组为空就要添加soap
        if (this.account < 400) {
            //如果soap_array为空,就添加soap
            if (this.soap_array.length == 0) {
                var random = 1;

                //如果是后5秒就生成一个或者两个
                if (this.account >= 300)
                    random = Math.floor(Math.random() * 2) + 1;

                for (var i = 0; i < random; i++) {
                    //添加一个soap
                    var soap = new Soap(this.random_position().x, this.random_position().y, 0);
                    soap.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.on_soap_touch, soap);
                    this.soap_array.push(soap);
                    this.stage.addChild(soap);
                }
            }
        } else if (this.account == 400) {
            for (var i = 0; i < this.soap_array.length; i++) {
                this.stage.removeChild(this.soap_array[i]);
            }

            //将数组设置为空
            this.soap_array = [];

            for (var i = 0; i < this.grid_array.length; i++) {
                this.stage.removeChild(this.grid_array[i]);
            }
        } else if (this.account > 400 && this.account < 800) {
            for (var i = 0; i < this.soap_array.length; i++) {
                var soap_temp = this.soap_array[i];

                //向下移动
                soap_temp.y += soap_temp.speed;

                //判断有没有超出去
                if (soap_temp.y > 800)
                    soap_temp.is_dead = true;
            }

            //生成soap 并且有一个下落的动画
            if (this.account % 30 == 0) {
                var random_account = Math.floor(Math.random() * 4) + 1;

                for (var i = 0; i < random_account; i++) {
                    //var random_speed = Math.floor(Math.random() * 4) + 1;
                    var soap = new Soap(this.random_position().x, 0, 8);
                    soap.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.on_soap_touch, soap);
                    this.soap_array.push(soap);
                    this.stage.addChild(soap);
                }
            }
        }
    };

    //返回一个随机位置对象
    Soap_game.prototype.random_position = function () {
        //生成一个随机0到8的随机数
        var random = Math.floor(Math.random() * 9);

        var x = random % 3 * 160 + 30;
        var y = Math.floor(random / 3) * 200 + 65 + 130;

        return { x: x, y: y };
    };

    //画一个3*4的矩形
    Soap_game.prototype.my_drawRect = function () {
        this.grid_array = [];

        for (var i = 0; i < 4; i++) {
            var shp = new egret.Shape();
            shp.graphics.lineStyle(1, 0x555555);
            shp.graphics.moveTo(0, 200 * i + 130);
            shp.graphics.lineTo(480, 200 * i + 130);
            shp.graphics.endFill();
            this.grid_array.push(shp);
            this.stage.addChild(shp);
        }

        for (var i = 0; i < 2; i++) {
            var shp = new egret.Shape();
            shp.graphics.lineStyle(1, 0x555555);
            shp.graphics.moveTo(160 * (i + 1), 130);
            shp.graphics.lineTo(160 * (i + 1), 730);
            shp.graphics.endFill();
            this.grid_array.push(shp);
            this.stage.addChild(shp);
        }
    };
    return Soap_game;
})(egret.DisplayObjectContainer);
Soap_game.prototype.__class__ = "Soap_game";
