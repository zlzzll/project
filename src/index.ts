import type { App } from 'vue'
import DiygwEditor from './views/Editor.vue'

const install = (app: App) => {
    app.component('DiygwEditor', DiygwEditor)
}

export {
    install,
    DiygwEditor
}
export default DiygwEditor;