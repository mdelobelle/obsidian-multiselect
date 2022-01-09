import { PluginSettingTab, App, Setting, ButtonComponent } from "obsidian"
import MultiSelect from "main"
import Query from "src/queries/Query"
import QuerySetting from 'src/settings/QuerySetting'
import QuerySettingModal from 'src/settings/QuerySettingModal'

export default class MultiSelectSettingTab extends PluginSettingTab {
    plugin: MultiSelect

    constructor(app: App, plugin: MultiSelect) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Settings for Multi Select.' });

        /* Add new query*/
        new Setting(containerEl)
            .setName("Add New Query")
            .setDesc("Add a new query to select files from result.")
            .addButton((button: ButtonComponent): ButtonComponent => {
                let b = button
                    .setTooltip("Add New Query")
                    .setButtonText("+")
                    .onClick(async () => {
                        let modal = new QuerySettingModal(this.app, this.plugin, containerEl);
                        modal.open();
                    });

                return b;
            });

        /* Managed properties that currently have preset values */
        this.plugin.initialQueries.forEach(savedQuery => {
            const query = new Query()
            Object.assign(query, savedQuery)
            new QuerySetting(containerEl, query, this.app, this.plugin)
        })
    }
}