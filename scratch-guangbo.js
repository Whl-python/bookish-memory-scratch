(function(Scratch) {
  'use strict';
  const vm = Scratch.vm;
  const runtime = vm.runtime;

  class BetterBroadcast {
    constructor() {
      this.lastBroadcastName = "";
      this.activeBroadcasts = new Set();

      // 全局监听所有广播
      runtime.on('BROADCAST', (msg) => {
        this.lastBroadcastName = msg;
        this.activeBroadcasts.add(msg);
      });

      runtime.on('BROADCAST_END', (msg) => {
        this.activeBroadcasts.delete(msg);
      });
    }

    getInfo() {
      return {
        id: 'stableBroadcast',
        name: '增强广播（稳定版）',
        color1: '#ff7b00',
        color2: '#e06c00',
        blocks: [
          {
            opcode: 'sendCustomBroadcast',
            blockType: Scratch.BlockType.COMMAND,
            text: '发送广播 [msg]',
            arguments: {
              msg: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "提示"
              }
            }
          },
          {
            opcode: 'sendCustomBroadcastWait',
            blockType: Scratch.BlockType.COMMAND,
            text: '广播 [msg] 并等待',
            arguments: {
              msg: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "提示"
              }
            }
          },
          "---",
          {
            opcode: 'getLastMsg',
            blockType: Scratch.BlockType.REPORTER,
            text: '最近广播名称'
          },
          {
            opcode: 'isMsgActive',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '广播 [msg] 是否正在执行',
            arguments: {
              msg: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "提示"
              }
            }
          },
          {
            opcode: 'clearMsgRecord',
            blockType: Scratch.BlockType.COMMAND,
            text: '清空广播记录'
          }
        ]
      };
    }

    // 发送自定义广播
    sendCustomBroadcast(args) {
      const name = Scratch.Cast.toString(args.msg);
      runtime.broadcast(name);
    }

    // 广播并等待
    async sendCustomBroadcastWait(args, util) {
      const name = Scratch.Cast.toString(args.msg);
      await runtime.broadcastAndWait(name, util.target);
    }

    // 获取上次广播名
    getLastMsg() {
      return this.lastBroadcastName;
    }

    // 判断广播是否运行中
    isMsgActive(args) {
      const name = Scratch.Cast.toString(args.msg);
      return this.activeBroadcasts.has(name);
    }

    // 清空记录
    clearMsgRecord() {
      this.lastBroadcastName = "";
    }
  }

  Scratch.extensions.register(new BetterBroadcast());
})(Scratch);
