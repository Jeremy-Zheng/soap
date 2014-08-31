class LoadingUI extends egret.Sprite{

    public constructor(){
        super();
        this.createView();
    }


    private textField:egret.TextField;

    private createView():void {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.textColor=0xFFFFFF;
        this.textField.fontFamily = "KaiTi";
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    }

    public setProgress(current, total):void {
        this.textField.text = "游戏加载中..." + current + "/" + total;
    }
}
