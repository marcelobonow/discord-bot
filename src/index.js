//@ts-check

const { Client, IntentsBitField, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");
const { register } = require("./register-commands");
dotenv.config();

console.log("Inicializando");
const token = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    GatewayIntentBits.MessageContent,
  ]
});


client.on("ready", clientReady => {
  register();
  console.log(`${clientReady.user.tag} pronto para uso`);
});

client.on("messageCreate", message => {
  if (message.author.bot)
    return;


  if (message.content == "/total") {
    console.log("Calculando total");
    message.reply("O total é: ");
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand())
    return;

  if (interaction.commandName == "total") {
    const total = await calculateTotal(interaction.channel);
    if (total == null)
      interaction.reply("Não foi possível calcular o total");
    else
      interaction.reply(`Total é: R$ ${total}`);
  }
});

/**
 * @param {import("discord.js").TextBasedChannel | null} channel
 */
async function calculateTotal(channel) {
  if (!channel)
    return null;

  const messages = await channel.messages.fetch({ limit: 100 });
  let total = 0;
  for (const messageIterator of messages) {
    const message = messageIterator[1];
    if (message.author.bot || !message.content)
      continue;

    const lines = message.content.split('\n');
    for (const line of lines) {
      const value = parseFloat(line.split(" ")[0]);
      if (isNaN(value))
        continue;

      total += value;
    }

  }
  return total;
}

client.login(token);