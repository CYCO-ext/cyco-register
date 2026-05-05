export interface IEventProducer {
  publish(topic: string, message: any): Promise<void>;
}

export const IEventProducerToken = 'IEventProducerToken';
