import { createModuleLogger } from './logger';

const logger = createModuleLogger('metrics');

// Métricas simplificadas para producción
class MetricsManager {
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();

  // Counter metrics
  incrementCounter(name: string, value: number = 1, labels?: Record<string, string>): void {
    const key = this.buildKey(name, labels);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);
    logger.debug(`Counter incremented: ${key} = ${current + value}`);
  }

  getCounter(name: string, labels?: Record<string, string>): number {
    const key = this.buildKey(name, labels);
    return this.counters.get(key) || 0;
  }

  // Gauge metrics
  setGauge(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.buildKey(name, labels);
    this.gauges.set(key, value);
    logger.debug(`Gauge set: ${key} = ${value}`);
  }

  getGauge(name: string, labels?: Record<string, string>): number {
    const key = this.buildKey(name, labels);
    return this.gauges.get(key) || 0;
  }

  // Histogram metrics
  observeHistogram(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.buildKey(name, labels);
    const current = this.histograms.get(key) || [];
    current.push(value);
    this.histograms.set(key, current);
    logger.debug(`Histogram observation: ${key} = ${value}`);
  }

  getHistogram(name: string, labels?: Record<string, string>): { count: number; sum: number; avg: number; min: number; max: number } {
    const key = this.buildKey(name, labels);
    const values = this.histograms.get(key) || [];
    
    if (values.length === 0) {
      return { count: 0, sum: 0, avg: 0, min: 0, max: 0 };
    }

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return { count: values.length, sum, avg, min, max };
  }

  // Build metric key with labels
  private buildKey(name: string, labels?: Record<string, string>): string {
    if (!labels) return name;
    
    const labelPairs = Object.entries(labels)
      .map(([key, value]) => `${key}="${value}"`)
      .join(',');
    
    return `${name}{${labelPairs}}`;
  }

  // Get all metrics as Prometheus format
  getMetrics(): string {
    const lines: string[] = [];
    
    // Counters
    for (const [key, value] of this.counters) {
      lines.push(`# HELP ${key} Counter metric`);
      lines.push(`# TYPE ${key} counter`);
      lines.push(`${key} ${value}`);
    }
    
    // Gauges
    for (const [key, value] of this.gauges) {
      lines.push(`# HELP ${key} Gauge metric`);
      lines.push(`# TYPE ${key} gauge`);
      lines.push(`${key} ${value}`);
    }
    
    // Histograms
    for (const [key, values] of this.histograms) {
      const stats = this.getHistogram(key);
      lines.push(`# HELP ${key} Histogram metric`);
      lines.push(`# TYPE ${key} histogram`);
      lines.push(`${key}_count ${stats.count}`);
      lines.push(`${key}_sum ${stats.sum}`);
      lines.push(`${key}_avg ${stats.avg}`);
      lines.push(`${key}_min ${stats.min}`);
      lines.push(`${key}_max ${stats.max}`);
    }
    
    return lines.join('\n');
  }

  // Reset all metrics
  reset(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    logger.info('All metrics reset');
  }

  // Get metrics summary
  getSummary(): Record<string, any> {
    return {
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      histograms: Object.fromEntries(
        Array.from(this.histograms.entries()).map(([key, values]) => [
          key,
          this.getHistogram(key)
        ])
      )
    };
  }
}

export const metricsManager = new MetricsManager();
export default metricsManager;
