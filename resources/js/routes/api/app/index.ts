import version from './version';
import startup from './startup';
import updates from './updates';
import window from './window';

const app = {
    version: Object.assign(version, version),
    startup: Object.assign(startup, startup),
    updates: Object.assign(updates, updates),
    window: Object.assign(window, window),
};

export default app;
