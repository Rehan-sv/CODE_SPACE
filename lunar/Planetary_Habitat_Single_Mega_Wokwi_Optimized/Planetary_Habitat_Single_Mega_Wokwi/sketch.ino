#include <Wire.h>
#include <DHT.h>
#include <LiquidCrystal_I2C.h>
#include <Servo.h>

// ============================================================
// PLANETARY HABITAT - SINGLE MEGA WOKWI DEMONSTRATOR
// One Mega simulates the central command center and the four
// subsystem UNOs by reading each subsystem's sensors directly.
// Physical project architecture remains 4 UNOs -> I2C -> Mega.
// ============================================================

// ---------- ENVIRONMENT MONITORING (Member 1) ----------
#define DHT1_PIN 22
#define DHT1_TYPE DHT22
#define ENV_GAS A0
#define ENV_PRESSURE A1
#define ENV_RADIATION A2

DHT dht1(DHT1_PIN, DHT1_TYPE);

// ---------- LIFE SUPPORT (Member 2) ----------
#define SOIL_PIN A3
#define LIGHT_PIN A4
#define DHT2_PIN 23
#define DHT2_TYPE DHT22
#define WATER_LEVEL A5
#define O2_LEVEL A6
#define SOLAR_VOLTAGE A7
#define GREENHOUSE_PUMP 30
#define WATER_PUMP 31
#define O2_FAN 32
#define SOLAR_LED 33

DHT dht2(DHT2_PIN, DHT2_TYPE);

// ---------- SAFETY & EMERGENCY (Member 3) ----------
#define FLAME_PIN A8
#define SAFETY_GAS A9
#define SOS_BUTTON 24
#define SAFETY_BUZZER 34
#define FIRE_LED 35
#define GAS_LED 36
#define SOS_LED 37

// ---------- SMART INFRASTRUCTURE (Member 4) ----------
#define TRAFFIC_IR1 25
#define TRAFFIC_IR2 26
#define WASTE_TRIG 27
#define WASTE_ECHO 28
#define PARK_TRIG 40
#define PARK_ECHO 41
#define PARK_SERVO_PIN 42
#define STREET_LDR A10
#define STREET_LED 43

Servo parkingServo;

// ---------- CENTRAL STATUS ----------
#define CENTRAL_BUZZER 44
#define CENTRAL_GREEN 45
#define CENTRAL_YELLOW 46
#define CENTRAL_RED 47

LiquidCrystal_I2C lcd(0x27, 20, 4);

unsigned long lastPage = 0;
int page = 0;

float readUltrasonic(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH, 30000);
  if (duration == 0) return 999;
  return duration * 0.0343 / 2.0;
}

void setCentralStatus(bool warning, bool danger) {
  digitalWrite(CENTRAL_GREEN, (!warning && !danger));
  digitalWrite(CENTRAL_YELLOW, (warning && !danger));
  digitalWrite(CENTRAL_RED, danger);

  if (danger) tone(CENTRAL_BUZZER, 1200);
  else if (warning) tone(CENTRAL_BUZZER, 700, 150);
  else noTone(CENTRAL_BUZZER);
}

void lcdLine(int row, const String &text) {
  lcd.setCursor(0, row);
  String s = text;
  while (s.length() < 20) s += ' ';
  lcd.print(s.substring(0, 20));
}

