import { RmqPatterns } from './rmq-patterns';
import { Injectable, OnModuleInit } from '@nestjs/common';
import {Client, ClientProxy, Transport} from '@nestjs/microservices';

@Injectable()
export class AppService implements OnModuleInit {

  onModuleInit() {
      // tslint:disable-next-line:no-console
    console.log(`[${new Date()}] Connected to RabbitMQ...`);
  }

  @Client({
      transport: Transport.RMQ,
      options: {
          urls: [`amqp://localhost:5672`],
          queue: 'manager_service_queue',
          queueOptions: {durable: false},
      },
  })
  managerQueue: ClientProxy;

  async rejectPayment(reason: any, orderId: string, userId: string) {
    const body = {
      orderId,
      userId,
    };
    try {
        console.log(`Payment rejected ${orderId}. Informing manager service...`);
        await this.managerQueue.send({cmd: RmqPatterns.ORDER_PAYMENT_REJECTED}, body).toPromise();
    } catch (err) {
        console.error(err.message || err, err.stackTrace);
    }
}

submitPayment(orderId: string, userId: string) {
  console.log(orderId, userId);
}

async approvePayment(orderId: string, userId: string) {
    const body = {
      orderId,
      userId,
    };
    try {
        console.log(`Payment approved ${orderId}. Informing manager service...`);
        this.managerQueue.send({cmd: RmqPatterns.ORDER_PAYMENT_APPROVED}, body).toPromise();
    } catch (err) {
        console.error(err.message || err, err.stackTrace);
    }
}
}
