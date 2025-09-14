/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient, Role, Unit } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Hàm tiện ích để lấy một phần tử ngẫu nhiên từ mảng
function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Hàm để tạo một số ngẫu nhiên trong khoảng
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('🔥 Bắt đầu quá trình seed dữ liệu...');

  // 1. Xóa dữ liệu cũ theo thứ tự phụ thuộc ngược để tránh lỗi khóa ngoại
  console.log('🗑️  Đang xóa dữ liệu cũ...');
  await prisma.saleItem.deleteMany();
  await prisma.saleTransaction.deleteMany();
  await prisma.receiptItem.deleteMany();
  await prisma.goodsReceipt.deleteMany();
  // Prisma sẽ tự động xóa các bản ghi trong bảng join `_ProductSuppliers` khi Product bị xóa
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Xóa dữ liệu cũ thành công.');

  // 2. Tạo dữ liệu cơ bản
  console.log('🌱 Đang tạo dữ liệu cơ bản (Users, Categories, Suppliers)...');
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Tạo Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        fullName: 'Quản Trị Viên',
        role: Role.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        username: 'manager01',
        password: hashedPassword,
        fullName: 'Nguyễn Văn Quản Lý A',
        role: Role.MANAGER,
      },
    }),
    prisma.user.create({
      data: {
        username: 'manager02',
        password: hashedPassword,
        fullName: 'Nguyễn Thị Quản Lý B',
        role: Role.MANAGER,
      },
    }),
    prisma.user.create({
      data: {
        username: 'staff01',
        password: hashedPassword,
        fullName: 'Trần Thị Nhân Viên 1',
        role: Role.STAFF,
      },
    }),
    prisma.user.create({
      data: {
        username: 'staff02',
        password: hashedPassword,
        fullName: 'Lê Văn Nhân Viên 2',
        role: Role.STAFF,
      },
    }),
    prisma.user.create({
      data: {
        username: 'staff03',
        password: hashedPassword,
        fullName: 'Phạm Thị Nhân Viên 3',
        role: Role.STAFF,
      },
    }),
  ]);

  // Tạo Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Mì & Phở ăn liền' } }),
    prisma.category.create({ data: { name: 'Đồ uống & Nước giải khát' } }),
    prisma.category.create({ data: { name: 'Bánh kẹo & Snack' } }),
    prisma.category.create({ data: { name: 'Sữa & Các sản phẩm từ sữa' } }),
    prisma.category.create({ data: { name: 'Hóa phẩm & Chăm sóc cá nhân' } }),
    prisma.category.create({ data: { name: 'Gia vị & Phụ gia nấu ăn' } }),
    prisma.category.create({ data: { name: 'Thực phẩm đông lạnh' } }),
  ]);

  // Tạo Suppliers
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: 'Công ty Acecook Việt Nam',
        contactInfo: 'Hotline: 1800 6155',
      },
    }),
    prisma.supplier.create({
      data: { name: 'PepsiCo Việt Nam', contactInfo: 'Hotline: 028 5412 3456' },
    }),
    prisma.supplier.create({
      data: { name: 'Tập đoàn Orion', contactInfo: 'Hotline: 1800 5555' },
    }),
    prisma.supplier.create({
      data: { name: 'Công ty Vinamilk', contactInfo: 'Hotline: 1900 636 979' },
    }),
    prisma.supplier.create({
      data: { name: 'Unilever Việt Nam', contactInfo: 'Hotline: 1900 636 078' },
    }),
    prisma.supplier.create({
      data: { name: 'Masan Consumer', contactInfo: 'Hotline: 1800 6968' },
    }),
  ]);

  console.log('✅ Tạo dữ liệu cơ bản thành công.');

  // 3. Tạo dữ liệu lớn trong một giao dịch (transaction) để đảm bảo tính toàn vẹn
  const productLoopCount = 1000; // TẠO 1000 SẢN PHẨM
  console.log(
    `🚀 Bắt đầu tạo ${productLoopCount} sản phẩm và dữ liệu liên quan trong một transaction...`,
  );

  try {
    // Tăng thời gian chờ của transaction lên 5 phút (300000 ms)
    await prisma.$transaction(
      async (tx) => {
        const staffIds = (
          await tx.user.findMany({
            where: { role: 'STAFF' },
            select: { id: true },
          })
        ).map((u) => u.id);
        const managerIds = (
          await tx.user.findMany({
            where: { role: 'MANAGER' },
            select: { id: true },
          })
        ).map((u) => u.id);
        const categoryIds = (
          await tx.category.findMany({ select: { id: true } })
        ).map((c) => c.id);
        const supplierIds = (
          await tx.supplier.findMany({ select: { id: true } })
        ).map((s) => s.id);
        const units = Object.values(Unit);

        for (let i = 1; i <= productLoopCount; i++) {
          const importPrice = new Decimal(getRandomInt(1000, 50000));
          const sellingPrice = importPrice
            .mul(new Decimal(1 + getRandomInt(20, 50) / 100))
            .toDecimalPlaces(2);

          // Tạo sản phẩm
          const product = await tx.product.create({
            data: {
              name: `Sản phẩm ${i}`,
              sku: `SKU${String(i).padStart(5, '0')}`,
              description: `Mô tả chi tiết cho sản phẩm ${i}`,
              price: sellingPrice,
              unit: getRandomElement(units),
              imageUrl: `https://picsum.photos/seed/${i}/400/400`,
              categoryId: getRandomElement(categoryIds),
              suppliers: {
                connect: { id: getRandomElement(supplierIds) },
              },
            },
          });

          // Với mỗi sản phẩm, tạo 2-6 lần nhập kho
          const receiptsPerProduct = getRandomInt(2, 6);
          for (let j = 0; j < receiptsPerProduct; j++) {
            const receiptQuantity = getRandomInt(50, 250);
            const receiptDate = new Date(
              Date.now() - getRandomInt(0, 365) * 24 * 60 * 60 * 1000,
            );

            // Quyết định bán bao nhiêu % của lô hàng này
            const soldQuantity = Math.floor(
              receiptQuantity * (getRandomInt(10, 100) / 100),
            );

            // Tạo GoodsReceipt và ReceiptItem lồng nhau
            const goodsReceipt = await tx.goodsReceipt.create({
              data: {
                totalAmount: importPrice.mul(receiptQuantity),
                supplierId: getRandomElement(supplierIds),
                userId: getRandomElement(managerIds),
                createdAt: receiptDate,
                items: {
                  create: {
                    quantity: receiptQuantity,
                    remainingQuantity: receiptQuantity - soldQuantity,
                    importPrice: importPrice,
                    expiryDate: new Date(
                      receiptDate.getTime() + 6 * 30 * 24 * 60 * 60 * 1000,
                    ), // HSD 6 tháng
                    productId: product.id,
                  },
                },
              },
            });

            // Tạo các giao dịch bán hàng để khớp với số lượng đã bán
            let totalSoldForThisReceipt = 0;
            while (totalSoldForThisReceipt < soldQuantity) {
              const currentSaleQuantity = Math.min(
                getRandomInt(1, 10),
                soldQuantity - totalSoldForThisReceipt,
              );
              const saleDate = new Date(
                receiptDate.getTime() +
                  getRandomInt(1, 90) * 24 * 60 * 60 * 1000,
              );

              // Tạo SaleTransaction và SaleItem lồng nhau
              await tx.saleTransaction.create({
                data: {
                  totalAmount: sellingPrice.mul(currentSaleQuantity),
                  userId: getRandomElement(staffIds),
                  createdAt: saleDate,
                  items: {
                    create: {
                      quantity: currentSaleQuantity,
                      priceAtSale: sellingPrice,
                      productId: product.id,
                    },
                  },
                },
              });
              totalSoldForThisReceipt += currentSaleQuantity;
            }
          }
          if (i % 100 === 0) {
            console.log(`⏳ Đã xử lý ${i}/${productLoopCount} sản phẩm...`);
          }
        }
      },
      {
        timeout: 300000, // 5 phút timeout
      },
    );

    console.log('✅ Giao dịch hoàn tất. Dữ liệu lớn đã được tạo thành công!');
  } catch (e) {
    console.error(
      '❌ Đã xảy ra lỗi trong quá trình transaction, dữ liệu đã được rollback.',
    );
    console.error(e);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('👋 Đã ngắt kết nối Prisma.');
  });
