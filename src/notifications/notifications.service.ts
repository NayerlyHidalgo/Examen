import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument, NotificationStatus, NotificationType } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification(data: {
    title: string;
    message: string;
    type: NotificationType;
    userId?: string;
    userEmail?: string;
    orderNumber?: string;
    productId?: string;
    metadata?: Record<string, any>;
  }): Promise<Notification> {
    const notification = new this.notificationModel(data);
    return notification.save();
  }

  async findAll(filter?: any): Promise<Notification[]> {
    return this.notificationModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findByUser(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findByStatus(status: NotificationStatus): Promise<Notification[]> {
    return this.notificationModel.find({ status }).sort({ createdAt: -1 }).exec();
  }

  async findByType(type: NotificationType): Promise<Notification[]> {
    return this.notificationModel.find({ type }).sort({ createdAt: -1 }).exec();
  }

  async markAsSent(notificationId: string): Promise<Notification | null> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { 
        status: NotificationStatus.SENT,
        sentAt: new Date(),
      },
      { new: true }
    );
  }

  async markAsRead(notificationId: string): Promise<Notification | null> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { 
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
      { new: true }
    );
  }

  async markAsFailed(notificationId: string): Promise<Notification | null> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { status: NotificationStatus.FAILED },
      { new: true }
    );
  }

  async deleteOldNotifications(daysOld: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    await this.notificationModel.deleteMany({
      createdAt: { $lt: cutoffDate },
    });
  }

  // Métodos de conveniencia
  async notifyOrderConfirmation(orderNumber: string, userEmail: string): Promise<Notification> {
    return this.createNotification({
      title: 'Orden Confirmada',
      message: `Tu orden ${orderNumber} ha sido confirmada exitosamente`,
      type: NotificationType.ORDER_CONFIRMATION,
      userEmail,
      orderNumber,
    });
  }

  async notifyPaymentSuccess(orderNumber: string, userEmail: string): Promise<Notification> {
    return this.createNotification({
      title: 'Pago Exitoso',
      message: `El pago de tu orden ${orderNumber} ha sido procesado exitosamente`,
      type: NotificationType.PAYMENT_SUCCESS,
      userEmail,
      orderNumber,
    });
  }

  async notifyPaymentFailed(orderNumber: string, userEmail: string): Promise<Notification> {
    return this.createNotification({
      title: 'Pago Fallido',
      message: `El pago de tu orden ${orderNumber} no pudo ser procesado`,
      type: NotificationType.PAYMENT_FAILED,
      userEmail,
      orderNumber,
    });
  }

  async notifyWelcome(userEmail: string): Promise<Notification> {
    return this.createNotification({
      title: 'Bienvenido a Tattoo Shop',
      message: 'Gracias por registrarte en nuestra tienda de implementos de tatuaje',
      type: NotificationType.WELCOME,
      userEmail,
    });
  }
}
