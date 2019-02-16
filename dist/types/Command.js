"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(options) {
        this.aliases = [];
        if (options.aliases)
            this.aliases = options.aliases;
        this.argument = options.argument;
        this.options = options.options;
        this.name = options.name;
    }
    /**
     * Iterator object that contains the values for each alias
     */
    values() {
        const aliases = [this.name]
            .concat(this.aliases)
            .filter(Boolean)
            .map(a => a.toLowerCase().trim());
        return new Set(aliases)[Symbol.iterator]();
    }
}
exports.Command = Command;
