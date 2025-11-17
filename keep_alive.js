import express from "express";
import axios from "axios";

export default function keep_alive() {
const app = express();
const port = process.env.PORT || 3000;

// Basit bir route (Render bunu kontrol eder)
app.get("/", (req, res) => {
res.send("✅ Bot aktif! keep_alive.js çalışıyor 🚀");
});

app.listen(port, () => {
const url = process.env.RENDER_EXTERNAL_URL || "https://sanal.onrender.com";
console.log(`🌐 Keep-alive sunucusu aktif: ${url} (port ${port})`);

// 30 saniyede bir kendi URL’ine ping at  
setInterval(async () => {  
  try {  
    await axios.get(url);  
    console.log(`🔁 Ping gönderildi → ${url}`);  
  } catch (err) {  
    console.log(`⚠️ Ping hatası: ${err.message}`);  
  }  
}, 30 * 1000); // 30 saniye

});
}
