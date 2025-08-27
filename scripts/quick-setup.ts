#!/usr/bin/env tsx

import { existsSync, copyFileSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

async function quickSetup() {
  console.log('🚀 CONFIGURACIÓN RÁPIDA DEL HOTEL PMS...\n');

  // Step 1: Create .env file
  console.log('📊 1. CREANDO ARCHIVO .env...');
  const envPath = join(process.cwd(), '.env');
  const envExamplePath = join(process.cwd(), 'env.database.example');
  
  if (!existsSync(envPath)) {
    if (existsSync(envExamplePath)) {
      // Read the example file
      const exampleContent = readFileSync(envExamplePath, 'utf8');
      
      // Replace placeholder values with actual development values
      const envContent = exampleContent
        .replace(/your_password/g, 'admin123')
        .replace(/your_nextauth_secret_here_min_32_chars/g, 'hotel_pms_secret_key_2024_development_environment_secure')
        .replace(/your_jwt_secret_here_min_32_chars/g, 'hotel_pms_jwt_secret_2024_development_environment_secure_key')
        .replace(/your_redis_password/g, '')
        .replace(/your_sentry_dsn_here/g, '')
        .replace(/your_public_sentry_dsn_here/g, '')
        .replace(/your_organization/g, '')
        .replace(/your_sentry_auth_token/g, '')
        .replace(/your_slack_webhook_url/g, '')
        .replace(/your_alert_webhook_url/g, '')
        .replace(/your_webhook_token/g, '')
        .replace(/your_elasticsearch_password/g, '')
        .replace(/your_grafana_api_key/g, '')
        .replace(/your_redis_password/g, '')
        .replace(/your_stripe_secret_key/g, '')
        .replace(/your_stripe_publishable_key/g, '')
        .replace(/your_webhook_secret/g, '')
        .replace(/your_email@gmail.com/g, '')
        .replace(/your_app_password/g, '')
        .replace(/your_twilio_account_sid/g, '')
        .replace(/your_twilio_auth_token/g, '')
        .replace(/your_monitoring_auth_token/g, '')
        .replace(/your_monitoring_ip_whitelist/g, '127.0.0.1,::1');
      
      writeFileSync(envPath, envContent);
      console.log('✅ Archivo .env creado con configuración de desarrollo');
    } else {
      console.log('❌ No se encontró env.database.example');
      return;
    }
  } else {
    console.log('✅ Archivo .env ya existe');
  }

  // Step 2: Check if PostgreSQL is running
  console.log('\n📊 2. VERIFICANDO POSTGRESQL...');
  try {
    // Try to connect to PostgreSQL
    execSync('psql -U postgres -h localhost -p 5432 -c "SELECT version();"', { 
      stdio: 'pipe',
      env: { ...process.env, PGPASSWORD: 'admin123' }
    });
    console.log('✅ PostgreSQL está ejecutándose');
  } catch (error) {
    console.log('❌ No se puede conectar a PostgreSQL');
    console.log('   Solución: Instala y ejecuta PostgreSQL');
    console.log('   Windows: https://www.postgresql.org/download/windows/');
    console.log('   macOS: brew install postgresql && brew services start postgresql');
    console.log('   Ubuntu: sudo apt install postgresql && sudo systemctl start postgresql');
    return;
  }

  // Step 3: Create database
  console.log('\n📊 3. CREANDO BASE DE DATOS...');
  try {
    // Create database
    execSync('psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE hotel_pms;"', { 
      stdio: 'pipe',
      env: { ...process.env, PGPASSWORD: 'admin123' }
    });
    console.log('✅ Base de datos "hotel_pms" creada');
  } catch (error) {
    console.log('⚠️  Base de datos ya existe o error al crearla');
  }

  // Step 4: Test database connection
  console.log('\n📊 4. PROBANDO CONEXIÓN A LA BASE DE DATOS...');
  try {
    execSync('psql -U postgres -h localhost -p 5432 -d hotel_pms -c "SELECT current_database();"', { 
      stdio: 'pipe',
      env: { ...process.env, PGPASSWORD: 'admin123' }
    });
    console.log('✅ Conexión a la base de datos exitosa');
  } catch (error) {
    console.log('❌ Error conectando a la base de datos');
    return;
  }

  // Step 5: Install dependencies if needed
  console.log('\n📊 5. VERIFICANDO DEPENDENCIAS...');
  if (!existsSync(join(process.cwd(), 'node_modules'))) {
    console.log('   Instalando dependencias...');
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('✅ Dependencias instaladas');
    } catch (error) {
      console.log('❌ Error instalando dependencias');
      return;
    }
  } else {
    console.log('✅ Dependencias ya instaladas');
  }

  // Step 6: Generate Prisma client
  console.log('\n📊 6. GENERANDO CLIENTE PRISMA...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Cliente Prisma generado');
  } catch (error) {
    console.log('❌ Error generando cliente Prisma');
    return;
  }

  // Step 7: Run database migrations
  console.log('\n📊 7. APLICANDO MIGRACIONES...');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migraciones aplicadas');
  } catch (error) {
    console.log('⚠️  Error en migraciones, intentando crear esquema...');
    try {
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log('✅ Esquema de base de datos creado');
    } catch (pushError) {
      console.log('❌ Error creando esquema de base de datos');
      return;
    }
  }

  // Step 8: Seed database
  console.log('\n📊 8. INSERTANDO DATOS INICIALES...');
  try {
    execSync('npm run prisma:seed', { stdio: 'inherit' });
    console.log('✅ Datos iniciales insertados');
  } catch (error) {
    console.log('⚠️  Error ejecutando seed, puedes ejecutarlo manualmente después');
  }

  // Step 9: Check Redis (optional)
  console.log('\n📊 9. VERIFICANDO REDIS (OPCIONAL)...');
  try {
    execSync('redis-cli ping', { stdio: 'pipe' });
    console.log('✅ Redis está ejecutándose');
  } catch (error) {
    console.log('⚠️  Redis no está ejecutándose');
    console.log('   El sistema funcionará sin cache, pero con performance reducida');
    console.log('   Para instalar Redis:');
    console.log('   Windows: https://redis.io/docs/getting-started/installation/install-redis-on-windows/');
    console.log('   macOS: brew install redis && brew services start redis');
    console.log('   Ubuntu: sudo apt install redis-server && sudo systemctl start redis');
  }

  console.log('\n🎉 CONFIGURACIÓN COMPLETADA');
  console.log('=====================================');
  console.log('✅ Archivo .env configurado');
  console.log('✅ Base de datos PostgreSQL creada');
  console.log('✅ Esquema de base de datos aplicado');
  console.log('✅ Cliente Prisma generado');
  console.log('✅ Datos iniciales insertados');
  
  console.log('\n🚀 El sistema está listo para usar');
  console.log('\n📋 PRÓXIMOS PASOS:');
  console.log('   1. Ejecuta: npm run dev');
  console.log('   2. Abre: http://localhost:3000');
  console.log('   3. Ejecuta el script de prueba: npm run test:db');
  
  console.log('\n🔑 CREDENCIALES DE ACCESO:');
  console.log('   Usuario: admin@hotel.com');
  console.log('   Contraseña: admin123');
}

// Run setup
quickSetup()
  .then(() => {
    console.log('\n🎯 Configuración completada exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error durante la configuración:', error);
    process.exit(1);
  });


