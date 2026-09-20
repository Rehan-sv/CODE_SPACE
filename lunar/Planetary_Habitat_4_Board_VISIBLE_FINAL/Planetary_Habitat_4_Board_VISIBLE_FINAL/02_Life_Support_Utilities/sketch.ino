#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

#define DHT_PIN 2
#define LDR_DO 3
#define SOIL A0
#define WATER A1
#define O2 A2
#define SOLAR_V A3
#define GROW_LIGHT 4
#define GREEN_PUMP 5
#define WATER_PUMP 6
#define O2_FAN 7
#define BAT_LED 8
#define LOAD_LED 9
#define BUZZER 10

DHT dht(DHT_PIN, DHT22);
LiquidCrystal_I2C lcd(0x27,20,4);
unsigned long lastUpdate=0;

void line(int r,const String &txt){lcd.setCursor(0,r);String s=txt;if(s.length()>20)s.remove(20);while(s.length()<20)s+=' ';lcd.print(s);}

void setup(){
  Serial.begin(115200); dht.begin(); lcd.init(); lcd.backlight();
  pinMode(LDR_DO,INPUT); pinMode(GROW_LIGHT,OUTPUT); pinMode(GREEN_PUMP,OUTPUT); pinMode(WATER_PUMP,OUTPUT); pinMode(O2_FAN,OUTPUT);
  pinMode(BAT_LED,OUTPUT); pinMode(LOAD_LED,OUTPUT); pinMode(BUZZER,OUTPUT);
  line(0,"LIFE SUPPORT NODE"); line(1,"GREENHOUSE ONLINE"); line(2,"WATER + O2 ONLINE"); line(3,"I2C OUT: A4/A5"); delay(1200);
}

void loop(){
  if(millis()-lastUpdate<800)return; lastUpdate=millis();
  float t=dht.readTemperature(), h=dht.readHumidity();
  if(isnan(t))t=24; if(isnan(h))h=55;
  int soil=map(analogRead(SOIL),0,1023,0,100);
  int water=map(analogRead(WATER),0,1023,0,100);
  int oxygen=map(analogRead(O2),0,1023,0,100);
  int solar=map(analogRead(SOLAR_V),0,1023,0,100);
  bool dark=digitalRead(LDR_DO)==LOW;
  bool dry=soil<35;
  bool lowWater=water<25;
  bool lowO2=oxygen<30;
  bool weakSolar=solar<25;
  bool climateBad=(t<18||t>30||h<35||h>75);

  bool greenhousePump=dry;
  bool waterPump=lowWater;
  bool o2Fan=lowO2;
  bool grow=dark;

  digitalWrite(GREEN_PUMP,greenhousePump); digitalWrite(WATER_PUMP,waterPump); digitalWrite(O2_FAN,o2Fan);
  digitalWrite(GROW_LIGHT,grow); digitalWrite(BAT_LED,!weakSolar); digitalWrite(LOAD_LED,!lowWater && !lowO2);
  if(lowWater||lowO2||climateBad) tone(BUZZER,900,120); else noTone(BUZZER);

  String state=(lowWater||lowO2)?"CRITICAL":(dry||dark||weakSolar||climateBad)?"ATTENTION":"STABLE";
  line(0,"LIFE "+state);
  line(1,"SOIL:"+String(soil)+"% W:"+String(water)+"%");
  line(2,"O2:"+String(oxygen)+"% SOL:"+String(solar)+"%");
  line(3,"GH:"+(greenhousePump?String("PUMP"):String("OK"))+" O2:"+(o2Fan?String("FAN"):String("OK")));

  Serial.print("LIFE_PACKET|SOIL=");Serial.print(soil);Serial.print("|WATER=");Serial.print(water);Serial.print("|O2=");Serial.print(oxygen);Serial.print("|SOLAR=");Serial.print(solar);Serial.print("|TEMP=");Serial.print(t,1);Serial.print("|RH=");Serial.print(h,0);Serial.print("|DARK=");Serial.print(dark);Serial.print("|GH_PUMP=");Serial.print(greenhousePump);Serial.print("|WATER_PUMP=");Serial.print(waterPump);Serial.print("|O2_FAN=");Serial.print(o2Fan);Serial.print("|GROW=");Serial.println(grow);
}
