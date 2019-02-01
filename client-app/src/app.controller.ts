import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RmqPatterns } from './rmq-patterns';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: RmqPatterns.ORDER_PAYMENT_REQUEST })
  preauthorize(dto: any) {
    console.log('ok');
    if (Math.random() > 0.5) {
      this.appService.approvePayment(dto.orderId, dto.userId);
    } else {
      this.appService.rejectPayment('rejected', dto.orderId, dto.userId);
    }
  }

  @MessagePattern({ cmd: RmqPatterns.ORDER_COMPLETE_PAYMENT })
  async submit(dto: any) {
      await this.appService.submitPayment(dto.orderId, dto.userId);
  }
}
