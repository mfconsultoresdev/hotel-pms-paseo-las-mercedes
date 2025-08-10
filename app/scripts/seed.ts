
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando semilla de datos para Hotel Paseo Las Mercedes...')

  // 1. Crear Hotel Principal
  console.log('📍 Creando hotel...')
  const hotel = await prisma.hotel.upsert({
    where: { id: 'hotel-paseo-las-mercedes' },
    update: {},
    create: {
      id: 'hotel-paseo-las-mercedes',
      name: 'Hotel Paseo Las Mercedes',
      address: 'Paseo Las Mercedes, Caracas, Venezuela',
      phone: '+58-212-993-5000',
      email: 'info@hotelpaseolm.com',
      description: 'Hotel boutique de lujo ubicado en el corazón de Las Mercedes, Caracas',
      tax_id: 'J-12345678-9',
      default_currency: 'USD'
    },
  })

  // 2. Crear Roles del Sistema
  console.log('👥 Creando roles...')
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'Administrador' },
      update: {},
      create: {
        name: 'Administrador',
        description: 'Acceso completo al sistema',
        permissions: JSON.stringify([
          'hotel.manage', 'users.manage', 'rooms.manage', 'reservations.manage', 
          'guests.manage', 'reports.view', 'settings.manage', 'transactions.manage'
        ])
      }
    }),
    prisma.role.upsert({
      where: { name: 'Gerente' },
      update: {},
      create: {
        name: 'Gerente',
        description: 'Gestión operativa del hotel',
        permissions: JSON.stringify([
          'rooms.manage', 'reservations.manage', 'guests.manage', 'reports.view', 'transactions.view'
        ])
      }
    }),
    prisma.role.upsert({
      where: { name: 'Recepcionista' },
      update: {},
      create: {
        name: 'Recepcionista',
        description: 'Atención al huésped y operaciones básicas',
        permissions: JSON.stringify([
          'reservations.create', 'reservations.view', 'guests.manage', 'checkin.manage', 'checkout.manage'
        ])
      }
    }),
    prisma.role.upsert({
      where: { name: 'Personal de Limpieza' },
      update: {},
      create: {
        name: 'Personal de Limpieza',
        description: 'Mantenimiento de habitaciones',
        permissions: JSON.stringify(['rooms.status', 'rooms.cleaning'])
      }
    }),
    prisma.role.upsert({
      where: { name: 'Presidente' },
      update: {},
      create: {
        name: 'Presidente',
        description: 'Máximo nivel directivo',
        permissions: JSON.stringify([
          'hotel.manage', 'users.manage', 'rooms.manage', 'reservations.manage', 
          'guests.manage', 'reports.view', 'settings.manage', 'transactions.manage', 'executive.reports'
        ])
      }
    }),
    prisma.role.upsert({
      where: { name: 'Vicepresidente' },
      update: {},
      create: {
        name: 'Vicepresidente',
        description: 'Alto nivel directivo',
        permissions: JSON.stringify([
          'hotel.view', 'users.view', 'rooms.view', 'reservations.view', 
          'guests.view', 'reports.view', 'transactions.view', 'executive.reports'
        ])
      }
    })
  ])

  // 3. Crear Usuarios del Sistema
  console.log('👤 Creando usuarios...')
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const testPassword = await bcrypt.hash('johndoe123', 12)
  
  const adminRole = roles.find(r => r.name === 'Administrador')!
  const managerRole = roles.find(r => r.name === 'Gerente')!
  const receptRole = roles.find(r => r.name === 'Recepcionista')!
  
  const users = await Promise.all([
    // Usuario principal admin
    prisma.user.upsert({
      where: { email: 'admin@hotelpaseolm.com' },
      update: {},
      create: {
        email: 'admin@hotelpaseolm.com',
        name: 'Admin Principal',
        first_name: 'Admin',
        last_name: 'Principal',
        password: hashedPassword,
        employee_id: 'EMP001',
        phone: '+58-212-993-5001',
        position: 'Administrador de Sistemas',
        department: 'Tecnología',
        hotel_id: hotel.id,
        role_id: adminRole.id,
      }
    }),
    // Usuario de prueba requerido
    prisma.user.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        email: 'john@doe.com',
        name: 'John Doe',
        first_name: 'John',
        last_name: 'Doe',
        password: testPassword,
        employee_id: 'EMP999',
        phone: '+58-212-000-0000',
        position: 'Administrador',
        department: 'Test',
        hotel_id: hotel.id,
        role_id: adminRole.id,
      }
    }),
    // Gerente
    prisma.user.upsert({
      where: { email: 'gerente@hotelpaseolm.com' },
      update: {},
      create: {
        email: 'gerente@hotelpaseolm.com',
        name: 'María García',
        first_name: 'María',
        last_name: 'García',
        password: hashedPassword,
        employee_id: 'EMP002',
        phone: '+58-212-993-5002',
        position: 'Gerente General',
        department: 'Administración',
        hotel_id: hotel.id,
        role_id: managerRole.id,
      }
    }),
    // Recepcionista
    prisma.user.upsert({
      where: { email: 'recepcion@hotelpaseolm.com' },
      update: {},
      create: {
        email: 'recepcion@hotelpaseolm.com',
        name: 'Carlos Mendoza',
        first_name: 'Carlos',
        last_name: 'Mendoza',
        password: hashedPassword,
        employee_id: 'EMP003',
        phone: '+58-212-993-5003',
        position: 'Recepcionista',
        department: 'Front Desk',
        hotel_id: hotel.id,
        role_id: receptRole.id,
      }
    })
  ])

  // 4. Crear Pisos (9 pisos)
  console.log('🏢 Creando pisos...')
  const floors = []
  for (let i = 1; i <= 9; i++) {
    const floor = await prisma.floor.upsert({
      where: { 
        hotel_id_floor_number: { 
          hotel_id: hotel.id, 
          floor_number: i 
        }
      },
      update: {},
      create: {
        hotel_id: hotel.id,
        floor_number: i,
        name: `Piso ${i}`,
        description: `Piso ${i} - Hotel Paseo Las Mercedes`
      }
    })
    floors.push(floor)
  }

  // 5. Crear Tipos de Habitaciones
  console.log('🛏️ Creando tipos de habitaciones...')
  const roomTypes = await Promise.all([
    prisma.roomType.upsert({
      where: { id: 'rt-individual' },
      update: {},
      create: {
        id: 'rt-individual',
        name: 'Individual',
        description: 'Habitación individual con una cama',
        max_occupancy: 1,
        base_rate_usd: 80.00,
        base_rate_usdt: 80.00,
        base_rate_eur: 75.00,
        base_rate_bnb: 0.00015,
        base_rate_etc: 0.002,
        amenities: JSON.stringify(['WiFi', 'TV', 'Aire Acondicionado', 'Minibar']),
        size_sqm: 25,
        bed_type: 'Individual',
        bed_count: 1
      }
    }),
    prisma.roomType.upsert({
      where: { id: 'rt-doble' },
      update: {},
      create: {
        id: 'rt-doble',
        name: 'Doble',
        description: 'Habitación doble con dos camas o una cama matrimonial',
        max_occupancy: 2,
        base_rate_usd: 120.00,
        base_rate_usdt: 120.00,
        base_rate_eur: 110.00,
        base_rate_bnb: 0.0002,
        base_rate_etc: 0.003,
        amenities: JSON.stringify(['WiFi', 'TV', 'Aire Acondicionado', 'Minibar', 'Balcón']),
        size_sqm: 35,
        bed_type: 'Queen',
        bed_count: 1
      }
    }),
    prisma.roomType.upsert({
      where: { id: 'rt-suite' },
      update: {},
      create: {
        id: 'rt-suite',
        name: 'Suite',
        description: 'Suite de lujo con sala de estar separada',
        max_occupancy: 4,
        base_rate_usd: 250.00,
        base_rate_usdt: 250.00,
        base_rate_eur: 230.00,
        base_rate_bnb: 0.0004,
        base_rate_etc: 0.006,
        amenities: JSON.stringify(['WiFi', 'TV', 'Aire Acondicionado', 'Minibar', 'Balcón', 'Jacuzzi', 'Sala de Estar']),
        size_sqm: 65,
        bed_type: 'King',
        bed_count: 1
      }
    })
  ])

  // 6. Crear 200 Habitaciones Distribuidas
  console.log('🏨 Creando 200 habitaciones...')
  const roomDistribution = [
    { floor: 1, start: 101, count: 20, type: 'rt-individual' },
    { floor: 2, start: 201, count: 25, type: 'rt-individual' },
    { floor: 3, start: 301, count: 25, type: 'rt-doble' },
    { floor: 4, start: 401, count: 25, type: 'rt-doble' },
    { floor: 5, start: 501, count: 25, type: 'rt-doble' },
    { floor: 6, start: 601, count: 25, type: 'rt-doble' },
    { floor: 7, start: 701, count: 20, type: 'rt-doble' },
    { floor: 8, start: 801, count: 15, type: 'rt-suite' },
    { floor: 9, start: 901, count: 20, type: 'rt-suite' }
  ]

  const rooms = []
  for (const dist of roomDistribution) {
    const floor = floors.find(f => f.floor_number === dist.floor)!
    const roomType = roomTypes.find(rt => rt.id === dist.type)!
    
    for (let i = 0; i < dist.count; i++) {
      const roomNumber = (dist.start + i).toString()
      const room = await prisma.room.create({
        data: {
          room_number: roomNumber,
          hotel_id: hotel.id,
          floor_id: floor.id,
          room_type_id: roomType.id,
          status: 'AVAILABLE',
          has_minibar: true,
          has_balcony: dist.type !== 'rt-individual',
          has_view: dist.floor >= 5,
          wifi_password: `PLM${roomNumber}`
        }
      })
      rooms.push(room)
    }
  }

  console.log(`✅ Creadas ${rooms.length} habitaciones`)

  // 7. Crear Servicios del Hotel
  console.log('🍽️ Creando servicios...')
  const services = await Promise.all([
    // Restaurante
    prisma.service.create({
      data: {
        hotel_id: hotel.id,
        name: 'Desayuno Buffet',
        description: 'Desayuno buffet internacional',
        category: 'RESTAURANT',
        price_usd: 25.00,
        price_usdt: 25.00,
        price_eur: 22.00,
        price_bnb: 0.00008,
        price_etc: 0.001,
        is_taxable: true,
        tax_rate: 16.00
      }
    }),
    prisma.service.create({
      data: {
        hotel_id: hotel.id,
        name: 'Almuerzo Ejecutivo',
        description: 'Menú ejecutivo con entrada, plato principal y postre',
        category: 'RESTAURANT',
        price_usd: 35.00,
        price_usdt: 35.00,
        price_eur: 32.00,
        price_bnb: 0.00012,
        price_etc: 0.0015,
        is_taxable: true,
        tax_rate: 16.00
      }
    }),
    prisma.service.create({
      data: {
        hotel_id: hotel.id,
        name: 'Cena Gourmet',
        description: 'Cena de tres tiempos con opciones gourmet',
        category: 'RESTAURANT',
        price_usd: 55.00,
        price_usdt: 55.00,
        price_eur: 50.00,
        price_bnb: 0.00018,
        price_etc: 0.002,
        is_taxable: true,
        tax_rate: 16.00
      }
    }),
    // Spa
    prisma.service.create({
      data: {
        hotel_id: hotel.id,
        name: 'Masaje Relajante',
        description: 'Masaje corporal completo de 60 minutos',
        category: 'SPA',
        price_usd: 80.00,
        price_usdt: 80.00,
        price_eur: 75.00,
        price_bnb: 0.00025,
        price_etc: 0.003,
        is_taxable: true,
        tax_rate: 16.00
      }
    }),
    prisma.service.create({
      data: {
        hotel_id: hotel.id,
        name: 'Facial Hidratante',
        description: 'Tratamiento facial hidratante de 45 minutos',
        category: 'SPA',
        price_usd: 65.00,
        price_usdt: 65.00,
        price_eur: 60.00,
        price_bnb: 0.0002,
        price_etc: 0.0025,
        is_taxable: true,
        tax_rate: 16.00
      }
    }),
    // Lavandería
    prisma.service.create({
      data: {
        hotel_id: hotel.id,
        name: 'Servicio de Lavandería',
        description: 'Lavado y planchado de ropa',
        category: 'LAUNDRY',
        price_usd: 15.00,
        price_usdt: 15.00,
        price_eur: 14.00,
        price_bnb: 0.00005,
        price_etc: 0.0006,
        is_taxable: true,
        tax_rate: 16.00
      }
    }),
    // Minibar
    prisma.service.create({
      data: {
        hotel_id: hotel.id,
        name: 'Agua Mineral',
        description: 'Botella de agua mineral 500ml',
        category: 'MINIBAR',
        price_usd: 3.00,
        price_usdt: 3.00,
        price_eur: 2.50,
        price_bnb: 0.000008,
        price_etc: 0.0001,
        is_taxable: true,
        tax_rate: 16.00
      }
    }),
    prisma.service.create({
      data: {
        hotel_id: hotel.id,
        name: 'Cerveza Premium',
        description: 'Cerveza importada 350ml',
        category: 'MINIBAR',
        price_usd: 8.00,
        price_usdt: 8.00,
        price_eur: 7.00,
        price_bnb: 0.000025,
        price_etc: 0.0003,
        is_taxable: true,
        tax_rate: 16.00
      }
    }),
    // Room Service
    prisma.service.create({
      data: {
        hotel_id: hotel.id,
        name: 'Room Service',
        description: 'Servicio a la habitación 24 horas',
        category: 'ROOM_SERVICE',
        price_usd: 10.00,
        price_usdt: 10.00,
        price_eur: 9.00,
        price_bnb: 0.00003,
        price_etc: 0.0004,
        is_taxable: true,
        tax_rate: 16.00
      }
    })
  ])

  // 8. Crear Huéspedes de Ejemplo
  console.log('🧑‍🤝‍🧑 Creando huéspedes de ejemplo...')
  const guests = await Promise.all([
    prisma.guest.create({
      data: {
        hotel_id: hotel.id,
        first_name: 'Ana',
        last_name: 'Rodríguez',
        email: 'ana.rodriguez@email.com',
        phone: '+58-412-1234567',
        document_type: 'ID',
        document_number: 'V-12345678',
        nationality: 'Venezolana',
        date_of_birth: new Date('1985-03-15'),
        address: 'Av. Francisco de Miranda, Caracas',
        city: 'Caracas',
        country: 'Venezuela',
        postal_code: '1060',
        vip_status: true
      }
    }),
    prisma.guest.create({
      data: {
        hotel_id: hotel.id,
        first_name: 'Roberto',
        last_name: 'Silva',
        email: 'roberto.silva@email.com',
        phone: '+58-414-9876543',
        document_type: 'PASSPORT',
        document_number: 'P12345678',
        nationality: 'Brasileño',
        date_of_birth: new Date('1978-08-22'),
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        country: 'Brasil',
        postal_code: '01234-567'
      }
    }),
    prisma.guest.create({
      data: {
        hotel_id: hotel.id,
        first_name: 'Isabella',
        last_name: 'García',
        email: 'isabella.garcia@email.com',
        phone: '+1-305-5555555',
        document_type: 'PASSPORT',
        document_number: 'US123456789',
        nationality: 'Estadounidense',
        date_of_birth: new Date('1990-12-10'),
        address: '123 Ocean Drive',
        city: 'Miami',
        country: 'Estados Unidos',
        postal_code: '33139'
      }
    })
  ])

  // 9. Crear Reservas de Ejemplo
  console.log('📅 Creando reservas de ejemplo...')
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  
  const adminUser = users.find(u => u.email === 'admin@hotelpaseolm.com')!
  const sampleRooms = rooms.slice(0, 5) // Primeras 5 habitaciones
  
  const reservations = await Promise.all([
    prisma.reservation.create({
      data: {
        reservation_number: 'RES-2025-001',
        hotel_id: hotel.id,
        room_id: sampleRooms[0].id,
        guest_id: guests[0].id,
        check_in_date: tomorrow,
        check_out_date: new Date(tomorrow.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 días
        adults: 1,
        children: 0,
        nights: 3,
        currency: 'USD',
        room_rate: 80.00,
        total_amount: 240.00,
        taxes: 38.40,
        status: 'CONFIRMED',
        payment_status: 'PENDING',
        created_by: adminUser.id
      }
    }),
    prisma.reservation.create({
      data: {
        reservation_number: 'RES-2025-002',
        hotel_id: hotel.id,
        room_id: sampleRooms[1].id,
        guest_id: guests[1].id,
        check_in_date: nextWeek,
        check_out_date: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 días
        adults: 2,
        children: 0,
        nights: 5,
        currency: 'USD',
        room_rate: 120.00,
        total_amount: 600.00,
        taxes: 96.00,
        status: 'CONFIRMED',
        payment_status: 'PAID',
        created_by: adminUser.id
      }
    })
  ])

  console.log('🎉 ¡Semilla de datos completada exitosamente!')
  console.log(`✅ Hotel creado: ${hotel.name}`)
  console.log(`✅ ${roles.length} roles creados`)
  console.log(`✅ ${users.length} usuarios creados`)
  console.log(`✅ ${floors.length} pisos creados`)
  console.log(`✅ ${roomTypes.length} tipos de habitaciones creados`)
  console.log(`✅ ${rooms.length} habitaciones creadas`)
  console.log(`✅ ${services.length} servicios creados`)
  console.log(`✅ ${guests.length} huéspedes creados`)
  console.log(`✅ ${reservations.length} reservas creadas`)
  
  console.log('\n🔐 Credenciales de acceso:')
  console.log('Admin: admin@hotelpaseolm.com / admin123')
  console.log('Gerente: gerente@hotelpaseolm.com / admin123')
  console.log('Recepción: recepcion@hotelpaseolm.com / admin123')
  console.log('Test: john@doe.com / johndoe123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
