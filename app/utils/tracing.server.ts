// app/utils/tracing.server.ts

import { trace, context } from '@opentelemetry/api';

export function createSpan(name: string, fn: () => Promise<any>) {
  const tracer = trace.getTracer('my-remix-app');
  
  return tracer.startActiveSpan(name, async (span) => {
    try {
      const result = await fn();
      span.end();
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: 2, message: error.message });
      span.end();
      throw error;
    }
  });
}
