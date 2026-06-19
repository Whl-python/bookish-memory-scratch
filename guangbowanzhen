(function(Scratch) {
  'use strict';
  const vm = Scratch.vm;
  const runtime = vm.runtime;

  class AdvBroadcast {
    constructor() {
      this.lastMsg = "";
      this.runningBroadcasts = new Set();
      // 监听原生广播事件，同步给自定义接收积木
      runtime.on('BROADCAST', (msgName) => {
        this.lastMsg = msgName;
        this.runningBroadcasts.add(msgName);
        setTimeout(() => this.runningBroadcasts.delete(msgName), 10);
      });
    }

    getInfo() {
      return {
        id: 'advBroadcast',
        name: '增强广播',
        color1: '#FF9900',
        color2: '#E67700',
        blocks: [
          // 自定义接收帽子积木（核心新增：可自由输入广播名称）
          {
            opcode: 'whenReceiveCustom',
            blockType: Scratch.BlockType.HAT,
            text: '当收到广播 [MSG]',
            arguments: {
              MSG: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'start'
              }
            },
            hat: 'broadcast_custom'
          },
          '---',
          {
            opcode: 'sendBroadcast',
            blockType: Scratch.BlockType.COMMAND,
            text: '发送广播 [MSG]',
            arguments: {
              MSG: { type: Scratch.ArgumentType.STRING, defaultValue: '消息1' }
            }
          },
          {
            opcode: 'sendBroadcastWait',
            blockType: Scratch.BlockType.COMMAND,
            text: '广播 [MSG] 并等待',
            arguments: {
              MSG: { type: Scratch.ArgumentType.STRING, defaultValue: '消息1' }
            }
          },
          '---',
          {
            opcode: 'getLastBroadcast',
            blockType: Scratch.BlockType.REPORTER,
            text: '上次广播名称'
          },
          {
            opcode: 'isBroadcasting',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '正在广播 [MSG]?',
            arguments: {
              MSG: { type: Scratch.ArgumentType.STRING, defaultValue: '消息1' }
            }
          },
          {
            opcode: 'clearBroadcastRecord',
            blockType: Scratch.BlockType.COMMAND,
            text: '清空广播记录'
          }
        ]
      };
    }

    // 自定义帽子触发判断：匹配输入的广播名
    whenReceiveCustom(args) {
      const targetMsg = Scratch.Cast.toString(args.MSG);
      return this.lastMsg === targetMsg;
    }

    // 发送广播
    sendBroadcast(args) {
      const msg = Scratch.Cast.toString(args.MSG);
      runtime.broadcast(msg);
    }

    // 广播并等待
    async sendBroadcastWait(args, util) {
      const msg = Scratch.Cast.toString(args.MSG);
      await runtime.broadcastAndWait(msg, util.target);
    }

    // 获取上次广播
    getLastBroadcast() {
      return this.lastMsg;
    }

    // 判断是否正在广播
    isBroadcasting(args) {
      const msg = Scratch.Cast.toString(args.MSG);
      return this.runningBroadcasts.has(msg);
    }

    // 清空记录
    clearBroadcastRecord() {
      this.lastMsg = "";
    }
  }

  Scratch.extensions.register(new AdvBroadcast());
})(Scratch);
