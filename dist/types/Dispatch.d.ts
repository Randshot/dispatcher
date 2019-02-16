import * as pathToRegexp from 'path-to-regexp';
import { Application as App } from 'hershel';
import * as compose from 'koa-compose';
import { argument } from '../Dispatcher';
import { Command } from './Command';
export declare namespace Dispatch {
    type middleware<C extends Command> = compose.Middleware<Context<C>>;
    type params = Record<string, string>;
    type PathToRegexpOptions = pathToRegexp.RegExpOptions & pathToRegexp.ParseOptions;
    interface Options {
        prefix: Iterable<string>;
        pathToRegexp?: PathToRegexpOptions;
    }
    interface Context<C extends Command = Command> extends App.Context {
        state: {
            dispatcher: State<C>;
        };
        params: params;
    }
    interface State<C extends Command = Command> {
        [argument]: ArgumentState;
        command: CommandState<C>;
        prefix: PrefixState;
    }
    interface CommandState<C extends Command = Command> {
        alias: string;
        resolved: C;
    }
    interface PrefixState {
        detected: boolean;
        content: string;
        length: number;
    }
    interface ArgumentState {
        keys: pathToRegexp.Key[];
    }
}
