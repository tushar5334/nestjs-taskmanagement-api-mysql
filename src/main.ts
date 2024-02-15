import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { ValidationError, useContainer } from 'class-validator';
import { TransformInterceptor } from './transform.interceptor';
async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: (errors: ValidationError[] = []) => {
      const errorMessages = {};
      errors.forEach(error => {
        errorMessages[error.property] = Object.values(error.constraints).join(', ').trim();
      });
      return new BadRequestException(errorMessages);
    }
  }));
  app.enableCors();
  // enable DI for class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const port = process.env.PORT;
  await app.listen(port);
  logger.log(`Application listening on ${port}`);
}
bootstrap();

