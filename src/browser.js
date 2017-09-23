import { toConsole as console} from './browser-version/console';
import { Log as Logger } from './browser-version/log.browser';

Logger.console = console;

export default Logger;

