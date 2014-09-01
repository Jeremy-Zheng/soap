/**
 * Created by Administrator on 2014/8/29.
 */
class Soap extends egret.Sprite{

    private soap_animation;
    public is_dead;
    private speed;
    public constructor(x,y,speed){
        super();
        this.createView(x,y,speed);
    }

    private createView(x,y,speed):void {
        var data = RES.getRes("soap_json");//获取动画文件的信息配置文件
        var texture = RES.getRes("soap_pic");//获取动画文件的图片
        this.soap_animation = new egret.MovieClip(data, texture);//创建MovieClip
        this.addChild(this.soap_animation);//添加到显示列表，显示影片剪辑
        this.soap_animation.frameRate = 10;//设置动画的帧频
        this.soap_animation.scaleX = 0.5;
        this.soap_animation.scaleY = 0.5;
        this.soap_animation.x=x;
        this.soap_animation.y=y;
        this.is_dead=false;
        this.speed=speed;
        this.soap_animation.gotoAndPlay("stand");//跳转到指定帧并开始播放
        this.soap_animation.touchEnabled = true; //可以添加touch事件
    }
}

