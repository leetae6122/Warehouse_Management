export default () => ({
  port: parseInt(process.env.PORT ?? '', 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.SECRET_ACCESS_JWT || 'defaultSecretKey',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
});
