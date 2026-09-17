MEMBER 1 — ENVIRONMENT MONITORING

Wokwi-native simulation:
- DHT22: temperature + humidity
- Wokwi MQ2 gas sensor: used as a simulator stand-in for the planned MQ135 air-quality sensor
- Slide potentiometer: simulates BMP280 pressure
- Slide potentiometer: simulates radiation level
- Green / yellow / red status LEDs + buzzer

Reserved for final integration:
- UNO A4 = SDA
- UNO A5 = SCL

Physical-hardware version:
- Replace pressure slider with BMP280 (prefer SPI if the UNO is also an I2C slave to the Mega)
- Replace MQ2 proxy with MQ135
- Replace radiation slider with your chosen radiation sensor/simulator input
