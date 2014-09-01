var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by Administrator on 2014/8/29.
*/
var Soap = (function (_super) {
    __extends(Soap, _super);
    function Soap(x, y, speed) {
        _super.call(this);
        this.createView(x, y, speed);
    }
    Soap.prototype.createView = function (x, y, speed) {
        var data = RES.getRes("soap_json");
        var texture = RES.getRes("soap_pic");
        this.soap_animation = new egret.MovieClip(data, texture); //创建MovieClip
        this.addChild(this.soap_animation); //添加到显示列表，显示影片剪辑
        this.soap_animation.frameRate = 10; //设置动画的帧频
        this.soap_animation.scaleX = 0.5;
        this.soap_animation.scaleY = 0.5;
        this.soap_animation.x = x;
        this.soap_animation.y = y;
        this.is_dead = false;
        this.speed = speed;
        this.soap_animation.gotoAndPlay("stand"); //跳转到指定帧并开始播放
        this.soap_animation.touchEnabled = true; //可以添加touch事件
    };
    return Soap;
})(egret.Sprite);
Soap.prototype.__class__ = "Soap";
