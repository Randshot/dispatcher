import { Dispatch } from './Dispatch';
export declare namespace Command {
    interface Options {
        options?: Dispatch.PathToRegexpOptions;
        argument?: string;
        aliases?: string[];
        name: string;
    }
}
export declare abstract class Command {
    readonly options?: Dispatch.PathToRegexpOptions;
    readonly aliases?: string[];
    readonly argument?: string;
    readonly name: string;
    constructor(options: Command.Options);
    /**
     * Action of the command
     * @param context Dispatcher context
     */
    abstract action(context: Dispatch.Context): Promise<any> | any;
    /**
     * Iterator object that contains the values for each alias
     */
    values(): IterableIterator<string>;
}
