#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#define ENV A0
#define LIFE A1
#define SAFE A2
#define INFRA A3
#define OK 6
#define WARN 7
#define ALARM 8
#define BUZZER 9
LiquidCrystal_I2C lcd(0x27,20,4);
void line(int r,const String&s){lcd.setCursor(0,r);String x=s;if(x.length()>20)x.remove(20);while(x.length()<20)x+=' ';lcd.print(x);}
void setup(){Serial.begin(115200);lcd.init();lcd.backlight();pinMode(OK,OUTPUT);pinMode(WARN,OUTPUT);pinMode(ALARM,OUTPUT);pinMode(BUZZER,OUTPUT);}
void loop(){int e=map(analogRead(ENV),0,1023,0,100),l=map(analogRead(LIFE),0,1023,0,100),s=map(analogRead(SAFE),0,1023,0,100),i=map(analogRead(INFRA),0,1023,0,100);int bad=(e<25)+(l<25)+(s<25)+(i<25);bool alarm=s<15, warn=bad>0;digitalWrite(OK,!warn);digitalWrite(WARN,warn&&!alarm);digitalWrite(ALARM,alarm);if(alarm)tone(BUZZER,1400);else if(warn)tone(BUZZER,700,100);else noTone(BUZZER);line(0,"CENTRAL HABITAT");line(1,"ENV:"+String(e)+" LIFE:"+String(l));line(2,"SAFE:"+String(s)+" INF:"+String(i));line(3,alarm?"MASTER: EMERGENCY":warn?"MASTER: ATTENTION":"MASTER: ALL OK");Serial.print("MEGA|ENV=");Serial.print(e);Serial.print(" LIFE=");Serial.print(l);Serial.print(" SAFE=");Serial.print(s);Serial.print(" INFRA=");Serial.println(i);delay(700);}
