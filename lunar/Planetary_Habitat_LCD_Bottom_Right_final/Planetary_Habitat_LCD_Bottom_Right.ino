#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <Adafruit_BMP085.h>
#include <Servo.h>

/*
  PLANETARY HABITAT - SIMPLE DEMO VERSION

  Program flow:
  1. Environment system
  2. Life-support system
  3. Safety system
  4. Infrastructure system
  5. Five live dashboards

  Status:
  0 = NORMAL
  1 = WARNING
  2 = DANGER
*/

// =====================================================
// PIN CONNECTIONS
// =====================================================

// Environment
#define ENV_DHT 2
#define ENV_GAS A0
#define RADIATION A1
#define ENV_GREEN 22
#define ENV_YELLOW 23
#define ENV_RED 24
#define ENV_BUZZER 25
#define VENTILATION 26
#define SCRUBBER 27

// Life Support
#define SOIL A2
#define GREENHOUSE_LIGHT A3
#define WATER_LEVEL A4
#define OXYGEN_LEVEL A5
#define SOLAR_LEVEL A6
#define IRRIGATION 28
#define GROW_LIGHT 29
#define WATER_PUMP 30
#define OXYGEN_FAN 31
#define SOLAR_OK 32
#define SOLAR_WARNING 33
#define LIFE_BUZZER 34

// Safety
#define FIRE_BUTTON 4
#define SOS_BUTTON 5
#define SAFETY_GAS A7
#define FIRE_LED 35
#define GAS_LED 36
#define SOS_LED 37
#define SECURE_LED 38
#define SAFETY_BUZZER 39
#define FIRE_SUPPRESSION 40
#define EXHAUST 41

// Infrastructure
#define TRAFFIC_A 6
#define TRAFFIC_B 7
#define WASTE_TRIG 8
#define WASTE_ECHO 9
#define PARK_TRIG 10
#define PARK_ECHO 11
#define PARK_SERVO 12
#define STREET_LDR A8
#define TRAFFIC_GO 42
#define TRAFFIC_STOP 43
#define WASTE_LED 44
#define WASTE_BUZZER 45
#define STREET_LIGHT 46

// Central Command
#define MASTER_BUZZER 47
#define MASTER_GREEN 48
#define MASTER_YELLOW 49
#define MASTER_RED 50

DHT envDHT(ENV_DHT, DHT22);
Adafruit_BMP085 bmp;
Servo parkingGate;
// Five always-visible dashboards (unique I2C addresses)
LiquidCrystal_I2C centralLCD(0x27, 20, 4);
LiquidCrystal_I2C envLCD(0x26, 20, 4);
LiquidCrystal_I2C lifeLCD(0x25, 20, 4);
LiquidCrystal_I2C safetyLCD(0x24, 20, 4);
LiquidCrystal_I2C infraLCD(0x23, 20, 4);

// =====================================================
// SHARED SYSTEM VALUES
// =====================================================

int envStatus = 0;
int lifeStatus = 0;
int safetyStatus = 0;
int infraStatus = 0;
int overallStatus = 0;

float envTemp = 24;
float envHumidity = 45;
float pressure = 1013;
int envGas = 0;
int radiation = 0;

// Member 1 environment limits
// Temperature: below 50 = NORMAL, 50-59.9 = WARNING, 60+ = DANGER
const float ENV_TEMP_WARNING = 50.0;
const float ENV_TEMP_DANGER = 60.0;

// Environment gas input is a direct 0-1023 demo value,
// using the same solution as Member 3.
const int ENV_GAS_WARNING = 400;
const int ENV_GAS_DANGER = 700;

// Radiation thresholds
const int RADIATION_WARNING = 600;
const int RADIATION_DANGER = 850;

int soil = 0;
int greenhouseLight = 0;
int water = 0;
int oxygen = 0;
int solar = 0;

bool fireDetected = false;
bool sosPressed = false;

// Member 3 gas input: use a simple 0-1023 demo value
// 0-399 = NORMAL, 400-699 = WARNING, 700-1023 = DANGER
int safetyGas = 0;

const int GAS_WARNING = 400;
const int GAS_DANGER = 700;

long wasteDistance = 100;
long parkingDistance = 100;
bool parkingOccupied = false;
bool trafficAActive = false;
bool trafficBActive = false;
bool streetLightOn = false;

bool bmpReady = false;

// =====================================================
// SMALL HELPER FUNCTIONS
// =====================================================

