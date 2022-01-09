## Description
This plugin leverages the great Dataview plugin capabilities to select multiple values returned by a query and include them in your note

You can beta-test it with BRAT: `mdelobelle/obsidian-multiselect/`

for example
- select some [[<ingredient>]] from your '#Ingredient' notes as required ingredients for a recipe
- select some of your [[<teamate>]] from your '#Staff' notes as participants for a meeting note
- select some [[<song>]] from your '#Favorite && #Song' notes as songs for a playlist note
and so on...

Seing all the links related to a query helps selecting them faster and not forgetting some.

### Settings

> Important: Activate dataview js queries and inline js queries

<img src=https://raw.githubusercontent.com/mdelobelle/obsidian-multiselect/master/images/dataview-settings.png alt="drawing" style="width:600px;"/>


You can Add/Change/Remove as many queries has you want

Add a query by hitting "+".

<img src=https://raw.githubusercontent.com/mdelobelle/obsidian-multiselect/master/images/add-query.png alt="drawing" style="width:600px;"/>

You'll have to set a name, a description and the query.
The query has to be written in the dataviewjs syntax: https://blacksmithgu.github.io/obsidian-dataview/api/intro/ and has to return a dataArray

<img src=https://raw.githubusercontent.com/mdelobelle/obsidian-multiselect/master/images/edit-query.png alt="drawing" style="width:600px;"/>

There will be one command per query. Each one is name "Multi Select: {description of the query}"

Once created, you can modify the query by hitting the pencil button or remove it by hitting the garbage button

### Usage
1. In live preview, position the cursor where you want to include links

<img src=https://raw.githubusercontent.com/mdelobelle/obsidian-multiselect/master/images/select-position-to-insert.png alt="drawing" style="width:600px;"/>

2. open the command palette and select the query that you want to execute

<img src=https://raw.githubusercontent.com/mdelobelle/obsidian-multiselect/master/images/select-query.png alt="drawing" style="width:600px;"/>

3. Select the results that you want to paste at the cursor position

<img src=https://raw.githubusercontent.com/mdelobelle/obsidian-multiselect/master/images/select-results.png alt="drawing" style="width:600px;"/>

4. You can select an alias for the link display when the target note contains aliases in its frontmatter

5. Set append and prepend strings (default prepend string: none, default append string: `", "`)

<img src=https://raw.githubusercontent.com/mdelobelle/obsidian-multiselect/master/images/set-append-prepend.png alt="drawing" style="width:600px;"/>

6. Hit the checkmark button to paste the links in your note: Et voilà!

<img src=https://raw.githubusercontent.com/mdelobelle/obsidian-multiselect/master/images/et-voila.png alt="drawing" style="width:600px;"/>
