## Description
This plugin leverages the great Dataview plugin capabilities to select multiple values returned by a query and include them in your note

for example
- select some [[<ingredient>]] from your '#Ingredient' notes as required ingredients for a recipe
- select some of your [[<teamate>]] from your '#Staff' notes as participants for a meeting note
- select some [[<song>]] from your '#Favorite && #Song' notes as songs for a playlist note
and so on...

Seing all the links related to a query helps selecting them faster and not forgetting some.

### Demo
TODO

### Settings
You can Add/Change/Remove as many queries has you want

Add a query by hitting "+".
You'll have to set a name, a description and the query.
The query has to be written in the dataviewjs syntax: https://blacksmithgu.github.io/obsidian-dataview/api/intro/ and has to return a dataArray

There will be one command per query. Each one is name "Multi Select: {description of the query}"

Once created, you can modify the query by hitting the pencil button or remove it by hitting the garbage button

### Usage
1. In live preview, position the cursor where you want to include links
2. open the command palette and select the query that you want to execute
3. Select the results that you want to paste at the cursor position
4. You can select an alias where the target note contains aliases in its frontmatter
5. Set append and prepend strings (default prepend string: none, default append string: `", "`)
6. Hit the checkmark button to paste the links in your note: Et voilà!
