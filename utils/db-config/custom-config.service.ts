import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomConfigService {
  constructor(private readonly configService: ConfigService) {}

  async get<T>(key: string, defaultValue?: T): Promise<T> {
    const value = this.configService.get<T>(key);

    if (value === undefined || value === null) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`Missing required configuration key: ${key}`);
    }

    return value;
  }
}
