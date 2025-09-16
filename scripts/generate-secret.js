#!/usr/bin/env node

/**
 * Script para generar NEXTAUTH_SECRET seguro
 * Uso: node scripts/generate-secret.js
 */

const crypto = require('crypto');

function generateSecret() {
  // Generar 32 bytes aleatorios y convertir a base64
  const secret = crypto.randomBytes(32).toString('base64');
  
  console.log('🔐 NEXTAUTH_SECRET generado:');
  console.log('');
  console.log(`NEXTAUTH_SECRET="${secret}"`);
  console.log('');
  console.log('📋 Instrucciones:');
  console.log('1. Copia la línea anterior');
  console.log('2. Pégalo en tu archivo .env o .env.local');
  console.log('3. Para producción, configura esta variable en tu plataforma de deployment');
  console.log('');
  console.log('⚠️  IMPORTANTE: Mantén este secret seguro y no lo compartas');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateSecret();
}

module.exports = { generateSecret };
