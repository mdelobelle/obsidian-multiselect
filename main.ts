import { MarkdownView, Plugin } from 'obsidian';
import { MultiSelectSettings, DEFAULT_SETTINGS } from "src/settings/settings"
import Query from "src/queries/Query"
import QueryResultModal from "src/queries/queryResultsModal"
import settingTab from "src/settings/settingTab"

export default class MultiSelect extends Plugin {
	settings: MultiSelectSettings;
	initialQueries: Array<Query> = []

	addMultiSelectQueryCommand(query: Query) {
		this.addCommand({
			id: `multiSelect-${query.name}`,
			name: `Multi Select from ${query.name}`,
			callback: () => {
				const leaf = this.app.workspace.activeLeaf
				if (leaf.view instanceof MarkdownView && leaf.view.editor) {
					const queryResultModal = new QueryResultModal(this.app, this, query, leaf.view.editor.getCursor(), leaf.view.file)
					queryResultModal.open()
				}
			},
		});
	}

	async onload() {
		await this.loadSettings();
		this.settings.queries.forEach(savedQuery => {
			const query = new Query()
			Object.assign(query, savedQuery)
			this.initialQueries.push(query)
		})
		this.addSettingTab(new settingTab(this.app, this));
		this.settings.queries.forEach(query => {
			this.addMultiSelectQueryCommand(query)
		})

	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		this.settings.queries = this.initialQueries
		await this.saveData(this.settings);
	}
}


