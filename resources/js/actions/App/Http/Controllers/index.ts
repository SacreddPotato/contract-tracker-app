import EmployeeController from './EmployeeController';
import EmployeeNotificationController from './EmployeeNotificationController';
import Settings from './Settings';
import AppVersionController from './AppVersionController';
import AppStartupController from './AppStartupController';
import AppWindowController from './AppWindowController';
import SpaController from './SpaController';

const Controllers = {
    EmployeeController: Object.assign(EmployeeController, EmployeeController),
    EmployeeNotificationController: Object.assign(
        EmployeeNotificationController,
        EmployeeNotificationController,
    ),
    Settings: Object.assign(Settings, Settings),
    AppVersionController: Object.assign(
        AppVersionController,
        AppVersionController,
    ),
    AppStartupController: Object.assign(
        AppStartupController,
        AppStartupController,
    ),
    AppWindowController: Object.assign(
        AppWindowController,
        AppWindowController,
    ),
    SpaController: Object.assign(SpaController, SpaController),
};

export default Controllers;
