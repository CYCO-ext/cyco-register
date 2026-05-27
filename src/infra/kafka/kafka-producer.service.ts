import { Kafka, Producer, KafkaConfig, Admin, SASLMechanism, SASLOptions } from 'kafkajs';
import { readFileSync } from 'node:fs';
import { IEventProducer } from '../../@core/domain/services/event-producer.service';

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getKafkaSaslConfig(): SASLOptions | undefined {
    const username = process.env.KAFKA_SASL_USERNAME;
    const password = process.env.KAFKA_SASL_PASSWORD;

    if (!username || !password) return undefined;

    const mechanism = (process.env.KAFKA_SASL_MECHANISM || 'plain') as SASLMechanism;

    switch (mechanism) {
        case 'plain':
            return { mechanism, username, password };
        case 'scram-sha-256':
            return { mechanism, username, password };
        case 'scram-sha-512':
            return { mechanism, username, password };
        default:
            throw new Error(`Unsupported Kafka SASL mechanism: ${mechanism}`);
    }
}

function getKafkaSslConfig(): KafkaConfig['ssl'] {
    if (process.env.KAFKA_SSL !== 'true') return false;

    const ca = process.env.KAFKA_CA_CERT;
    const caPath = process.env.KAFKA_CA_CERT_PATH;

    if (ca) {
        return { ca: [ca.replace(/\\n/g, '\n')] };
    }

    if (caPath) {
        return { ca: [readFileSync(caPath, 'utf-8')] };
    }

    return true;
}

export function getKafkaBrokers(): string[] {
    const brokers = process.env.KAFKA_BROKERS;
    const sasl = getKafkaSaslConfig();

    if (!brokers && sasl) {
        throw new Error('KAFKA_BROKERS must be set when Kafka SASL is configured');
    }

    return (brokers || 'localhost:29092')
        .split(',')
        .map((broker) => broker.trim())
        .filter(Boolean);
}

export class KafkaProducerImpl implements IEventProducer {
    private kafka: Kafka;
    private producer: Producer;
    private connected = false;

    constructor(brokers: string[], private readonly defaultTopic: string, clientId = 'register-api') {
        const kafkaConfig: KafkaConfig = {
            clientId,
            brokers,
            ssl: getKafkaSslConfig(),
            sasl: getKafkaSaslConfig(),
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
            console.log(`Publishing message to topic ${targetTopic}:`, message);
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
