# Board 02 - Life Support & Utilities

## Full simulated functions
- Greenhouse: DHT22 temperature/humidity, soil moisture, light condition.
- Automatic greenhouse irrigation pump.
- Automatic grow light when the LDR reports darkness.
- Water recycling: adjustable water level + automatic recycle pump.
- Oxygen production: adjustable O2 level + automatic O2 fan/pump.
- Solar monitoring: adjustable simulated battery/solar voltage level.
- Battery healthy/weak and load-status indicators.
- Buzzer for critical water/O2/climate conditions.
- 20x4 I2C LCD and serial `LIFE_PACKET` for central integration.

The analog controls are intentionally separate so every subsystem can be demonstrated independently.
