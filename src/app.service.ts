import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Tatoo Store API is running! Welcome to the Tatoo Store API! version: 2025.07.13.16.11';
  }
}
