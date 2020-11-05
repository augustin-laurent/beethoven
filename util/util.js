module.exports = {
  canModifyQueue(member) {
    const { channelID } = member.voice;
    const botChannel = member.guild.voice.channelID;

    if (channelID !== botChannel) {
      member.send("Vous devez être dans un canal vocal pour exécuter cette commande !").catch(console.error);
      return;
    }

    return true;
  }
};
