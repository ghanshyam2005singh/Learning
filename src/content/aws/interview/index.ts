import type { InterviewQuestion } from '@/types';

export const interviewQuestions: InterviewQuestion[] = [
  // ─── CLOUD FUNDAMENTALS ────────────────────────────────────────────────────
  {
    question: 'What is cloud computing and what are its main service models?',
    answer: 'Cloud computing is the delivery of computing services (servers, storage, databases, networking, software) over the internet on a pay-as-you-go basis. The three main service models are: IaaS (Infrastructure as a Service) — you manage OS and above, provider manages hardware (EC2). PaaS (Platform as a Service) — you manage just the application, provider manages OS and runtime (Elastic Beanstalk). SaaS (Software as a Service) — you just use the software (Gmail, Salesforce). AWS covers all three.',
    difficulty: 'beginner',
    tip: 'Remember: IaaS = most control, SaaS = least control, PaaS = middle ground.',
  },
  {
    question: 'What is the difference between regions, availability zones, and edge locations in AWS?',
    answer: 'A Region is a geographic area (e.g., us-east-1, ap-south-1) containing multiple data centers. Each Region is independent to provide data residency and disaster isolation. An Availability Zone (AZ) is one or more discrete data centers within a Region, connected by low-latency links. Deploying across multiple AZs protects against single AZ failures. Edge Locations are endpoints for CloudFront CDN — they cache content close to users worldwide. Rule: Regions > AZs > Edge Locations (hierarchy of scale).',
    difficulty: 'beginner',
    followUp: ['How many AZs does a region typically have?', 'Why deploy across multiple AZs?'],
  },
  // ─── IAM ──────────────────────────────────────────────────────────────────
  {
    question: 'What is AWS IAM and what are its key components?',
    answer: 'IAM (Identity and Access Management) controls who can do what in your AWS account. Key components: Users — individual identities with credentials. Groups — collection of users sharing the same permissions. Roles — temporary identities assumed by services, EC2 instances, or cross-account access. Policies — JSON documents defining permissions (Allow/Deny specific actions on specific resources). The root account should never be used for daily tasks — create IAM users instead. Always follow the principle of least privilege.',
    difficulty: 'beginner',
    tip: 'Interviewers love the least privilege principle and the difference between users vs roles.',
  },
  {
    question: 'What is the difference between an IAM Role and an IAM User?',
    answer: 'An IAM User is a permanent identity with long-term credentials (username/password or access keys) representing a person or application. An IAM Role is a temporary identity with no permanent credentials — it is assumed by trusted entities (EC2 instances, Lambda functions, other AWS accounts) and provides short-lived credentials via STS (Security Token Service). Best practice: EC2 instances and Lambda functions should always use Roles (not hardcoded access keys). Cross-account access should use Roles.',
    difficulty: 'intermediate',
    followUp: ['What is the principle of least privilege?', 'What is STS?'],
  },
  // ─── EC2 ──────────────────────────────────────────────────────────────────
  {
    question: 'What is AWS EC2 and what are the different instance purchasing options?',
    answer: 'EC2 (Elastic Compute Cloud) provides resizable virtual machines (instances) in the cloud. Purchasing options: On-Demand — pay per second/hour, most flexible, most expensive. Reserved Instances — commit to 1 or 3 years, up to 75% discount, best for steady workloads. Spot Instances — bid on unused capacity, up to 90% discount, can be interrupted with 2-minute warning, best for fault-tolerant batch jobs. Savings Plans — flexible discount in exchange for committing to a $ spend per hour. Dedicated Hosts — physical server dedicated to you, for compliance/licensing.',
    difficulty: 'beginner',
    tip: 'Know which instance type to use for which scenario — this is a common scenario question.',
  },
  {
    question: 'What is an AMI (Amazon Machine Image)?',
    answer: 'An AMI is a pre-configured template used to launch EC2 instances. It includes the OS, application server, and any pre-installed software. You can use AWS-provided AMIs (Amazon Linux, Ubuntu, Windows), Marketplace AMIs, or create your own custom AMIs. Creating a custom AMI lets you bake in your application setup so new instances launch ready-to-serve. AMIs are region-specific but can be copied across regions. Key use: creating Auto Scaling Groups from a configured AMI ensures all instances are identical.',
    difficulty: 'beginner',
  },
  {
    question: 'What is the difference between EBS and instance store?',
    answer: 'EBS (Elastic Block Store) is a persistent network-attached storage volume. Data survives instance stop/restart. Can be detached and attached to another instance. Supports snapshots to S3. Best for databases and OS volumes. Instance Store is ephemeral storage physically attached to the host — extremely fast (NVMe SSD) but ALL DATA IS LOST when the instance stops, terminates, or fails. Best for temporary data: buffers, caches, scratch files. Rule: use EBS for anything you need to keep, instance store for temporary high-speed scratch space.',
    difficulty: 'intermediate',
    followUp: ['What EBS volume types exist?', 'What is EBS Multi-Attach?'],
  },
  // ─── LOAD BALANCING & AUTO SCALING ────────────────────────────────────────
  {
    question: 'What is Elastic Load Balancing and what are the different types?',
    answer: 'ELB distributes incoming traffic across multiple targets (EC2 instances, containers, IPs) in one or more AZs. Three types: Application Load Balancer (ALB) — Layer 7, HTTP/HTTPS, routes based on URL path, hostname, headers — best for web apps and microservices. Network Load Balancer (NLB) — Layer 4, TCP/UDP, ultra-low latency, millions of RPS, preserves client IP — best for gaming, IoT, financial apps. Gateway Load Balancer (GWLB) — deploys and scales third-party virtual appliances (firewalls, IDS). Classic Load Balancer (deprecated).',
    difficulty: 'intermediate',
    tip: 'ALB = smart routing at HTTP level. NLB = raw speed at TCP level.',
  },
  {
    question: 'What is Auto Scaling and how does it work?',
    answer: 'Auto Scaling Groups (ASG) automatically adjust the number of EC2 instances based on demand. Key settings: Min capacity (never go below), Max capacity (never exceed), Desired capacity (target count). Scaling policies: Target Tracking — maintain a metric at a target value (e.g., CPU at 50%). Step Scaling — scale by specific amounts when alarms trigger. Scheduled Scaling — scale at known times. ASG integrates with ELB to automatically register/deregister instances. Health checks replace unhealthy instances automatically.',
    difficulty: 'intermediate',
    followUp: ['What is a launch template?', 'How does cooldown period work?'],
  },
  // ─── S3 ───────────────────────────────────────────────────────────────────
  {
    question: 'What is Amazon S3 and what are its storage classes?',
    answer: 'S3 (Simple Storage Service) is object storage with virtually unlimited capacity, 99.999999999% (11 nines) durability, and 99.99% availability. Storage classes: S3 Standard — frequently accessed data, lowest latency, most expensive. S3 Standard-IA — infrequent access, lower cost, retrieval fee. S3 One Zone-IA — like IA but single AZ, for non-critical data. S3 Glacier Instant Retrieval — archives, millisecond retrieval. S3 Glacier Flexible Retrieval — minutes to hours retrieval. S3 Glacier Deep Archive — lowest cost, 12-48 hour retrieval. Intelligent-Tiering — auto-moves objects between tiers based on access patterns.',
    difficulty: 'beginner',
    tip: 'Know when to use each storage class — Glacier for archives, Standard for active data.',
  },
  {
    question: 'What is S3 versioning and why would you use it?',
    answer: 'S3 versioning keeps multiple versions of an object in the same bucket. When enabled, every PUT/DELETE creates a new version rather than overwriting. Benefits: Recover accidentally deleted objects (delete marker instead of true deletion). Restore previous versions of files. Protection against unintended overwrites. Once enabled, versioning cannot be disabled (only suspended). Works well with lifecycle policies to expire old versions. Cost consideration: all versions count toward storage billing.',
    difficulty: 'intermediate',
    followUp: ['What is MFA Delete?', 'How does a lifecycle policy work with versioning?'],
  },
  {
    question: 'What is the difference between S3 pre-signed URLs and S3 bucket policies?',
    answer: 'A pre-signed URL grants temporary, time-limited access to a specific S3 object without changing bucket permissions. The URL embeds the creator\'s credentials and an expiry time. Use case: allow users to download a private file for 1 hour. A bucket policy is a resource-based IAM policy attached to the bucket that controls access for all requests (who can read/write the bucket). Use case: make a bucket public, restrict access to a specific VPC. Pre-signed URL = temporary object-level access. Bucket policy = permanent bucket-level rules.',
    difficulty: 'intermediate',
  },
  // ─── RDS & DATABASES ──────────────────────────────────────────────────────
  {
    question: 'What is Amazon RDS and what databases does it support?',
    answer: 'RDS (Relational Database Service) is a managed database service that handles provisioning, patching, backups, and failover automatically. Supported engines: MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, and Amazon Aurora. RDS removes DBA overhead — AWS manages OS patching and database software updates. You still control database-level settings. Does NOT give OS/SSH access. Key features: automated backups (point-in-time recovery up to 35 days), read replicas for read scaling, Multi-AZ for high availability.',
    difficulty: 'beginner',
  },
  {
    question: 'What is the difference between RDS Multi-AZ and Read Replicas?',
    answer: 'Multi-AZ is for High Availability and Disaster Recovery. AWS maintains a synchronous standby replica in another AZ. If the primary fails, automatic failover to standby in 1-2 minutes. The standby cannot serve read traffic — it is purely a failover target. Read Replicas are for Read Scalability. They use asynchronous replication from the primary. Can be in the same AZ, different AZ, or even different region. Can serve SELECT queries to offload the primary. Can be promoted to standalone DB. Rule: Multi-AZ = HA/DR, Read Replica = performance/scaling.',
    difficulty: 'intermediate',
    tip: 'Multi-AZ = standby (not readable). Read Replica = readable but not for failover (unless promoted).',
  },
  {
    question: 'What is Amazon Aurora and how does it differ from standard RDS?',
    answer: 'Aurora is AWS\'s proprietary cloud-native relational database, compatible with MySQL and PostgreSQL. Key differences from standard RDS: Storage auto-scales from 10GB to 128TB in 10GB increments. 6 copies of data across 3 AZs (highly durable). Up to 15 read replicas (vs 5 for RDS MySQL). Faster failover than RDS (under 30 seconds). Aurora Serverless: auto-pauses when inactive, scales compute on demand — ideal for intermittent workloads. Aurora Global Database: replicate across regions with <1 second latency. Aurora is typically 5x faster than MySQL and 3x faster than PostgreSQL on RDS.',
    difficulty: 'intermediate',
  },
  // ─── DYNAMODB ─────────────────────────────────────────────────────────────
  {
    question: 'What is Amazon DynamoDB and when should you use it?',
    answer: 'DynamoDB is a fully managed serverless NoSQL key-value and document database with single-digit millisecond performance at any scale. Use it when: you need millions of requests per second. You have simple access patterns (get/put by key). You need auto-scaling with no capacity planning. Data doesn\'t require complex joins or transactions. Avoid DynamoDB when: you need complex queries/joins. You have unpredictable or highly complex access patterns. Data relationships are important. Core concepts: Table, Items (rows), Attributes (columns). Primary key = Partition Key (required) + Sort Key (optional).',
    difficulty: 'intermediate',
    followUp: ['What is a DynamoDB GSI vs LSI?', 'What is DynamoDB Streams?'],
  },
  {
    question: 'What is the difference between DynamoDB provisioned and on-demand capacity?',
    answer: 'Provisioned Capacity: you specify RCUs (Read Capacity Units) and WCUs (Write Capacity Units) in advance. Can use Auto Scaling to adjust. Best for predictable, steady traffic — cheaper at high sustained loads. 1 RCU = 1 strongly consistent read per second for items up to 4KB. 1 WCU = 1 write per second for items up to 1KB. On-Demand Capacity: no capacity planning — DynamoDB handles it automatically. Pay per request. Best for unpredictable traffic, new applications, or spiky workloads. More expensive per request than provisioned at high volume.',
    difficulty: 'intermediate',
  },
  // ─── LAMBDA ───────────────────────────────────────────────────────────────
  {
    question: 'What is AWS Lambda and what are its key limits?',
    answer: 'Lambda is a serverless compute service that runs code in response to events without provisioning or managing servers. You pay only for compute time consumed (100ms increments). Supports Node.js, Python, Java, Go, C#, Ruby, and custom runtimes. Key limits: Max execution time = 15 minutes. Max memory = 10GB. Deployment package size = 50MB (zipped), 250MB unzipped. Ephemeral disk (/tmp) = 512MB to 10GB. Cold starts: first invocation takes longer as Lambda provisions a container. Triggers: API Gateway, S3 events, DynamoDB Streams, SQS, SNS, CloudWatch Events, etc.',
    difficulty: 'intermediate',
    tip: '15-minute limit means Lambda is NOT for long-running processes — use ECS/Fargate instead.',
  },
  {
    question: 'What is a Lambda cold start and how do you minimize it?',
    answer: 'A cold start occurs when Lambda needs to provision a new execution environment for your function — downloading code, starting the runtime, running initialization code. This adds latency (100ms to several seconds depending on language and package size). Warm starts reuse the existing container. Minimization strategies: Use Provisioned Concurrency (Lambda pre-warms X instances at a cost). Minimize package size and dependencies. Prefer Go or Python over Java (faster runtime startup). Keep initialization code outside the handler (runs once per container). Use Snapstart for Java Lambda functions (AWS pre-initializes). Avoid VPC unless needed (adds ~several hundred ms).',
    difficulty: 'advanced',
  },
  // ─── CLOUDFORMATION ───────────────────────────────────────────────────────
  {
    question: 'What is AWS CloudFormation and what is Infrastructure as Code?',
    answer: 'CloudFormation is AWS\'s IaC (Infrastructure as Code) service that lets you define and provision AWS infrastructure using YAML or JSON templates. Instead of clicking in the console, you write templates that describe resources (EC2, RDS, S3, etc.) and CloudFormation creates/updates/deletes them in the correct order. Benefits: version control your infrastructure, repeatable deployments, stack-based management (create/delete entire environment with one command), drift detection. Key concepts: Template (YAML/JSON definition), Stack (instantiation of a template), StackSet (deploy across multiple accounts/regions).',
    difficulty: 'intermediate',
    followUp: ['What is CDK vs CloudFormation?', 'What is Terraform vs CloudFormation?'],
  },
  // ─── CLOUDFRONT & ROUTE 53 ────────────────────────────────────────────────
  {
    question: 'What is Amazon CloudFront and how does it work?',
    answer: 'CloudFront is AWS\'s CDN (Content Delivery Network) that caches content at 400+ Edge Locations worldwide, reducing latency by serving users from the nearest location. Works with S3, ALB, EC2, or any HTTP origin. Key concepts: Distribution (your CloudFront config), Origin (where content comes from), Edge Location (cache location), TTL (how long content is cached). Cache behaviors route different paths to different origins. CloudFront also provides DDoS protection via Shield Standard, HTTPS support, and Origin Access Control to restrict S3 bucket access to CloudFront only.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is Amazon Route 53 and what routing policies does it support?',
    answer: 'Route 53 is AWS\'s scalable DNS service and domain registrar. Routing policies: Simple — single resource, no health check. Weighted — split traffic by percentage (A/B testing, blue/green deploy). Latency-based — route to region with lowest latency for the user. Failover — primary/secondary with health checks (active-passive DR). Geolocation — route by user country/continent. Geoproximity — route by geographic distance with bias. Multi-value Answer — return multiple healthy IPs (basic load balancing at DNS level). Health Checks: Route 53 can health-check endpoints and remove unhealthy ones from DNS.',
    difficulty: 'intermediate',
    tip: 'Know Weighted for A/B testing, Failover for DR, and Latency for global performance.',
  },
  // ─── VPC & NETWORKING ─────────────────────────────────────────────────────
  {
    question: 'What is a VPC and what are its core components?',
    answer: 'A VPC (Virtual Private Cloud) is your own isolated network within AWS. Core components: Subnets — segment the VPC into public (internet-accessible) and private (no direct internet) ranges. Internet Gateway (IGW) — allows public subnets to reach the internet. NAT Gateway — allows private subnets to reach the internet for outbound traffic (updates, APIs) without being reachable inbound. Route Tables — define where traffic goes. Security Groups — stateful firewall at the instance level (allow rules only). NACLs — stateless firewall at the subnet level (allow and deny rules). VPC Peering — connect two VPCs directly.',
    difficulty: 'intermediate',
    tip: 'Security Group = stateful (return traffic auto-allowed). NACL = stateless (must allow both directions).',
  },
  // ─── ECS, EKS, AMPLIFY ────────────────────────────────────────────────────
  {
    question: 'What is the difference between ECS and EKS?',
    answer: 'ECS (Elastic Container Service) is AWS\'s proprietary container orchestration service. Simpler to set up and deeply integrated with AWS services. Uses task definitions (like docker-compose). Launch types: EC2 (you manage instances) or Fargate (serverless containers — AWS manages compute). EKS (Elastic Kubernetes Service) runs Kubernetes on AWS. More complex but industry-standard, portable across clouds. Use ECS when: you are AWS-only and want simplicity. Use EKS when: you already use Kubernetes, need portability, or have complex multi-cluster needs. Fargate works with both and eliminates server management entirely.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is AWS Amplify and what does it provide?',
    answer: 'AWS Amplify is a full-stack platform for building web and mobile apps faster. It includes: Amplify Hosting — CI/CD hosting for frontend apps (React, Next.js, Vue) with git-based deployments, similar to Vercel/Netlify. Amplify Studio — visual interface to build backend resources. Amplify Libraries — client SDKs for Auth (Cognito), Storage (S3), API (GraphQL/REST), and Analytics. Amplify Gen 2 uses TypeScript for infrastructure definition. Best for: frontend developers who need backend without deep AWS knowledge. Not ideal when: you need full control over infrastructure or have complex backend requirements.',
    difficulty: 'beginner',
  },
  // ─── SCENARIO QUESTIONS ────────────────────────────────────────────────────
  {
    question: 'How would you design a highly available web application on AWS?',
    answer: 'Use multiple AZs: Deploy EC2 instances (or ECS/EKS) across 2+ AZs. Put an Application Load Balancer in front to distribute traffic. Use an Auto Scaling Group to handle load and replace unhealthy instances. For the database: RDS Multi-AZ for automatic failover, and Read Replicas to scale reads. Use ElastiCache (Redis) for session storage and caching — do NOT store sessions on EC2 (stateless instances). Store static assets on S3 + CloudFront. Use Route 53 health checks for DNS failover. Put secrets in AWS Secrets Manager. Use private subnets for databases and app servers; public subnets only for the load balancer.',
    difficulty: 'advanced',
  },
  {
    question: 'What is the difference between horizontal and vertical scaling on AWS?',
    answer: 'Vertical scaling (scale up) means increasing the size of an instance — e.g., upgrading from t3.micro to m5.xlarge. Simple but has limits, requires downtime to change instance type, and a single point of failure remains. Horizontal scaling (scale out) means adding more instances — enabled by Auto Scaling Groups and load balancers. No upper limit, no single point of failure, can scale during traffic spikes with zero downtime. AWS strongly favors horizontal scaling: design stateless applications, offload state to RDS/ElastiCache/S3, and use Auto Scaling to add/remove instances automatically.',
    difficulty: 'intermediate',
    tip: 'AWS is designed for horizontal scaling. Interviewers want stateless app design + ASG + ELB.',
  },
  {
    question: 'What is the shared responsibility model in AWS?',
    answer: 'AWS is responsible for security OF the cloud: physical infrastructure, hardware, networking, hypervisor, managed service software. You are responsible for security IN the cloud: OS patching (for EC2), application security, IAM configuration, data encryption, network configuration (security groups, NACLs), and customer data. Example splits: For EC2 — AWS secures the physical host, you patch the OS and configure the firewall. For RDS — AWS patches the database engine, you configure access controls and encryption. For Lambda — AWS manages everything below the function code, you secure the function itself and its permissions.',
    difficulty: 'beginner',
    tip: 'Always comes up in interviews. Remember: AWS = security OF the cloud, You = security IN the cloud.',
  },
];
