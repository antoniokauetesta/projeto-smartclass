# SmartClass Dashboard de Temperatura

Este projeto é um site em HTML, CSS e JavaScript para monitorar a temperatura lida por um Arduino em tempo real.

Ele inclui:
- dashboard principal
- página de histórico
- página de alertas
- gráfico de temperatura em tempo real
- integração com Arduino via porta serial (quando suportada pelo navegador)

## Estrutura do projeto

- `index.html` — painel principal
- `historico.html` — histórico de leituras
- `alertas.html` — eventos e alertas
- `styles.css` — estilos do dashboard
- `script.js` — lógica do gráfico, leitura serial e simulação
- `arduino/temperatura_serial.ino` — exemplo de código para Arduino

## Como executar

O projeto pode ser executado com Node.js em uma porta local. A porta usada será a 3000.

### 1) Instale o Node.js

Se ainda não tiver o Node.js instalado, baixe em:
https://nodejs.org/

### 2) Entre na pasta do projeto

```powershell
cd "c: \projeto-smartclass"
```

### 3) Inicie o servidor com npm
''
```powershell
npm start
```

### 4) Acesse no navegador

```text
http://localhost:3000
```

O servidor vai servir os arquivos HTML, CSS e JavaScript do projeto na porta 3000.

## Como conectar com o Arduino

O navegador pode usar a API Web Serial para ler dados enviados pela porta serial do Arduino.

O código do Arduino deve mandar uma linha no formato:

```text
TEMP:24.5
```

O script do projeto tenta ler esse padrão automaticamente.

Se o navegador não suportar serial, o sistema usa uma simulação de temperatura para demonstrar o dashboard.

## Exemplo de código para Arduino

Arquivo:
- `arduino/temperatura_serial.ino`

Exemplo de funcionamento:

```cpp
const int sensorPin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  float voltage = analogRead(sensorPin) * (5.0 / 1023.0);
  float temperaturaC = voltage * 100.0;

  Serial.print("TEMP:");
  Serial.println(temperaturaC, 2);

  delay(1000);
}
```

## Observação importante

Esse exemplo funciona corretamente para um sensor LM35 conectado ao pino A0.

Se você estiver usando outro sensor, como DHT11, DHT22 ou DS18B20, o código do Arduino deve ser ajustado conforme o modelo.

## Próximo passo

Se quiser, posso agora adaptar o projeto para:
- sensor DHT11/DHT22
- sensor LM35 com maior precisão
- salvar histórico em banco local
- enviar alertas por e-mail ou WhatsApp
