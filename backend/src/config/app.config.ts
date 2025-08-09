export default () => ({
  port: parseInt(process.env.PORT ?? '', 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.SECRET_ACCESS_JWT || 'defaultSecretKey',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    dest: process.env.UPLOADED_FILES_DESTINATION,
    domain: process.env.BACKEND_DOMAIN + '\\',
  },
  cache: {
    ttl: process.env.CACHE_TTL
      ? parseInt(process.env.CACHE_TTL) * 60000
      : 5 * 60000,
    max: process.env.CACHE_MAX ? parseInt(process.env.CACHE_MAX) : 100,
  },
  redis: {
    host: process.env.REDIS_HOST,
  },
});
