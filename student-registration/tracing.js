// tracing.js

// Import the NodeSDK from OpenTelemetry to initialize the tracing SDK.
const { NodeSDK } = require('@opentelemetry/sdk-node');
// Import the NodeTracerProvider to create our own tracer provider.
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');

// Import the auto instrumentations package to automatically instrument Node.js libraries.
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

// Import the OTLP HTTP trace exporter to send traces to a collector (Tempo, etc.).
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

// Import Resource to add metadata about the service.
const { Resource } = require('@opentelemetry/resources');

// Import semantic conventions for standardized attribute keys.
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// Import ConsoleSpanExporter and SimpleSpanProcessor to output spans to the console.
const { ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

// Determine the OTLP endpoint from the environment variable, or use the default.
const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://otel-collector:4318/v1/traces';

// Log the endpoint so that we know where trace data is being sent.
console.log(`OTLPTraceExporter configured to send trace data to: ${otlpEndpoint}`);

// Create an instance of the OTLP exporter.
const traceExporter = new OTLPTraceExporter({
  url: otlpEndpoint,
});

// Create our own NodeTracerProvider with resource attributes.
const tracerProvider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'backend-service',
  }),
});

// Add a ConsoleSpanExporter via a SimpleSpanProcessor to the tracer provider.
// This will output completed spans to the console.
tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

// **Register the tracer provider globally**
tracerProvider.register();

// Create and configure the NodeSDK for tracing by passing in our tracer provider.
const sdk = new NodeSDK({
  tracerProvider,
  traceExporter,
  // Automatically instrument supported Node libraries (like Express, HTTP, etc.).
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start the OpenTelemetry SDK (initializes instrumentation and exporters).
sdk.start();

// Listen for the SIGTERM signal to gracefully shut down the SDK.
// This ensures all pending traces are flushed before the process exits.
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
