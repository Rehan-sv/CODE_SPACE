# Board 03 - Safety & Emergency

## Full simulated functions
- Fire detector input: pushbutton stands in for the flame sensor so the case is directly testable.
- MQ-2 analog gas detection: adjustable safe/warning/danger levels.
- Manual SOS emergency button.
- Automatic fire suppression relay + blue suppression indicator.
- Automatic exhaust/ventilation relay during gas/fire/SOS events.
- Secure/fire/gas/SOS LEDs and emergency buzzer.
- 20x4 I2C LCD.
- Serial `SAFETY_PACKET` output for the central controller.
- Dedicated `ESP32_Telegram_Gateway` folder provides the Wi-Fi/Telegram portion separately, because Wokwi currently does not support multiple microcontrollers in one simulation.
