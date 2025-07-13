import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './schemas/log.schema';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

  async createLog(logData: {
    action: string;
    userId: string;
    entityType: string;
    entityId?: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      const log = new this.logModel({
        ...logData,
        timestamp: new Date(),
      });
      return await log.save();
    } catch (error) {
      console.error('Error creating log:', error);
      return null;
    }
  }

  async getLogs(userId?: string, limit: number = 50) {
    const filter = userId ? { userId } : {};
    return this.logModel
      .find(filter)
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async getLogsByEntity(entityType: string, entityId: string) {
    return this.logModel
      .find({ entityType, entityId })
      .sort({ timestamp: -1 })
      .exec();
  }

  async getLogsByAction(action: string, limit: number = 50) {
    return this.logModel
      .find({ action })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async deleteOldLogs(daysOld: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    return this.logModel.deleteMany({
      timestamp: { $lt: cutoffDate }
    });
  }
}
