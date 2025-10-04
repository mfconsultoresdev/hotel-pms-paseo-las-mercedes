const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_vYwoRk4e5sLQ@ep-shy-tree-adruv4z1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function testConnection() {
  const client = new Client({ connectionString });
  
  try {
    console.log('🔌 Intentando conectar a la base de datos...');
    await client.connect();
    console.log('✅ Conexión exitosa!\n');
    
    // Test 1: Query simple
    console.log('📊 Test 1: Query simple (SELECT)');
    const result = await client.query('SELECT version(), current_database(), current_user;');
    console.log('✅ Query exitoso');
    console.log('   - PostgreSQL:', result.rows[0].version.split(' ')[1]);
    console.log('   - Database:', result.rows[0].current_database);
    console.log('   - User:', result.rows[0].current_user);
    console.log('');
    
    // Test 2: Intentar crear una tabla de prueba (DDL)
    console.log('🔨 Test 2: Operación DDL (CREATE TABLE)');
    try {
      await client.query('CREATE TABLE IF NOT EXISTS test_ddl_operations (id SERIAL PRIMARY KEY, name VARCHAR(50), created_at TIMESTAMP DEFAULT NOW());');
      console.log('✅ CREATE TABLE exitoso - Soporta operaciones DDL');
      
      // Insertar un registro
      await client.query("INSERT INTO test_ddl_operations (name) VALUES ('test_migration');");
      console.log('✅ INSERT exitoso');
      
      // Verificar
      const testResult = await client.query('SELECT * FROM test_ddl_operations;');
      console.log('✅ SELECT exitoso - Registros:', testResult.rows.length);
      
      // Limpiar
      await client.query('DROP TABLE test_ddl_operations;');
      console.log('✅ DROP TABLE exitoso - Limpieza completada');
      console.log('');
      
      console.log('🎉 RESULTADO: Esta conexión SOPORTA operaciones DDL');
      console.log('   ✅ Sirve para queries normales (SELECT, INSERT, UPDATE, DELETE)');
      console.log('   ✅ Sirve para migraciones (CREATE TABLE, ALTER TABLE, etc.)');
      console.log('   ✅ Puedes usar esta URL tanto para DATABASE_URL como para DIRECT_DATABASE_URL');
      
    } catch (ddlError) {
      console.log('❌ CREATE TABLE falló');
      console.log('   Error:', ddlError.message);
      console.log('');
      console.log('⚠️  RESULTADO: Esta conexión NO SOPORTA operaciones DDL');
      console.log('   ✅ Sirve para queries normales (DATABASE_URL)');
      console.log('   ❌ NO sirve para migraciones (necesitas DIRECT_DATABASE_URL sin -pooler)');
    }
    
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    console.log('');
    console.log('Posibles causas:');
    console.log('  - Contraseña incorrecta');
    console.log('  - Base de datos no existe o está suspendida');
    console.log('  - Firewall bloqueando la conexión');
  } finally {
    await client.end();
  }
}

testConnection();
