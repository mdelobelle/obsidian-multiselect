import { App, Modal, Setting, TextComponent, Notice, ButtonComponent, ExtraButtonComponent, TextAreaComponent } from "obsidian"
import MultiSelect from "main"
import Query from "src/queries/Query"
import QuerySetting from "src/settings/QuerySetting"

export default class QuerySettingsModal extends Modal {
    namePromptComponent: TextComponent
    descriptionPromptComponent: TextComponent
    queryPromptComponent: TextAreaComponent
    saved: boolean = false
    query: Query
    plugin: MultiSelect
    initialQuery: Query
    parentSetting: QuerySetting
    new: boolean = true
    parentSettingContainer: HTMLElement


    constructor(app: App, plugin: MultiSelect, parentSettingContainer: HTMLElement, parentSetting?: QuerySetting, query?: Query) {
        super(app)
        this.plugin = plugin
        this.parentSetting = parentSetting
        this.initialQuery = new Query()
        this.parentSettingContainer = parentSettingContainer
        if (query) {
            this.new = false
            this.query = query
            this.initialQuery.name = query.name
            this.initialQuery.id = query.id
            this.initialQuery.description = query.description
        } else {
            let newId = 1
            this.plugin.initialQueries.forEach(query => {
                if (parseInt(query.id) && parseInt(query.id) >= newId) {
                    newId = parseInt(query.id) + 1
                }
            })
            this.query = new Query()
            this.query.id = newId.toString()
            this.initialQuery.id = newId.toString()
        }
    }

    onOpen(): void {
        if (this.query.name == "") {
            this.titleEl.setText(`Add a query`)
        } else {
            this.titleEl.setText(`Manage query ${this.query.name}`)
        }
        this.createForm()
    }

    onClose(): void {
        Object.assign(this.query, this.initialQuery)
        if (!this.new) {
            this.parentSetting.setTextContentWithname()
        } else if (this.saved) {
            new QuerySetting(this.parentSettingContainer, this.query, this.app, this.plugin)
        }
    }

    createNameInputContainer(parentNode: HTMLDivElement): TextComponent {
        const queryNameContainerLabel = parentNode.createDiv()
        queryNameContainerLabel.setText(`Query Name:`)
        const input = new TextComponent(parentNode)
        const name = this.query.name
        input.setValue(name)
        input.setPlaceholder("Name of the query")
        input.onChange(value => {
            this.query.name = value
            this.titleEl.setText(`Manage ${this.query.name}`)
            QuerySettingsModal.removeValidationError(input)
        })
        return input
    }

    createDescriptionInputContainer(parentNode: HTMLDivElement): TextComponent {
        const queryDescriptionContainerLabel = parentNode.createDiv()
        queryDescriptionContainerLabel.setText(`Query Description:`)
        const input = new TextComponent(parentNode)
        const description = this.query.description
        input.setValue(description)
        input.setPlaceholder("Description of the query")
        input.onChange(value => {
            this.query.description = value
            QuerySettingsModal.removeValidationError(input)
        })
        return input
    }

    createDataviewJSInputContainer(parentNode: HTMLDivElement): TextAreaComponent {
        const queryDataviewJSQueryContainerLabel = parentNode.createDiv()
        queryDataviewJSQueryContainerLabel.setText(`DataviewJS query:`)
        const input = new TextAreaComponent(parentNode)
        const dataviewJSQuery = this.query.dataviewJSQuery
        input.inputEl.cols = 100
        input.inputEl.rows = 15
        input.setPlaceholder("Dataviewjs syntax to query pages\nExample:\ndv.pages(\"#SomeTag\").where(p => p.field === \"some value\").sort(p => condition, 'asc')")
        input.setValue(dataviewJSQuery ?? "")
        input.onChange(value => {
            this.query.dataviewJSQuery = value
            QuerySettingsModal.removeValidationError(input)
        })
        return input
    }

    createForm(): void {
        const div = this.contentEl.createDiv({
            cls: "frontmatter-prompt-div"
        })
        const mainDiv = div.createDiv({
            cls: "frontmatter-prompt-form"
        })
        /* Property Name Section */
        const nameContainer = mainDiv.createDiv()
        const descriptionContainer = mainDiv.createDiv()
        const dataviewJSQueryContainer = mainDiv.createDiv()
        this.namePromptComponent = this.createNameInputContainer(nameContainer)
        this.descriptionPromptComponent = this.createDescriptionInputContainer(descriptionContainer)
        this.queryPromptComponent = this.createDataviewJSInputContainer(dataviewJSQueryContainer)

        mainDiv.createDiv().createEl("hr")

        /* footer buttons*/
        const footerEl = this.contentEl.createDiv()
        const footerButtons = new Setting(footerEl)
        footerButtons.addButton((b) => this.createSaveButton(b))
        footerButtons.addExtraButton((b) => this.createCancelButton(b));
    }

    createSaveButton(b: ButtonComponent): ButtonComponent {
        b.setTooltip("Save")
            .setIcon("checkmark")
            .onClick(async () => {
                let error = false
                if (/^[#>-]/.test(this.query.name)) {
                    QuerySettingsModal.setValidationError(
                        this.namePromptComponent, this.namePromptComponent.inputEl,
                        "Query name cannot start with #, >, -"
                    );
                    error = true;
                }
                if (this.query.name == "") {
                    QuerySettingsModal.setValidationError(
                        this.namePromptComponent, this.namePromptComponent.inputEl,
                        "Property name can not be Empty"
                    );
                    error = true
                }
                if (error) {
                    new Notice("Fix errors before saving.");
                    return;
                }
                this.saved = true;
                const currentExistingQuery = this.plugin.initialQueries.filter(q => q.id == this.query.id)[0]
                if (currentExistingQuery) {
                    this.plugin.initialQueries.remove(currentExistingQuery)
                    //@ts-ignore
                    this.app.commands.removeCommand(
                        `${this.plugin.manifest.id}:multiSelect-${currentExistingQuery.name}`
                    );
                }
                this.plugin.initialQueries.push(this.query)
                this.plugin.addMultiSelectQueryCommand(this.query)
                this.initialQuery = this.query
                this.plugin.saveSettings()
                this.close();
            })
        return b
    }

    createCancelButton(b: ExtraButtonComponent): ExtraButtonComponent {
        b.setIcon("cross")
            .setTooltip("Cancel")
            .onClick(() => {
                this.saved = false;
                /* reset values from settings */
                if (this.initialQuery.name != "") {
                    Object.assign(this.query, this.initialQuery)
                }
                this.close();
            });
        return b;
    }

    /* utils functions */

    static setValidationError(textInput: TextComponent | TextAreaComponent, insertAfter: Element, message?: string) {
        textInput.inputEl.addClass("is-invalid");
        if (message) {

            let mDiv = textInput.inputEl.parentElement.querySelector(
                ".invalid-feedback"
            ) as HTMLDivElement;

            if (!mDiv) {
                mDiv = createDiv({ cls: "invalid-feedback" });
            }
            mDiv.innerText = message;
            mDiv.insertAfter(insertAfter);
        }
    }
    static removeValidationError(textInput: TextComponent | TextAreaComponent) {
        if (textInput.inputEl.hasClass("is-invalid")) {
            textInput.inputEl.removeClass("is-invalid")
            textInput.inputEl.parentElement.removeChild(
                textInput.inputEl.parentElement.lastElementChild
            )
        }
    }
}