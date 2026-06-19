(function(Scratch) {
  'use strict';
  const vm = Scratch.vm;
  const runtime = vm.runtime;

  class StableBroadcast {
    constructor() {
      this.lastMsg = "";
      this.runningMsg = new Set();
      // 监听广播启停
      runtime.on('BROADCAST', msg => {
        this.lastMsg = msg;
        this.runningMsg.add(msg);
      });
      runtime.on('BROADCAST_END', msg => {
        this.runningMsg.delete(msg);
      });
    }

    getInfo() {
      return {
        id: 'stableBroadcast',
        name: '增强广播（无报错版）',
        color1: '#ff8800',
        color2: '#e06600',
        blocks: [
          {
            opcode: 'sendBroadcast',
            blockType: Scratch.BlockType.COMMAND,
            text: '发送广播 [MSG]',
            arguments: {
              MSG: { type: Scratch.ArgumentType.STRING, defaultValue: '消息' }
            }
          },
          {
            opcode: 'getLastBroadcast',
            blockType: Scratch.BlockType.REPORTER,
            text: '上一条广播名称'
          },
          {
            opcode: 'isBroadcastingNow',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '广播 [MSG] 是否正在运行',
            arguments: {
              MSG: { type: Scratch.ArgumentType.STRING, defaultValue: '消息' }
            }
          },
          {
            opcode: 'clearRecord',
            blockType: Scratch.BlockType.COMMAND,
            text: '清空广播记录'
          }
        ]
      };
    }

    // 发送广播（稳定可用，无API报错）
    sendBroadcast(args) {
      const msg = Scratch.Cast.toString(args.MSG);
      runtime.broadcast(msg);
    }

    // 获取上次广播名
    getLastBroadcast() {
      return this.lastMsg;
    }

    // 判断广播是否还在执行
    isBroadcastingNow(args) {
      const msg = Scratch.Cast.toString(args.MSG);
      return this.runningMsg.has(msg);
    }

    // 清空缓存
    clearRecord() {
      this.lastMsg = "";
    }
  }

  Scratch.extensions.register(new StableBroadcast());
})(Scratch);
