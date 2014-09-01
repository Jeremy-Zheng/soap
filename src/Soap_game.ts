/**
 * Created by Administrator on 2014/8/22.
 */
class Soap_game extends egret.DisplayObjectContainer {

    //todo useless  为了解决编译器的shab问题
    private is_dead;
    //todo useless  为了解决编译器的shab问题


    private static instance;
    private loadingView;
    private soap_array;
    private soap_account;
    private soap_account_text;
    private soap_time;
    private soap_time_text;
    private grid_array;
    private timer;
    private account;

    public constructor() {
        Soap_game.instance = this;
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    //这个类初始化后运行的函数
    private onAddToStage(event:egret.Event) {

        //开启我们的监测面板
        egret.Profiler.getInstance().run();

        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    }

    //配置文件加载完成,开始预加载资源组
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    }

    //资源组加载进度
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    //资源组加载完成
    private onResourceLoadComplete(event:RES.ResourceEvent):void {

        this.stage.removeChild(this.loadingView);
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);

        //游戏开始
        this.start_game();


    }

    //游戏开始
    private start_game() {

        this.soap_account = 0;
        this.soap_time = 20;
        this.account = 0;

        this.my_drawRect();
        this.init_soap_array();
        this.init_soap_account_text();
        this.init_soap_time_text();
        this.init_timer();
    }

    //游戏结束
    private game_over() {
        alert("游戏结束");
    }

    //初始化soap影片剪辑
    private init_soap_array() {
        this.soap_array = [];
        var soap = new Soap(this.random_position().x,
            this.random_position().y, 0);

        soap.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.on_soap_touch, soap);

        this.soap_array.push(soap);

        this.stage.addChild(soap);
    }

    //初始化soap_account_text 文本
    private init_soap_account_text() {
        this.soap_account_text = new egret.TextField();
        this.addChild(this.soap_account_text);
        this.soap_account_text.x = 20;
        this.soap_account_text.y = 30;
        this.soap_account_text.fontFamily = "KaiTi";
        this.soap_account_text.textColor = "#000000";
        this.soap_account_text.text = "捡到肥皂次数：0";
    }

    //初始化soap_account_text 文本
    private init_soap_time_text() {
        this.soap_time_text = new egret.TextField();
        this.addChild(this.soap_time_text);
        this.soap_time_text.x = 20;
        this.soap_time_text.y = 70;
        this.soap_time_text.fontFamily = "KaiTi";
        this.soap_time_text.textColor = "#000000";
        this.soap_time_text.text = "离捡肥皂结束时间：15";
    }

    //初始化timer计时器
    private init_timer() {
        //创建一个计时器对象
        this.timer = new egret.Timer(25, 0);
        //注册事件侦听器
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        //开始计时
        this.timer.start();
    }

    //点击soap触发的函数
    private on_soap_touch() {
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
    }

    //timer 每次间隔出发的函数
    private timerFunc() {
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

        //去除掉soap_array数组里面is_dead为true的soap
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


                //生成soap
                for (var i = 0; i < random; i++) {
                    //添加一个soap
                    var soap = new Soap(this.random_position().x,
                        this.random_position().y, 0);
                    soap.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.on_soap_touch, soap);
                    this.soap_array.push(soap);
                    this.stage.addChild(soap);
                }
            }

        }

        //如果this.account==600 清空soap_array,去除掉之前画的表格
        else if (this.account == 400) {

            //移除所有肥皂
            for (var i = 0; i < this.soap_array.length; i++) {
                this.stage.removeChild(this.soap_array[i]);
            }

            //将数组设置为空
            this.soap_array = [];

            //清除掉格子
            for (var i = 0; i < this.grid_array.length; i++) {
                this.stage.removeChild(this.grid_array[i]);
            }
        }

        //如果为后5秒就要添加soap，,判断超出屏幕的soap的is_dead为true 还要为soap添加动画
        else if (this.account > 400 && this.account < 800) {

            //让现有的soap都向下移动起来,
            //判断哪些soap的坐标超出了屏幕，超出了的就设置is_dead为true
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
                //添加soap
                for (var i = 0; i < random_account; i++) {
                    //var random_speed = Math.floor(Math.random() * 4) + 1;
                    var soap = new Soap(this.random_position().x, 0, 8);
                    soap.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.on_soap_touch, soap);
                    this.soap_array.push(soap);
                    this.stage.addChild(soap);
                }
            }

        }

    }

    //返回一个随机位置对象
    private random_position() {

        //生成一个随机0到8的随机数
        var random = Math.floor(Math.random() * 9);

        var x = random % 3 * 160 + 30;
        var y = Math.floor(random / 3) * 200 + 65 + 130;

        return {x: x, y: y};
    }

    //画一个3*4的矩形
    private my_drawRect() {
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
    }

}