# Board 01 - Environment Monitoring

## Full simulated functions
- DHT22 temperature + humidity monitoring.
- BMP180 pressure monitoring (Wokwi stand-in for the physical BMP280).
- MQ-2/MQ-series analog air-quality input (Wokwi stand-in for MQ-135).
- Adjustable radiation index potentiometer.
- Automatic NORMAL / WARNING / DANGER classification.
- Ventilation relay activates on warning/danger.
- Air-scrubber relay activates on danger.
- Green/yellow/red status LEDs and buzzer.
- 20x4 I2C LCD.
- Serial `ENV_PACKET` is the clean data packet intended for the central Mega.
- A4/A5 remain the I2C lines for the final physical integration.

## Test
Move the MQ sensor, radiation potentiometer, or DHT22 controls while running. The LCD and actuators respond automatically.
