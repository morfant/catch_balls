#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <SocketIoClient.h>

#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BNO055.h>
#include <utility/imumaths.h>

#define USE_SERIAL Serial

ESP8266WiFiMulti WiFiMulti;
SocketIoClient webSocket;
Adafruit_BNO055 bno = Adafruit_BNO055(55);

//const char * SOCKET_ID = "ball_0";
//const char * SOCKET_ID = "ball_1";
//const char * SOCKET_ID = "ball_2";
const char * SOCKET_ID = "ball_3";

//void event(const char * payload, size_t length) {
//  USE_SERIAL.printf("got message: %s\n", payload);
//}

void setup() {
  //  USE_SERIAL.begin(115200);

  //  USE_SERIAL.setDebugOutput(true);
  //
  //  USE_SERIAL.println();
  //  USE_SERIAL.println();
  //  USE_SERIAL.println();
  //
  //  USE_SERIAL.println("start.....");
  //
  //  for (uint8_t t = 4; t > 0; t--) {
  //    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
  //    USE_SERIAL.flush();
  //    delay(1000);
  //  }
  //
  //  USE_SERIAL.println("after forloop!");

  // Set wifi info
  WiFiMulti.addAP("catch-bb", "catchbomb");

  while (WiFiMulti.run() != WL_CONNECTED) {
    //    USE_SERIAL.printf("wifi not connected!");
    delay(100);
  }

//  webSocket.on("event", event);


  // Set socket.io server address and port
  webSocket.begin("192.168.1.2", 3000); // catch-bb

//  USE_SERIAL.println("websocket began!");


  if (!bno.begin())
  {
    /* There was a problem detecting the BNO055 ... check your connections */
    //    Serial.print("Ooops, no BNO055 detected ... Check your wiring or I2C ADDR!");
    while (1);
  }

  //  delay(1000);
  delay(500);

  bno.setExtCrystalUse(true);


}

void loop() {

  // get orientation
  sensors_event_t event;
  bno.getEvent(&event);


  // get accelerometer
//  imu::Vector<3> acc = bno.getVector(Adafruit_BNO055::VECTOR_ACCELEROMETER);
  imu::Vector<3> acc = bno.getVector(Adafruit_BNO055::VECTOR_LINEARACCEL);
  imu::Vector<3> g = bno.getVector(Adafruit_BNO055::VECTOR_GRAVITY);

  webSocket.loop();

  // o : orientation
  // a : accelerometer

  //  String p = "\"\\\"" + String(pos[0]) + "/" + String(pos[1]) + "/" + String(pos[2]) + "\\\"\"";
////String o = "\"\\\"" + String(event.orientation.x) + "/" + String(event.orientation.y) + "/" + String(event.orientation.z) + "|" + String(acc.x()) + "/" + String(acc.y()) + "/" + String(acc.z()) + "|" + String(g.x()) + "/" + String(g.y()) + "/" + String(g.z()) + "\\\"\"";
  String o = "\"\\\"" + String(event.orientation.x) + "/" + String(event.orientation.y) + "/" + String(event.orientation.z) + "|" + String(acc.x()) + "/" + String(acc.y()) + "/" + String(acc.z()) + "\\\"\"";
  
  //  String a = "\"\\\"" + String(acc.x()) + "/" + String(acc.y()) + "/" + String(acc.z()) + "\\\"\"";


  //  USE_SERIAL.println(p);

  //  int len_p = p.length() + 1;
  int len_o = o.length() + 1;
  //  int len_a = a.length() + 1;

  //  char payload_p[len_p];
  char payload_o[len_o];
  //  char payload_a[len_a];

  //  p.toCharArray(payload_p, len_p);
  o.toCharArray(payload_o, len_o);
  //  a.toCharArray(payload_a, len_a);

//  USE_SERIAL.println(payload_o);

  //  webSocket.emit(SOCKET_ID, payload_p);
  webSocket.emit(SOCKET_ID, payload_o);
  //  webSocket.emit(SOCKET_ID, payload_a);

  delay(1);




}

