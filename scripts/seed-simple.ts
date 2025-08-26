#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSimple() {
  console.log('🌱 INSERTANDO DATOS INICIALES SIMPLIFICADOS...\n');

  try {
    // Step 1: Create Hotel
    console.log('📊 1. CREANDO HOTEL...');
    const hotel = await prisma.hotel.create({
      data: {
        name: 'Hotel Paseo Las Mercedes',
        address: 'Paseo Las Mercedes, Caracas, Venezuela',
        phone: '+58 212 555-0123',
        email: 'info@hotelpaseolasmercedes.com',
        description: 'Hotel de lujo en el corazón de Caracas',
        tax_id: 'J-12345678-9',
        logo_url: '/images/logo.png',
        default_currency: 'USD',
        created_by: 'system',
        updated_by: 'system',
      },
    });
    console.log('✅ Hotel creado:', hotel.name);

    // Step 2: Create Admin User
    console.log('\n📊 2. CREANDO USUARIO ADMINISTRADOR...');
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@hotel.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/vHhH8eG', // admin123
        firstName: 'Administrador',
        lastName: 'Sistema',
        phone: '+58 212 555-0001',
        isActive: true,
        emailVerified: true,
        created_by: 'system',
        updated_by: 'system',
      },
    });
    console.log('✅ Usuario administrador creado:', adminUser.email);

    // Step 3: Create Sample Room
    console.log('\n📊 3. CREANDO HABITACIÓN DE EJEMPLO...');
    const room = await prisma.room.create({
      data: {
        number: '101',
        hotelId: hotel.id,
        status: 'AVAILABLE',
        isActive: true,
        created_by: 'system',
        updated_by: 'system',
      },
    });
    console.log('✅ Habitación creada:', room.number);

    console.log('\n🎉 SEED SIMPLIFICADO COMPLETADO EXITOSAMENTE');
    console.log('=====================================');
    console.log('✅ Hotel configurado');
    console.log('✅ Usuario administrador creado');
    console.log('✅ Habitación de ejemplo creada');
    
    console.log('\n🔑 CREDENCIALES DE ACCESO:');
    console.log('   Usuario: admin@hotel.com');
    console.log('   Contraseña: admin123');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed
seedSimple()
  .then(() => {
    console.log('\n🎯 Seed simplificado completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error durante el seed:', error);
    process.exit(1);
  });

