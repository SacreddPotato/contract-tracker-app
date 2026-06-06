import notifications from './notifications';
import settings from './settings';
import app from './app';

const api = {
    notifications: Object.assign(notifications, notifications),
    settings: Object.assign(settings, settings),
    app: Object.assign(app, app),
};

export default api;
