#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

// Fill these two values only if you want a real Telegram message from Wokwi.
const char* BOT_TOKEN = "PASTE_BOT_TOKEN_HERE";
const char* CHAT_ID   = "PASTE_CHAT_ID_HERE";

const char* SSID = "Wokwi-GUEST";
const char* PASS = "";

String urlEncode(const String &s){
  String out; const char *hex="0123456789ABCDEF";
  for(size_t i=0;i<s.length();i++){char c=s[i];if(isalnum(c)||c=='-'||c=='_'||c=='.'||c=='~')out+=c;else{out+='%';out+=hex[(c>>4)&0xF];out+=hex[c&0xF];}}
  return out;
}

void sendTelegram(const String &message){
  digitalWrite(LED_BUILTIN, HIGH);
  if(String(BOT_TOKEN).startsWith("PASTE") || String(CHAT_ID).startsWith("PASTE")){
    Serial.println("TELEGRAM_SIMULATED|"+message);
    delay(250); digitalWrite(LED_BUILTIN, LOW);
    return;
  }
  WiFiClientSecure client; client.setInsecure();
  HTTPClient http;
  String url="https://api.telegram.org/bot"+String(BOT_TOKEN)+"/sendMessage?chat_id="+String(CHAT_ID)+"&text="+urlEncode(message);
  if(http.begin(client,url)){int code=http.GET();Serial.print("TELEGRAM_HTTP=");Serial.println(code);http.end();}
  delay(250); digitalWrite(LED_BUILTIN, LOW);
}

void setup(){
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);
  Serial.begin(115200);
  Serial.println("TELEGRAM GATEWAY");
  WiFi.begin(SSID,PASS);
  Serial.print("WIFI");
  unsigned long start=millis();
  while(WiFi.status()!=WL_CONNECTED && millis()-start<10000){delay(250);Serial.print('.');}
  Serial.println();
  Serial.println(WiFi.status()==WL_CONNECTED?"WIFI_CONNECTED":"WIFI_NOT_CONNECTED");
  Serial.println("Type SOS to test the emergency notification.");
}

void loop(){
  if(Serial.available()){
    String cmd=Serial.readStringUntil('\n'); cmd.trim(); cmd.toUpperCase();
    if(cmd=="SOS" || cmd=="FIRE" || cmd=="GAS"){
      sendTelegram("PLANETARY HABITAT ALERT: "+cmd+" detected. Immediate response required.");
    }
  }
  delay(20);
}
