import type { Lesson } from '@/types';

export const messagingSystemsLesson: Lesson = {
  id: 'messaging-systems',
  slug: 'messaging-systems',
  title: 'Messaging Systems',
  description:
    'Master asynchronous messaging — message queues, event streaming, pub/sub patterns, and deep comparisons of RabbitMQ, Apache Kafka, and AWS SQS. Learn when async communication is the right architectural decision and when it backfires.',
  category: 'Infrastructure',
  order: 13,
  difficulty: 'advanced',
  estimatedTime: 55,
  prevLesson: 'distributed-systems',
  nextLesson: 'rate-limiting',

  content: `
# Messaging Systems

## The Problem Messaging Solves

Imagine you build an e-commerce system. When a user places an order, you need to:
1. Reserve inventory
2. Charge the payment card
3. Send a confirmation email
4. Notify the warehouse
5. Update analytics

If you do all this synchronously — the user waits for all 5 steps to complete before seeing "Order Confirmed." Payment APIs have 500ms latency. Email services can take 200ms. The user waits 1–2 seconds.

Worse: if the email service is down, your order endpoint returns an error. The user's card was charged, but they get an error page.

**Messaging solves this** by making steps 2–5 asynchronous. You confirm the order immediately (step 1: inventory reservation), then send the rest as messages for background processing. User sees "Order Confirmed" in 50ms. The email gets sent when the email service is available.

---

## Core Concepts

### Message Queue

A **message queue** is a buffer that holds messages from producers until consumers are ready to process them. It decouples the sender from the receiver — they do not need to be available at the same time.

\`\`\`
Producer → [Queue: [ msg1 | msg2 | msg3 ]] → Consumer
           (buffer)
\`\`\`

Key property: **point-to-point**. Once a consumer reads and acknowledges a message, it is deleted from the queue. Another consumer cannot read the same message.

### Event Streaming

An **event stream** is a persistent, ordered, append-only log of events. Unlike a queue, events are not deleted after consumption. Multiple consumers can read the same events independently. Consumers track their own position (offset) in the stream.

\`\`\`
Producer → [Stream: event1, event2, event3, event4, event5]
                         ^                          ^
                    Consumer A               Consumer B
                   (at offset 2)            (at offset 5)
\`\`\`

### Pub/Sub (Publish-Subscribe)

Publishers emit events without knowing who receives them. Subscribers declare interest in event types without knowing who publishes them. Loose coupling between producers and consumers.

\`\`\`
Publisher:  "order.created" event
               |
           [Message Broker]
               |
     +---------+---------+
     |         |         |
Email Svc  Warehouse  Analytics
(subscriber) (subscriber) (subscriber)
\`\`\`

### Key Terminology

**Producer:** The service that sends messages or events.

**Consumer:** The service that receives and processes messages.

**Dead Letter Queue (DLQ):** A separate queue for messages that failed processing repeatedly (after N retries). Instead of losing failed messages or blocking the queue, they go to the DLQ for manual inspection or reprocessing. Essential for observability.

**Retry with Exponential Backoff:** On processing failure, retry after 1s, then 2s, then 4s, then 8s, etc. Prevents hammering a downstream service that is struggling.

**Message Ordering:** FIFO ordering means messages are processed in the order they were sent. Most queues guarantee ordering within a partition/queue but not across partitions.

**Delivery Semantics:**
- **At-most-once:** Message may be lost, never duplicated. Simple but unreliable.
- **At-least-once:** Message will be delivered, but may be duplicated. Most systems default to this.
- **Exactly-once:** Message delivered exactly once. Hard to achieve; requires idempotent consumers or transactional messaging.

---

## Why Messaging Exists — The Four Benefits

### 1. Decoupling Services

Without messaging, Service A calls Service B directly. If B is down, A fails. With messaging, A puts a message on the queue and returns immediately. B processes when it is available. A and B can be deployed, scaled, and maintained independently.

### 2. Handling Traffic Spikes (Buffering)

Black Friday: 10,000 orders/minute flood your system. Your order service can handle 10,000/minute. Your warehouse notification service can handle 1,000/minute.

Without messaging: 9,000 notifications/minute are dropped.
With messaging: All 10,000 notifications go to the queue. The warehouse service processes them at 1,000/minute over 10 minutes. No notifications lost.

\`\`\`
Traffic spike:
Orders:    ████████████████ 10,000/min → Queue → Warehouse: ████ 1,000/min
                                           ↑
                           Queue absorbs the burst, normalizes flow
\`\`\`

### 3. Async Processing

Heavy operations (video encoding, PDF generation, sending emails, ML inference) don't need to block the user. Put a job in the queue, return a "your request is processing" response immediately. Background workers handle the heavy work.

### 4. Fan-Out

One event → many consumers. An "order.created" event is consumed simultaneously by the email service, warehouse system, analytics pipeline, fraud detection system, and loyalty points service. Adding a new consumer requires no changes to the order service.

---

## RabbitMQ — The Task Queue Champion

### How RabbitMQ Works

RabbitMQ implements **AMQP (Advanced Message Queuing Protocol)**. Key concepts:

- **Exchange:** Receives messages from producers and routes them to queues based on routing rules.
- **Queue:** Stores messages until consumers retrieve them.
- **Binding:** Rules that connect an exchange to a queue (routing keys, patterns).

**Exchange Types:**
- **Direct:** Routes to queues with exact routing key match.
- **Topic:** Routes based on wildcard patterns (\`order.*\`, \`*.payment\`)
- **Fanout:** Broadcasts to all bound queues (ignore routing key)
- **Headers:** Routes based on message header attributes

\`\`\`
Producer
    |
    v
[Exchange: "order-events"]   (type: topic)
    |              |
    |              |
[Queue: payments]  [Queue: warehouse]
 binding: "order.#" binding: "order.created"
    |              |
 Payment Svc   Warehouse Svc
\`\`\`

**Push-Based:** RabbitMQ pushes messages to consumers. Consumers register as subscribers; the broker sends messages as they arrive. Consumers must manage prefetch count (how many unacked messages they buffer).

### RabbitMQ Advantages

- **Flexible routing:** Complex routing logic without touching consumers (exchanges + bindings)
- **Per-message TTL:** Individual messages can expire, not just queues
- **Priority queues:** Process high-priority messages first
- **Acknowledgment model:** Consumer explicitly acks each message; unacked messages are requeued on failure
- **Low latency:** Sub-millisecond delivery for small messages

### RabbitMQ Disadvantages

- **Not designed for replay:** Once a message is consumed and acked, it is gone. You cannot re-read old messages.
- **Complex routing adds ops burden:** Rich features require careful configuration of exchanges, queues, and bindings.
- **Throughput limits:** Designed for task queuing, not massive event streaming. Performance degrades at millions of messages/second.
- **Message loss risk:** If a queue is not durable and the broker restarts, unprocessed messages are lost.

### When to Use RabbitMQ

- Task queues (background jobs: send email, resize image, generate PDF)
- RPC patterns (request-reply with correlation IDs)
- Complex routing logic (route by message type, content, priority)
- Work distribution across multiple workers (competing consumers)

### When NOT to Use RabbitMQ

- You need to replay past events (e.g., rebuild a read model from event history)
- Throughput exceeds ~100K messages/second
- Multiple independent consumers need to read the same message (RabbitMQ deletes on ack; use fanout exchange workaround, but Kafka is better)

---

## Apache Kafka — The Event Streaming Platform

### How Kafka Works

Kafka is a **distributed commit log**. Events are written to **topics**, which are split into **partitions**. Each partition is an ordered, immutable append-only log.

\`\`\`
Topic: "order-events"
  Partition 0: [event1, event2, event5, event8, ...]
  Partition 1: [event3, event6, event9, ...]
  Partition 2: [event4, event7, event10, ...]

Consumer Group A (Payment Service):
  Consumer A1 → reads Partition 0
  Consumer A2 → reads Partition 1
  Consumer A3 → reads Partition 2

Consumer Group B (Analytics Pipeline):
  Consumer B1 → reads Partition 0
  Consumer B2 → reads Partition 1 + 2 (handles 2 partitions)

Both consumer groups read ALL events independently. Kafka does not delete on read.
\`\`\`

**Key concepts:**

- **Topic:** A named stream of events. Producers write to a topic, consumers read from topics.
- **Partition:** A topic is split into partitions for parallelism. Each partition is ordered. Events with the same key always go to the same partition (key-based routing).
- **Offset:** Each event in a partition has a monotonically increasing offset number. Consumers track which offset they have read up to.
- **Consumer Group:** A group of consumers that collectively read a topic. Each partition is assigned to exactly one consumer in the group. Adding consumers scales parallelism (up to the number of partitions).
- **Retention:** Kafka retains events for a configurable period (e.g., 7 days) regardless of consumption. Consumers can replay from any offset.

**Pull-Based:** Consumers pull events at their own pace. This is important — a slow consumer does not back-pressure producers. Kafka simply retains unconsumed events in the log.

### Kafka Advantages

- **Massive throughput:** Millions of events/second per cluster. LinkedIn originally built it and processes trillions of events/day.
- **Replay:** Events are stored and can be replayed from any offset. Critical for event sourcing and rebuilding state.
- **Exactly-once semantics:** Kafka Transactions enable exactly-once delivery across producers, topics, and consumer offsets.
- **Durability:** Events are replicated across brokers. Data is safe even with broker failures.
- **Fan-out:** Multiple consumer groups can read the same topic independently without coordination.
- **Event sourcing:** Kafka is the natural backend for event-sourced systems — the log IS the source of truth.

### Kafka Disadvantages

- **Operationally complex:** Cluster management, partition rebalancing, ZooKeeper/KRaft coordination, consumer lag monitoring.
- **Not for simple task queues:** Overkill for "send 10 emails in the background." RabbitMQ or SQS is better.
- **Ordering only within partition:** Global ordering across all events requires a single partition (eliminating parallelism).
- **High latency for low-throughput use cases:** Kafka batches writes for efficiency; for very small volumes this adds latency.
- **Exactly-once is complex to configure:** Requires idempotent producers + transactional APIs.

### When to Use Kafka

- Event streaming and event-driven architectures
- Event sourcing (log is the source of truth)
- Audit logs (retain all events, immutable history)
- Analytics pipelines (multiple consumers process same data stream independently)
- Microservice integration at scale (millions of events/second)
- When you need replay capability

### When NOT to Use Kafka

- Simple background job queue at low scale → use SQS or RabbitMQ
- You need per-message TTL or priority queues
- Your team lacks Kafka operational experience (it is complex to run)
- Small-scale systems where the operational overhead is not justified

---

## AWS SQS — The Managed Queue

### How SQS Works

SQS is a fully managed message queue service by AWS. No infrastructure to manage — just send and receive messages via API.

**Two queue types:**

**Standard Queue:**
- At-least-once delivery (messages can be delivered more than once)
- Best-effort ordering (not strictly FIFO)
- Unlimited throughput
- Messages stored for up to 14 days (configurable)

**FIFO Queue:**
- Exactly-once delivery within a deduplication window (5 minutes)
- Strict FIFO ordering (per message group)
- Up to 3,000 messages/second (with batching) or 300 without
- Higher cost

**Visibility Timeout:** When a consumer receives a message, it becomes invisible to other consumers for a timeout period. If the consumer acks within the timeout → message deleted. If it does not (crashed) → message becomes visible again for another consumer.

### SQS Advantages

- **Zero operational overhead:** Fully managed by AWS. No clusters, no brokers, no ZooKeeper.
- **Automatic scaling:** Handles any throughput without configuration.
- **Dead Letter Queue:** Native DLQ support — after N delivery failures, messages move to DLQ automatically.
- **AWS integration:** Native integration with Lambda, SNS, EventBridge, EC2, ECS.
- **Cost-effective at low scale:** Pay per request.

### SQS Disadvantages

- **AWS lock-in:** Not portable to other clouds or on-premise.
- **No replay:** Once a message is deleted, it is gone. No event log.
- **Limited routing:** No exchange/binding model like RabbitMQ. Use SNS → SQS fan-out pattern.
- **Poll-based:** Must poll SQS to receive messages (though Long Polling reduces this overhead).
- **Message size limit:** Max 256KB per message.

### When to Use SQS

- AWS-native architecture where managed services are preferred
- Simple background job processing (email, notifications)
- Decoupling microservices within AWS
- When operational simplicity is the top priority
- Handling traffic bursts (Lambda + SQS auto-scales workers automatically)

### When NOT to Use SQS

- You need replay / event history
- Non-AWS environment
- Very complex routing logic
- Throughput beyond FIFO queue limits with ordering guarantees

---

## Technology Comparison

| Feature | RabbitMQ | Kafka | AWS SQS |
|---|---|---|---|
| Type | Message queue | Event streaming log | Managed queue |
| Delivery | At-least-once | At-least-once (exactly-once with transactions) | At-least-once (FIFO: exactly-once) |
| Ordering | Per-queue | Per-partition | Best-effort (FIFO: strict) |
| Replay | No | Yes (configurable retention) | No |
| Multiple consumers same message | Via fanout exchange | Yes (consumer groups) | No (one consumer per message) |
| Throughput | ~100K/sec | Millions/sec | Unlimited (Standard) |
| Routing | Rich (exchanges, bindings) | Topic + partition | None (use SNS for routing) |
| Managed | No (self-hosted) | No (self-hosted, or Confluent) | Yes (fully managed) |
| Complexity | Medium | High | Low |
| Best for | Task queues, complex routing | Event streaming, replay, high throughput | AWS workloads, simplicity |
`,

  codeExamples: [
    {
      title: 'RabbitMQ — Producer and Consumer with Dead Letter Queue',
      code: `import amqp from 'amqplib';

// Producer: Place an order
async function publishOrderCreated(order: Order) {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  // Declare exchange
  await channel.assertExchange('order-events', 'topic', { durable: true });

  // Publish event with routing key
  channel.publish(
    'order-events',
    'order.created',              // Routing key
    Buffer.from(JSON.stringify(order)),
    {
      persistent: true,           // Survive broker restart
      contentType: 'application/json',
      messageId: order.id,        // For deduplication
    }
  );

  console.log(\`Published order.created for order \${order.id}\`);
  await conn.close();
}

// Consumer: Email Service subscribes to order.created
async function startEmailConsumer() {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();

  // Dead Letter Queue setup
  await channel.assertQueue('email-dlq', { durable: true });

  // Main queue — on rejection after max-retries, route to DLQ
  await channel.assertQueue('email-service', {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': '',       // Default exchange
      'x-dead-letter-routing-key': 'email-dlq',
    }
  });

  // Bind queue to exchange
  await channel.bindQueue('email-service', 'order-events', 'order.created');

  // Prefetch 1: only take next message after acking current one
  await channel.prefetch(1);

  await channel.consume('email-service', async (msg) => {
    if (!msg) return;

    const order = JSON.parse(msg.content.toString());
    const retryCount = (msg.properties.headers?.['x-retry-count'] ?? 0) as number;

    try {
      await sendConfirmationEmail(order);
      channel.ack(msg);  // Success: remove from queue
    } catch (error) {
      if (retryCount >= 3) {
        // Max retries exceeded: reject and send to DLQ
        console.error(\`Order \${order.id} failed after 3 retries. Sending to DLQ.\`);
        channel.reject(msg, false); // false = do not requeue
      } else {
        // Retry with exponential backoff
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(\`Retry \${retryCount + 1} for order \${order.id} in \${delay}ms\`);
        await new Promise(r => setTimeout(r, delay));
        channel.nack(msg, false, true); // nack + requeue
      }
    }
  });
}`,
      explanation:
        'This shows the complete RabbitMQ pattern: durable exchange + queue, persistent messages that survive restarts, Dead Letter Queue for failed messages, prefetch for backpressure, and exponential backoff retry.',
    },
    {
      title: 'Apache Kafka — Producer with Partitioning and Consumer Group',
      code: `import { Kafka, Partitioners } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['kafka-1:9092', 'kafka-2:9092', 'kafka-3:9092'],
});

// Producer: Publish order events
async function publishOrderEvent(order: Order) {
  const producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
    idempotent: true,  // Exactly-once producer semantics
  });

  await producer.connect();

  await producer.send({
    topic: 'order-events',
    messages: [
      {
        // Using userId as key → same user's events always go to same partition
        // This guarantees ordering of events per user
        key: order.userId,
        value: JSON.stringify(order),
        headers: {
          eventType: 'order.created',
          version: '1',
          traceId: order.traceId,
        },
      },
    ],
  });

  console.log(\`Published order \${order.id} for user \${order.userId}\`);
  await producer.disconnect();
}

// Consumer: Analytics Service reads all order events
async function startAnalyticsConsumer() {
  const consumer = kafka.consumer({
    groupId: 'analytics-consumer-group',  // Each group reads the topic independently
  });

  await consumer.connect();

  // Subscribe from beginning to replay all historical events
  await consumer.subscribe({ topic: 'order-events', fromBeginning: true });

  await consumer.run({
    // Process each message
    eachMessage: async ({ topic, partition, message, heartbeat }) => {
      const order = JSON.parse(message.value!.toString());
      const offset = message.offset;

      try {
        await updateAnalyticsDashboard(order);

        console.log(
          \`Processed order \${order.id} | partition=\${partition} | offset=\${offset}\`
        );
        // Kafka auto-commits offset after processing (or use manual commit)
      } catch (error) {
        // Unlike RabbitMQ, Kafka does not re-queue on failure automatically.
        // You must handle retry logic explicitly.
        console.error(\`Failed to process order \${order.id}:\`, error);
        // Options: skip (commit offset), retry in-memory, or write to error topic
      }
    },
  });
}

// Multiple consumer groups all reading the same topic:
// - analytics-consumer-group → updates dashboards
// - email-consumer-group     → sends confirmation emails
// - warehouse-consumer-group → notifies warehouse
// Each group maintains its own offset. Kafka sends all events to all groups.`,
      output: `Published order ord-123 for user usr-456
Processed order ord-123 | partition=1 | offset=2847
Processed order ord-124 | partition=1 | offset=2848`,
      explanation:
        'Key Kafka insight: the message key (userId) determines the partition, ensuring all events for the same user are ordered within a partition. Multiple consumer groups independently read the same topic — adding a new consumer requires zero changes to producers or other consumers.',
    },
    {
      title: 'AWS SQS — Producer and Lambda Consumer with DLQ',
      code: `import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';

const sqs = new SQSClient({ region: 'us-east-1' });
const QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/123456789/order-queue';
const DLQ_URL = 'https://sqs.us-east-1.amazonaws.com/123456789/order-queue-dlq';

// Producer: Send message to SQS
async function enqueueOrder(order: Order) {
  await sqs.send(new SendMessageCommand({
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify(order),
    MessageGroupId: order.userId,   // FIFO: group by user for ordering
    MessageDeduplicationId: order.id, // FIFO: prevent duplicate processing
    MessageAttributes: {
      EventType: {
        DataType: 'String',
        StringValue: 'order.created',
      },
    },
  }));
  console.log(\`Enqueued order \${order.id}\`);
}

// Consumer: Long-poll SQS and process
async function processOrders() {
  while (true) {
    const response = await sqs.send(new ReceiveMessageCommand({
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 10,         // Batch up to 10 messages
      WaitTimeSeconds: 20,             // Long-poll (reduces API calls)
      VisibilityTimeout: 30,           // 30 seconds to process before re-appearing
    }));

    const messages = response.Messages ?? [];

    await Promise.all(messages.map(async (message) => {
      const order = JSON.parse(message.Body!);

      try {
        await fulfillOrder(order);

        // Delete on success (ack equivalent)
        await sqs.send(new DeleteMessageCommand({
          QueueUrl: QUEUE_URL,
          ReceiptHandle: message.ReceiptHandle!,
        }));
        console.log(\`Processed and deleted order \${order.id}\`);
      } catch (error) {
        // Do NOT delete on failure → message becomes visible again after VisibilityTimeout
        // After MaxReceiveCount (configured in SQS), message moves to DLQ automatically
        console.error(\`Failed to process order \${order.id} — will retry\`);
      }
    }));
  }
}

// AWS CDK: Configure DLQ (Infrastructure as Code)
// const dlq = new sqs.Queue(this, 'OrderDLQ', { retentionPeriod: Duration.days(14) });
// const mainQueue = new sqs.Queue(this, 'OrderQueue', {
//   deadLetterQueue: { queue: dlq, maxReceiveCount: 3 }, // DLQ after 3 failures
//   visibilityTimeout: Duration.seconds(30),
// });`,
      explanation:
        'SQS uses Visibility Timeout as its acknowledgment mechanism. A received message is hidden for 30 seconds. If not explicitly deleted (acked), it reappears for another consumer. After maxReceiveCount failures, SQS automatically moves the message to the DLQ — no consumer code required.',
    },
  ],

  commonMistakes: [
    'Not making consumers idempotent — with at-least-once delivery, messages can be processed twice. Processing a payment twice doubles the charge. Always design consumers to handle duplicate messages safely.',
    'Forgetting Dead Letter Queues — without DLQ, failed messages either block the queue, are retried forever, or are silently dropped. Always configure DLQ in production.',
    'Using Kafka for simple task queues — Kafka\'s operational complexity is enormous. For "send 10 emails per day", SQS or RabbitMQ is far simpler.',
    'Not setting appropriate Visibility Timeout (SQS) or Ack Timeout — if too short, messages are redelivered while still being processed. If too long, failed messages take too long to re-queue.',
    'Assuming FIFO ordering across Kafka partitions — Kafka only guarantees order within a single partition. If a consumer group has multiple consumers, different partitions are processed in parallel and may complete out of global order.',
    'Not monitoring consumer lag — if consumers fall behind producers in Kafka, the lag grows unboundedly. This causes replay storms and can fill disk. Always monitor consumer lag.',
    'Processing messages in a tight loop without backpressure — consuming messages faster than downstream systems can handle causes cascading failures. Implement prefetch limits and rate limiting in consumers.',
    'Not handling poison pills — a malformed message that always causes consumer crashes must be detected and moved to DLQ, not retried indefinitely.',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between a message queue and an event stream?',
      difficulty: 'intermediate',
      answer:
        'A message queue (RabbitMQ, SQS) is designed for point-to-point communication: each message is consumed by exactly one consumer, and deleted after acknowledgment. Good for task distribution. An event stream (Kafka) is a persistent, ordered log: events are retained for a configurable period and multiple independent consumer groups can read the same event at different times. Consumers track their own position (offset). Good for event sourcing, audit logs, and fan-out to many consumers. Key difference: in a queue, messages disappear after processing. In a stream, events persist and can be replayed.',
      followUp: ['When would you use pub/sub vs message queue?', 'What is event sourcing and why does it need a stream?'],
    },
    {
      question: 'Explain at-least-once, at-most-once, and exactly-once delivery semantics.',
      difficulty: 'advanced',
      answer:
        'At-most-once: Message is sent once and never retried. May be lost (fire-and-forget). No duplicates. Used for: metrics, non-critical notifications where loss is acceptable. At-least-once: Message is retried until acknowledged. Will not be lost but may be delivered more than once on consumer crash before ack. The default for most systems. Requires idempotent consumers. At-exactly-once: Delivered precisely once, never lost, never duplicated. Hardest to achieve. Requires idempotent producers (Kafka) + transactional commits + idempotent consumers. Use for: financial transactions, inventory updates. In practice, at-least-once + idempotent consumers = effectively exactly-once behavior.',
      tip: 'Always mention that exactly-once requires ALL three: idempotent producer, at-least-once broker, idempotent consumer.',
    },
    {
      question: 'How would you design a system to process 1 million orders per day asynchronously?',
      difficulty: 'advanced',
      answer:
        '1 million orders/day = ~700 orders/second peak. Choose Kafka for the event backbone — it handles this throughput easily. Design: Order Service publishes order.created events to Kafka with userId as partition key (ensures per-user ordering). Multiple consumer groups subscribe: Payment (3 consumers across 3 partitions), Email (2 consumers), Warehouse (2 consumers), Analytics (1 consumer). Configure DLQ topic for failed events. Monitor consumer lag — if lag grows, add consumers (up to partition count). Use idempotent producer + consumer to handle restarts safely. Retention: 7 days for replay capability.',
      followUp: ['How do you scale consumers if lag grows?', 'What happens if the payment service is slow?'],
    },
    {
      question: 'What is a Dead Letter Queue and why is it essential?',
      difficulty: 'intermediate',
      answer:
        'A Dead Letter Queue (DLQ) is a separate queue/topic where messages are routed after failing processing N times. Without DLQ, you have three bad options: (1) Retry forever — blocks queue, causes unbounded lag for poison pill messages. (2) Drop on failure — data loss. (3) Log and ignore — messages lost with no visibility. With DLQ: failed messages are isolated (do not block other messages), preserved for inspection (you can debug why they failed), and can be manually reprocessed after fixing the bug. Essential for operational visibility and reliability in any production messaging system.',
    },
    {
      question: 'Why does Kafka use a partition key and how does it affect ordering and parallelism?',
      difficulty: 'advanced',
      answer:
        'Kafka routes messages to partitions based on a key hash: partition = hash(key) % numPartitions. Same key → always same partition. This has two implications: (1) Ordering: events with the same key are always in the same partition, which is ordered and processed by a single consumer in a group. So if key = userId, all events for user Alice are ordered. (2) Parallelism: different keys → different partitions → can be processed in parallel by different consumers. The number of partitions caps the parallelism — a consumer group cannot have more active consumers than partitions. Choose a key that distributes load evenly (user ID is good; timestamp or status is bad — creates hot partitions).',
    },
    {
      question: 'When would you choose Kafka over RabbitMQ?',
      difficulty: 'advanced',
      answer:
        'Choose Kafka when: (1) You need event replay — Kafka retains events; RabbitMQ deletes on ack. (2) Multiple independent consumer groups need the same data — Kafka fan-out is native; RabbitMQ requires fanout exchanges. (3) Throughput exceeds ~100K/sec — Kafka scales to millions/sec. (4) You are building event-sourced systems or audit logs. (5) Analytics pipelines where multiple teams process the same event stream. Choose RabbitMQ when: (1) You need complex routing (topic patterns, header-based routing). (2) Per-message TTL or priority queues. (3) Task queues where simplicity matters more than throughput. (4) Low volume where Kafka overhead is not justified.',
    },
  ],

  exercises: [
    {
      id: 'msg-ex-1',
      title: 'Design an Idempotent Order Processor',
      description:
        'You have a consumer that processes payment messages from a queue. The queue guarantees at-least-once delivery — the same payment message may arrive twice (e.g., if the consumer crashed after charging the card but before acking). Design an idempotent payment processor that ensures a payment is charged exactly once even if the message is processed multiple times. Use a "processed payments" table as the idempotency store.',
      starterCode: `interface PaymentMessage {
  messageId: string;   // Unique per message delivery (changes on redelivery)
  orderId: string;     // Unique per order (same across redeliveries)
  userId: string;
  amount: number;
  currency: string;
}

interface PaymentRecord {
  orderId: string;
  status: 'charged' | 'failed';
  chargedAt: Date;
  transactionId: string;
}

class IdempotentPaymentProcessor {
  private processedPayments: Map<string, PaymentRecord> = new Map(); // orderId → record

  async processPayment(message: PaymentMessage): Promise<void> {
    // TODO: Implement idempotent processing
    // Steps:
    // 1. Check if this orderId was already processed
    // 2. If yes: log "already processed" and return (do not charge again)
    // 3. If no: charge the card, record the result, then ack
    // 4. Handle the case where we charged but crashed before recording
    //    (hint: check transaction status from payment provider before charging)
  }

  private async chargeCard(userId: string, amount: number, orderId: string): Promise<string> {
    // Returns transactionId from payment provider
    // Simulates a payment API call
    return \`txn-\${Math.random().toString(36).slice(2)}\`;
  }
}`,
      solution: `class IdempotentPaymentProcessor {
  private processedPayments: Map<string, PaymentRecord> = new Map();

  async processPayment(message: PaymentMessage): Promise<void> {
    const { orderId, userId, amount, currency } = message;

    // Step 1: Check idempotency store — was this order already paid?
    const existing = this.processedPayments.get(orderId);
    if (existing) {
      console.log(
        \`Order \${orderId} already processed (txn: \${existing.transactionId}). Skipping.\`
      );
      return; // Safe to ack — we know it was processed
    }

    // Step 2: Check payment provider for existing transaction
    // (handles crash-after-charge-before-record scenario)
    const existingTxn = await this.checkExistingTransaction(orderId);
    if (existingTxn) {
      console.log(\`Found existing txn \${existingTxn} for order \${orderId}. Recording and skipping.\`);
      this.processedPayments.set(orderId, {
        orderId,
        status: 'charged',
        chargedAt: new Date(),
        transactionId: existingTxn,
      });
      return;
    }

    // Step 3: Charge the card
    try {
      const transactionId = await this.chargeCard(userId, amount, orderId);

      // Step 4: Record in idempotency store BEFORE acking
      // If we crash here, next delivery will find the txn via checkExistingTransaction
      this.processedPayments.set(orderId, {
        orderId,
        status: 'charged',
        chargedAt: new Date(),
        transactionId,
      });

      console.log(\`Charged $\${amount} \${currency} for order \${orderId} (txn: \${transactionId})\`);
      // Ack the message → removed from queue
    } catch (error) {
      console.error(\`Payment failed for order \${orderId}:\`, error);
      this.processedPayments.set(orderId, {
        orderId,
        status: 'failed',
        chargedAt: new Date(),
        transactionId: '',
      });
      throw error; // Nack → message goes to DLQ or retried
    }
  }

  private async checkExistingTransaction(orderId: string): Promise<string | null> {
    // In production: call payment provider API to check if orderId was already charged
    // Most payment providers support idempotency keys for exactly this purpose
    // e.g., Stripe: stripe.charges.retrieve with idempotency key = orderId
    return null; // Simplified
  }

  private async chargeCard(userId: string, amount: number, orderId: string): Promise<string> {
    return \`txn-\${Math.random().toString(36).slice(2)}\`;
  }
}`,
      hints: [
        'Idempotency key should be the orderId — it is stable across message redeliveries (unlike messageId which changes).',
        'The most dangerous failure mode: charged the card, crashed before writing to the idempotency store. Use payment provider\'s idempotency key support to detect this.',
        'Always check the idempotency store BEFORE charging. Never charge first and check after.',
        'Stripe, PayPal, and other payment providers support idempotency keys natively — pass orderId as the idempotency key and they guarantee at-most-once charging.',
      ],
    },
    {
      id: 'msg-ex-2',
      title: 'Build a Fan-Out Pattern: One Event, Many Consumers',
      description:
        'Design a system where publishing a single "user.registered" event triggers three independent downstream services: (1) Email service sends welcome email, (2) Analytics service records user registration, (3) Recommendation service initializes user preferences. Requirements: services must be independent (failure in one must not affect others), each must receive every event exactly once, and new services must be addable without modifying the publisher.',
      starterCode: `// Design the fan-out architecture
// Choose between: Kafka consumer groups, RabbitMQ fanout exchange, or SNS→SQS

interface UserRegisteredEvent {
  userId: string;
  email: string;
  registeredAt: Date;
  source: string; // 'web' | 'mobile' | 'api'
}

// Option A: Kafka-based fan-out
class KafkaFanOut {
  // TODO: Show how producer publishes once, all consumer groups receive it
  async publishUserRegistered(event: UserRegisteredEvent): Promise<void> {
    // Your implementation
  }

  // Each of these should be separate consumer groups
  async startEmailConsumer(): Promise<void> { /* ... */ }
  async startAnalyticsConsumer(): Promise<void> { /* ... */ }
  async startRecommendationConsumer(): Promise<void> { /* ... */ }
}

// Option B: SNS→SQS fan-out (AWS)
// Describe the architecture without code
function describeSNSSQSFanOut(): string {
  return '';
}`,
      solution: `// SOLUTION: Kafka-based fan-out

class KafkaFanOut {
  private kafka = new Kafka({ clientId: 'user-service', brokers: ['kafka:9092'] });
  private TOPIC = 'user-events';

  async publishUserRegistered(event: UserRegisteredEvent): Promise<void> {
    const producer = this.kafka.producer({ idempotent: true });
    await producer.connect();

    await producer.send({
      topic: this.TOPIC,
      messages: [{
        key: event.userId,           // Partition by userId for ordering per user
        value: JSON.stringify(event),
        headers: { eventType: 'user.registered' },
      }],
    });

    // Producer publishes ONCE. Kafka fan-out is handled by consumer groups.
    console.log(\`Published user.registered for \${event.userId}\`);
    await producer.disconnect();
  }

  // Each consumer is in its OWN group → reads ALL events independently
  async startEmailConsumer(): Promise<void> {
    const consumer = this.kafka.consumer({ groupId: 'email-service' });
    await consumer.connect();
    await consumer.subscribe({ topic: this.TOPIC });

    await consumer.run({
      eachMessage: async ({ message }) => {
        const event: UserRegisteredEvent = JSON.parse(message.value!.toString());
        const eventType = message.headers?.eventType?.toString();

        if (eventType !== 'user.registered') return; // Filter: only handle this event type

        await sendWelcomeEmail(event.email, event.userId);
        // Offset auto-committed. Failure here only retries this consumer group,
        // not the analytics or recommendation consumers.
      },
    });
  }

  async startAnalyticsConsumer(): Promise<void> {
    const consumer = this.kafka.consumer({ groupId: 'analytics-service' }); // Different group!
    await consumer.connect();
    await consumer.subscribe({ topic: this.TOPIC });

    await consumer.run({
      eachMessage: async ({ message }) => {
        const event: UserRegisteredEvent = JSON.parse(message.value!.toString());
        await recordUserRegistration(event);
      },
    });
  }

  async startRecommendationConsumer(): Promise<void> {
    const consumer = this.kafka.consumer({ groupId: 'recommendation-service' }); // Another group!
    await consumer.connect();
    await consumer.subscribe({ topic: this.TOPIC });

    await consumer.run({
      eachMessage: async ({ message }) => {
        const event: UserRegisteredEvent = JSON.parse(message.value!.toString());
        await initializeUserPreferences(event.userId, event.source);
      },
    });
  }

  // Adding a NEW consumer: zero changes to publisher or other consumers
  async startAuditConsumer(): Promise<void> {
    const consumer = this.kafka.consumer({ groupId: 'audit-service' }); // Just add new group
    await consumer.connect();
    await consumer.subscribe({ topic: this.TOPIC, fromBeginning: true }); // Can even replay history!
    // ...
  }
}

function describeSNSSQSFanOut(): string {
  return \`
  SNS → SQS Fan-Out Architecture (AWS):

  Publisher → SNS Topic "user-events"
                    |
        +-----------+-----------+
        |           |           |
   SQS Queue    SQS Queue   SQS Queue
  (email-svc) (analytics) (recommendations)
        |           |           |
   Lambda/EC2  Lambda/EC2  Lambda/EC2

  Adding new consumer = subscribe new SQS queue to SNS topic.
  Zero changes to publisher.
  Each SQS queue is independent: failure in email-svc does not affect analytics.
  \`;
}`,
      hints: [
        'The key insight: in Kafka, consumer GROUPS are the isolation boundary. One group per service.',
        'Different consumer groups have completely independent offsets. A failure in the email consumer group does not affect the analytics consumer group.',
        'In SNS→SQS pattern (AWS), SNS delivers a copy to each subscribed SQS queue. Each queue is independently consumed.',
        'Adding a new consumer in Kafka = create new consumer group. Zero producer changes. Can even replay historical events with fromBeginning: true.',
      ],
    },
  ],

  keyTakeaways: [
    'Messaging decouples services — producers and consumers are independently deployable, scalable, and fault-isolated from each other.',
    'Message queues (point-to-point) delete messages after one consumer processes them. Event streams (Kafka) retain events for all consumer groups to read independently.',
    'At-least-once delivery is the default in most systems. Always design consumers to be idempotent — safe to run twice with the same input.',
    'Dead Letter Queues are mandatory in production. Without DLQ, failed messages either loop forever, block the queue, or are silently lost.',
    'RabbitMQ excels at complex routing, task queues, and per-message features. Not designed for replay or massive throughput.',
    'Kafka excels at high throughput (millions/sec), event replay, and fan-out to many consumer groups. Operationally complex; overkill for simple queuing.',
    'AWS SQS is ideal for AWS-native architectures where operational simplicity trumps raw features. Fully managed, auto-scaling, native DLQ.',
    'Kafka partition key determines both routing and ordering: same key → same partition → ordered. Choose keys that distribute load evenly (user ID, not status).',
    'Consumer lag is the critical Kafka metric: if consumers fall behind, the lag grows. Scale consumers (add more, up to partition count) when lag grows.',
    'Exactly-once delivery requires: idempotent producer + at-least-once broker + idempotent consumer. The third point (idempotent consumer) is YOUR responsibility.',
  ],
};
