#include <Wire.h>
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
#define GREENHOUSE_DHT 3
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
DHT greenhouseDHT(GREENHOUSE_DHT, DHT22);
Adafruit_BMP085 bmp;
Servo parkingGate;
// Five always-visible dashboards (unique I2C addresses)
// Wokwi supports changing the LCD I2C address.  We use a tiny
// built-in PCF8574/HD44780 driver here so all five LCDs can share
// the Mega's I2C bus without depending on a particular LiquidCrystal_I2C implementation.
class HabitatLCD {
public:
  uint8_t addr;
  bool backlightOn;

  HabitatLCD(uint8_t address) : addr(address), backlightOn(true) {}

  void expanderWrite(uint8_t data) {
    Wire.beginTransmission(addr);
    Wire.write(data | (backlightOn ? 0x08 : 0x00));
    Wire.endTransmission();
  }

  void pulseEnable(uint8_t data) {
    expanderWrite(data | 0x04);
    delayMicroseconds(1);
    expanderWrite(data & ~0x04);
    delayMicroseconds(50);
  }

  void write4bits(uint8_t data) {
    expanderWrite(data);
    pulseEnable(data);
  }

  void send(uint8_t value, uint8_t mode) {
    write4bits((value & 0xF0) | mode);
    write4bits(((value << 4) & 0xF0) | mode);
  }

  void command(uint8_t value) { send(value, 0x00); }

  void writeChar(char c) { send((uint8_t)c, 0x01); }

  void init() {
    delay(50);
    expanderWrite(0x00);
    delay(5);
    write4bits(0x30);
    delay(5);
    write4bits(0x30);
    delayMicroseconds(150);
    write4bits(0x30);
    delay(1);
    write4bits(0x20);

    command(0x28); // 4-bit, 2-line, 5x8 font
    command(0x08); // display off
    command(0x01); // clear
    delay(2);
    command(0x06); // entry mode
    command(0x0C); // display on, cursor off
  }

  void backlight() {
    backlightOn = true;
    expanderWrite(0x00);
  }

  void clear() { command(0x01); delay(2); }

  void setCursor(uint8_t col, uint8_t row) {
    static const uint8_t rowOffsets[] = {0x00, 0x40, 0x14, 0x54};
    if (row > 3) row = 3;
    command(0x80 | (col + rowOffsets[row]));
  }

  void print(const String &text) {
    for (size_t i = 0; i < text.length(); i++) writeChar(text[i]);
  }
};

HabitatLCD centralLCD(0x27);
HabitatLCD envLCD(0x26);
HabitatLCD lifeLCD(0x25);
HabitatLCD safetyLCD(0x24);
HabitatLCD infraLCD(0x23);

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

float greenhouseTemp = 25;
int soil = 0;
int water = 0;
int oxygen = 0;
int solar = 0;

bool fireDetected = false;
bool sosPressed = false;
int safetyGas = 0;

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

