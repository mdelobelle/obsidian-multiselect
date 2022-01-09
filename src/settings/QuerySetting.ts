import { App, Setting } from "obsidian"
import MultiSelect from "main"
import Query from "src/queries/Query"
import QuerySettingModal from "src/settings/QuerySettingModal"

export default class QuerySetting extends Setting {
    query: Query
    app: App
    plugin: MultiSelect
    containerEl: HTMLElement
    constructor(containerEl: HTMLElement, query: Query, app: App, plugin: MultiSelect) {
        super(containerEl)
        this.containerEl = containerEl
        this.query = query
        this.app = app
        this.plugin = plugin
        this.setTextContentWithname()
        this.addEditButton()
        this.addDeleteButton()
    }

    setTextContentWithname(): void {
        this.setName(this.query.name)
        this.setDesc(this.query.description)
    }


    addEditButton(): void {
        this.addButton((b) => {
            b.setIcon("pencil")
                .setTooltip("Edit")
                .onClick(() => {
                    let modal = new QuerySettingModal(this.app, this.plugin, this.containerEl, this, this.query);
                    modal.open();
                });
        })
    }

    addDeleteButton(): void {
        this.addButton((b) => {
            b.setIcon("trash")
                .setTooltip("Delete")
                .onClick(() => {
                    //remove the command
                    const currentExistingQuery = this.plugin.initialQueries.filter(p => p.id == this.query.id)[0]
                    if (currentExistingQuery) {
                        this.plugin.initialQueries.remove(currentExistingQuery)
                        //@ts-ignore
                        this.app.commands.removeCommand(
                            `${this.plugin.manifest.id}:multiSelect-${currentExistingQuery.name}`
                        );
                    }
                    this.settingEl.parentElement.removeChild(this.settingEl)
                    this.plugin.saveSettings()
                });
        });
    }
}