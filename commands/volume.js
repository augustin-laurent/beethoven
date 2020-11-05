const { canModifyQueue } = require("../util/util");

module.exports = {
  name: "volume",
  aliases: ["v"],
  description: "Change le volume de lecture des musiques.",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("Aucune musique n'est actuellement jouée.").catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply("Vous devez être dans un canal vocal pour exécuter cette commande !").catch(console.error);

    if (!args[0]) return message.reply(`🔊 Le volume actuel est: **${queue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return message.reply("Utilisez des nombres pour régler le volume.").catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("Utilisez un nombre entre 0 et 100.").catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel.send(`Volume réglé à : **${args[0]}%**`).catch(console.error);
  }
};
