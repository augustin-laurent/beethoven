const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "queue",
  aliases: ["q"],
  description: "Affiche la playlist en cours de lecture et la musique.",
  async execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("❌ **Rien n'est actuellement joué**");
    try {
      let currentPage = 0;
      const embeds = generateQueueEmbed(message, serverQueue.songs);
      const queueEmbed = await message.channel.send(
        `**Page - ${currentPage + 1}/${embeds.length}**`,
        embeds[currentPage]
      );
      await queueEmbed.react("⬅️");
      await queueEmbed.react("⏹");
      await queueEmbed.react("➡️");

      const filter = (reaction, user) =>
        ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;
      const collector = queueEmbed.createReactionCollector(filter, { time: 60000 });

      collector.on("collect", async (reaction, user) => {
        try {
          if (reaction.emoji.name === "➡️") {
            if (currentPage < embeds.length - 1) {
              currentPage++;
              queueEmbed.edit(`**Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
            }
          } else if (reaction.emoji.name === "⬅️") {
            if (currentPage !== 0) {
              --currentPage;
              queueEmbed.edit(`**Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
            }
          } else {
            collector.stop();
            reaction.message.reactions.removeAll();
          }
          await reaction.users.remove(message.author.id);
        } catch {
          return message.channel.send("**Permissions manquantes - [ADD_REACTIONS, MANAGE_MESSAGES]!**");
        }
      });
    } catch {
      return message.channel.send("**Permissions manquantes - [ADD_REACTIONS, MANAGE_MESSAGES]!**");
    }
  }
};

function generateQueueEmbed(message, queue) {
  const embeds = [];
  let k = 10;
  for (let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, k);
    let j = i;
    k += 10;
    const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");
    const embed = new MessageEmbed()
      .setTitle("Playlist\n")
      .setThumbnail(message.guild.iconURL())
      .setColor("#F8AA2A")
      .setDescription(`**Musique actuelle - [${queue[0].title}](${queue[0].url})**\n\n${info}`)
      .setTimestamp();
    embeds.push(embed);
  }
  return embeds;
}
