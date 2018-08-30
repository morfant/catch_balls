/*
    Simple HTTP get webclient test
*/

#include <ESP8266WiFi.h>

const char* ssid     = "jjwc";
const char* password = "akdyspwm";

const char* host = "192.168.0.37";


void setup() {
  Serial.begin(115200);
  delay(100);

  // We start by connecting to a WiFi network

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.print("Netmask: ");
  Serial.println(WiFi.subnetMask());
  Serial.print("Gateway: ");
  Serial.println(WiFi.gatewayIP());
}

int value = 0;
int data_x = 0;
int data_y = 0;
int data_z = 0;

void loop() {

  data_x+=2;
  data_x = data_x % 800;

  data_y++;
  data_y = data_y % 600;

  data_z++;
  data_z = data_z % 100;


//  delay(5000);
  ++value;


  // Use WiFiClient class to create TCP connections
  WiFiClient client;
//  const IPAddress host(127, 0, 0, 1);
  const int httpPort = 3000;
  
//  Serial.print("connecting to ");
//  Serial.println(host);


  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    return;
  }

  // We now create a URI for the request
  String url = "/posx/" + String(data_x) + "/posy/" + String(data_y) + "/posz/" + String(data_z);
//  Serial.print("Requesting URL: ");
//  Serial.println(url);

  // This will send the request to the server
  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: close\r\n\r\n");
  delay(50);

  // Read all the lines of the reply from server and print them to Serial
//  while (client.available()) {
//    String line = client.readStringUntil('\r');
//    Serial.print(line);
//  }

//  Serial.println();
//  Serial.println("closing connection");
}
