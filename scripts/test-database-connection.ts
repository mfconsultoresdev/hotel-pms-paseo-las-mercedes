#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import dbPool from '../lib/database/connection-pool';
import { cacheManager } from '../lib/caching/cache-manager';
import queueManager from '../lib/queues/queue-manager';

const prisma = new PrismaClient();

async function testDatabaseConnections() {
  console.log('🔍 PROBANDO CONECTIVIDAD DEL SISTEMA...\n');

  // Test 1: Prisma Connection
  console.log('📊 1. PROBANDO CONEXIÓN PRISMA...');
  try {
    await prisma.$connect();
    console.log('✅ Prisma: Conexión exitosa');
    
    // Test simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Prisma: Query de prueba exitosa');
    
  } catch (error) {
    console.error('❌ Prisma: Error de conexión');
    console.error('   Error:', error instanceof Error ? error.message : 'Unknown error');
    console.error('   Solución: Verifica DATABASE_URL en .env');
  }

  // Test 2: Connection Pool
  console.log('\n📊 2. PROBANDO CONNECTION POOL...');
  try {
    const dbPoolInstance = new dbPool({
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      database: process.env.DATABASE_NAME || 'hotel_pms',
      user: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || '',
      ssl: process.env.DATABASE_SSL === 'true'
    });
    
    await dbPoolInstance.connect();
    const poolStats = dbPoolInstance.getStats();
    console.log('✅ Connection Pool: Estadísticas obtenidas');
    console.log('   Estado de conexión:', poolStats.isConnected ? 'Conectado' : 'Desconectado');
    console.log('   Máximo de conexiones:', poolStats.maxConnections);
    
    const healthCheck = await dbPoolInstance.healthCheck();
    console.log('✅ Connection Pool: Health check exitoso');
    
  } catch (error) {
    console.error('❌ Connection Pool: Error');
    console.error('   Error:', error instanceof Error ? error.message : 'Unknown error');
    console.error('   Solución: Verifica variables DATABASE_* en .env');
  }

  // Test 3: Cache Manager
  console.log('\n📊 3. PROBANDO CACHE MANAGER...');
  try {
    // Test cache operations
    await cacheManager.set('test_key', 'test_value', 60000); // 60 segundos
    const cachedValue = await cacheManager.get('test_key');
    if (cachedValue === 'test_value') {
      console.log('✅ Cache Manager: Operaciones de lectura/escritura exitosas');
    }
    
    const cacheStats = await cacheManager.getStats();
    console.log('   Estadísticas del cache:', cacheStats);
    
  } catch (error) {
    console.error('❌ Cache Manager: Error de conexión');
    console.error('   Error:', error instanceof Error ? error.message : 'Unknown error');
    console.error('   Solución: Verifica la configuración del cache manager');
  }

  // Test 4: Queue Manager
  console.log('\n📊 4. PROBANDO QUEUE MANAGER...');
  try {
    const queueManagerInstance = new queueManager();
    console.log('✅ Queue Manager: Inicializado correctamente');
    
    // Simular operaciones básicas
    console.log('   Queue Manager funcionando en modo simulación');
    
  } catch (error) {
    console.error('❌ Queue Manager: Error');
    console.error('   Error:', error instanceof Error ? error.message : 'Unknown error');
  }

  // Test 5: Environment Variables
  console.log('\n📊 5. VERIFICANDO VARIABLES DE ENTORNO...');
  const requiredEnvVars = [
    'DATABASE_URL',
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_NAME',
    'DATABASE_USER',
    'DATABASE_PASSWORD',
    'REDIS_URL',
    'NEXTAUTH_SECRET',
    'JWT_SECRET'
  ];

  const missingVars: string[] = [];
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length === 0) {
    console.log('✅ Variables de entorno: Todas configuradas');
  } else {
    console.log('❌ Variables de entorno: Faltantes');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n   Solución: Copia env.database.example a .env y configura los valores');
  }

  // Test 6: Database Schema
  console.log('\n📊 6. VERIFICANDO ESQUEMA DE BASE DE DATOS...');
  try {
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `;
    
    console.log('✅ Esquema: Tablas encontradas:', (tables as any[]).length);
    
    // Check specific tables
    const requiredTables = ['User', 'Room', 'Guest', 'Reservation'];
    for (const table of requiredTables) {
      try {
        await prisma.$queryRaw`SELECT 1 FROM "${table}" LIMIT 1`;
        console.log(`   ✅ Tabla ${table}: Existe`);
      } catch (error) {
        console.log(`   ❌ Tabla ${table}: No existe o error de acceso`);
      }
    }
    
  } catch (error) {
    console.error('❌ Esquema: Error al verificar tablas');
    console.error('   Error:', error instanceof Error ? error.message : 'Unknown error');
  }

  console.log('\n🔍 RESUMEN DE LA VERIFICACIÓN:');
  console.log('=====================================');
  
  // Close connections
  try {
    await prisma.$disconnect();
    console.log('✅ Conexiones cerradas correctamente');
  } catch (error) {
    console.error('❌ Error al cerrar conexiones:', error);
  }
}

// Run the test
testDatabaseConnections()
  .then(() => {
    console.log('\n🎉 Verificación completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error durante la verificación:', error);
    process.exit(1);
  });
