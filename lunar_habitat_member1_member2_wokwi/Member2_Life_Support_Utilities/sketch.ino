#include <DHT.h>
#include <Servo.h>

#define DHT_PIN 2
#define DHT_TYPE DHT22

#define SOIL_PIN A0
#define SOLAR_PIN A2
#define OXYGEN_PIN A3

#define GREENHOUSE_DARK_PIN 7
#define GROW_LIGHT_PIN 3

#define TANK_TRIG 4
#define TANK_ECHO 5

#define PUMP_RELAY_PIN 6
#define OXYGEN_LED_PIN 8
#define OXYGEN_SERVO_PIN 9

DHT dht(DHT_PIN, DHT_TYPE);
Servo oxygenValve;

long readDistanceCM() {
  digitalWrite(TANK_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TANK_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TANK_TRIG, LOW);

  long duration = pulseIn(TANK_ECHO, HIGH, 30000);
  if (duration == 0) return 400;
  return duration / 58;
}

void setup() {
  Serial.begin(115200);
  dht.begin();

  pinMode(GREENHOUSE_DARK_PIN, INPUT);
  pinMode(GROW_LIGHT_PIN, OUTPUT);
  pinMode(TANK_TRIG, OUTPUT);
  pinMode(TANK_ECHO, INPUT);
  pinMode(PUMP_RELAY_PIN, OUTPUT);
  pinMode(OXYGEN_LED_PIN, OUTPUT);

  oxygenValve.attach(OXYGEN_SERVO_PIN);
  oxygenValve.write(0);

  Serial.println("=== MEMBER 2: LIFE SUPPORT & UTILITIES ===");
  Serial.println("A4/A5 are intentionally free for final I2C integration.");
}

void loop() {
  float greenhouseTemp = dht.readTemperature();
  float greenhouseHumidity = dht.readHumidity();

  int soilRaw = analogRead(SOIL_PIN);
  int soilMoisture = map(soilRaw, 0, 1023, 0, 100);

  bool isDark = digitalRead(GREENHOUSE_DARK_PIN) == HIGH;
  digitalWrite(GROW_LIGHT_PIN, isDark ? HIGH : LOW);

  long tankDistance = readDistanceCM();
  int waterLevel = constrain(100 - (int)tankDistance, 0, 100);

  // Automatic irrigation / recycling pump
  bool pumpOn = soilMoisture < 40 && waterLevel > 15;
  digitalWrite(PUMP_RELAY_PIN, pumpOn ? HIGH : LOW);

  // Solar monitoring (relative simulated output)
  int solarRaw = analogRead(SOLAR_PIN);
  int solarPercent = constrain(map(solarRaw, 0, 1023, 0, 100), 0, 100);

  // Simulated oxygen level
  int oxygenRaw = analogRead(OXYGEN_PIN);
  int oxygenLevel = map(oxygenRaw, 0, 1023, 0, 100);

  bool oxygenSystemOn = oxygenLevel < 75;
  digitalWrite(OXYGEN_LED_PIN, oxygenSystemOn ? HIGH : LOW);
  oxygenValve.write(oxygenSystemOn ? 90 : 0);

  Serial.println("--------------------------------");
  Serial.print("Greenhouse Temp: "); Serial.print(greenhouseTemp, 1); Serial.println(" C");
  Serial.print("Greenhouse Hum:  "); Serial.print(greenhouseHumidity, 1); Serial.println(" %");
  Serial.print("Soil Moisture:   "); Serial.print(soilMoisture); Serial.println(" %");
  Serial.print("Grow Light:      "); Serial.println(isDark ? "ON" : "OFF");
  Serial.print("Water Level:     "); Serial.print(waterLevel); Serial.println(" %");
  Serial.print("Water Pump:      "); Serial.println(pumpOn ? "ON" : "OFF");
  Serial.print("Solar Output:    "); Serial.print(solarPercent); Serial.println(" %");
  Serial.print("Oxygen Level:    "); Serial.print(oxygenLevel); Serial.println(" %");
  Serial.print("O2 Production:   "); Serial.println(oxygenSystemOn ? "ACTIVE" : "STANDBY");

  delay(1000);
}
