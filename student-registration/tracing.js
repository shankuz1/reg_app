const { NodeSDK } = require('@opentelemetry/sdk-node');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const { Resource } = require('@opentelemetry/resources');

const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const { ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

// const otlpEndpoint = 'http://otel-collector:4318/v1/traces';

//console.log(`OTLPTraceExporter configured to send trace data to: ${otlpEndpoint}`);

// const traceExporter = new OTLPTraceExporter({
//   url: 'http://otel-collector:4318/v1/traces',
//});

// Create our own NodeTracerProvider with resource attributes.
const tracerProvider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'backend-service',
  }),
});


tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

// **Register the tracer provider globally**
tracerProvider.register();


const sdk = new NodeSDK({
  tracerProvider: tracerProvider, 
  traceExporter : new OTLPTraceExporter({
    url: 'http://otel-collector:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});


sdk.start();


process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
