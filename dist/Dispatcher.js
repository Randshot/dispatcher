"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pathToRegexp = require("path-to-regexp");
const compose = require("koa-compose");
const Registry_1 = require("./Registry");
const util_1 = require("./util");
exports.argument = Symbol.for('@hershel/dispatcher.argument');
class Dispatcher {
    constructor(options) {
        this.middleware = [];
        this._registry = new Registry_1.Registry();
        util_1.assert(typeof options === 'object', 'options should be an object');
        this._prefixes = new Set(options.prefix);
        options.pathToRegexp = {
            ...Dispatcher.PATHTOREGEXP_DEFAULT,
            ...options.pathToRegexp
        };
        this.options = options;
    }
    /**
     * Dispatcher middleware
     */
    commands() {
        const composed = compose(this.middleware);
        const dispatch = async (ctx, next) => {
            if (!this.shouldHandle(ctx))
                return next();
            createDispatcherContext(ctx);
            const { dispatcher } = ctx.state;
            this.extractPrefix(ctx);
            if (!dispatcher.prefix.detected)
                return next();
            this.extractCommand(ctx);
            if (!dispatcher.command.resolved)
                return next();
            this.extractArgument(ctx);
            await composed(ctx);
            next();
        };
        return dispatch;
    }
    /**
     * Add new middleware inside Dispatcher
     * @param fn middleware function
     */
    use(fn) {
        this.throwIfAlreadyStarted('cannot add middleware');
        util_1.assert(typeof fn === 'function', 'provided middleware is not a function');
        this.middleware.push(fn);
        return this;
    }
    /**
     * Add new command in Dispatcher
     * @param command command
     */
    register(command) {
        this._registry.register(command);
        return this;
    }
    /**
     * Check if dispatcher should handle the message
     * @param message discord message
     */
    shouldHandle({ message, app }) {
        if (message.author.id === app.user.id)
            return false;
        if (message.author.bot)
            return false;
        return true;
    }
    /**
     * Set custom shouldHandle function
     * @param fn custom shouldHandle function
     */
    setCustomShouldHandle(fn) {
        this.throwIfAlreadyStarted('cannot set custom function');
        util_1.assert(typeof fn === 'function', 'ShouldHandle should be a function');
        this.shouldHandle = fn;
        return this;
    }
    /**
     * Extract prefix from message content
     * @param context Dispatcher context
     */
    extractPrefix({ message, state }) {
        const { prefix } = state.dispatcher;
        const content = message.content.trim();
        for (let p of this._prefixes) {
            if (content.startsWith(p)) {
                Object.assign(prefix, {
                    content: p,
                    detected: true,
                    length: p.length
                });
                break;
            }
        }
    }
    /**
     * Set custom extractPrefix function
     * @param fn custom extractPrefix function
     */
    setCustomExtractPrefix(fn) {
        this.throwIfAlreadyStarted('cannot set custom function');
        util_1.assert(typeof fn === 'function', 'ExtractPrefix should be a function');
        this.extractPrefix = fn;
        return this;
    }
    /**
     * Extract command from message content
     * @param context Dispatcher context
     */
    extractCommand({ message, state }) {
        const { prefix, command } = state.dispatcher;
        const name = message.content
            .slice(prefix.length)
            .trim()
            .split(' ')[0]
            .trim()
            .toLowerCase();
        command.alias = name;
        command.resolved = this._registry.resolve(name);
    }
    /**
     * Set custom extractCommand function
     * @param fn custom extractCommand function
     */
    setCustomExtractCommand(fn) {
        this.throwIfAlreadyStarted('cannot set custom function');
        util_1.assert(typeof fn === 'function', 'ExtractCommand should be a function');
        this.extractCommand = fn;
        return this;
    }
    /**
     * Extract arguments from message content
     * @param context Dispatcher context
     */
    extractArgument({ message, state, params }) {
        let { prefix } = state.dispatcher;
        let arg = state.dispatcher[exports.argument];
        const command = state.dispatcher.command;
        const path = command.resolved.argument;
        if (!path)
            return;
        const content = message.content
            .replace(prefix.content, '')
            .replace(command.alias, '')
            .replace(/\s+/g, ' ')
            .trim();
        const p = pathToRegexp(path, arg.keys, {
            ...this.options.pathToRegexp,
            ...command.resolved.options
        }).exec(content) || [];
        const keys = arg.keys.reduce((a, k, i) => {
            return { [k.name]: p[i + 1], ...a };
        }, {});
        Object.assign(params, keys);
    }
    /**
     * Set custom extractArgument function
     * @param fn custom extractArgument function
     */
    setCustomExtractArgument(fn) {
        this.throwIfAlreadyStarted('cannot set custom function');
        util_1.assert(typeof fn === 'function', 'ExtractArgument should be a function');
        this.extractArgument = fn;
        return this;
    }
    /**
     * Throw if Dispatcher is already started
     * @param message message to throw
     */
    throwIfAlreadyStarted(message) {
        if (this._started) {
            throw new Error(`${message} while dispatcher is already started`);
        }
    }
    /**
     * If the Dispatcher is already started
     */
    get started() {
        return this._started;
    }
    /**
     * Get Commands registry
     */
    get registry() {
        return this._registry;
    }
    /**
     * Get all possible prefixes
     */
    get prefixes() {
        return [...this._prefixes];
    }
}
/**
 * Default options for pathToRegexp
 */
Dispatcher.PATHTOREGEXP_DEFAULT = {
    delimiter: ' ',
    end: false
};
exports.Dispatcher = Dispatcher;
/**
 * Create Dispatcher context
 * @param ctx dispatcher context
 */
function createDispatcherContext(ctx) {
    ctx.params = {};
    ctx.state.dispatcher = {
        prefix: { content: null, detected: false, length: NaN },
        command: { alias: null, resolved: null },
        [exports.argument]: { keys: [] }
    };
}
exports.createDispatcherContext = createDispatcherContext;
