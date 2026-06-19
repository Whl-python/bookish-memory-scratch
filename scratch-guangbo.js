class BroadcastPlus {
  constructor() {
    this.runningBroadcasts = new Set();
    this.lastBroadcastName = "";
  }

  getInfo() {
    return {
      id: "broadcastplus",
      name: "增强广播",
      color1: "#FF9900",
      color2: "#E68A00",
      blocks: [
        {
          opcode: "sendBroadcast",
          blockType: Scratch.BlockType.COMMAND,
          text: "发送广播 [name]",
          arguments: {
            name: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "消息1"
            }
          }
        },
        {
          opcode: "sendBroadcastWait",
          blockType: Scratch.BlockType.COMMAND,
          text: "发送广播 [name] 并等待完成",
          arguments: {
            name: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "消息1"
            }
          }
        },
        {
          opcode: "getLastBroadcast",
          blockType: Scratch.BlockType.REPORTER,
          text: "上次发送的广播名"
        },
        {
          opcode: "isBroadcasting",
          blockType: Scratch.BlockType.BOOLEAN,
          text: "广播 [name] 正在运行？",
          arguments: {
            name: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "消息1"
            }
          }
        },
        {
          opcode: "clearAllBroadcastRecord",
          blockType: Scratch.BlockType.COMMAND,
          text: "清空广播运行记录"
        }
      ]
    };
  }

  sendBroadcast(args, util) {
    const name = args.name;
    this.lastBroadcastName = name;
    this.runningBroadcasts.add(name);
    util.broadcast(name);
  }

  sendBroadcastWait(args, util) {
    const name = args.name;
    this.lastBroadcastName = name;
    this.runningBroadcasts.add(name);
    return new Promise(resolve => {
      util.broadcastAndWait(name);
      this.runningBroadcasts.delete(name);
      resolve();
    });
  }

  getLastBroadcast() {
    return this.lastBroadcastName;
  }

  isBroadcasting(args) {
    return this.runningBroadcasts.has(args.name);
  }

  clearAllBroadcastRecord() {
    this.runningBroadcasts.clear();
    this.lastBroadcastName = "";
  }
}

Scratch.extensions.register(new BroadcastPlus());