// Type definitions for workerpool 2.3
// Project: https://github.com/josdejong/workerpool
// Definitions by: Alorel <https://github.com/Alorel>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export interface WorkerPoolStats {
    totalWorkers: number;
    busyWorkers: number;
    idleWorkers: number;
    pendingTasks: number;
    activeTasks: number;
}

export interface WorkerPool {
    /**
     * Execute a function on a worker with given arguments.
     * @param method When method is a string, a method with this name must exist at the worker and must be registered to make it accessible via the pool. The function will be executed on the worker with given parameters. When method is a function, the provided function fn will be stringified, send to the worker, and executed there with the provided parameters. The provided function must be static, it must not depend on variables in a surrounding scope.
     */
    exec(method: Function | string, params: any[] | null): Promise<any>;

    /** 
     * Create a proxy for the worker pool.
     * The proxy contains a proxy for all methods available on the worker.
     * All methods return promises resolving the methods result.
     */
    proxy(): Promise<any>;

    /** Retrieve statistics on workers, and active and pending tasks. */
    stats(): WorkerPoolStats;

    /**
     * If parameter force is false (default), workers will finish the tasks they are working on before terminating themselves.
     * When force is true, all workers are terminated immediately without finishing running tasks.
     * If timeout is provided, worker will be forced to terminal when the timeout expires and the worker has not finished.
     */
    terminate(force?: boolean, timeout?: number): WorkerPromise<any[]>;

    /**
     * Clear all workers from the pool.
     * If parameter force is false (default), workers will finish the tasks they are working on before terminating themselves.
     * When force is true, all workers are terminated immediately without finishing running tasks.
     * @deprecated
     */
    clear(force?: boolean): WorkerPromise<any[]>;
}

declare class CancellationError extends Error {
    name: 'CancellationError';
}

declare class TimeoutError extends Error {
    name: 'TimeoutError';
}

export class WorkerPromise<T, E = Error> {
    readonly resolved: boolean;
    readonly rejected: boolean;
    readonly pending: boolean;

    always<TT>(handler: () => WorkerPromise<TT>): WorkerPromise<TT>;
    then<TT, EE = Error>(result: (r: T) => TT, err?: (r: E) => EE): WorkerPromise<TT, EE>;
    catch<TT>(err: (error: E) => TT): WorkerPromise<TT>;
    cancel(): this;
    timeout(delay: number): this;

    static CancellationError: CancellationError;
    static TimeoutError: TimeoutError;
    static all(promises: WorkerPromise<any, any>[]): WorkerPromise<any, any>[];
}

export interface WorkerPoolOptions {
    /**
     * The minimum number of workers that must be initialized and kept available.
     * Setting this to 'max' will create maxWorkers default workers.
     */
    minWorkers?: number | 'max';
    /**
     * The default number of maxWorkers is the number of CPU's minus one.
     * When the number of CPU's could not be determined (for example in older browsers), maxWorkers is set to 3.
     */
    maxWorkers?: number;
}

/**
 * When a script argument is provided, the provided script will be started as a dedicated worker.
 * When no script argument is provided, a default worker is started which can be used to offload functions dynamically via Pool.exec.
 * Note that on node.js, script must be an absolute file path like __dirname + '/myWorker.js'.
 */
export function pool(pathToScript?: string, options?: WorkerPoolOptions): WorkerPool;

/**
 * When a script argument is provided, the provided script will be started as a dedicated worker.
 * When no script argument is provided, a default worker is started which can be used to offload functions dynamically via Pool.exec.
 * Note that on node.js, script must be an absolute file path like __dirname + '/myWorker.js'.
 */
export function pool(options?: WorkerPoolOptions): WorkerPool;

/**
 * Argument methods is optional can can be an object with functions available in the worker.
 * Registered functions will be available via the worker pool.
 */
export function worker(methods?: {[k: string]: Function}): any;
export const platform: 'node' | 'browser';
export const isMainThread: boolean;
export const cpus: number;
