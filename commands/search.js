const { MessageEmbed } = require("discord.js");
const YouTubeAPI = require("simple-youtube-api");

let YOUTUBE_API_KEY;
try {
  const config = require("../config.json");
  YOUTUBE_API_KEY = config.YOUTUBE_API_KEY;
} catch (error) {
  YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
}
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports = {
  name: "search",
  description: "Lance une recherche puis en selectionne une au choix.",
  async execute(message, args) {
    if (!args.length)
      return message.reply(`Utilisation: ${message.client.prefix}${module.exports.name} <Nom de la musique>`).catch(console.error);
    if (message.channel.activeCollector)
      return message.reply("Une recherche est déjà en cours.");
    if (!message.member.voice.channel)
      return message.reply("Vous devez être dans un canal vocal pour exécuter cette commande !").catch(console.error);

    const search = args.join(" ");

    let resultsEmbed = new MessageEmbed()
      .setTitle(`**Répondez avec le numéro correspondant à la recherche.**`)
      .setDescription(`Resultats pour: ${search}`)
      .setColor("#F8AA2A");

    try {
      const results = await youtube.searchVideos(search, 10);
      results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));

      var resultsMessage = await message.channel.send(resultsEmbed);

      function filter(msg) {
        const pattern = /(^[1-9][0-9]{0,1}$)/g;
        return pattern.test(msg.content) && parseInt(msg.content.match(pattern)[0]) <= 10;
      }

      message.channel.activeCollector = true;
      const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });
      const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;

      message.channel.activeCollector = false;
      message.client.commands.get("play").execute(message, [choice]);
      resultsMessage.delete().catch(console.error);
    } catch (error) {
      console.error(error);
      message.channel.activeCollector = false;
    }
  }
};
