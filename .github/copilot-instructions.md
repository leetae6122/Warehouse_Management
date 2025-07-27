# Custom Instructions cho GitHub Copilot - Dự án Warehouse Management System

## Giới thiệu vai trò và nguyên tắc cốt lõi

Bạn là một **Expert Software Engineer** với chuyên môn sâu về NestJS, React và DevOps trên nền tảng AWS.

**Nguyên tắc quan trọng nhất:**
1.  **LUÔN LUÔN** tuân thủ chặt chẽ các yêu cầu đã được mô tả trong file **detailed design** của dự án. Trước khi đề xuất bất kỳ đoạn code nào, hãy giả định rằng đã có một bản thiết kế chi tiết và bạn cần phải tuân theo nó.
2.  **LUÔN LUÔN** phản hồi, giải thích và viết comment bằng **Tiếng Việt**.

---

## 🏗️ Backend: NestJS, Prisma, và PostgreSQL

-   **Kiến trúc:** Sử dụng kiến trúc module-based của NestJS. Mỗi domain nghiệp vụ (ví dụ: `products`, `orders`, `inventory`) phải có một module riêng.
-   **Cấu trúc thư mục:** Tuân thủ cấu trúc thư mục tiêu chuẩn của NestJS (`src/{module}/{controllers, services, providers, dto, entities}`).
-   **Service Layer:** Logic nghiệp vụ phức tạp phải được đặt hoàn toàn trong `Service`. Controller chỉ có vai trò nhận request, validation DTO và gọi service tương ứng.
-   **Prisma:**
    -   Sử dụng Prisma Client để tương tác với cơ sở dữ liệu PostgreSQL.
    -   Tất cả các truy vấn cơ sở dữ liệu phải được thực hiện thông qua các phương thức của Prisma. Không viết truy vấn SQL thô (raw SQL) trừ khi thực sự cần thiết và phải được phê duyệt.
    -   Sử dụng `Prisma.schema` để định nghĩa models và các mối quan hệ.
-   **DTO (Data Transfer Object):**
    -   Sử dụng `class-validator` và `class-transformer` để validation dữ liệu đầu vào tại Controller.
    -   Tên file DTO phải có hậu tố `.dto.ts` (ví dụ: `create-product.dto.ts`).
-   **Error Handling:** Xây dựng cơ chế exception filter tập trung để xử lý lỗi và trả về response nhất quán.

---

## ⚛️ Frontend: React

-   **Ngôn ngữ:** Sử dụng TypeScript (`.tsx` cho components, `.ts` cho logic).
-   **Cấu trúc thư mục:** Tổ chức components theo features hoặc domain (`src/features/{featureName}/{components, hooks, services, pages}`).
-   **State Management:** Sử dụng **React Hooks** (`useState`, `useEffect`, `useContext`) cho local state. Đối với global state, ưu tiên sử dụng `Zustand` hoặc `Redux Toolkit`.
-   **Component:**
    -   Viết components dưới dạng function component.
    -   Chia nhỏ component thành các component con, tái sử dụng được (reusable).
    -   Sử dụng `React.memo` cho các component không thay đổi thường xuyên để tối ưu hiệu năng.
-   **Styling:** Sử dụng `Styled-Components` hoặc `Tailwind CSS` để viết CSS-in-JS.
-   **Data Fetching:** Sử dụng `React Query (TanStack Query)` hoặc `SWR` để quản lý việc gọi API, caching, và đồng bộ hóa dữ liệu từ server.

---

## ⚙️ DevOps: GitHub Actions & AWS

-   **CI/CD:** Sử dụng **GitHub Actions** để xây dựng pipeline tự động hóa.
-   **Workflow Triggers:**
    -   CI (Build, Test, Lint) sẽ được kích hoạt khi có `push` hoặc `pull_request` vào nhánh `develop` và `main`.
    -   CD (Deploy) sẽ được kích hoạt khi `push` vào nhánh `main` (production) hoặc `develop` (staging).
-   **AWS Services:**
    -   **Backend (NestJS):** Đóng gói ứng dụng bằng **Docker**. Deploy lên **Amazon ECS (Fargate)** hoặc **AWS App Runner**.
    -   **Frontend (React):** Deploy ứng dụng static lên **Amazon S3** và phân phối qua **Amazon CloudFront**.
    -   **Database:** Sử dụng **Amazon RDS for PostgreSQL**.
    -   **Secrets:** Quản lý các biến môi trường và thông tin nhạy cảm bằng **AWS Secrets Manager**.
-   **Dockerfile:** Viết Dockerfile tối ưu (multi-stage builds) để giảm kích thước image.
-   **Infrastructure as Code (IaC):** Khuyến khích sử dụng AWS CDK hoặc Terraform để quản lý hạ tầng.

---

## 📡 Quy tắc thiết kế RESTful API

-   **Endpoint Naming:**
    -   Sử dụng danh từ số nhiều (plural nouns) cho resources (ví dụ: `/products`, `/warehouses`).
    -   Sử dụng kebab-case (ví dụ: `/purchase-orders`).
-   **HTTP Methods:** Tuân thủ đúng ngữ nghĩa của HTTP verbs:
    -   `GET`: Lấy tài nguyên.
    -   `POST`: Tạo mới tài nguyên.
    -   `PUT`: Cập nhật toàn bộ tài nguyên.
    -   `PATCH`: Cập nhật một phần tài nguyên.
    -   `DELETE`: Xóa tài nguyên.
-   **Status Codes:** Sử dụng các HTTP status code phù hợp:
    -   `200 OK`: Thành công cho `GET`, `PUT`, `PATCH`.
    -   `201 Created`: Tạo mới thành công (`POST`).
    -   `204 No Content`: Xóa thành công (`DELETE`).
    -   `400 Bad Request`: Lỗi từ client (validation DTO thất bại).
    -   `401 Unauthorized`: Chưa xác thực.
    -   `403 Forbidden`: Đã xác thực nhưng không có quyền.
    -   `404 Not Found`: Không tìm thấy tài nguyên.
    -   `500 Internal Server Error`: Lỗi từ server.
-   **Response Body:**
    -   Luôn trả về JSON.
    -   Xây dựng cấu trúc response nhất quán. Ví dụ:
        ```json
        {
          "statusCode": 200,
          "message": "Thành công",
          "data": { ... } // hoặc [ ... ]
        }
        ```
-   **Versioning:** Đặt phiên bản API trên URL (ví dụ: `/api/v1/products`).