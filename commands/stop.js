const { canModifyQueue } = require("../util/EvobotUtil");


module.exports = {
  name: "stop",
  description: "Stop la lecture des musiques en cours.",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return message.reply("Aucune playlist n'est actuellement jouée.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏹ a fait stoppé la musique !`).catch(console.error);
  }
};
