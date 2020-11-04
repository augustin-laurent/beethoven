const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "pause",
  description: "Mets en pause la musique actuellement jouée.",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Aucune musique n'est actuellement jouée.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(`${message.author} ⏸ musique mis en pause.`).catch(console.error);
    }
  }
};
