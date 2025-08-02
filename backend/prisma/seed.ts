import { PrismaClient, Role, Unit } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}
async function main() {
  await prisma.saleItem.deleteMany();
  await prisma.saleTransaction.deleteMany();
  await prisma.receiptItem.deleteMany();
  await prisma.goodsReceipt.deleteMany();
  // Prisma sẽ tự động xóa các bản ghi trong bảng join `_ProductSuppliers` khi Product bị xóa
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  // Tạo users
  const hashedPassword = await hashPassword('123456');
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword, // Mật khẩu đã băm (ví dụ: "admin123")
      fullName: 'Quản Trị Viên',
      role: Role.ADMIN,
    },
  });

  const manager = await prisma.user.create({
    data: {
      username: 'manager01',
      password: hashedPassword,
      fullName: 'Nguyễn Văn Quản Lý',
      role: Role.MANAGER,
    },
  });

  const staff = await prisma.user.create({
    data: {
      username: 'nhanvien1',
      password: hashedPassword, // Mật khẩu đã băm
      fullName: 'Trần Thị Nhân Viên',
      role: Role.STAFF,
    },
  });

  // Tạo categories
  const instantNoodles = await prisma.category.create({
    data: { name: 'Mì ăn liền' },
  });

  const beverages = await prisma.category.create({
    data: { name: 'Đồ uống' },
  });

  // Tạo suppliers
  const acecook = await prisma.supplier.create({
    data: {
      name: 'Công ty Acecook Việt Nam',
      contactInfo: 'Hotline: 1800 6155',
    },
  });

  const pepsiCo = await prisma.supplier.create({
    data: {
      name: 'PepsiCo Việt Nam',
      contactInfo: 'Hotline: 028 5412 3456',
    },
  });

  // Tạo products
  const miHaoHao = await prisma.product.create({
    data: {
      name: 'Mì Hảo Hảo tôm chua cay 75g',
      sku: 'MHH01',
      description: 'Mì ăn liền Hảo Hảo vị tôm chua cay, gói 75g',
      price: new Decimal(4500), // Giá bán lẻ mỗi gói
      unit: Unit.PACK,
      imageUrl: 'https://example.com/mi-hao-hao.jpg',
      categoryId: instantNoodles.id,
      suppliers: {
        connect: [{ id: acecook.id }],
      },
    },
  });

  const pepsiCan = await prisma.product.create({
    data: {
      name: 'Pepsi Lon 330ml',
      sku: 'PEPSI01',
      description: 'Pepsi lon 330ml',
      price: new Decimal(10000),
      unit: Unit.CAN,
      imageUrl: 'https://example.com/pepsi.jpg',
      categoryId: beverages.id,
      suppliers: {
        connect: [{ id: pepsiCo.id }],
      },
    },
  });

  // Tạo goods receipt (nhập kho) - 1 thùng mì = 30 gói
  const receiptDate = new Date();
  const goodsReceipt = await prisma.goodsReceipt.create({
    data: {
      totalAmount: new Decimal(30 * 3000), // Giả sử giá nhập mỗi gói 3,000đ
      supplierId: acecook.id,
      userId: manager.id,
      createdAt: receiptDate,
      items: {
        create: [
          {
            quantity: 30,
            remainingQuantity: 30, // Ban đầu = tổng nhập
            importPrice: new Decimal(3000), // Giá nhập mỗi gói
            expiryDate: new Date('2025-12-31'),
            productId: miHaoHao.id,
          },
          {
            quantity: 24, // 1 thùng Pepsi 24 lon
            remainingQuantity: 24,
            importPrice: new Decimal(8000), // Giá nhập mỗi lon
            expiryDate: new Date('2024-12-31'),
            productId: pepsiCan.id,
          },
        ],
      },
    },
    include: { items: true },
  });

  // Tạo sale transaction (bán 10 gói mì)
  const saleDate = new Date();
  const saleTransaction = await prisma.saleTransaction.create({
    data: {
      totalAmount: new Decimal(10 * 4500), // 10 gói x 4,500đ
      userId: staff.id,
      createdAt: saleDate,
      items: {
        create: [
          {
            quantity: 10,
            priceAtSale: new Decimal(4500), // Giá bán tại thời điểm
            productId: miHaoHao.id,
          },
        ],
      },
    },
  });

  // Cập nhật tồn kho sau khi bán (giảm remainingQuantity)
  const receiptItem = goodsReceipt.items.find(
    (i) => i.productId === miHaoHao.id,
  );
  if (receiptItem) {
    await prisma.receiptItem.update({
      where: { id: receiptItem.id },
      data: {
        remainingQuantity: receiptItem.remainingQuantity - 10,
      },
    });
  }

  console.log('Dữ liệu seed đã được tạo thành công!');
  console.table({
    'Mì Hảo Hảo sau khi bán': `Tồn kho: ${receiptItem ? receiptItem.remainingQuantity - 10 : 'N/A'} gói`,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
