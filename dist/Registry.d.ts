import { Command } from './types/Command';
declare type Deletable<C extends Command> = string | C;
export declare class Registry<C extends Command> {
    private _commands;
    /**
     * Resolve command name to command
     * @param name
     */
    resolve(name: string): C;
    /**
     * Register new command in Registry
     * @param command command object
     */
    register(command: C): this;
    /**
     * Delte command from the Registry
     * @param target command object or name to delete
     */
    delete(target: Deletable<C> | (Deletable<C>)[]): this;
    /**
     * Check aliases conflicts
     * @param alias alias to check
     */
    private conflict;
    /**
     * Check if command is valid
     * @param command command
     */
    private checkCommand;
    /**
     * Commands map object (Registry)
     */
    readonly commands: Map<string, C>;
    /**
     * Size of the commands map
     */
    readonly size: number;
}
export {};
