import { RmqPatterns } from './rmq-patterns';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Transport } from '@nestjs/common/enums/transport.enum';
import {Client, ClientProxy} from '@nestjs/microservices';

@Injectable()
export class AppService implements OnModuleInit {

  @Client({
    transport: Transport.RMQ,
    options: {
        urls: [`amqp://localhost:5672`],
        queue: 'manager_service_queue',
        queueOptions: {durable: false},
    },
  })
  managerQueue: ClientProxy;

  @Client({
      transport: Transport.RMQ,
      options: {
          urls: [`amqp://localhost:5672`],
          queue: 'payment_service_queue',
          queueOptions: {durable: false},
      },
  })
  paymentQueue: ClientProxy;

  async onModuleInit() {
    await Promise.all([this.managerQueue.connect(), this.paymentQueue.connect()]);
    console.log(`[${new Date()}] Connected to RabbitMQ queues...`);
  }

  async preauthorize(userId: string, order) {
    try {
        console.log('Calling Payment service...');
        await this.paymentQueue.send({cmd: RmqPatterns.ORDER_PAYMENT_REQUEST}, {
            userId,
            amount: order.totalPrice,
            orderId: order.orderId,
        }).toPromise();
        console.log('Successfully!');
    } catch (err) {
        console.error(err.message || err, err.stackTrace);
    }
  }

  changeOrderStatus(...params: any) {
    console.log(`${params} order status changed`);
  }
}
