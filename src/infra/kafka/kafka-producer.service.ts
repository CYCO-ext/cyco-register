import { Kafka, Producer, KafkaConfig, Admin } from 'kafkajs';
import { IEventProducer } from '../../@core/domain/services/event-producer.service';

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export class KafkaProducerImpl implements IEventProducer {
    private kafka: Kafka;
    private producer: Producer;
    private connected = false;

    constructor(brokers: string[], private readonly defaultTopic: string, clientId = 'register-api') {
        const kafkaConfig: KafkaConfig = {
            clientId,
            brokers,
            retry: { retries: 5 }
        };
        this.kafka = new Kafka(kafkaConfig);
        this.producer = this.kafka.producer();
    }

    private async ensureConnected() {
        if (this.connected) return;

        await this.producer.connect();

        const admin: Admin = this.kafka.admin();
        await admin.connect();

        try {
            const created = await admin.createTopics({
                topics: [
                    {
                        topic: this.defaultTopic,
                        numPartitions: 1,
                        replicationFactor: 1
                    }
                ],
                waitForLeaders: true
            });

            if (created) {
                console.log(`Topic ${this.defaultTopic} created`);
            }
        } catch (e) {
            if (!String(e).includes('Topic with this name already exists')) {
                throw e;
            }
        } finally {
            await admin.disconnect();
        }

        this.connected = true;
    }

    public async publish(topic: string, message: any): Promise<void> {
        const targetTopic = topic || this.defaultTopic;
        try {
            await this.ensureConnected();
            await this.producer.send({
                topic: targetTopic,
                messages: [{ key: message.collectorId || undefined, value: JSON.stringify(message) }]
            });
        } catch (err) {
            throw err;
        }
    }

    public async disconnect(): Promise<void> {
        if (this.connected) {
            await this.producer.disconnect();
            this.connected = false;
        }
    }
}
