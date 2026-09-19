import type { Lesson } from '@/types';

import { introductionLesson } from './01-introduction';
import { systemDesignThinkingLesson } from './02-system-design-thinking';
import { architectureFundamentalsLesson } from './03-architecture-fundamentals';
import { monolithLesson } from './04-monolith-architecture';
import { microservicesLesson } from './05-microservices-architecture';
import { apisLesson } from './06-apis';
import { scalabilityLesson } from './07-scalability';
import { loadBalancersLesson } from './08-load-balancers';
import { cachingLesson } from './09-caching';
import { cdnLesson } from './10-cdn';
import { databasesSystemDesignLesson } from './11-databases-system-design';
import { distributedSystemsLesson } from './12-distributed-systems';
import { messagingSystemsLesson } from './13-messaging-systems';
import { rateLimitingLesson } from './14-rate-limiting';
import { apiGatewayLesson } from './15-api-gateway';
import { securityFundamentalsLesson } from './16-security-fundamentals';
import { highLevelDesignLesson } from './17-high-level-design';
import { lowLevelDesignLesson } from './17-low-level-design';
import { designPatternsLesson } from './18-design-patterns';
import { caseStudiesLesson } from './19-case-studies';
import { interviewPrepLesson } from './20-interview-preparation';
import { exercisesLesson } from './21-exercises';
import { revisionHubLesson } from './22-revision-hub';

export const lessons: Lesson[] = [
  introductionLesson,
  systemDesignThinkingLesson,
  architectureFundamentalsLesson,
  monolithLesson,
  microservicesLesson,
  apisLesson,
  scalabilityLesson,
  loadBalancersLesson,
  cachingLesson,
  cdnLesson,
  databasesSystemDesignLesson,
  distributedSystemsLesson,
  messagingSystemsLesson,
  rateLimitingLesson,
  apiGatewayLesson,
  securityFundamentalsLesson,
  highLevelDesignLesson,
  lowLevelDesignLesson,
  designPatternsLesson,
  caseStudiesLesson,
  interviewPrepLesson,
  exercisesLesson,
  revisionHubLesson,
];
