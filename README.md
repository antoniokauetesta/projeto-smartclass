# SmartClass Dashboard

Dashboard web para monitorar temperatura em tempo real com interface simples, responsiva e integrada com Arduino.

## Visão geral

Este projeto foi desenvolvido para exibir leituras de temperatura em um painel visual, com:

- página principal com gráfico e indicadores
- histórico de leituras
- área de alertas
- suporte à leitura serial do Arduino via Web Serial
- fallback para simulação de temperatura quando o navegador não suporta serial

## Tecnologias

- HTML
- CSS
- JavaScript
- Node.js
- Arduino (opcional para leitura real de sensores)

## Estrutura do projeto

- `index.html` — painel principal
- `historico.html` — histórico das temperaturas
- `alertas.html` — alertas e eventos
- `styles.css` — estilos da interface
- `script.js` — lógica do dashboard e leitura serial
- `server.js` — servidor local para servir os arquivos
- `api/index.js` — entrada para deploy no Vercel
- `vercel.json` — configuração de rota do deploy
- `arduino/temperatura_serial.ino` — exemplo de código para Arduino

## Como executar localmente

### 1) Entre na pasta do projeto

```powershell
cd "c:\Users\anton\Documents\smartclass - pacotao completo\site\projeto-smartclass"
```

### 2) Instale as dependências

```powershell
npm install
```

### 3) Inicie o servidor

```powershell
npm start
```

### 4) Acesse no navegador

```text
http://localhost:3000
```

## Como funciona a integração com Arduino

O navegador pode usar a API Web Serial para ler dados enviados pela porta serial do Arduino.

O projeto espera receber linhas no formato:

```text
TEMP:24.5
```

Se o navegador não suportar Web Serial, o sistema usa uma simulação de temperatura para manter a interface funcionando.

## Exemplo de código para Arduino

Arquivo:
- `arduino/temperatura_serial.ino`

Exemplo base:

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

## Deploy no Vercel

Este projeto está preparado para ser publicado no Vercel usando a configuração em `vercel.json` e a função em `api/index.js`.

### Passos

1. envie o projeto para um repositório GitHub
2. abra o Vercel
3. importe o repositório
4. selecione a pasta raiz do projeto
5. faça o deploy

## Observações

- O projeto foi pensado para uso didático e demonstrativo.
- Para sensores reais, como LM35, DHT11, DHT22 ou DS18B20, pode ser necessário ajustar o código do Arduino.
- O dashboard pode ser ampliado com armazenamento em banco, autenticação, alertas por e-mail ou integração com APIs.

## Licença

Este projeto está disponível sob a licença MIT.
