import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

config(); // Load environment variables

const prisma = new PrismaClient();

async function seedInventory() {
  console.log('🌱 Seeding inventory data...');

  // Get the first hotel
  const hotel = await prisma.hotel.findFirst();
  if (!hotel) {
    console.error('❌ No hotel found. Please run the main seed script first.');
    return;
  }

  const hotelId = hotel.id;

  // Get the first user as creator
  const user = await prisma.user.findFirst({ where: { hotel_id: hotelId } });
  const userId = user?.id || '';

  console.log('✅ Hotel found:', hotel.name);

  // 1. Create categories
  console.log('📁 Creating inventory categories...');
  const categories = await Promise.all([
    prisma.inventoryCategory.create({
      data: {
        hotel_id: hotelId,
        name: 'Amenidades',
        code: 'AMEN',
        description: 'Productos de cortesía para huéspedes',
        display_order: 1,
        created_by: userId
      }
    }),
    prisma.inventoryCategory.create({
      data: {
        hotel_id: hotelId,
        name: 'Alimentos',
        code: 'FOOD',
        description: 'Productos alimenticios',
        display_order: 2,
        created_by: userId
      }
    }),
    prisma.inventoryCategory.create({
      data: {
        hotel_id: hotelId,
        name: 'Bebidas',
        code: 'BEV',
        description: 'Bebidas y refrescos',
        display_order: 3,
        created_by: userId
      }
    }),
    prisma.inventoryCategory.create({
      data: {
        hotel_id: hotelId,
        name: 'Limpieza',
        code: 'CLEAN',
        description: 'Productos de limpieza',
        display_order: 4,
        created_by: userId
      }
    }),
    prisma.inventoryCategory.create({
      data: {
        hotel_id: hotelId,
        name: 'Equipamiento',
        code: 'EQUIP',
        description: 'Equipos y herramientas',
        display_order: 5,
        created_by: userId
      }
    })
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // 2. Create suppliers
  console.log('🏢 Creating suppliers...');
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        hotel_id: hotelId,
        name: 'Distribuidora Nacional C.A.',
        code: 'DIST-001',
        contact_person: 'Carlos Rodríguez',
        email: 'ventas@distribuidora.com',
        phone: '+58 212 555-1234',
        address: 'Av. Principal, Caracas',
        city: 'Caracas',
        country: 'Venezuela',
        tax_id: 'J-12345678-9',
        payment_terms: 'NET_30',
        rating: 4.5,
        created_by: userId
      }
    }),
    prisma.supplier.create({
      data: {
        hotel_id: hotelId,
        name: 'Suministros Hoteleros S.A.',
        code: 'HOT-001',
        contact_person: 'María González',
        email: 'contacto@suministros.com',
        phone: '+58 212 555-5678',
        address: 'Centro Comercial, Las Mercedes',
        city: 'Caracas',
        country: 'Venezuela',
        tax_id: 'J-98765432-1',
        payment_terms: 'NET_15',
        rating: 5.0,
        created_by: userId
      }
    }),
    prisma.supplier.create({
      data: {
        hotel_id: hotelId,
        name: 'Alimentos Frescos C.A.',
        code: 'FOOD-001',
        contact_person: 'José Pérez',
        email: 'pedidos@alimentosfrescos.com',
        phone: '+58 212 555-9012',
        address: 'Zona Industrial, Guarenas',
        city: 'Guarenas',
        country: 'Venezuela',
        tax_id: 'J-11223344-5',
        payment_terms: 'IMMEDIATE',
        rating: 4.0,
        created_by: userId
      }
    })
  ]);

  console.log(`✅ Created ${suppliers.length} suppliers`);

  // 3. Create products
  console.log('📦 Creating inventory products...');
  const products = await Promise.all([
    // Amenities
    prisma.inventoryProduct.create({
      data: {
        hotel_id: hotelId,
        category_id: categories[0].id,
        supplier_id: suppliers[1].id,
        name: 'Champú 30ml',
        sku: 'AMEN-SHAMPOO-30',
        description: 'Champú para cabello 30ml',
        product_type: 'AMENITY',
        unit_type: 'PIECE',
        current_stock: 500,
        minimum_stock: 100,
        reorder_point: 150,
        reorder_quantity: 300,
        cost_price: 0.50,
        selling_price: 1.00,
        storage_location: 'Almacén A1',
        created_by: userId
      }
    }),
    prisma.inventoryProduct.create({
      data: {
        hotel_id: hotelId,
        category_id: categories[0].id,
        supplier_id: suppliers[1].id,
        name: 'Jabón de Tocador',
        sku: 'AMEN-SOAP-40',
        description: 'Jabón de tocador 40g',
        product_type: 'AMENITY',
        unit_type: 'PIECE',
        current_stock: 600,
        minimum_stock: 150,
        reorder_point: 200,
        reorder_quantity: 400,
        cost_price: 0.30,
        selling_price: 0.75,
        storage_location: 'Almacén A1',
        created_by: userId
      }
    }),
    // Food
    prisma.inventoryProduct.create({
      data: {
        hotel_id: hotelId,
        category_id: categories[1].id,
        supplier_id: suppliers[2].id,
        name: 'Café Molido Premium',
        sku: 'FOOD-COFFEE-500',
        description: 'Café molido 500g',
        product_type: 'FOOD',
        unit_type: 'KG',
        current_stock: 50,
        minimum_stock: 10,
        reorder_point: 15,
        reorder_quantity: 30,
        cost_price: 8.50,
        selling_price: 15.00,
        storage_location: 'Almacén B2',
        shelf_life_days: 180,
        created_by: userId
      }
    }),
    prisma.inventoryProduct.create({
      data: {
        hotel_id: hotelId,
        category_id: categories[1].id,
        supplier_id: suppliers[2].id,
        name: 'Azúcar Refinada',
        sku: 'FOOD-SUGAR-1KG',
        description: 'Azúcar refinada 1kg',
        product_type: 'FOOD',
        unit_type: 'KG',
        current_stock: 100,
        minimum_stock: 20,
        reorder_point: 30,
        reorder_quantity: 50,
        cost_price: 2.50,
        selling_price: 4.00,
        storage_location: 'Almacén B2',
        shelf_life_days: 365,
        created_by: userId
      }
    }),
    // Beverages
    prisma.inventoryProduct.create({
      data: {
        hotel_id: hotelId,
        category_id: categories[2].id,
        supplier_id: suppliers[0].id,
        name: 'Agua Mineral 500ml',
        sku: 'BEV-WATER-500',
        description: 'Agua mineral natural 500ml',
        product_type: 'BEVERAGE',
        unit_type: 'BOTTLE',
        current_stock: 300,
        minimum_stock: 50,
        reorder_point: 75,
        reorder_quantity: 200,
        cost_price: 0.75,
        selling_price: 2.00,
        storage_location: 'Almacén C1',
        shelf_life_days: 730,
        created_by: userId
      }
    }),
    prisma.inventoryProduct.create({
      data: {
        hotel_id: hotelId,
        category_id: categories[2].id,
        supplier_id: suppliers[0].id,
        name: 'Refresco Cola 350ml',
        sku: 'BEV-COLA-350',
        description: 'Refresco de cola 350ml',
        product_type: 'BEVERAGE',
        unit_type: 'BOTTLE',
        current_stock: 200,
        minimum_stock: 40,
        reorder_point: 60,
        reorder_quantity: 150,
        cost_price: 1.00,
        selling_price: 3.00,
        storage_location: 'Almacén C1',
        shelf_life_days: 365,
        created_by: userId
      }
    }),
    // Cleaning supplies
    prisma.inventoryProduct.create({
      data: {
        hotel_id: hotelId,
        category_id: categories[3].id,
        supplier_id: suppliers[1].id,
        name: 'Detergente Líquido 5L',
        sku: 'CLEAN-DET-5L',
        description: 'Detergente líquido multiusos 5L',
        product_type: 'SUPPLY',
        unit_type: 'LITER',
        current_stock: 30,
        minimum_stock: 10,
        reorder_point: 15,
        reorder_quantity: 20,
        cost_price: 12.00,
        selling_price: 20.00,
        storage_location: 'Almacén D1',
        created_by: userId
      }
    }),
    prisma.inventoryProduct.create({
      data: {
        hotel_id: hotelId,
        category_id: categories[3].id,
        supplier_id: suppliers[1].id,
        name: 'Desinfectante 1L',
        sku: 'CLEAN-DIS-1L',
        description: 'Desinfectante multiusos 1L',
        product_type: 'SUPPLY',
        unit_type: 'LITER',
        current_stock: 50,
        minimum_stock: 15,
        reorder_point: 20,
        reorder_quantity: 30,
        cost_price: 5.00,
        selling_price: 8.50,
        storage_location: 'Almacén D1',
        created_by: userId
      }
    }),
    // Equipment
    prisma.inventoryProduct.create({
      data: {
        hotel_id: hotelId,
        category_id: categories[4].id,
        supplier_id: suppliers[1].id,
        name: 'Aspiradora Industrial',
        sku: 'EQUIP-VAC-IND',
        description: 'Aspiradora industrial 2000W',
        product_type: 'EQUIPMENT',
        unit_type: 'PIECE',
        current_stock: 5,
        minimum_stock: 2,
        reorder_point: 3,
        reorder_quantity: 2,
        cost_price: 350.00,
        storage_location: 'Almacén E1',
        created_by: userId
      }
    }),
    prisma.inventoryProduct.create({
      data: {
        hotel_id: hotelId,
        category_id: categories[4].id,
        supplier_id: suppliers[1].id,
        name: 'Carrito de Limpieza',
        sku: 'EQUIP-CART-CLEAN',
        description: 'Carrito de limpieza con compartimentos',
        product_type: 'EQUIPMENT',
        unit_type: 'PIECE',
        current_stock: 8,
        minimum_stock: 3,
        reorder_point: 4,
        reorder_quantity: 3,
        cost_price: 120.00,
        storage_location: 'Almacén E1',
        created_by: userId
      }
    })
  ]);

  console.log(`✅ Created ${products.length} products`);

  // 4. Create initial stock movements for each product
  console.log('📊 Creating stock movements...');
  for (const product of products) {
    await prisma.stockMovement.create({
      data: {
        hotel_id: hotelId,
        product_id: product.id,
        movement_type: 'IN',
        quantity: product.current_stock,
        previous_stock: 0,
        new_stock: product.current_stock,
        unit_cost: product.cost_price,
        total_value: product.current_stock.toNumber() * product.cost_price.toNumber(),
        reference_type: 'ADJUSTMENT',
        reason: 'Stock inicial',
        created_by: userId
      }
    });
  }

  console.log(`✅ Created stock movements for ${products.length} products`);

  // 5. Create a sample purchase order
  console.log('📝 Creating sample purchase order...');
  const po = await prisma.purchaseOrder.create({
    data: {
      hotel_id: hotelId,
      supplier_id: suppliers[0].id,
      po_number: 'PO-0001',
      order_date: new Date(),
      expected_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'CONFIRMED',
      subtotal: 500.00,
      tax_amount: 80.00,
      total_amount: 580.00,
      payment_terms: 'NET_30',
      shipping_address: hotel.address,
      notes: 'Orden de compra de prueba',
      created_by: userId,
      items: {
        create: [
          {
            product_id: products[4].id, // Agua Mineral
            line_number: 1,
            quantity_ordered: 200,
            unit_price: 0.75,
            line_total: 150.00,
            tax_rate: 16.00,
            tax_amount: 24.00
          },
          {
            product_id: products[5].id, // Refresco
            line_number: 2,
            quantity_ordered: 150,
            unit_price: 1.00,
            line_total: 150.00,
            tax_rate: 16.00,
            tax_amount: 24.00
          }
        ]
      }
    },
    include: {
      items: true
    }
  });

  console.log(`✅ Created purchase order: ${po.po_number}`);

  console.log('✅ Inventory seeding completed successfully!');
  console.log(`\nInventory Summary:
  - ${categories.length} categories
  - ${suppliers.length} suppliers
  - ${products.length} products
  - 1 purchase order with ${po.items.length} items`);
}

seedInventory()
  .catch((error) => {
    console.error('❌ Error seeding inventory:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