String statusName(int status) {
  if (status == 0) return "NORMAL";
  if (status == 1) return "WARNING";
  return "DANGER";
}

void printLine(LiquidCrystal_I2C &screen, int row, String text) {
  while (text.length() < 20) text += " ";
  screen.setCursor(0, row);
  screen.print(text.substring(0, 20));
}

String shortStatus(int status) {
  if (status == 0) return "N";
  if (status == 1) return "W";
  return "D";
}


long distanceCM(int trig, int echo) {
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  long duration = pulseIn(echo, HIGH, 30000);
  if (duration == 0) return 400;
  return duration / 58;
}

// =====================================================
// 1. ENVIRONMENT MONITORING
// =====================================================

// Fast Member 1 controls: gas/radiation and output LEDs are checked
// continuously so the ventilation and air scrubber react immediately.
void environmentFastControls() {
  envGas = constrain(analogRead(ENV_GAS), 0, 1023);
  radiation = constrain(analogRead(RADIATION), 0, 1023);

  // Decide environment status
  if (envTemp >= ENV_TEMP_DANGER ||
      envGas >= ENV_GAS_DANGER ||
      radiation >= RADIATION_DANGER) {
    envStatus = 2;   // DANGER
  }
  else if (envTemp >= ENV_TEMP_WARNING ||
           envGas >= ENV_GAS_WARNING ||
           radiation >= RADIATION_WARNING) {
    envStatus = 1;   // WARNING
  }
  else {
    envStatus = 0;   // NORMAL
  }

  // Status LEDs
  digitalWrite(ENV_GREEN, envStatus == 0);
  digitalWrite(ENV_YELLOW, envStatus == 1);
  digitalWrite(ENV_RED, envStatus == 2);

  // Ventilation turns on for high temperature or elevated gas.
  bool ventilationNeeded =
      (envTemp >= ENV_TEMP_WARNING || envGas >= ENV_GAS_WARNING);
  digitalWrite(VENTILATION, ventilationNeeded ? HIGH : LOW);

  // Air scrubber turns on whenever environment gas reaches warning level.
  bool scrubberNeeded = (envGas >= ENV_GAS_WARNING);
  digitalWrite(SCRUBBER, scrubberNeeded ? HIGH : LOW);

  // Environment buzzer only for DANGER.
  digitalWrite(ENV_BUZZER, envStatus == 2 ? HIGH : LOW);
}

void environmentSystem() {
  float t = envDHT.readTemperature();
  float h = envDHT.readHumidity();

  if (!isnan(t)) envTemp = t;
  if (!isnan(h)) envHumidity = h;

  // BMP180 is used for atmospheric pressure monitoring.
  if (bmpReady) pressure = bmp.readPressure() / 100.0;

  environmentFastControls();
}

// =====================================================
// 2. LIFE SUPPORT
// =====================================================

void lifeSupportSystem() {
  soil = analogRead(SOIL);
  greenhouseLight = analogRead(GREENHOUSE_LIGHT);
  water = analogRead(WATER_LEVEL);
  oxygen = analogRead(OXYGEN_LEVEL);
  solar = analogRead(SOLAR_LEVEL);

  // Automatic controls
  digitalWrite(IRRIGATION, soil > 600);
  digitalWrite(GROW_LIGHT, greenhouseLight < 400);
  digitalWrite(WATER_PUMP, water < 350);
  digitalWrite(OXYGEN_FAN, oxygen < 350);
  digitalWrite(SOLAR_OK, solar >= 350);
  digitalWrite(SOLAR_WARNING, solar < 350);

  // Decide life-support status
  if (water < 180 || oxygen < 220)
    lifeStatus = 2;
  else if (soil > 600 || water < 350 || oxygen < 350 || solar < 350)
    lifeStatus = 1;
  else
    lifeStatus = 0;

  digitalWrite(LIFE_BUZZER, lifeStatus == 2);
}

// =====================================================
// 3. SAFETY & EMERGENCY
// =====================================================

