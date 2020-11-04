const fs = require("fs");
let config;

try {
  config = require("../config.json");
} catch (error) {
  config = null;
}

module.exports = {
  name: "pruning",
  description: "Active le raccourcissement des messages du bot.",
  execute(message) {
    if (!config) return;
    config.PRUNING = !config.PRUNING;

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        return message.channel.send("Une erreur est survenue en esseyent de modifier le fichier de configuration.").catch(console.error);
      }

      return message.channel
        .send(`Raccourcissement des messages ${config.PRUNING ? "**on**" : "**off**"}`)
        .catch(console.error);
    });
  }
};
