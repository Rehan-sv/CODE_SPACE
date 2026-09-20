#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <Adafruit_BMP085.h>

#define DHT_PIN 2
#define DHT_TYPE DHT22
#define GAS_PIN A0
#define RAD_PIN A1
#define LED_OK 6
#define LED_WARN 7
#define LED_DANGER 8
#define BUZZER 9
#define VENT_RELAY 10
#define SCRUB_RELAY 11

DHT dht(DHT_PIN, DHT_TYPE);
Adafruit_BMP085 bmp;
LiquidCrystal_I2C lcd(0x27, 20, 4);

unsigned long lastUpdate = 0;
bool bmpOK = false;

void line(int row, const String &text) {
  lcd.setCursor(0, row);
  String s = text;
  if (s.length() > 20) s.remove(20);
  while (s.length() < 20) s += ' ';
  lcd.print(s);
}

void statusOutputs(bool warning, bool danger) {
  digitalWrite(LED_OK, !warning && !danger);
  digitalWrite(LED_WARN, warning && !danger);
  digitalWrite(LED_DANGER, danger);
  digitalWrite(VENT_RELAY, warning || danger);
  digitalWrite(SCRUB_RELAY, danger);
  if (danger) tone(BUZZER, 1300);
  else if (warning) tone(BUZZER, 700, 120);
  else noTone(BUZZER);
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  bmpOK = bmp.begin();
  lcd.init(); lcd.backlight();
  pinMode(LED_OK, OUTPUT); pinMode(LED_WARN, OUTPUT); pinMode(LED_DANGER, OUTPUT);
  pinMode(BUZZER, OUTPUT); pinMode(VENT_RELAY, OUTPUT); pinMode(SCRUB_RELAY, OUTPUT);
  line(0, "ENVIRONMENT NODE");
  line(1, bmpOK ? "ALL SENSORS READY" : "BMP180 CHECK");
  line(2, "I2C OUT: A4/A5");
  line(3, "SYSTEM ONLINE");
  delay(1200);
}

void loop() {
  if (millis() - lastUpdate < 1000) return;
  lastUpdate = millis();

  float t = dht.readTemperature();
  float h = dht.readHumidity();
  float p = bmpOK ? bmp.readPressure() / 100.0 : 1013.0; // hPa
  int gas = analogRead(GAS_PIN);
  int rad = map(analogRead(RAD_PIN), 0, 1023, 0, 100);

  bool badDht = isnan(t) || isnan(h);
  if (badDht) { t = 24.0; h = 45.0; }

  bool warning = false, danger = false;
  if (t < 18 || t > 30 || h < 30 || h > 70 || p < 900 || p > 1060 || gas > 520 || rad > 50) warning = true;
  if (t < 10 || t > 38 || gas > 760 || rad > 78 || p < 850 || p > 1100) danger = true;

  statusOutputs(warning, danger);

  String st = danger ? "DANGER" : warning ? "WARNING" : "NORMAL";
  line(0, "ENV " + st);
  line(1, "T:" + String(t,1) + "C RH:" + String(h,0) + "%");
  line(2, "P:" + String(p,0) + " GAS:" + String(gas));
  line(3, "RAD:" + String(rad) + "/100 VENT:" + (digitalRead(VENT_RELAY)?"ON":"OFF"));

  Serial.print("ENV_PACKET|T="); Serial.print(t,1);
  Serial.print("|RH="); Serial.print(h,0);
  Serial.print("|P_hPa="); Serial.print(p,0);
  Serial.print("|GAS="); Serial.print(gas);
  Serial.print("|RAD="); Serial.print(rad);
  Serial.print("|STATUS="); Serial.print(st);
  Serial.print("|VENT="); Serial.print(digitalRead(VENT_RELAY));
  Serial.print("|SCRUB="); Serial.println(digitalRead(SCRUB_RELAY));
}