void safetySystem() {
  // Read Member 3 inputs continuously
  fireDetected = (digitalRead(FIRE_BUTTON) == LOW);
  sosPressed = (digitalRead(SOS_BUTTON) == LOW);

  // Read the gas input directly as a 0-1023 demo value.
  // Any value above 1023 is capped at 1023.
  safetyGas = analogRead(SAFETY_GAS);
  safetyGas = constrain(safetyGas, 0, 1023);

  // Decide safety status
  if (fireDetected || sosPressed || safetyGas >= GAS_DANGER) {
    safetyStatus = 2;   // DANGER
  }
  else if (safetyGas >= GAS_WARNING) {
    safetyStatus = 1;   // WARNING
  }
  else {
    safetyStatus = 0;   // NORMAL
  }

  // Individual indicators
  digitalWrite(FIRE_LED, fireDetected);
  digitalWrite(SOS_LED, sosPressed);
  digitalWrite(GAS_LED, safetyGas >= GAS_WARNING);
  digitalWrite(SECURE_LED, safetyStatus == 0);

  // Individual automatic responses
  digitalWrite(FIRE_SUPPRESSION, fireDetected);
  digitalWrite(EXHAUST, safetyGas >= GAS_WARNING);

  // Common emergency alarm only for danger conditions
  digitalWrite(SAFETY_BUZZER,
               fireDetected || sosPressed || safetyGas >= GAS_DANGER);
}

void updateSafetyLCD() {
  printLine(safetyLCD, 0, "3. SAFETY SYSTEM");

  if (fireDetected) {
    printLine(safetyLCD, 1, "!!! FIRE ALERT !!!");
    printLine(safetyLCD, 2, "SUPPRESSION: ON");
    printLine(safetyLCD, 3, "STATUS: DANGER");
  }
  else if (sosPressed) {
    printLine(safetyLCD, 1, "!!! SOS ACTIVE !!!");
    printLine(safetyLCD, 2, "EMERGENCY SIGNAL");
    printLine(safetyLCD, 3, "STATUS: DANGER");
  }
  else if (safetyGas >= GAS_DANGER) {
    printLine(safetyLCD, 1, "!!! GAS DANGER !!!");
    printLine(safetyLCD, 2, "Gas:" + String(safetyGas));
    printLine(safetyLCD, 3, "EXHAUST ON DANGER");
  }
  else if (safetyGas >= GAS_WARNING) {
    printLine(safetyLCD, 1, "GAS WARNING");
    printLine(safetyLCD, 2, "Gas:" + String(safetyGas));
    printLine(safetyLCD, 3, "EXHAUST ON WARNING");
  }
  else {
    printLine(safetyLCD, 1, "Fire:NO   SOS:NO");
    printLine(safetyLCD, 2, "Gas:" + String(safetyGas));
    printLine(safetyLCD, 3, "SYSTEM SECURE");
  }
}

// =====================================================
// 4. SMART INFRASTRUCTURE
// =====================================================

void infrastructureSystem() {
  trafficAActive = digitalRead(TRAFFIC_A) == LOW;
  trafficBActive = digitalRead(TRAFFIC_B) == LOW;

  wasteDistance = distanceCM(WASTE_TRIG, WASTE_ECHO);
  parkingDistance = distanceCM(PARK_TRIG, PARK_ECHO);
  int light = analogRead(STREET_LDR);
  streetLightOn = light < 400;

  bool wasteFull = wasteDistance < 12;
  parkingOccupied = parkingDistance < 15;

  // Traffic
  digitalWrite(TRAFFIC_GO, trafficAActive != trafficBActive);
  digitalWrite(TRAFFIC_STOP, trafficAActive && trafficBActive);

  // Waste
  digitalWrite(WASTE_LED, wasteFull);
  digitalWrite(WASTE_BUZZER, wasteDistance < 6);

  // Parking
  parkingGate.write(parkingOccupied ? 0 : 90);

  // Street light
  digitalWrite(STREET_LIGHT, streetLightOn);

  // Decide infrastructure status
  if (wasteDistance < 6)
    infraStatus = 2;
  else if (wasteFull || (trafficAActive && trafficBActive))
    infraStatus = 1;
  else
    infraStatus = 0;
}

// =====================================================
// 5. CENTRAL COMMAND
// =====================================================

