import dotenv from 'dotenv';
console.log("NODE_ENV:", process.env.NODE_ENV);
dotenv.config({
    path:  `./.env.${process.env.NODE_ENV}` 
    
  });

  
const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000
}

export default config;