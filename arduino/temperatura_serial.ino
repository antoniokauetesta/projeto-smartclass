const int sensorPin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int leitura = analogRead(sensorPin);
  float tensao = leitura * (5.0 / 1023.0);
  float temperaturaC = tensao * 100.0;

  Serial.print("TEMP:");
  Serial.println(temperaturaC, 2);

  delay(1000);
}
