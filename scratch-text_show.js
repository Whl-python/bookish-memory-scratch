(function () {
  class TextAboveSprite {
    constructor() {
      // 创建顶层独立画布，盖在舞台上方
      this.textCanvas = document.createElement("canvas");
      this.textCtx = this.textCanvas.getContext("2d");
      this.textCanvas.style.position = "absolute";
      this.textCanvas.style.pointerEvents = "none";
      this.textCanvas.style.zIndex = "999";
      document.body.appendChild(this.textCanvas);

      this.textList = []; // 存储所有待渲染文字数据 {x,y,text,r,g,b,size}

      // 每帧自动重绘文字
      this.renderLoop = setInterval(() => this.drawAllText(), 30);
    }

    getInfo() {
      return {
        id: "textAboveSprite",
        name: "角色上方文字",
        color1: "#ff9933",
        color2: "#e67700",
        color3: "#cc6600",
        blocks: [
          {
            opcode: "showTextOverMe",
            blockType: Scratch.BlockType.COMMAND,
            text: "显示文字 [TEXT] 字号[SIZE] 红[R]绿[G]蓝[B]",
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "Hello" },
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 14 },
              R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              G: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: "clearAllFloatText",
            blockType: Scratch.BlockType.COMMAND,
            text: "清空所有文字"
          }
        ]
      };
    }

    // 核心积木：在当前角色/克隆体头顶添加文字
    showTextOverMe(args, util) {
      const target = util.target;
      const stage = util.runtime.stage;
      const stageRect = stage.renderer.canvas.getBoundingClientRect();

      // Scratch舞台坐标转屏幕像素坐标
      const scale = stageRect.width / 480;
      const screenX = stageRect.left + (240 + target.x) * scale;
      const screenY = stageRect.top + (180 - target.y - 15) * scale;

      // 存入渲染列表
      this.textList.push({
        x: screenX,
        y: screenY,
        text: String(args.TEXT),
        size: Number(args.SIZE),
        r: Number(args.R),
        g: Number(args.G),
        b: Number(args.B)
      });
    }

    // 清空全部文字
    clearAllFloatText() {
      this.textList = [];
    }

    // 每帧绘制所有文字
    drawAllText() {
      const stageCanvas = document.querySelector("canvas");
      if (!stageCanvas) return;
      const rect = stageCanvas.getBoundingClientRect();

      // 同步画布尺寸
      this.textCanvas.width = rect.width;
      this.textCanvas.height = rect.height;
      this.textCanvas.style.left = rect.left + "px";
      this.textCanvas.style.top = rect.top + "px";
      this.textCtx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);

      // 循环绘制每条文字
      for (const t of this.textList) {
        this.textCtx.fillStyle = `rgb(${t.r},${t.g},${t.b})`;
        this.textCtx.font = `${t.size}px sans-serif`;
        this.textCtx.textAlign = "center";
        // 加白色描边防止文字看不清
        this.textCtx.strokeStyle = "#ffffff";
        this.textCtx.lineWidth = 2;
        this.textCtx.strokeText(t.text, t.x - rect.left, t.y - rect.top);
        this.textCtx.fillText(t.text, t.x - rect.left, t.y - rect.top);
      }

      // 单帧只保留本次新添加文字，实现只显示一帧
      this.textList = [];
    }
  }

  Scratch.extensions.register(new TextAboveSprite());
})();
