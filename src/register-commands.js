//@ts-check

require("dotenv").config();

const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
  {
    name: "total",
    description: "Soma o total dos valores digitados anteriormente",
    options: [
      {
        name: "start-date",
        description: "Data da primeira mensagem para começar a soma",
        type: ApplicationCommandOptionType.String,
      },
      {
        name: "end-date",
        description: "Data da última mensagem para a soma",
        type: ApplicationCommandOptionType.String,
      },
    ]
  }
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN ?? "");

async function register() {
  try {
    console.log("Registrando comandos");
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID ?? "", process.env.GUILD_ID ?? ""), { body: commands });
    console.log("Registrou");
  } catch (error) {
    console.error(error);
  }
}

module.exports = { register };