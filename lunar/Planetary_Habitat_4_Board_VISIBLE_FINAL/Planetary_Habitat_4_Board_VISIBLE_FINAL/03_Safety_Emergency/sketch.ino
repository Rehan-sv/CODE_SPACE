#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define FIRE_PIN 2
#define SOS_PIN 3
#define GAS_PIN A0
#define SPRINKLER 4
#define EXHAUST 5
#define SAFE_LED 6
#define FIRE_LED 7
#define GAS_LED 8
#define BUZZER 9
#define SOS_LED 10

LiquidCrystal_I2C lcd(0x27,20,4);
unsigned long lastUpdate=0;

void line(int r,const String &txt){lcd.setCursor(0,r);String s=txt;if(s.length()>20)s.remove(20);while(s.length()<20)s+=' ';lcd.print(s);}

void setup(){
  Serial.begin(115200); lcd.init(); lcd.backlight();
  pinMode(FIRE_PIN,INPUT_PULLUP); pinMode(SOS_PIN,INPUT_PULLUP);
  pinMode(SPRINKLER,OUTPUT); pinMode(EXHAUST,OUTPUT); pinMode(SAFE_LED,OUTPUT); pinMode(FIRE_LED,OUTPUT); pinMode(GAS_LED,OUTPUT); pinMode(BUZZER,OUTPUT); pinMode(SOS_LED,OUTPUT);
  line(0,"SAFETY NODE ONLINE"); line(1,"FIRE + GAS + SOS"); line(2,"ALARM SYSTEM READY"); line(3,"I2C OUT: A4/A5"); delay(1200);
}

void loop(){
  if(millis()-lastUpdate<250)return; lastUpdate=millis();
  bool fire=digitalRead(FIRE_PIN)==LOW;
  bool sos=digitalRead(SOS_PIN)==LOW;
  int gas=analogRead(GAS_PIN);
  bool gasWarn=gas>520;
  bool gasDanger=gas>760;
  bool emergency=fire||sos||gasDanger;
  bool warning=fire||sos||gasWarn;

  digitalWrite(SPRINKLER,fire||sos);
  digitalWrite(EXHAUST,gasWarn||fire||sos);
  digitalWrite(SAFE_LED,!warning);
  digitalWrite(FIRE_LED,fire);
  digitalWrite(GAS_LED,gasWarn);
  digitalWrite(SOS_LED,sos);
  if(emergency) tone(BUZZER,1450);
  else if(warning) tone(BUZZER,750,120);
  else noTone(BUZZER);

  String st=emergency?"EMERGENCY":warning?"WARNING":"SECURE";
  line(0,"SAFETY "+st);
  line(1,"FIRE:"+(fire?String("ALERT"):String("OK"))+" GAS:"+String(gas));
  line(2,"SOS:"+(sos?String("PRESSED"):String("READY")));
  line(3,"ACT:"+(emergency?String("EVACUATE"):String("MONITOR")));

  Serial.print("SAFETY_PACKET|FIRE=");Serial.print(fire);Serial.print("|GAS=");Serial.print(gas);Serial.print("|SOS=");Serial.print(sos);Serial.print("|SPRINKLER=");Serial.print(digitalRead(SPRINKLER));Serial.print("|EXHAUST=");Serial.print(digitalRead(EXHAUST));Serial.print("|STATUS=");Serial.println(st);
}
