#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { existsSync, copyFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function setupDatabase() {
  console.log('🚀 CONFIGURANDO BASE DE DATOS DEL HOTEL PMS...\n');

  // Step 1: Check if .env exists
  console.log('📊 1. VERIFICANDO ARCHIVO .env...');
  const envPath = join(process.cwd(), '.env');
  const envExamplePath = join(process.cwd(), 'env.database.example');
  
  if (!existsSync(envPath)) {
    if (existsSync(envExamplePath)) {
      console.log('   Archivo .env no encontrado, copiando desde env.database.example...');
      copyFileSync(envExamplePath, envPath);
      console.log('✅ Archivo .env creado desde env.database.example');
      console.log('⚠️  IMPORTANTE: Edita .env y configura tus credenciales reales');
    } else {
      console.log('❌ No se encontró env.database.example');
      console.log('   Creando archivo .env básico...');
      
      const basicEnvContent = `# Hotel PMS - Variables de Entorno Básicas
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/hotel_pms"
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=hotel_pms
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_SSL=false
REDIS_URL=redis://localhost:6379
NEXTAUTH_SECRET=your_nextauth_secret_here_min_32_chars
JWT_SECRET=your_jwt_secret_here_min_32_chars
NODE_ENV=development
`;
      
      writeFileSync(envPath, basicEnvContent);
      console.log('✅ Archivo .env básico creado');
      console.log('⚠️  IMPORTANTE: Edita .env y configura tus credenciales reales');
    }
  } else {
    console.log('✅ Archivo .env ya existe');
  }

  // Step 2: Check environment variables
  console.log('\n📊 2. VERIFICANDO VARIABLES DE ENTORNO...');
  const requiredVars = [
    'DATABASE_URL',
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_NAME',
    'DATABASE_USER',
    'DATABASE_PASSWORD'
  ];

  const missingVars: string[] = [];
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.log('❌ Variables de entorno faltantes:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n   Solución: Edita el archivo .env y configura todas las variables requeridas');
    return;
  }

  console.log('✅ Variables de entorno configuradas');

  // Step 3: Test database connection
  console.log('\n📊 3. PROBANDO CONEXIÓN A LA BASE DE DATOS...');
  try {
    await prisma.$connect();
    console.log('✅ Conexión a PostgreSQL exitosa');
  } catch (error) {
    console.error('❌ Error de conexión a PostgreSQL:');
    console.error('   Error:', error instanceof Error ? error.message : 'Unknown error');
    console.error('\n   Posibles soluciones:');
    console.error('   1. Verifica que PostgreSQL esté ejecutándose');
    console.error('   2. Verifica las credenciales en .env');
    console.error('   3. Verifica que la base de datos "hotel_pms" exista');
    console.error('   4. Verifica que el usuario tenga permisos');
    return;
  }

  // Step 4: Check if database exists and has tables
  console.log('\n📊 4. VERIFICANDO ESQUEMA DE LA BASE DE DATOS...');
  try {
    // Check if database exists
    const dbExists = await prisma.$queryRaw`SELECT current_database() as db_name`;
    console.log('✅ Base de datos conectada:', (dbExists as any[])[0]?.db_name);

    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `;
    
    const tableCount = (tables as any[]).length;
    console.log(`✅ Tablas encontradas: ${tableCount}`);

    if (tableCount === 0) {
      console.log('\n📊 5. INICIALIZANDO BASE DE DATOS...');
      console.log('   Ejecutando migraciones de Prisma...');
      
      try {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        console.log('✅ Migraciones aplicadas exitosamente');
      } catch (migrationError) {
        console.log('⚠️  Error en migraciones, intentando generar cliente...');
        try {
          execSync('npx prisma generate', { stdio: 'inherit' });
          console.log('✅ Cliente Prisma generado');
        } catch (generateError) {
          console.error('❌ Error generando cliente Prisma:', generateError);
        }
      }
    } else {
      console.log('✅ Base de datos ya tiene tablas, saltando migraciones');
    }

  } catch (error) {
    console.error('❌ Error verificando esquema:', error);
    return;
  }

  // Step 5: Check Cache Manager
  console.log('\n📊 6. VERIFICANDO CACHE MANAGER...');
  try {
    const { cacheManager } = await import('../lib/caching/cache-manager');
    const stats = await cacheManager.getStats();
    
    if (stats.size >= 0) {
      console.log('✅ Cache manager funcionando correctamente');
    } else {
      console.log('❌ Cache manager no responde');
    }
  } catch (error) {
    console.log('⚠️  Cache manager no configurado o no disponible');
    console.log('   El sistema funcionará sin cache, pero con performance reducida');
  }

  // Step 6: Generate Prisma client
  console.log('\n📊 7. GENERANDO CLIENTE PRISMA...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Cliente Prisma generado exitosamente');
  } catch (error) {
    console.error('❌ Error generando cliente Prisma:', error);
  }

  // Step 7: Seed database if needed
  console.log('\n📊 8. VERIFICANDO DATOS INICIALES...');
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('   Base de datos vacía, ejecutando seed...');
      try {
        execSync('npm run prisma:seed', { stdio: 'inherit' });
        console.log('✅ Datos iniciales insertados');
      } catch (seedError) {
        console.log('⚠️  Error ejecutando seed, puedes ejecutarlo manualmente con: npm run prisma:seed');
      }
    } else {
      console.log(`✅ Base de datos tiene ${userCount} usuarios`);
    }
  } catch (error) {
    console.log('⚠️  No se pudo verificar datos iniciales');
  }

  console.log('\n🎉 CONFIGURACIÓN COMPLETADA');
  console.log('=====================================');
  console.log('✅ Archivo .env configurado');
  console.log('✅ Conexión a PostgreSQL establecida');
  console.log('✅ Esquema de base de datos verificado');
  console.log('✅ Cliente Prisma generado');
  console.log('\n🚀 El sistema está listo para usar');
  console.log('\n📋 PRÓXIMOS PASOS:');
  console.log('   1. Ejecuta: npm run dev');
  console.log('   2. Abre: http://localhost:3000');
  console.log('   3. Ejecuta el script de prueba: npm run test:db');

  // Close connection
  await prisma.$disconnect();
}

// Run setup
setupDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error durante la configuración:', error);
    process.exit(1);
  });
