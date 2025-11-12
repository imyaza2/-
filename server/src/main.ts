
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS to allow requests from the admin panel frontend
  app.enableCors();

  await app.listen(3000);
  console.log('Server is running on http://localhost:3000');
}
bootstrap();