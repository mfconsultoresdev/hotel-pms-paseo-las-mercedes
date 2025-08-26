#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 INSERTANDO DATOS INICIALES EN LA BASE DE DATOS...\n');

  try {
    // Step 1: Create Hotel
    console.log('📊 1. CREANDO HOTEL...');
    const hotel = await prisma.hotel.create({
      data: {
        name: 'Hotel Paseo Las Mercedes',
        address: 'Paseo Las Mercedes, Caracas, Venezuela',
        phone: '+58 212 555-0123',
        email: 'info@hotelpaseolasmercedes.com',
        description: 'Hotel de lujo en el corazón de Caracas, ofreciendo la mejor experiencia de hospedaje con servicios premium y atención personalizada.',
        tax_id: 'J-12345678-9',
        logo_url: '/images/logo.png',
        default_currency: 'USD',
        created_by: 'system',
        updated_by: 'system',
      },
    });
    console.log('✅ Hotel creado:', hotel.name);

    // Step 2: Create Roles
    console.log('\n📊 2. CREANDO ROLES Y PERMISOS...');
    const adminRole = await prisma.role.create({
      data: {
        name: 'Administrador',
        description: 'Acceso completo al sistema',
        permissions: {
          create: [
            { name: 'user.manage', description: 'Gestionar usuarios' },
            { name: 'hotel.manage', description: 'Gestionar hotel' },
            { name: 'room.manage', description: 'Gestionar habitaciones' },
            { name: 'reservation.manage', description: 'Gestionar reservas' },
            { name: 'finance.manage', description: 'Gestionar finanzas' },
            { name: 'reports.view', description: 'Ver reportes' },
            { name: 'system.admin', description: 'Administración del sistema' },
          ],
        },
        created_by: 'system',
        updated_by: 'system',
      },
    });

    const managerRole = await prisma.role.create({
      data: {
        name: 'Gerente',
        description: 'Gestión operativa del hotel',
        permissions: {
          create: [
            { name: 'room.manage', description: 'Gestionar habitaciones' },
            { name: 'reservation.manage', description: 'Gestionar reservas' },
            { name: 'guest.manage', description: 'Gestionar huéspedes' },
            { name: 'reports.view', description: 'Ver reportes' },
          ],
        },
        created_by: 'system',
        updated_by: 'system',
      },
    });

    const staffRole = await prisma.role.create({
      data: {
        name: 'Personal',
        description: 'Operaciones diarias',
        permissions: {
          create: [
            { name: 'reservation.view', description: 'Ver reservas' },
            { name: 'guest.view', description: 'Ver huéspedes' },
            { name: 'room.view', description: 'Ver habitaciones' },
          ],
        },
        created_by: 'system',
        updated_by: 'system',
      },
    });

    console.log('✅ Roles creados: Administrador, Gerente, Personal');

    // Step 3: Create Admin User
    console.log('\n📊 3. CREANDO USUARIO ADMINISTRADOR...');
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@hotel.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/vHhH8eG', // admin123
        firstName: 'Administrador',
        lastName: 'Sistema',
        phone: '+58 212 555-0001',
        isActive: true,
        emailVerified: true,
        roleId: adminRole.id,
        created_by: 'system',
        updated_by: 'system',
      },
    });
    console.log('✅ Usuario administrador creado:', adminUser.email);

    // Step 4: Create Floors
    console.log('\n📊 4. CREANDO PISOS...');
    const floors = [];
    for (let i = 1; i <= 10; i++) {
      const floor = await prisma.floor.create({
        data: {
          number: i,
          name: `Piso ${i}`,
          description: `Piso ${i} del hotel`,
          hotelId: hotel.id,
          created_by: 'system',
          updated_by: 'system',
        },
      });
      floors.push(floor);
    }
    console.log('✅ Pisos creados:', floors.length);

    // Step 5: Create Room Types
    console.log('\n📊 5. CREANDO TIPOS DE HABITACIÓN...');
    const roomTypes = [
      { name: 'Standard', description: 'Habitación estándar con vista a la ciudad', basePrice: 120.00, capacity: 2 },
      { name: 'Deluxe', description: 'Habitación de lujo con amenities premium', basePrice: 180.00, capacity: 2 },
      { name: 'Suite', description: 'Suite ejecutiva con sala de estar', basePrice: 280.00, capacity: 4 },
      { name: 'Presidential', description: 'Suite presidencial de máxima categoría', basePrice: 450.00, capacity: 6 },
    ];

    const createdRoomTypes = [];
    for (const type of roomTypes) {
      const roomType = await prisma.roomType.create({
        data: {
          ...type,
          hotelId: hotel.id,
          created_by: 'system',
          updated_by: 'system',
        },
      });
      createdRoomTypes.push(roomType);
    }
    console.log('✅ Tipos de habitación creados:', createdRoomTypes.length);

    // Step 6: Create Rooms
    console.log('\n📊 6. CREANDO HABITACIONES...');
    const rooms = [];
    let roomNumber = 100;
    
    for (const floor of floors) {
      for (const roomType of createdRoomTypes) {
        // Create 2-3 rooms per type per floor
        const roomsPerType = Math.floor(Math.random() * 2) + 2;
        
        for (let i = 0; i < roomsPerType; i++) {
          const room = await prisma.room.create({
            data: {
              number: roomNumber.toString(),
              floorId: floor.id,
              roomTypeId: roomType.id,
              hotelId: hotel.id,
              status: 'AVAILABLE',
              isActive: true,
              created_by: 'system',
              updated_by: 'system',
            },
          });
          rooms.push(room);
          roomNumber++;
        }
      }
    }
    console.log('✅ Habitaciones creadas:', rooms.length);

    // Step 7: Create Services
    console.log('\n📊 7. CREANDO SERVICIOS...');
    const services = [
      { name: 'WiFi Premium', description: 'Internet de alta velocidad', price: 15.00, category: 'INTERNET' },
      { name: 'Limpieza Diaria', description: 'Servicio de limpieza diario', price: 0.00, category: 'HOUSEKEEPING' },
      { name: 'Room Service', description: 'Servicio a la habitación 24/7', price: 25.00, category: 'FOOD' },
      { name: 'Gimnasio', description: 'Acceso al gimnasio del hotel', price: 20.00, category: 'FITNESS' },
      { name: 'Piscina', description: 'Acceso a la piscina', price: 0.00, category: 'RECREATION' },
      { name: 'Estacionamiento', description: 'Estacionamiento seguro', price: 18.00, category: 'TRANSPORT' },
    ];

    const createdServices = [];
    for (const service of services) {
      const createdService = await prisma.service.create({
        data: {
          ...service,
          hotelId: hotel.id,
          isActive: true,
          created_by: 'system',
          updated_by: 'system',
        },
      });
      createdServices.push(createdService);
    }
    console.log('✅ Servicios creados:', createdServices.length);

    // Step 8: Create Sample Guests
    console.log('\n📊 8. CREANDO HUÉSPEDES DE EJEMPLO...');
    const sampleGuests = [
      {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@email.com',
        phone: '+58 412 123-4567',
        nationality: 'Venezolano',
        documentType: 'CÉDULA',
        documentNumber: 'V-12345678',
        address: 'Av. Principal, Caracas',
        emergencyContact: 'María Pérez',
        emergencyPhone: '+58 412 987-6543',
      },
      {
        firstName: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@email.com',
        phone: '+58 414 234-5678',
        nationality: 'Venezolana',
        documentType: 'PASAPORTE',
        documentNumber: 'V123456789',
        address: 'Calle Comercial, Valencia',
        emergencyContact: 'Carlos González',
        emergencyPhone: '+58 414 876-5432',
      },
      {
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos.rodriguez@email.com',
        phone: '+58 416 345-6789',
        nationality: 'Colombiano',
        documentType: 'PASAPORTE',
        documentNumber: 'CO987654321',
        address: 'Carrera 15, Bogotá',
        emergencyContact: 'Ana Rodríguez',
        emergencyPhone: '+58 416 765-4321',
      },
    ];

    const createdGuests = [];
    for (const guestData of sampleGuests) {
      const guest = await prisma.guest.create({
        data: {
          ...guestData,
          hotelId: hotel.id,
          isActive: true,
          created_by: 'system',
          updated_by: 'system',
        },
      });
      createdGuests.push(guest);
    }
    console.log('✅ Huéspedes de ejemplo creados:', createdGuests.length);

    // Step 9: Create Sample Reservations
    console.log('\n📊 9. CREANDO RESERVAS DE EJEMPLO...');
    const sampleReservations = [
      {
        guestId: createdGuests[0].id,
        roomId: rooms[0].id,
        checkInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        checkOutDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        adults: 2,
        children: 1,
        totalAmount: 360.00,
        status: 'CONFIRMED',
        specialRequests: 'Habitación con vista a la ciudad',
      },
      {
        guestId: createdGuests[1].id,
        roomId: rooms[5].id,
        checkInDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        checkOutDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        adults: 1,
        children: 0,
        totalAmount: 180.00,
        status: 'CONFIRMED',
        specialRequests: 'Habitación silenciosa',
      },
    ];

    const createdReservations = [];
    for (const reservationData of sampleReservations) {
      const reservation = await prisma.reservation.create({
        data: {
          ...reservationData,
          hotelId: hotel.id,
          created_by: 'system',
          updated_by: 'system',
        },
      });
      createdReservations.push(reservation);
    }
    console.log('✅ Reservas de ejemplo creadas:', createdReservations.length);

    // Step 10: Create Payment Methods
    console.log('\n📊 10. CREANDO MÉTODOS DE PAGO...');
    const paymentMethods = [
      { name: 'Efectivo', description: 'Pago en efectivo', isActive: true },
      { name: 'Tarjeta de Crédito', description: 'Visa, Mastercard, American Express', isActive: true },
      { name: 'Tarjeta de Débito', description: 'Débito directo', isActive: true },
      { name: 'Transferencia Bancaria', description: 'Transferencia electrónica', isActive: true },
      { name: 'PayPal', description: 'Pago electrónico', isActive: true },
    ];

    const createdPaymentMethods = [];
    for (const method of paymentMethods) {
      const paymentMethod = await prisma.paymentMethod.create({
        data: {
          ...method,
          hotelId: hotel.id,
          created_by: 'system',
          updated_by: 'system',
        },
      });
      createdPaymentMethods.push(paymentMethod);
    }
    console.log('✅ Métodos de pago creados:', createdPaymentMethods.length);

    console.log('\n🎉 SEED COMPLETADO EXITOSAMENTE');
    console.log('=====================================');
    console.log('✅ Hotel configurado');
    console.log('✅ Roles y permisos creados');
    console.log('✅ Usuario administrador creado');
    console.log('✅ Pisos y habitaciones configurados');
    console.log('✅ Servicios del hotel definidos');
    console.log('✅ Huéspedes de ejemplo creados');
    console.log('✅ Reservas de ejemplo creadas');
    console.log('✅ Métodos de pago configurados');
    
    console.log('\n🔑 CREDENCIALES DE ACCESO:');
    console.log('   Usuario: admin@hotel.com');
    console.log('   Contraseña: admin123');
    
    console.log('\n📊 ESTADÍSTICAS:');
    console.log(`   - ${floors.length} pisos`);
    console.log(`   - ${rooms.length} habitaciones`);
    console.log(`   - ${createdServices.length} servicios`);
    console.log(`   - ${createdGuests.length} huéspedes de ejemplo`);
    console.log(`   - ${createdReservations.length} reservas de ejemplo`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed
seed()
  .then(() => {
    console.log('\n🎯 Seed completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error durante el seed:', error);
    process.exit(1);
  });
