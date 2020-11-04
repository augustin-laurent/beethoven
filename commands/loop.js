const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "loop",
  aliases: ['l'],
  description: "Active la fonction boucle.",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Aucune musique n'est actuellement jouée.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    return queue.textChannel
      .send(`Bouclage sur ${queue.loop ? "**on**" : "**off**"}`)
      .catch(console.error);
  }
};
