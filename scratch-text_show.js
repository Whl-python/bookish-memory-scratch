(function(Scratch) {
  'use strict';
  const vm = Scratch.vm;

  class TextOnTop {
    getInfo() {
      return {
        id: 'textOnTop',
        name: '头顶文字显示',
        color1: '#4285F4',
        color2: '#3367D6',
        blocks: [
          {
            opcode: 'setTopText',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置头顶文字为 [TEXT] 字号[SIZE]颜色[COLOR]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '按钮' },
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 14 },
              COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#000000' }
            }
          },
          {
            opcode: 'clearTopText',
            blockType: Scratch.BlockType.COMMAND,
            text: '清除头顶文字'
          },
          {
            opcode: 'setTextOffset',
            blockType: Scratch.BlockType.COMMAND,
            text: '文字上下偏移 [Y]',
            arguments: {
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 20 }
            }
          }
        ]
      };
    }

    constructor() {
      this.actorData = new Map();
      this.renderLayer = null;
    }

    setTopText(args, util) {
      const targetId = util.target.id;
      const text = Scratch.Cast.toString(args.TEXT);
      const size = Scratch.Cast.toNumber(args.SIZE);
      const color = args.COLOR;
      const data = this.actorData.get(targetId) || { text: '', size: 14, color: '#000', offsetY: 20 };
      data.text = text;
      data.size = size;
      data.color = color;
      this.actorData.set(targetId, data);
      this._initRender();
    }

    clearTopText(args, util) {
      const targetId = util.target.id;
      const data = this.actorData.get(targetId);
      if (data) data.text = '';
    }

    setTextOffset(args, util) {
      const targetId = util.target.id;
      const y = Scratch.Cast.toNumber(args.Y);
      const data = this.actorData.get(targetId) || { text: '', size: 14, color: '#000', offsetY: 20 };
      data.offsetY = y;
      this.actorData.set(targetId, data);
    }

    _initRender() {
      if (this.renderLayer) return;
      const renderer = vm.renderer;
      const oldDraw = renderer.draw;
      renderer.draw = () => {
        oldDraw.call(renderer);
        const ctx = renderer._canvas.getContext('2d');
        const stage = vm.runtime.getTargetForStage();
        const stageScale = renderer._stageSize[0] / 480;
        ctx.save();
        ctx.scale(stageScale, stageScale);
        this.actorData.forEach((data, tid) => {
          if (!data.text) return;
          const target = vm.runtime.getTargetById(tid);
          if (!target || !target.isVisible()) return;
          const pos = target.getXY();
          const scale = target.getScale() / 100;
          ctx.font = `${data.size * scale}px sans-serif`;
          ctx.fillStyle = data.color;
          ctx.textAlign = 'center';
          ctx.fillText(data.text, pos[0], pos[1] - data.offsetY * scale);
        });
        ctx.restore();
      };
      this.renderLayer = true;
    }
  }

  Scratch.extensions.register(new TextOnTop());
})(Scratch);