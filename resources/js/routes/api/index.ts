import settings from './settings';
import app from './app';

const api = {
    settings: Object.assign(settings, settings),
    app: Object.assign(app, app),
};

export default api;