void setup() {
  Serial.begin(115200);
  Wire.begin();

  dht1.begin();
  dht2.begin();

  pinMode(GREENHOUSE_PUMP, OUTPUT);
  pinMode(WATER_PUMP, OUTPUT);
  pinMode(O2_FAN, OUTPUT);
  pinMode(SOLAR_LED, OUTPUT);

  pinMode(SOS_BUTTON, INPUT_PULLUP);
  pinMode(SAFETY_BUZZER, OUTPUT);
  pinMode(FIRE_LED, OUTPUT);
  pinMode(GAS_LED, OUTPUT);
  pinMode(SOS_LED, OUTPUT);

  pinMode(TRAFFIC_IR1, INPUT);
  pinMode(TRAFFIC_IR2, INPUT);

  pinMode(WASTE_TRIG, OUTPUT);
  pinMode(WASTE_ECHO, INPUT);
  pinMode(PARK_TRIG, OUTPUT);
  pinMode(PARK_ECHO, INPUT);

  pinMode(STREET_LED, OUTPUT);

  pinMode(CENTRAL_BUZZER, OUTPUT);
  pinMode(CENTRAL_GREEN, OUTPUT);
  pinMode(CENTRAL_YELLOW, OUTPUT);
  pinMode(CENTRAL_RED, OUTPUT);

  parkingServo.attach(PARK_SERVO_PIN);
  parkingServo.write(0);

  lcd.init();
  lcd.backlight();
  lcdLine(0, "PLANET HABITAT");
  lcdLine(1, "CENTRAL COMMAND");
  lcdLine(2, "Mega Online");
  lcdLine(3, "Initializing...");
  delay(1500);
}

