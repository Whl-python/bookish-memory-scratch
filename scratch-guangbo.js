(function(Scratch) {
  'use strict';
  const vm = Scratch.vm;
  const runtime = vm.runtime;

  class AdvBroadcast {
    constructor() {
      this.lastMsg = "";
      this.justBroadcast = false;
      this.runningBroadcasts = new Set();
      // 监听系统原生广播事件
      runtime.on('BROADCAST', (msgName) => {
        this.lastMsg = msgName;
        this.justBroadcast = true;
        this.runningBroadcasts.add(msgName);
        setTimeout(() => {
          this.justBroadcast = false;
          this.runningBroadcasts.delete(msgName);
        }, 50);
      });
    }

    getInfo() {
      return {
        id: 'advBroadcast',
        name: '增强广播',
        color1: '#FF9900',
        color2: '#E67700',
        blocks: [
          {
            opcode: 'whenReceiveCustom',
            blockType: Scratch.BlockType.HAT,
            text: '当收到广播 [MSG]',
            isEdgeActivated: true, // 关键：开启边沿触发，没有这条永远不触发
            arguments: {
              MSG: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'start'
              }
            }
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

    // 帽子触发判断：必须同时满足「刚发送」+「名称匹配」
    whenReceiveCustom(args) {
      const targetMsg = Scratch.Cast.toString(args.MSG);
      return this.justBroadcast && this.lastMsg === targetMsg;
    }

    sendBroadcast(args) {
      const msg = Scratch.Cast.toString(args.MSG);
      runtime.broadcast(msg);
    }

    async sendBroadcastWait(args, util) {
      const msg = Scratch.Cast.toString(args.MSG);
      await runtime.broadcastAndWait(msg, util.target);
    }

    getLastBroadcast() {
      return this.lastMsg;
    }

    isBroadcasting(args) {
      const msg = Scratch.Cast.toString(args.MSG);
      return this.runningBroadcasts.has(msg);
    }

    clearBroadcastRecord() {
      this.lastMsg = "";
      this.justBroadcast = false;
    }
  }

  Scratch.extensions.register(new AdvBroadcast());
})(Scratch);
