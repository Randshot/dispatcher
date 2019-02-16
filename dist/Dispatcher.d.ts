import * as compose from 'koa-compose';
import { Dispatch, Command } from './types';
import { Registry } from './Registry';
declare type ContextFunction<R = void> = (ctx: Dispatch.Context) => R;
export declare const argument: unique symbol;
export declare class Dispatcher<C extends Command = Command> {
    private middleware;
    private _registry;
    private options;
    private _prefixes;
    private _started;
    constructor(options: Dispatch.Options);
    /**
     * Dispatcher middleware
     */
    commands(): compose.Middleware<Dispatch.Context<C>>;
    /**
     * Add new middleware inside Dispatcher
     * @param fn middleware function
     */
    use(fn: Dispatch.middleware<C>): this;
    /**
     * Add new command in Dispatcher
     * @param command command
     */
    register(command: C): this;
    /**
     * Check if dispatcher should handle the message
     * @param message discord message
     */
    shouldHandle({ message, app }: Dispatch.Context): boolean;
    /**
     * Set custom shouldHandle function
     * @param fn custom shouldHandle function
     */
    setCustomShouldHandle(fn: ContextFunction<boolean>): this;
    /**
     * Extract prefix from message content
     * @param context Dispatcher context
     */
    extractPrefix({ message, state }: Dispatch.Context): void;
    /**
     * Set custom extractPrefix function
     * @param fn custom extractPrefix function
     */
    setCustomExtractPrefix(fn: ContextFunction): this;
    /**
     * Extract command from message content
     * @param context Dispatcher context
     */
    extractCommand({ message, state }: Dispatch.Context): void;
    /**
     * Set custom extractCommand function
     * @param fn custom extractCommand function
     */
    setCustomExtractCommand(fn: ContextFunction): this;
    /**
     * Extract arguments from message content
     * @param context Dispatcher context
     */
    extractArgument({ message, state, params }: Dispatch.Context): void;
    /**
     * Set custom extractArgument function
     * @param fn custom extractArgument function
     */
    setCustomExtractArgument(fn: ContextFunction): this;
    /**
     * Throw if Dispatcher is already started
     * @param message message to throw
     */
    private throwIfAlreadyStarted;
    /**
     * If the Dispatcher is already started
     */
    readonly started: boolean;
    /**
     * Get Commands registry
     */
    readonly registry: Registry<C>;
    /**
     * Get all possible prefixes
     */
    readonly prefixes: string[];
    /**
     * Default options for pathToRegexp
     */
    static PATHTOREGEXP_DEFAULT: Dispatch.PathToRegexpOptions;
}
/**
 * Create Dispatcher context
 * @param ctx dispatcher context
 */
export declare function createDispatcherContext(ctx: Dispatch.Context): void;
export {};
