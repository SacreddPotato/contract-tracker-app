import EmployeeController from './EmployeeController';
import Settings from './Settings';
import AppVersionController from './AppVersionController';
import AppStartupController from './AppStartupController';
import AppWindowController from './AppWindowController';
import SpaController from './SpaController';

const Controllers = {
    EmployeeController: Object.assign(EmployeeController, EmployeeController),
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
