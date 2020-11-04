const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  name: "lyrics",
  aliases: ["ly"],
  description: "Recherche les lyrics de la musique actuellement jouée.",
  async execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Aucune musique n'est actuellement jouée.").catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = `Aucun lyrics n'a été trouvé pour ${queue.songs[0].title}.`;
    } catch (error) {
      lyrics = `Aucun lyrics n'a été trouvé pour ${queue.songs[0].title}.`;
    }

    let lyricsEmbed = new MessageEmbed()
      .setTitle("Lyrics")
      .setDescription(lyrics)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  }
};
