import { createModuleLogger } from '@/lib/monitoring/logger';

const logger = createModuleLogger('queue-manager');

// Queue manager simplificado para producción
export interface JobOptions {
  delay?: number;
  priority?: number;
  attempts?: number;
  backoff?: number;
}

export interface Job<T = any> {
  id: string;
  data: T;
  options: JobOptions;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export type ProcessCallbackFunction<T = any> = (job: Job<T>) => Promise<void>;

export class QueueManager {
  private queues: Map<string, Queue<any>> = new Map();
  private isConnected: boolean = false;

  constructor() {
    logger.info('Queue manager initialized');
  }

  async connect(): Promise<void> {
    try {
      this.isConnected = true;
      logger.info('Queue manager connected');
    } catch (error) {
      logger.error('Failed to connect queue manager', { error });
      this.isConnected = false;
      throw error;
    }
  }

  async createQueue<T = any>(name: string, concurrency: number = 1): Promise<Queue<T>> {
    if (!this.isConnected) {
      throw new Error('Queue manager not connected');
    }

    const queue = new Queue<T>(name, concurrency);
    this.queues.set(name, queue);
    
    logger.info(`Queue created: ${name} with concurrency ${concurrency}`);
    return queue;
  }

  async addJob<T = any>(
    queueName: string,
    data: T,
    options: JobOptions = {}
  ): Promise<Job<T>> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const job: Job<T> = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      data,
      options,
      status: 'pending',
      attempts: 0,
      createdAt: new Date(),
    };

    await queue.addJob(job);
    logger.debug(`Job added to queue ${queueName}`, { jobId: job.id });
    
    return job;
  }

  async processQueue<T = any>(
    queueName: string,
    callback: ProcessCallbackFunction<T>
  ): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    queue.setProcessor(callback);
    logger.info(`Processor set for queue: ${queueName}`);
  }

  async getJob(queueName: string, jobId: string): Promise<Job<any> | null> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      return null;
    }

    return queue.getJob(jobId);
  }

  async getQueueStats(queueName: string): Promise<{ pending: number; processing: number; completed: number; failed: number }> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      return { pending: 0, processing: 0, completed: 0, failed: 0 };
    }

    return queue.getStats();
  }

  async close(): Promise<void> {
    try {
      this.isConnected = false;
      this.queues.clear();
      logger.info('Queue manager closed');
    } catch (error) {
      logger.error('Failed to close queue manager', { error });
    }
  }
}

export class Queue<T = any> {
  private name: string;
  private concurrency: number;
  private jobs: Job<T>[] = [];
  private processor?: ProcessCallbackFunction<T>;
  private isProcessing: boolean = false;

  constructor(name: string, concurrency: number = 1) {
    this.name = name;
    this.concurrency = concurrency;
  }

  async addJob(job: Job<T>): Promise<void> {
    this.jobs.push(job);
    logger.debug(`Job added to queue ${this.name}`, { jobId: job.id });
    
    if (!this.isProcessing) {
      this.processJobs();
    }
  }

  setProcessor(callback: ProcessCallbackFunction<T>): void {
    this.processor = callback;
  }

  async getJob(jobId: string): Promise<Job<T> | null> {
    return this.jobs.find(job => job.id === jobId) || null;
  }

  getStats(): { pending: number; processing: number; completed: number; failed: number } {
    return {
      pending: this.jobs.filter(job => job.status === 'pending').length,
      processing: this.jobs.filter(job => job.status === 'processing').length,
      completed: this.jobs.filter(job => job.status === 'completed').length,
      failed: this.jobs.filter(job => job.status === 'failed').length,
    };
  }

  private async processJobs(): Promise<void> {
    if (this.isProcessing || !this.processor) return;

    this.isProcessing = true;
    logger.debug(`Starting to process queue ${this.name}`);

    while (this.jobs.length > 0) {
      const pendingJobs = this.jobs.filter(job => job.status === 'pending');
      if (pendingJobs.length === 0) break;

      const job = pendingJobs[0];
      job.status = 'processing';
      job.processedAt = new Date();

      try {
        await this.processor(job);
        job.status = 'completed';
        job.completedAt = new Date();
        logger.debug(`Job completed successfully`, { jobId: job.id, queue: this.name });
      } catch (error) {
        job.status = 'failed';
        job.attempts += 1;
        job.error = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Job failed`, { jobId: job.id, queue: this.name, error: job.error });
      }
    }

    this.isProcessing = false;
    logger.debug(`Finished processing queue ${this.name}`);
  }
}

export default QueueManager;
