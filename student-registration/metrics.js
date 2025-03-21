// metrics.js

// [1] Import the MeterProvider from OpenTelemetry's metrics SDK.
const { MeterProvider } = require('@opentelemetry/sdk-metrics-base');

// [2] Import the OTLPMetricExporter to export metrics using the OTLP protocol over HTTP.
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');

// [3] Determine the OTLP metrics endpoint from an environment variable, or use the default.
const otlpMetricEndpoint = process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT || 'http://localhost:4318/v1/metrics';

// [4] Log the endpoint so you can verify the configuration at runtime.
console.log(`OTLPMetricExporter configured to send metrics data to: ${otlpMetricEndpoint}`);

// [5] Create an instance of the OTLPMetricExporter with the specified endpoint.
const metricExporter = new OTLPMetricExporter({
  url: otlpMetricEndpoint,
});

// [6] Create a MeterProvider, setting it up to use the OTLP metric exporter.
// The "interval" specifies how frequently metrics will be exported (in milliseconds).
const meterProvider = new MeterProvider({
  exporter: metricExporter,
  interval: 1000, // export metrics every 1 second
});

// [7] Instead of calling meterProvider.register(), set the global MeterProvider.
const { metrics } = require('@opentelemetry/api');
metrics.setGlobalMeterProvider(meterProvider);

// [8] Obtain a Meter from the provider; this meter will be used to create instruments (e.g., counters, histograms).
const meter = meterProvider.getMeter('backend-service');

// [9] Export the meter so it can be imported and used elsewhere in your application.
module.exports = meter;
