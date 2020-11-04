const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "resume",
  aliases: ["r"],
  description: "Relance la lecture de la musique mit en pause.",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Aucune musique n'est actuellement jouée.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(`${message.author} ▶ a relancé la musique !`).catch(console.error);
    }

    return message.reply("La playlist n'a pas été mis en pause.").catch(console.error);
  }
};
