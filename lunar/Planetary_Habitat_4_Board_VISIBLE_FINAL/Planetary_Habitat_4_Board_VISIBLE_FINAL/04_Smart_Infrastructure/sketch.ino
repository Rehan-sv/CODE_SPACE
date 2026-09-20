#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Servo.h>

#define TRAFFIC_A 2
#define TRAFFIC_B 3
#define W_TRIG 4
#define W_ECHO 5
#define P_TRIG 6
#define P_ECHO 7
#define GATE 8
#define STREET 9
#define PARK_LED 10
#define WASTE_LED 11
#define TRAFFIC_GO 12
#define TRAFFIC_STOP 13
#define BUZZER A1

LiquidCrystal_I2C lcd(0x27,20,4);
Servo gate;
unsigned long lastUpdate=0;

long distanceCM(int trig,int echo){
  digitalWrite(trig,LOW); delayMicroseconds(2); digitalWrite(trig,HIGH); delayMicroseconds(10); digitalWrite(trig,LOW);
  long us=pulseIn(echo,HIGH,30000); return us?us/58:400;
}
void line(int r,const String &txt){lcd.setCursor(0,r);String s=txt;if(s.length()>20)s.remove(20);while(s.length()<20)s+=' ';lcd.print(s);}

void setup(){
  Serial.begin(115200); lcd.init(); lcd.backlight(); gate.attach(GATE);
  pinMode(TRAFFIC_A,INPUT_PULLUP); pinMode(TRAFFIC_B,INPUT_PULLUP);
  pinMode(W_TRIG,OUTPUT);pinMode(W_ECHO,INPUT);pinMode(P_TRIG,OUTPUT);pinMode(P_ECHO,INPUT);
  pinMode(STREET,OUTPUT);pinMode(PARK_LED,OUTPUT);pinMode(WASTE_LED,OUTPUT);pinMode(TRAFFIC_GO,OUTPUT);pinMode(TRAFFIC_STOP,OUTPUT);pinMode(BUZZER,OUTPUT);
  line(0,"INFRASTRUCTURE NODE");line(1,"TRAFFIC + PARKING");line(2,"WASTE + LIGHTING");line(3,"I2C OUT: A4/A5");delay(1200);
}

void loop(){
  if(millis()-lastUpdate<400)return; lastUpdate=millis();
  bool carA=digitalRead(TRAFFIC_A)==LOW;
  bool carB=digitalRead(TRAFFIC_B)==LOW;
  long waste=distanceCM(W_TRIG,W_ECHO);
  long park=distanceCM(P_TRIG,P_ECHO);
  int light=analogRead(A0);
  bool wasteFull=waste<15;
  bool occupied=park<30;
  bool dark=light<450;
  bool bothTraffic=carA&&carB;

  digitalWrite(STREET,dark);
  digitalWrite(PARK_LED,!occupied);
  digitalWrite(WASTE_LED,wasteFull);
  digitalWrite(TRAFFIC_STOP,bothTraffic);
  digitalWrite(TRAFFIC_GO,!bothTraffic && (carA||carB));
  gate.write(occupied?10:90);
  if(wasteFull) tone(BUZZER,1000,120); else noTone(BUZZER);

  String t=bothTraffic?"STOP":(carA||carB?"GO":"IDLE");
  line(0,"INFRA "+t);
  line(1,"A:"+(carA?String("CAR"):String("-"))+" B:"+(carB?String("CAR"):String("-")));
  line(2,"W:"+String(waste)+"cm P:"+(occupied?String("BUSY"):String("FREE")));
  line(3,"L:"+(dark?String("ON"):String("OFF"))+" G:"+(occupied?String("CLOSED"):String("OPEN")));

  Serial.print("INFRA_PACKET|TRAFFIC_A=");Serial.print(carA);Serial.print("|TRAFFIC_B=");Serial.print(carB);Serial.print("|WASTE_CM=");Serial.print(waste);Serial.print("|PARK_CM=");Serial.print(park);Serial.print("|LIGHT_ADC=");Serial.print(light);Serial.print("|STREET=");Serial.print(dark);Serial.print("|GATE=");Serial.print(occupied?10:90);Serial.print("|WASTE_FULL=");Serial.println(wasteFull);
}
