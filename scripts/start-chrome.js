#!/usr/bin/env node
// start-chrome.js - Script Node.js para iniciar Chrome com debug

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando Chrome com DevTools...');

// Configurações do Chrome
const chromeArgs = [
  '--remote-debugging-port=9222',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-web-security',
  '--disable-features=VizDisplayCompositor',
  '--user-data-dir=/tmp/chrome-debug',
  '--disable-extensions',
  '--disable-plugins',
  '--disable-images',
  '--disable-javascript',
  '--disable-default-apps',
  '--disable-sync',
  '--disable-translate',
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
  '--disable-ipc-flooding-protection'
];

// Tentar diferentes comandos do Chrome
const chromeCommands = [
  'google-chrome',
  'google-chrome-stable',
  'chromium-browser',
  'chromium',
  'chrome'
];

let chromeProcess = null;

// Função para tentar iniciar Chrome
function tryStartChrome(commandIndex = 0) {
  if (commandIndex >= chromeCommands.length) {
    console.error('❌ Nenhum comando do Chrome encontrado');
    process.exit(1);
  }

  const command = chromeCommands[commandIndex];
  console.log(`🔍 Tentando comando: ${command}`);

  chromeProcess = spawn(command, chromeArgs, {
    stdio: 'inherit',
    detached: false
  });

  chromeProcess.on('error', (error) => {
    console.log(`⚠️  ${command} falhou: ${error.message}`);
    tryStartChrome(commandIndex + 1);
  });

  chromeProcess.on('spawn', () => {
    console.log(`✅ Chrome iniciado com PID: ${chromeProcess.pid}`);
    console.log('🌐 DevTools disponível em: http://localhost:9222');
  });
}

// Função de cleanup
function cleanup() {
  console.log('\n🛑 Parando Chrome...');
  if (chromeProcess) {
    chromeProcess.kill('SIGTERM');
  }
  process.exit(0);
}

// Capturar sinais de parada
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Iniciar Chrome
tryStartChrome();
