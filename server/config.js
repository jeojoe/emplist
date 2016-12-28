const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/emplist',
  port: process.env.PORT || 8000,
  autoIndex: process.env.NODE_ENV !== 'production',
};

export default config;
