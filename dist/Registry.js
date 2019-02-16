"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("./types/Command");
const util_1 = require("./util");
class Registry {
    constructor() {
        this._commands = new Map();
    }
    /**
     * Resolve command name to command
     * @param name
     */
    resolve(name) {
        return this._commands.get(name) || null;
    }
    /**
     * Register new command in Registry
     * @param command command object
     */
    register(command) {
        const aliases = [...command.values()];
        util_1.assert(aliases.length > 0, `${command.constructor.name} has no alias`);
        this.checkCommand(command);
        for (let alias of aliases) {
            this.conflict(alias);
            this._commands.set(alias, command);
        }
        return this;
    }
    /**
     * Delte command from the Registry
     * @param target command object or name to delete
     */
    delete(target) {
        if (Array.isArray(target)) {
            target.forEach(t => this.delete.apply(this, [t]));
            return this;
        }
        if (target instanceof Command_1.Command) {
            const deletable = [...this.commands.entries()]
                .filter(e => e[1] === target)
                .map(e => e[0]);
            deletable.forEach(t => this.delete.apply(this, [t]));
        }
        if (typeof target === 'string') {
            this.commands.delete(target);
        }
        return this;
    }
    /**
     * Check aliases conflicts
     * @param alias alias to check
     */
    conflict(alias) {
        if (this._commands.has(alias)) {
            throw new Error(`\`${alias}\` is already registered by a command`);
        }
    }
    /**
     * Check if command is valid
     * @param command command
     */
    checkCommand(command) {
        const { aliases, name, action } = command;
        util_1.assert(command instanceof Command_1.Command, `${name} should be instance of Command`);
        util_1.assert(typeof action === 'function', '.action should be a function');
        util_1.assert(name.length >= 2, 'name length should be >= 2');
        if (aliases.length >= 1) {
            aliases.forEach(a => util_1.assert(typeof a === 'string', 'all aliases must be a string'));
        }
    }
    /**
     * Commands map object (Registry)
     */
    get commands() {
        return this._commands;
    }
    /**
     * Size of the commands map
     */
    get size() {
        return this._commands.size;
    }
}
exports.Registry = Registry;
