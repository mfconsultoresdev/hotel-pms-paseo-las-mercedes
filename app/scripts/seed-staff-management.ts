import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedStaffManagement() {
  console.log('🏨 Seeding Staff Management data...')

  try {
    const hotel = await prisma.hotel.findFirst()
    if (!hotel) {
      console.error('❌ No hotel found')
      return
    }

    console.log('✅ Hotel found:', hotel.name)

    // Create Staff Members
    const staffData = [
      {
        employee_number: 'EMP001',
        first_name: 'Carlos',
        last_name: 'Rodríguez',
        email: 'carlos.rodriguez@hotelpaseolm.com',
        phone: '+58 412 1234567',
        department: 'FRONT_DESK',
        position: 'Gerente de Recepción',
        employment_type: 'FULL_TIME',
        shift_type: 'DAY',
        salary_type: 'MONTHLY',
        base_salary: 1200.00,
        hire_date: new Date('2023-01-15'),
        date_of_birth: new Date('1985-03-20'),
        is_active: true
      },
      {
        employee_number: 'EMP002',
        first_name: 'María',
        last_name: 'González',
        email: 'maria.gonzalez@hotelpaseolm.com',
        phone: '+58 424 2345678',
        department: 'FRONT_DESK',
        position: 'Recepcionista',
        employment_type: 'FULL_TIME',
        shift_type: 'DAY',
        salary_type: 'HOURLY',
        base_salary: 8.00,
        hire_date: new Date('2023-06-01'),
        date_of_birth: new Date('1992-07-15'),
        is_active: true
      },
      {
        employee_number: 'EMP003',
        first_name: 'José',
        last_name: 'Martínez',
        email: 'jose.martinez@hotelpaseolm.com',
        phone: '+58 414 3456789',
        department: 'HOUSEKEEPING',
        position: 'Supervisor de Limpieza',
        employment_type: 'FULL_TIME',
        shift_type: 'DAY',
        salary_type: 'MONTHLY',
        base_salary: 900.00,
        hire_date: new Date('2022-11-10'),
        date_of_birth: new Date('1988-11-05'),
        is_active: true
      },
      {
        employee_number: 'EMP004',
        first_name: 'Ana',
        last_name: 'López',
        email: 'ana.lopez@hotelpaseolm.com',
        phone: '+58 416 4567890',
        department: 'MAINTENANCE',
        position: 'Técnico de Mantenimiento',
        employment_type: 'FULL_TIME',
        shift_type: 'DAY',
        salary_type: 'MONTHLY',
        base_salary: 1000.00,
        hire_date: new Date('2023-03-20'),
        date_of_birth: new Date('1990-04-12'),
        is_active: true
      },
      {
        employee_number: 'EMP005',
        first_name: 'Pedro',
        last_name: 'Sánchez',
        email: 'pedro.sanchez@hotelpaseolm.com',
        phone: '+58 412 5678901',
        department: 'SECURITY',
        position: 'Guardia de Seguridad',
        employment_type: 'FULL_TIME',
        shift_type: 'NIGHT',
        salary_type: 'MONTHLY',
        base_salary: 800.00,
        hire_date: new Date('2023-08-01'),
        date_of_birth: new Date('1987-09-25'),
        is_active: true
      },
      {
        employee_number: 'EMP006',
        first_name: 'Laura',
        last_name: 'Fernández',
        email: 'laura.fernandez@hotelpaseolm.com',
        phone: '+58 424 6789012',
        department: 'ADMINISTRATION',
        position: 'Contador',
        employment_type: 'FULL_TIME',
        shift_type: 'DAY',
        salary_type: 'MONTHLY',
        base_salary: 1400.00,
        hire_date: new Date('2022-09-01'),
        date_of_birth: new Date('1986-02-18'),
        is_active: true
      },
      {
        employee_number: 'EMP007',
        first_name: 'Roberto',
        last_name: 'Pérez',
        email: 'roberto.perez@hotelpaseolm.com',
        phone: '+58 414 7890123',
        department: 'RESTAURANT',
        position: 'Chef',
        employment_type: 'FULL_TIME',
        shift_type: 'DAY',
        salary_type: 'MONTHLY',
        base_salary: 1100.00,
        hire_date: new Date('2023-04-15'),
        date_of_birth: new Date('1989-06-30'),
        is_active: true
      },
      {
        employee_number: 'EMP008',
        first_name: 'Carmen',
        last_name: 'Díaz',
        email: 'carmen.diaz@hotelpaseolm.com',
        phone: '+58 416 8901234',
        department: 'HOUSEKEEPING',
        position: 'Camarera',
        employment_type: 'PART_TIME',
        shift_type: 'DAY',
        salary_type: 'HOURLY',
        base_salary: 6.00,
        hire_date: new Date('2024-01-10'),
        date_of_birth: new Date('1995-05-22'),
        is_active: true
      }
    ]

    console.log('📝 Creating staff members...')
    const createdStaff = []
    
    for (const staff of staffData) {
      const created = await prisma.staff.upsert({
        where: { employee_number: staff.employee_number },
        update: {},
        create: {
          ...staff,
          hotel_id: hotel.id,
          created_by: 'system'
        }
      })
      createdStaff.push(created)
      console.log(`  ✅ Created staff: ${staff.first_name} ${staff.last_name} (#${staff.employee_number})`)
    }

    // Create Schedules for this week
    console.log('📅 Creating schedules...')
    const today = new Date()
    const schedulePromises = []

    for (let i = 0; i < 7; i++) {
      const scheduleDate = new Date(today)
      scheduleDate.setDate(today.getDate() + i)
      
      for (const staff of createdStaff) {
        let shiftStart, shiftEnd
        
        if (staff.shift_type === 'DAY') {
          shiftStart = new Date(scheduleDate)
          shiftStart.setHours(8, 0, 0, 0)
          shiftEnd = new Date(scheduleDate)
          shiftEnd.setHours(16, 0, 0, 0)
        } else if (staff.shift_type === 'NIGHT') {
          shiftStart = new Date(scheduleDate)
          shiftStart.setHours(22, 0, 0, 0)
          shiftEnd = new Date(scheduleDate)
          shiftEnd.setHours(6, 0, 0, 0)
          shiftEnd.setDate(shiftEnd.getDate() + 1)
        } else {
          shiftStart = new Date(scheduleDate)
          shiftStart.setHours(14, 0, 0, 0)
          shiftEnd = new Date(scheduleDate)
          shiftEnd.setHours(22, 0, 0, 0)
        }

        schedulePromises.push(
          prisma.staffSchedule.create({
            data: {
              hotel_id: hotel.id,
              staff_id: staff.id,
              schedule_date: scheduleDate,
              shift_start: shiftStart,
              shift_end: shiftEnd,
              schedule_type: 'REGULAR',
              scheduled_hours: 8.00,
              break_minutes: 30,
              status: 'SCHEDULED',
              created_by: 'system'
            }
          })
        )
      }
    }

    await Promise.all(schedulePromises)
    console.log(`  ✅ Created ${schedulePromises.length} schedules`)

    // Create Attendance Records
    console.log('📋 Creating attendance records...')
    const attendancePromises = []

    for (let i = 1; i <= 5; i++) {
      const attendanceDate = new Date(today)
      attendanceDate.setDate(today.getDate() - i)
      
      for (const staff of createdStaff.slice(0, 6)) { // First 6 employees
        const clockIn = new Date(attendanceDate)
        clockIn.setHours(8, Math.floor(Math.random() * 15), 0, 0)
        
        const clockOut = new Date(attendanceDate)
        clockOut.setHours(16, Math.floor(Math.random() * 30), 0, 0)

        attendancePromises.push(
          prisma.staffAttendance.create({
            data: {
              hotel_id: hotel.id,
              staff_id: staff.id,
              attendance_date: attendanceDate,
              clock_in: clockIn,
              clock_out: clockOut,
              scheduled_hours: 8.00,
              actual_hours: 8.00,
              status: 'PRESENT',
              productivity_rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
              created_by: 'system'
            }
          })
        )
      }
    }

    await Promise.all(attendancePromises)
    console.log(`  ✅ Created ${attendancePromises.length} attendance records`)

    // Create Evaluations
    console.log('⭐ Creating evaluations...')
    const evaluationPromises = []

    const evaluationsData = [
      {
        staff: createdStaff[0], // Carlos Rodríguez
        overall_rating: 4.8,
        punctuality: 5,
        quality_of_work: 5,
        teamwork: 5,
        communication: 5,
        initiative: 4,
        reliability: 5,
        customer_service: 5,
        recommendation: 'MAINTAIN'
      },
      {
        staff: createdStaff[1], // María González
        overall_rating: 4.5,
        punctuality: 5,
        quality_of_work: 4,
        teamwork: 5,
        communication: 4,
        initiative: 4,
        reliability: 5,
        customer_service: 5,
        recommendation: 'MAINTAIN'
      },
      {
        staff: createdStaff[2], // José Martínez
        overall_rating: 4.3,
        punctuality: 4,
        quality_of_work: 5,
        teamwork: 4,
        communication: 4,
        initiative: 4,
        reliability: 5,
        customer_service: 4,
        recommendation: 'MAINTAIN'
      }
    ]

    for (const evalData of evaluationsData) {
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 3)
      const endDate = new Date()
      endDate.setDate(endDate.getDate() - 1)

      evaluationPromises.push(
        prisma.staffEvaluation.create({
          data: {
            hotel_id: hotel.id,
            staff_id: evalData.staff.id,
            evaluation_period_start: startDate,
            evaluation_period_end: endDate,
            evaluation_date: new Date(),
            evaluation_type: 'PERFORMANCE',
            evaluator_id: 'system',
            evaluator_name: 'Sistema Administrativo',
            overall_rating: evalData.overall_rating,
            punctuality: evalData.punctuality,
            quality_of_work: evalData.quality_of_work,
            teamwork: evalData.teamwork,
            communication: evalData.communication,
            initiative: evalData.initiative,
            reliability: evalData.reliability,
            customer_service: evalData.customer_service,
            strengths: 'Excelente desempeño en todas las áreas asignadas. Demuestra compromiso y profesionalismo.',
            areas_improvement: 'Continuar desarrollando habilidades de liderazgo.',
            goals_objectives: 'Mantener estándares de calidad y explorar oportunidades de crecimiento.',
            recommendation: evalData.recommendation,
            next_review_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            created_by: 'system'
          }
        })
      )
    }

    await Promise.all(evaluationPromises)
    console.log(`  ✅ Created ${evaluationPromises.length} evaluations`)

    console.log('✅ Staff Management data seeded successfully!')

  } catch (error) {
    console.error('❌ Error seeding Staff Management data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedStaffManagement()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
