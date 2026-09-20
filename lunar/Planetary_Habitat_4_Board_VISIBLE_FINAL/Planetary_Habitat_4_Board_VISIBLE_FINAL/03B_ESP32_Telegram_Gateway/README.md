# ESP32 Telegram SOS Gateway

Wokwi supports ESP32 Wi-Fi networking, but Wokwi currently does not support multiple microcontrollers in the same simulation. This gateway is therefore a separate simulation.

1. Add your Telegram bot token and chat ID in `sketch.ino` if you want a real Telegram message.
2. Start the simulation.
3. Type `SOS`, `FIRE`, or `GAS` in Serial Monitor.
4. With placeholder credentials it prints `TELEGRAM_SIMULATED`; with real credentials it performs the Telegram HTTPS request.
5. The ESP32 onboard LED (GPIO2) is used by the firmware as the alert indicator.
