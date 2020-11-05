const { canModifyQueue } = require("../util/util");

module.exports = {
  name: "remove",
  description: "Supprime un son de la playlist.",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Il n'y a pas de playlist.").catch(console.error);
    if (!canModifyQueue(message.member)) return;
    
    if (!args.length) return message.reply(`Utilisation: ${message.client.prefix}remove <Numéro dans la playlist>`);
    if (isNaN(args[0])) return message.reply(`Utilisation: ${message.client.prefix}remove <Numéro dans la playlist>`);

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(`${message.author} ❌ **${song[0].title}** a été supprimé de la queue.`);
  }
};