void loop() {
  // ===== MEMBER 1: ENVIRONMENT =====
  float temp1 = dht1.readTemperature();
  float hum1 = dht1.readHumidity();
  if (isnan(temp1)) temp1 = 24.0;
  if (isnan(hum1)) hum1 = 50.0;

  int gas1 = analogRead(ENV_GAS);
  float pressure = 70.0 + (analogRead(ENV_PRESSURE) / 1023.0) * 40.0;
  int radiation = map(analogRead(ENV_RADIATION), 0, 1023, 0, 100);

  bool envWarning = temp1 < 18 || temp1 > 30 || hum1 < 30 || hum1 > 70 ||
                    pressure < 90 || pressure > 106 || gas1 > 550 || radiation > 50;
  bool envDanger = temp1 < 10 || temp1 > 38 || gas1 > 750 || radiation > 75;

  // ===== MEMBER 2: LIFE SUPPORT =====
  int soil = analogRead(SOIL_PIN);
  int light = analogRead(LIGHT_PIN);
  float temp2 = dht2.readTemperature();
  float hum2 = dht2.readHumidity();
  if (isnan(temp2)) temp2 = 24.0;
  if (isnan(hum2)) hum2 = 55.0;

  int water = analogRead(WATER_LEVEL);
  int oxygen = analogRead(O2_LEVEL);
  int solar = analogRead(SOLAR_VOLTAGE);

  bool greenhouseNeedsWater = soil < 450;
  bool waterLow = water < 300;
  bool oxygenLow = oxygen < 350;

  digitalWrite(GREENHOUSE_PUMP, greenhouseNeedsWater);
  digitalWrite(WATER_PUMP, waterLow);
  digitalWrite(O2_FAN, oxygenLow);
  digitalWrite(SOLAR_LED, solar > 500);

  bool lifeWarning = greenhouseNeedsWater || waterLow || oxygenLow ||
                     temp2 < 18 || temp2 > 30;
  bool lifeDanger = oxygen < 200 || water < 150;

  // ===== MEMBER 3: SAFETY =====
  int flame = analogRead(FLAME_PIN);
  int safetyGas = analogRead(SAFETY_GAS);
  bool sos = digitalRead(SOS_BUTTON) == LOW;

  // Higher analog value = stronger simulated alarm condition.
  bool fireDanger = flame > 700;
  bool gasDanger = safetyGas > 750;
  bool safetyDanger = fireDanger || gasDanger || sos;
  bool safetyWarning = flame > 450 || safetyGas > 550;

  digitalWrite(FIRE_LED, fireDanger);
  digitalWrite(GAS_LED, gasDanger);
  digitalWrite(SOS_LED, sos);

  if (safetyDanger) tone(SAFETY_BUZZER, 1500);
  else noTone(SAFETY_BUZZER);

  // ===== MEMBER 4: INFRASTRUCTURE =====
  bool traffic1 = digitalRead(TRAFFIC_IR1);
  bool traffic2 = digitalRead(TRAFFIC_IR2);

  float wasteDistance = readUltrasonic(WASTE_TRIG, WASTE_ECHO);
  float parkingDistance = readUltrasonic(PARK_TRIG, PARK_ECHO);

  bool wasteFull = wasteDistance < 8;
  bool parkingOccupied = parkingDistance < 15;

  parkingServo.write(parkingOccupied ? 90 : 0);

  int streetLight = analogRead(STREET_LDR);
  // In Wokwi, adjust the photoresistor slider to demonstrate this.
  digitalWrite(STREET_LED, streetLight < 450);

  bool infraWarning = wasteFull || parkingOccupied;
  bool infraDanger = false;

  // ===== CENTRAL COMMAND DECISION =====
  bool warning = envWarning || lifeWarning || safetyWarning || infraWarning;
  bool danger = envDanger || lifeDanger || safetyDanger || infraDanger;

  setCentralStatus(warning, danger);

  // ===== SERIAL DASHBOARD =====
  Serial.println("\n================ HABITAT COMMAND CENTER ================");
  Serial.print("ENV  T="); Serial.print(temp1,1);
  Serial.print("C H="); Serial.print(hum1,1);
  Serial.print("% P="); Serial.print(pressure,1);
  Serial.print("kPa Gas="); Serial.print(gas1);
  Serial.print(" Rad="); Serial.println(radiation);

  Serial.print("LIFE Soil="); Serial.print(soil);
  Serial.print(" Water="); Serial.print(water);
  Serial.print(" O2="); Serial.print(oxygen);
  Serial.print(" Solar="); Serial.println(solar);

  Serial.print("SAFE Flame="); Serial.print(flame);
  Serial.print(" Gas="); Serial.print(safetyGas);
  Serial.print(" SOS="); Serial.println(sos ? "YES" : "NO");

  Serial.print("INFRA Traffic=");
  Serial.print(traffic1 || traffic2 ? "VEHICLE" : "CLEAR");
  Serial.print(" Waste=");
  Serial.print(wasteFull ? "FULL" : "OK");
  Serial.print(" Parking=");
  Serial.println(parkingOccupied ? "OCCUPIED" : "FREE");

  Serial.print("OVERALL STATUS: ");
  Serial.println(danger ? "DANGER" : warning ? "WARNING" : "NORMAL");

  // ===== LCD ROTATING PAGES =====
  if (millis() - lastPage > 2500) {
    lastPage = millis();
    page = (page + 1) % 4;

    if (page == 0) {
      lcdLine(0, "ENVIRONMENT");
      lcdLine(1, "T:" + String(temp1,1) + "C H:" + String(hum1,0) + "%");
      lcdLine(2, "P:" + String(pressure,1) + "kPa");
      lcdLine(3, "Gas:" + String(gas1) + " R:" + String(radiation));
    }
    else if (page == 1) {
      lcdLine(0, "LIFE SUPPORT");
      lcdLine(1, "Soil:" + String(soil));
      lcdLine(2, "Water:" + String(water) + " O2:" + String(oxygen));
      lcdLine(3, "Solar:" + String(solar));
    }
    else if (page == 2) {
      lcdLine(0, "SAFETY");
      lcdLine(1, "Fire:" + String(fireDanger ? "DANGER" : "OK"));
      lcdLine(2, "Gas:" + String(gasDanger ? "DANGER" : "OK"));
      lcdLine(3, "SOS:" + String(sos ? "ACTIVE" : "READY"));
    }
    else {
      lcdLine(0, "INFRASTRUCTURE");
      lcdLine(1, "Traffic:" + String((traffic1 || traffic2) ? "BUSY" : "CLEAR"));
      lcdLine(2, "Waste:" + String(wasteFull ? "FULL" : "OK"));
      lcdLine(3, "Park:" + String(parkingOccupied ? "OCCUPIED" : "FREE"));
    }
  }

  delay(500);
}