void printLine(HabitatLCD &screen, int row, String text) {
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

void environmentSystem() {
  float t = envDHT.readTemperature();
  float h = envDHT.readHumidity();

  if (!isnan(t)) envTemp = t;
  if (!isnan(h)) envHumidity = h;
  if (bmpReady) pressure = bmp.readPressure() / 100.0;

  envGas = analogRead(ENV_GAS);
  radiation = analogRead(RADIATION);

  // Decide environment status
  if (envTemp > 35 || envGas > 700 || radiation > 850)
    envStatus = 2;
  else if (envTemp > 30 || envGas > 450 || radiation > 600)
    envStatus = 1;
  else
    envStatus = 0;

  // Status LEDs
  digitalWrite(ENV_GREEN, envStatus == 0);
  digitalWrite(ENV_YELLOW, envStatus == 1);
  digitalWrite(ENV_RED, envStatus == 2);

  // Automatic response
  digitalWrite(VENTILATION, envStatus >= 1);
  digitalWrite(SCRUBBER, envStatus == 2);
  digitalWrite(ENV_BUZZER, envStatus == 2);
}

// =====================================================
// 2. LIFE SUPPORT
// =====================================================

void lifeSupportSystem() {
  float t = greenhouseDHT.readTemperature();
  if (!isnan(t)) greenhouseTemp = t;

  soil = analogRead(SOIL);
  int light = analogRead(GREENHOUSE_LIGHT);
  water = analogRead(WATER_LEVEL);
  oxygen = analogRead(OXYGEN_LEVEL);
  solar = analogRead(SOLAR_LEVEL);

  // Automatic controls
  digitalWrite(IRRIGATION, soil > 600);
  digitalWrite(GROW_LIGHT, light < 400);
  digitalWrite(WATER_PUMP, water < 350);
  digitalWrite(OXYGEN_FAN, oxygen < 350);
  digitalWrite(SOLAR_OK, solar >= 350);
  digitalWrite(SOLAR_WARNING, solar < 350);

  // Decide life-support status
  if (greenhouseTemp > 38 || water < 180 || oxygen < 220)
    lifeStatus = 2;
  else if (greenhouseTemp > 32 || soil > 600 || water < 350 || oxygen < 350 || solar < 350)
    lifeStatus = 1;
  else
    lifeStatus = 0;

  digitalWrite(LIFE_BUZZER, lifeStatus == 2);
}

// =====================================================
// 3. SAFETY & EMERGENCY
// =====================================================

void safetySystem() {
  fireDetected = digitalRead(FIRE_BUTTON) == LOW;
  sosPressed = digitalRead(SOS_BUTTON) == LOW;
  safetyGas = analogRead(SAFETY_GAS);

  if (fireDetected || sosPressed || safetyGas > 700)
    safetyStatus = 2;
  else if (safetyGas > 450)
    safetyStatus = 1;
  else
    safetyStatus = 0;

  digitalWrite(FIRE_LED, fireDetected);
  digitalWrite(GAS_LED, safetyGas > 450);
  digitalWrite(SOS_LED, sosPressed);
  digitalWrite(SECURE_LED, safetyStatus == 0);

  digitalWrite(FIRE_SUPPRESSION, fireDetected);
  digitalWrite(EXHAUST, fireDetected || safetyGas > 450);
  digitalWrite(SAFETY_BUZZER, safetyStatus == 2);
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
  printLine(lifeLCD, 1, "Soil:" + String(soil) + " T:" + String(greenhouseTemp, 1));
  printLine(lifeLCD, 2, "Water:" + String(water) + " O2:" + String(oxygen));
  printLine(lifeLCD, 3, "Sol:" + String(solar) + " " + statusName(lifeStatus));

  // SAFETY LCD
  printLine(safetyLCD, 0, "3. SAFETY");
  printLine(safetyLCD, 1, String("Fire:") + (fireDetected ? "YES" : "NO") + " SOS:" + (sosPressed ? "YES" : "NO"));
  printLine(safetyLCD, 2, "Gas: " + String(safetyGas));
  printLine(safetyLCD, 3, "STATUS: " + statusName(safetyStatus));

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
  delay(100);
  Serial.println("PLANETARY HABITAT BOOT");

  // Configure I2C explicitly. Arduino Mega: SDA=20, SCL=21.
  Wire.begin();
  Wire.setClock(100000);

  // Inputs
  pinMode(FIRE_BUTTON, INPUT_PULLUP);
  pinMode(SOS_BUTTON, INPUT_PULLUP);
  pinMode(TRAFFIC_A, INPUT_PULLUP);
  pinMode(TRAFFIC_B, INPUT_PULLUP);
  pinMode(WASTE_ECHO, INPUT);
  pinMode(PARK_ECHO, INPUT);

  // Outputs
  for (int pin = 22; pin <= 50; pin++) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, LOW);
  }
  pinMode(WASTE_TRIG, OUTPUT);
  pinMode(PARK_TRIG, OUTPUT);
  digitalWrite(WASTE_TRIG, LOW);
  digitalWrite(PARK_TRIG, LOW);

  // Initialize all five dashboards before starting sensor processing.
  centralLCD.init(); centralLCD.backlight();
  envLCD.init(); envLCD.backlight();
  lifeLCD.init(); lifeLCD.backlight();
  safetyLCD.init(); safetyLCD.backlight();
  infraLCD.init(); infraLCD.backlight();

  printLine(centralLCD, 0, "PLANETARY HABITAT");
  printLine(centralLCD, 1, "SYSTEM STARTING...");
  printLine(centralLCD, 2, "5 LIVE DASHBOARDS");
  printLine(centralLCD, 3, "I2C ONLINE");
  printLine(envLCD, 0, "1. ENVIRONMENT");
  printLine(lifeLCD, 0, "2. LIFE SUPPORT");
  printLine(safetyLCD, 0, "3. SAFETY");
  printLine(infraLCD, 0, "4. INFRASTRUCTURE");

  // Sensors/peripherals are initialized after the displays, so a bad optional
  // sensor cannot prevent the dashboards from showing the boot screen.
  envDHT.begin();
  greenhouseDHT.begin();
  bmpReady = bmp.begin();
  parkingGate.attach(PARK_SERVO);

  Serial.print("BMP180: ");
  Serial.println(bmpReady ? "OK" : "NOT FOUND (using default pressure)");
  Serial.println("DASHBOARDS INITIALIZED");

  // Make the expected normal indicators visible immediately.
  digitalWrite(ENV_GREEN, HIGH);
  digitalWrite(SECURE_LED, HIGH);
  digitalWrite(SOLAR_OK, HIGH);
  digitalWrite(MASTER_GREEN, HIGH);

  delay(1500);
}

// =====================================================
// MAIN PROGRAM
// =====================================================

void loop() {
  environmentSystem();
  lifeSupportSystem();
  safetySystem();
  infrastructureSystem();
  centralDashboard();

  Serial.print("ENV: "); Serial.print(statusName(envStatus));
  Serial.print(" | LIFE: "); Serial.print(statusName(lifeStatus));
  Serial.print(" | SAFETY: "); Serial.print(statusName(safetyStatus));
  Serial.print(" | INFRA: "); Serial.print(statusName(infraStatus));
  Serial.print(" | I2C LCDs: 0x27 0x26 0x25 0x24 0x23");
  Serial.println();

  delay(2000);
}
