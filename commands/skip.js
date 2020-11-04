const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: "Passe la musique actuellement jouée.",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply("Je ne peux pas faire passer de l'air, aucune musique n'est actuellement jouée.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ a fait passé le son.`).catch(console.error);
  }
};
