import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Transport} from '@nestjs/microservices';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const microservice = app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://localhost:5672`],
      queue: 'payment_service_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  const options = new DocumentBuilder()
    .setTitle('Sample')
    .setDescription('')
    .setVersion('1.0')
    .addTag('')
    .addBearerAuth('Authorization', 'header')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('manager-service/swagger-ui', app, document);
  await app.startAllMicroservicesAsync();
  await app.listen(3001);

}
bootstrap();
