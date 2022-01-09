import {
    App,
    Modal,
    TFile,
    MarkdownView,
    EditorPosition,
    ButtonComponent,
    ExtraButtonComponent,
    setIcon,
    ToggleComponent,
    parseFrontMatterAliases,
    TextComponent,
    TextAreaComponent
} from "obsidian"
import MultiSelect from "main"
import Query from "src/queries/Query"


export default class QueryResultModal extends Modal {
    query: Query
    plugin: MultiSelect
    cursorPosition: EditorPosition
    results: Array<string>
    selectedResults: string[]
    selectedAlias: Record<string, string>
    file: TFile
    prepend: string
    append: string

    constructor(app: App, plugin: MultiSelect, query: Query, cursorPosition: EditorPosition, file: TFile) {
        super(app)
        this.plugin = plugin
        this.query = query
        this.cursorPosition = cursorPosition
        this.results = []
        this.selectedResults = []
        this.selectedAlias = {}
        this.file = file
        this.prepend = ""
        this.append = ", "
    }

    onOpen() {
        //@ts-ignore
        const getResults = (api: DataviewPlugin["api"]) => {
            return (new Function("dv", `return ${this.query.dataviewJSQuery}`))(api)
        };
        const valueGrid = this.contentEl.createDiv({
            cls: "modal-results-grid"
        })
        if (this.app.plugins.enabledPlugins.has("dataview")) {
            const api = this.app.plugins.plugins.dataview?.api;
            if (api) {
                this.results = getResults(api);
            }
            else
                this.plugin.registerEvent(
                    this.app.metadataCache.on("dataview:api-ready", (api) =>
                        this.results = getResults(api)
                    )
                );
        }
        this.populateValuesGrid(valueGrid, this.results.map((p: any) => p.file.path))
    }

    buildAliasesList(destFile: TFile): string[] {
        const frontmatter = this.app.metadataCache.getFileCache(destFile).frontmatter
        return parseFrontMatterAliases(frontmatter)
    }

    buildValueToggler(valueGrid: HTMLDivElement, destFile: TFile, aliases?: string[]) {
        const valueSelectorContainer = valueGrid.createDiv({
            cls: "value-selector-container"
        })
        const valueTogglerLine = valueSelectorContainer.createDiv({
            cls: "value-toggler-line"
        })
        const valueTogglerContainer = valueTogglerLine.createDiv({
            cls: "value-selector-toggler"
        })
        const valueToggler = new ToggleComponent(valueTogglerContainer)
        valueToggler.onChange(value => {
            if (value && !this.selectedResults.includes(destFile.path)) {
                this.selectedResults.push(destFile.path)
            }
            if (!value) {
                this.selectedResults.remove(destFile.path)
                delete this.selectedAlias[destFile.basename]
            }
        })
        const valueLabel = valueTogglerLine.createDiv({
            cls: "value-selector-label"
        })
        valueLabel.setText(destFile.basename)
        valueLabel.onClickEvent(e => valueToggler.setValue(!valueToggler.getValue()))
        if (aliases) {
            const aliasesSelectorContainer = valueTogglerLine.createDiv({
                cls: "value-selector-aliases"
            })
            setIcon(aliasesSelectorContainer, "three-horizontal-bars")
            const aliasesListContainer = valueSelectorContainer.createDiv({
                cls: "aliases-list-container"
            })
            aliasesListContainer.style.display = "none"
            aliasesSelectorContainer.onClickEvent(e => {
                if (aliasesListContainer.style.display === "none") {
                    this.buildAliasSelector(aliasesListContainer, valueLabel, aliases, destFile.basename)
                    aliasesListContainer.style.display = "inline-block"
                } else {
                    aliasesListContainer.innerHTML = ''
                    aliasesListContainer.style.display = "none"
                }
            })
        }
    }

    buildAliasSelector(aliasesListContainer: HTMLDivElement, valueLabel: HTMLDivElement, aliases: string[], basename: string) {
        aliases.forEach(alias => {
            if (!Object.keys(this.selectedAlias).includes(basename) || this.selectedAlias[basename] !== alias) {
                const aliasContainer = aliasesListContainer.createDiv()
                aliasContainer.innerHTML = `<span>• ${alias}</span>`
                aliasContainer.onClickEvent(e => {
                    valueLabel.setText(alias)
                    this.selectedAlias[basename] = alias
                    aliasesListContainer.innerHTML = ""
                    aliasesListContainer.style.display = "none"
                })
            }
        })
        if (Object.keys(this.selectedAlias).includes(basename) && this.selectedAlias[basename] !== null) {
            const aliasContainer = aliasesListContainer.createDiv()
            aliasContainer.innerHTML = `<span>• ${basename}</span>`
            aliasContainer.onClickEvent(e => {
                valueLabel.setText(basename)
                this.selectedAlias[basename] = null
                aliasesListContainer.innerHTML = ""
                aliasesListContainer.style.display = "none"
            })
        }
    }

    buildMarkDownLink(path: string) {
        const destFile = this.app.metadataCache.getFirstLinkpathDest(path, this.file.path)
        const link = this.app.fileManager.generateMarkdownLink(
            destFile,
            this.file.path,
            null,
            this.selectedAlias[destFile.basename]
        )
        return link
    }

    buildNewLine(): void {
        const leaf = this.app.workspace.activeLeaf

        if (leaf.view instanceof MarkdownView && leaf.view.editor) {
            const editor = leaf.view.editor
            const lineAtCursor = editor.getLine(this.cursorPosition.line)
            const startLine = lineAtCursor.substr(0, this.cursorPosition.ch)
            const content = this.selectedResults.map(r => this.buildMarkDownLink(r)).map(l => this.prepend + l).join(this.append)
            const endLine = lineAtCursor.substr(this.cursorPosition.ch, lineAtCursor.length - this.cursorPosition.ch)
            editor.setLine(this.cursorPosition.line, startLine + content + endLine)
        }
    }

    populateValuesGrid(valueGrid: HTMLDivElement, filePaths: string[]) {
        filePaths.forEach(filePath => {
            const destFile = this.app.metadataCache.getFirstLinkpathDest(filePath, this.file.path)
            this.buildValueToggler(valueGrid, destFile, this.buildAliasesList(destFile))
        })
        const divider = this.contentEl.createDiv()
        divider.innerHTML = "<hr>"

        const helper = this.contentEl.createDiv({
            cls: "separator-helper-label"
        })
        helper.setText("prepend/append strings to the links")
        const footer = this.contentEl.createDiv({
            cls: "value-grid-footer"
        })
        const separatorContainer = footer.createDiv({
            cls: 'separator-container'
        })
        const prepend = new TextComponent(separatorContainer)
        prepend.inputEl.size = 10
        prepend.setValue(this.prepend)
        const linkLabel = separatorContainer.createDiv({
            cls: "separator-link-label"
        })
        linkLabel.setText(" [[Link]] ")
        prepend.onChange(value => this.prepend = value)
        const append = new TextAreaComponent(separatorContainer)
        append.inputEl.cols = 3
        append.inputEl.rows = 2
        append.setValue(this.append)
        append.onChange(value => this.append = value)
        const buttonsContainer = footer.createDiv({
            cls: 'buttons-container'
        })
        const saveButton = new ButtonComponent(buttonsContainer)
        saveButton.setIcon("checkmark")
        saveButton.onClick(() => {
            console.log(this.selectedResults, this.selectedAlias)
            this.buildNewLine()
            this.close()
        })
        const cancelButton = new ExtraButtonComponent(buttonsContainer)
        cancelButton.setIcon("cross")
        cancelButton.onClick(() => this.close())
    }
}