import Settings from './Settings'
import AppVersionController from './AppVersionController'
import SpaController from './SpaController'


const Controllers = {
    Settings: Object.assign(Settings, Settings),
    AppVersionController: Object.assign(AppVersionController, AppVersionController),
    SpaController: Object.assign(SpaController, SpaController),
}

export default Controllers