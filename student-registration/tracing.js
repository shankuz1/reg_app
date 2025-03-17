// tracing.js

// Import the NodeSDK from OpenTelemetry to initialize the tracing SDK.
const { NodeSDK } = require('@opentelemetry/sdk-node');

// Import the auto instrumentations package to automatically instrument Node.js libraries.
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

// Import the OTLP HTTP trace exporter to send traces to a collector (Tempo, etc.).
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

// Import Resource to add metadata about the service.
const { Resource } = require('@opentelemetry/resources');

// Import semantic conventions for standardized attribute keys.
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// Create an instance of the OTLP exporter.
// The URL here is set by an environment variable if available, or defaults to a local endpoint.
// Change the URL if your collector (e.g., Tempo) is running on a different host/port.
const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:55681/v1/traces',
});

// Create and configure the NodeSDK for tracing.
const sdk = new NodeSDK({
  // Define the resource attributes for this service (e.g., service name).
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'backend-service',
  }),
  // Set up the exporter that will send the trace data.
  traceExporter,
  // Automatically instrument supported Node libraries (like Express, HTTP, etc.).
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start the OpenTelemetry SDK.
// This call initializes all the instrumentation and exporters.
sdk.start();

// Listen for the SIGTERM signal to gracefully shut down the SDK.
// This ensures that all pending traces are flushed before the process exits.
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
