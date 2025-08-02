import { BadRequestException, Injectable } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import appConfig from 'src/config/app.config';
import { v4 as uuidv4 } from 'uuid';

interface UploadFile {
  fileSize: number;
  folder: string;
}

@Injectable()
export class FileService {
  constructor() {}

  static multerOptions(file: UploadFile): MulterOptions {
    return {
      limits: this.configLimits(file.fileSize),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
      storage: this.configDiskStorage(file.folder),
    };
  }

  static configLimits(fileSize: number) {
    return {
      fileSize: +(fileSize * 1024 * 1024), // mb style size
    };
  }

  static configFileFilter(
    req: any,
    file: Express.Multer.File,
    cb: (error: any, acceptFile: boolean) => void,
  ) {
    const allowedMimeTypes = appConfig().upload.allowedMimeTypes;
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(`Unsupported file type ${file.mimetype}`),
        false,
      );
    }
  }

  static configDiskStorage(folder: string) {
    const destination = `${appConfig().upload.dest}/${folder}`;

    return diskStorage({
      destination: (req, file, callback) => {
        const uploadPath = destination;
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        callback(null, uploadPath);
      },
      filename: (req, file, callback) => {
        const originalname =
          typeof file.originalname === 'string'
            ? file.originalname.replace(/\s+/g, '')
            : '';
        callback(null, `${uuidv4()}-${originalname}`);
      },
    });
  }

  uploadFile(file: Express.Multer.File) {
    if (!file) {
      return null;
    }

    // Tạo thư mục uploads nếu chưa tồn tại
    const uploadDir = path.join(process.cwd(), 'uploads', 'products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Tạo tên file unique
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Lưu file
    fs.writeFileSync(filePath, file.buffer);

    // Trả về đường dẫn tương đối
    return `/uploads/products/${fileName}`;
  }

  deleteFile(url: string, folder?: string) {
    if (url === null) return;
    if (folder !== undefined) {
      fs.unlink(
        `${appConfig().upload.dest}/${url.slice(url.indexOf(folder))}`,
        (err) => err,
      );
    } else {
      fs.unlink(`./dist/${url}`, (err) => err);
    }
  }

  fileFilter = (
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const { fieldname, mimetype } = file;
    if (fieldname === 'image') {
      if (mimetype.match(/\/(jpg|jpeg|png|tiff|jfif)$/))
        return callback(null, true);
    }
    return callback(null, false);
  };
}
