// prisma/seed.ts

import { PrismaClient, Role, Unit } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Decimal } from '@prisma/client/runtime/library';

// Khởi tạo Prisma Client
const prisma = new PrismaClient();

// Hàm hash mật khẩu
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  console.log('🚀 Bắt đầu quá trình seeding...');

  // --- DỌN DẸP DATABASE (Tùy chọn nhưng khuyến khích) ---
  // Xóa theo thứ tự ngược lại để tránh lỗi khóa ngoại
  console.log('🔥 Dọn dẹp database cũ...');
  await prisma.saleItem.deleteMany();
  await prisma.saleTransaction.deleteMany();
  await prisma.receiptItem.deleteMany();
  await prisma.goodsReceipt.deleteMany();
  // Prisma sẽ tự động xóa các bản ghi trong bảng join `_ProductSuppliers` khi Product bị xóa
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Database đã được dọn dẹp.');

  // --- 1. TẠO USERS ---
  console.log('👤 Tạo người dùng...');
  const hashedPassword = await hashPassword('123456'); // Mật khẩu chung cho tất cả
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      fullName: 'Quản Trị Viên',
      role: Role.ADMIN,
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      username: 'manager01',
      password: hashedPassword,
      fullName: 'Nguyễn Văn Quản Lý',
      role: Role.MANAGER,
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      username: 'staff01',
      password: hashedPassword,
      fullName: 'Trần Thị Nhân Viên',
      role: Role.STAFF,
    },
  });
  console.log('✅ Đã tạo người dùng.');

  // --- 2. TẠO CATEGORIES ---
  console.log('📚 Tạo danh mục sản phẩm...');
  const beverageCategory = await prisma.category.create({
    data: { name: 'Đồ uống' },
  });
  const foodCategory = await prisma.category.create({
    data: { name: 'Thực phẩm khô' },
  });
  const householdCategory = await prisma.category.create({
    data: { name: 'Đồ gia dụng' },
  });
  console.log('✅ Đã tạo danh mục.');

  // --- 3. TẠO SUPPLIERS ---
  console.log('🚚 Tạo nhà cung cấp...');
  const supplierA = await prisma.supplier.create({
    data: {
      name: 'Công ty Nước Giải Khát Tân Hiệp Phát',
      contactInfo: '02743755161',
    },
  });
  const supplierB = await prisma.supplier.create({
    data: { name: 'Acecook Việt Nam', contactInfo: '02838154064' },
  });
  const supplierC = await prisma.supplier.create({
    data: { name: 'Tổng kho Gia Dụng Miền Nam', contactInfo: '0987654321' },
  });
  console.log('✅ Đã tạo nhà cung cấp.');

  // --- 4. TẠO PRODUCTS ---
  console.log('📦 Tạo sản phẩm...');
  const product1 = await prisma.product.create({
    data: {
      name: 'Nước tăng lực Number 1',
      sku: 'NUOC_001',
      price: new Decimal('10000.00'),
      unit: Unit.BOTTLE,
      categoryId: beverageCategory.id,
      suppliers: {
        connect: [{ id: supplierA.id }], // Kết nối với nhà cung cấp
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Mì Hảo Hảo Tôm Chua Cay',
      sku: 'MI_001',
      price: new Decimal('4500.00'),
      unit: Unit.PACK,
      categoryId: foodCategory.id,
      suppliers: {
        connect: [{ id: supplierB.id }],
      },
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Thùng mì Hảo Hảo',
      sku: 'MI_002',
      price: new Decimal('125000.00'),
      unit: Unit.CARTON,
      categoryId: foodCategory.id,
      suppliers: {
        connect: [{ id: supplierB.id }],
      },
    },
  });

  const product4 = await prisma.product.create({
    data: {
      name: 'Nước rửa chén Sunlight Chanh',
      sku: 'GD_001',
      price: new Decimal('22000.00'),
      unit: Unit.BOTTLE,
      categoryId: householdCategory.id,
      suppliers: {
        connect: [{ id: supplierC.id }],
      },
    },
  });
  console.log('✅ Đã tạo sản phẩm.');

  // --- 5. TẠO PHIẾU NHẬP HÀNG (GoodsReceipt) ---
  console.log('📥 Tạo phiếu nhập hàng...');
  await prisma.goodsReceipt.create({
    data: {
      supplierId: supplierB.id,
      userId: managerUser.id,
      totalAmount: new Decimal('5000000.00'), // 40 thùng * 125000
      items: {
        create: [
          {
            productId: product3.id,
            quantity: 40,
            remainingQuantity: 40,
            importPrice: new Decimal('125000.00'),
            expiryDate: new Date('2026-12-31'),
          },
        ],
      },
    },
  });

  await prisma.goodsReceipt.create({
    data: {
      supplierId: supplierA.id,
      userId: managerUser.id,
      totalAmount: new Decimal('800000.00'), // 100 chai * 8000
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 100,
            remainingQuantity: 100,
            importPrice: new Decimal('8000.00'),
          },
        ],
      },
    },
  });
  console.log('✅ Đã tạo phiếu nhập hàng.');

  // --- 6. TẠO GIAO DỊCH BÁN HÀNG (SaleTransaction) ---
  console.log('💰 Tạo giao dịch bán hàng...');
  const saleTotalAmount = product2.price.mul(10).add(product1.price.mul(2));
  await prisma.saleTransaction.create({
    data: {
      userId: staffUser.id,
      totalAmount: saleTotalAmount,
      items: {
        create: [
          {
            productId: product2.id, // Mì gói
            quantity: 10,
            priceAtSale: product2.price,
          },
          {
            productId: product1.id, // Nước tăng lực
            quantity: 2,
            priceAtSale: product1.price,
          },
        ],
      },
    },
  });
  console.log('✅ Đã tạo giao dịch bán hàng.');
}

// Chạy hàm main và xử lý lỗi
main()
  .catch((e) => {
    console.error('❌ Đã xảy ra lỗi trong quá trình seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Đảm bảo ngắt kết nối Prisma Client
    await prisma.$disconnect();
    console.log('👋 Đã ngắt kết nối Prisma Client. Seeding hoàn tất!');
  });
