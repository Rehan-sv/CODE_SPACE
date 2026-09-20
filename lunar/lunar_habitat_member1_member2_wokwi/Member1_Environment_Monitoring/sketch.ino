#include <DHT.h>

#define DHT_PIN 2
#define DHT_TYPE DHT22

#define GAS_PIN A0
#define PRESSURE_SIM_PIN A1
#define RADIATION_SIM_PIN A2

#define LED_NORMAL 6
#define LED_WARNING 7
#define LED_DANGER 8
#define BUZZER_PIN 9

DHT dht(DHT_PIN, DHT_TYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();

  pinMode(LED_NORMAL, OUTPUT);
  pinMode(LED_WARNING, OUTPUT);
  pinMode(LED_DANGER, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  Serial.println("=== MEMBER 1: ENVIRONMENT MONITORING ===");
  Serial.println("A4/A5 are intentionally free for final I2C integration.");
}

void setStatus(bool warning, bool danger) {
  digitalWrite(LED_NORMAL, !warning && !danger);
  digitalWrite(LED_WARNING, warning && !danger);
  digitalWrite(LED_DANGER, danger);

  if (danger) {
    tone(BUZZER_PIN, 1200);
  } else if (warning) {
    tone(BUZZER_PIN, 700, 150);
  } else {
    noTone(BUZZER_PIN);
  }
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  int gasRaw = analogRead(GAS_PIN);

  // Wokwi simulation:
  // slider represents pressure from 70 kPa to 110 kPa
  int pressureRaw = analogRead(PRESSURE_SIM_PIN);
  float pressureKPa = 70.0 + (pressureRaw / 1023.0) * 40.0;

  // slider represents an arbitrary radiation alert index 0-100
  int radiationRaw = analogRead(RADIATION_SIM_PIN);
  int radiationIndex = map(radiationRaw, 0, 1023, 0, 100);

  bool warning = false;
  bool danger = false;

  if (temperature < 18 || temperature > 30) warning = true;
  if (temperature < 10 || temperature > 38) danger = true;

  if (humidity < 30 || humidity > 70) warning = true;
  if (pressureKPa < 90 || pressureKPa > 106) warning = true;

  // MQ2 is used as the Wokwi stand-in for the planned MQ135 air-quality sensor
  if (gasRaw > 550) warning = true;
  if (gasRaw > 750) danger = true;

  if (radiationIndex > 50) warning = true;
  if (radiationIndex > 75) danger = true;

  setStatus(warning, danger);

  Serial.println("--------------------------------");
  Serial.print("Temperature: "); Serial.print(temperature, 1); Serial.println(" C");
  Serial.print("Humidity:    "); Serial.print(humidity, 1); Serial.println(" %");
  Serial.print("Pressure:    "); Serial.print(pressureKPa, 1); Serial.println(" kPa");
  Serial.print("Air raw:     "); Serial.println(gasRaw);
  Serial.print("Radiation:   "); Serial.print(radiationIndex); Serial.println(" /100");
  Serial.print("STATUS:      ");
  Serial.println(danger ? "DANGER" : warning ? "WARNING" : "NORMAL");

  delay(1000);
}
