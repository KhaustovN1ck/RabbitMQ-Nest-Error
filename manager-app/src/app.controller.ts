import {RmqPatterns} from './rmq-patterns';
import {Get, Controller} from '@nestjs/common';
import {AppService} from './app.service';
import {MessagePattern} from '@nestjs/microservices';
import {ApiUseTags, ApiOperation} from '@nestjs/swagger';

@ApiUseTags('orders')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * This action is dispatched from another service
   */
  @MessagePattern({cmd: RmqPatterns.ORDER_CREATED})
  async orderCreated(orderId: string) {
    console.log(`Have new order ${orderId}`);
  }

  @MessagePattern({cmd: RmqPatterns.ORDER_PAYMENT_APPROVED})
  async orderApproved(paymentStatusDto: any) {
    console.log(`Received approve from PS`);
    this
      .appService
      .changeOrderStatus(paymentStatusDto.status, paymentStatusDto.userId, paymentStatusDto.orderId, paymentStatusDto.reason);
  }

  @Get('/run')

  @ApiOperation({title: 'Run this method '})
  async run() {
    await this.appService.preauthorize('userId', {
      totalPrice: 10000,
      orderId: '1234-1234-1234-1234',
    });
  }
}