void centralDashboard() {
  overallStatus = max(max(envStatus, lifeStatus), max(safetyStatus, infraStatus));

  digitalWrite(MASTER_GREEN, overallStatus == 0);
  digitalWrite(MASTER_YELLOW, overallStatus == 1);
  digitalWrite(MASTER_RED, overallStatus == 2);

  if (overallStatus == 2)
    tone(MASTER_BUZZER, 1000);
  else
    noTone(MASTER_BUZZER);

  // CENTRAL COMMAND LCD
  printLine(centralLCD, 0, "CENTRAL COMMAND");
  printLine(centralLCD, 1, "ENV:" + shortStatus(envStatus) + " LIFE:" + shortStatus(lifeStatus));
  printLine(centralLCD, 2, "SAFE:" + shortStatus(safetyStatus) + " INFRA:" + shortStatus(infraStatus));
  printLine(centralLCD, 3, "STATUS: " + statusName(overallStatus));

  // ENVIRONMENT LCD
  printLine(envLCD, 0, "1. ENVIRONMENT");
  printLine(envLCD, 1, "T:" + String(envTemp, 1) + " H:" + String(envHumidity, 0) + " P:" + String(pressure, 0));
  printLine(envLCD, 2, "Gas:" + String(envGas) + " Rad:" + String(radiation));
  printLine(envLCD, 3, "STATUS: " + statusName(envStatus));

  // LIFE SUPPORT LCD
  printLine(lifeLCD, 0, "2. LIFE SUPPORT");
  printLine(lifeLCD, 1, "Soil:" + String(soil) + " Light:" + String(greenhouseLight));
  printLine(lifeLCD, 2, "Water:" + String(water) + " O2:" + String(oxygen));
  printLine(lifeLCD, 3, "Sol:" + String(solar) + " " + statusName(lifeStatus));

  // SAFETY LCD
  updateSafetyLCD();

  // INFRASTRUCTURE LCD
  printLine(infraLCD, 0, "4. INFRASTRUCTURE");
  printLine(infraLCD, 1, "Waste:" + String(wasteDistance) + "cm");
  printLine(infraLCD, 2, String("Parking:") + (parkingOccupied ? "OCCUPIED" : "FREE"));
  printLine(infraLCD, 3, String("T:") + (trafficAActive ? "A" : "-") + (trafficBActive ? "B" : "-") + " Light:" + (streetLightOn ? "ON" : "OFF"));
}

// =====================================================
// SETUP
// =====================================================

void setup() {
  Serial.begin(115200);

  envDHT.begin();
  bmpReady = bmp.begin();
  parkingGate.attach(PARK_SERVO);

  // Input pins
  pinMode(FIRE_BUTTON, INPUT_PULLUP);
  pinMode(SOS_BUTTON, INPUT_PULLUP);
  pinMode(TRAFFIC_A, INPUT_PULLUP);
  pinMode(TRAFFIC_B, INPUT_PULLUP);
  pinMode(WASTE_ECHO, INPUT);
  pinMode(PARK_ECHO, INPUT);

  // Output pins
  for (int pin = 22; pin <= 50; pin++) pinMode(pin, OUTPUT);
  pinMode(WASTE_TRIG, OUTPUT);
  pinMode(PARK_TRIG, OUTPUT);

  centralLCD.init(); centralLCD.backlight();
  envLCD.init(); envLCD.backlight();
  lifeLCD.init(); lifeLCD.backlight();
  safetyLCD.init(); safetyLCD.backlight();
  infraLCD.init(); infraLCD.backlight();

  printLine(centralLCD, 0, "PLANETARY HABITAT");
  printLine(centralLCD, 1, "SYSTEM STARTING...");
  printLine(centralLCD, 2, "5 LIVE DASHBOARDS");
  printLine(centralLCD, 3, "NO PAGE SWITCHING");

  delay(1500);
}

// =====================================================
// MAIN PROGRAM
// =====================================================

void loop() {
  // Member 3 safety system is checked continuously so Fire/SOS are not missed
  safetySystem();
  updateSafetyLCD();

  // Member 1 gas/radiation controls are also checked continuously.
  // This makes the AIR SCRUBBER and VENTILATION react immediately.
  environmentFastControls();

  // Slower sensors and dashboards refresh every 2 seconds
  static unsigned long lastUpdate = 0;

  if (millis() - lastUpdate >= 2000) {
    lastUpdate = millis();

    environmentSystem();
    lifeSupportSystem();
    infrastructureSystem();
    centralDashboard();

    Serial.print("ENV: "); Serial.print(statusName(envStatus));
    Serial.print(" (T:"); Serial.print(envTemp, 1);
    Serial.print(" Gas:"); Serial.print(envGas);
    Serial.print(" Rad:"); Serial.print(radiation); Serial.print(")");
    Serial.print(" | LIFE: "); Serial.print(statusName(lifeStatus));
    Serial.print(" | SAFETY: "); Serial.print(statusName(safetyStatus));
    Serial.print(" | GAS: "); Serial.print(safetyGas);
    Serial.print(" | INFRA: "); Serial.println(statusName(infraStatus));
  }

  delay(50);
}
