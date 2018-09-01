#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <SocketIoClient.h>

#define USE_SERIAL Serial

ESP8266WiFiMulti WiFiMulti;
SocketIoClient webSocket;


const char BALL_ID = 0;

int pos[3] = {};

void event(const char * payload, size_t length) {
  USE_SERIAL.printf("got message: %s\n", payload);
}

void setup() {
  USE_SERIAL.begin(115200);

  USE_SERIAL.setDebugOutput(true);

  USE_SERIAL.println();
  USE_SERIAL.println();
  USE_SERIAL.println();

  USE_SERIAL.println("start.....");

  for (uint8_t t = 4; t > 0; t--) {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }

  USE_SERIAL.println("after forloop!");

  WiFiMulti.addAP("jjwc", "akdyspwm");

  while (WiFiMulti.run() != WL_CONNECTED) {
    USE_SERIAL.printf("wifi not connected!");
    delay(100);
  }

  USE_SERIAL.println("after wifi connection!");

  //    webSocket.on("event", event);
  webSocket.begin("192.168.0.37", 3000);

  USE_SERIAL.println("websocket began!");

}

void loop() {

  webSocket.loop();
  //  USE_SERIAL.println("loop");

  for (int i = 0; i < 3; i++) {
    pos[i] = (pos[i] + 1) % 600;
  }

  String p = "\"\\\"" + String(pos[0]) + "/" + String(pos[1]) + "/" + String(pos[2]) + "\\\"\"";
  //  USE_SERIAL.println(p);
  int len = p.length() + 1;
  char payload[len];
  p.toCharArray(payload, len);

  //  USE_SERIAL.println(payload);

  webSocket.emit("ball_" + BALL_ID, payload);

  delay(100);




}

