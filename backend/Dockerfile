# Sử dụng Node 20 Alpine
FROM node:20-alpine

# Cài thêm openssl (cần cho Prisma & bcrypt)
RUN apk add --no-cache openssl

# Thư mục làm việc
WORKDIR /usr/src/app

# Copy file package và lock trước
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS
RUN npm run build

# Mở port API
EXPOSE 3000

# Chạy ở chế độ production
CMD ["npm", "run", "start:dev"]
