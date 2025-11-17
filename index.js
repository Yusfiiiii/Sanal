import express from "express";
import fetch from "node-fetch";
import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  ActivityType
} from "discord.js";

// ---------------------
//  DISCORD BOT
// ---------------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

// AYARLAR ---------------------
const TARGET_TEXT = process.env.TARGET_TEXT ?? "örnek"; // durumdaki metin
const ROLE_ID = process.env.ROLE_ID ?? "123456789012345678"; // verilecek rol
const GUILD_ID = process.env.GUILD_ID ?? null;
// --------------------------------

// Custom status kontrol fonksiyonu
function presenceHasTargetText(presence) {
  if (!presence || !presence.activities) return false;

  return presence.activities.some((act) => {
    if (act.type !== ActivityType.Custom) return false;
    return act.state && act.state.includes(TARGET_TEXT);
  });
}

client.on("ready", () => {
  console.log(`${client.user.tag} aktif!`);
});

client.on("presenceUpdate", async (oldPresence, newPresence) => {
  try {
    if (!newPresence || !newPresence.member) return;

    // sadece belirli sunucu
    if (GUILD_ID && newPresence.guild.id !== GUILD_ID) return;

    const member = newPresence.member;
    const guild = newPresence.guild;

    const role = await guild.roles.fetch(ROLE_ID);
    if (!role) return console.log("Rol bulunamadı:", ROLE_ID);

    const hasNow = presenceHasTargetText(newPresence);
    const hadBefore = presenceHasTargetText(oldPresence);

    // Metin varsa rol ekle
    if (hasNow && !member.roles.cache.has(ROLE_ID)) {
      await member.roles.add(ROLE_ID, "Custom status metni eşleşti.");
      console.log(`Rol eklendi → ${member.user.tag}`);
    }

    // Metin kalktıysa rol kaldır
    if (!hasNow && member.roles.cache.has(ROLE_ID)) {
      await member.roles.remove(ROLE_ID, "Custom status metni artık yok.");
      console.log(`Rol kaldırıldı ← ${member.user.tag}`);
    }

  } catch (err) {
    console.log("presenceUpdate hatası:", err);
  }
});

client.login(process.env.TOKEN);
import keep-alive from './keep_alive.js';

keep_alive();
