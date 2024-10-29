const modeMapping = {
    'js': 'javascript',
    'py': 'python',
    'java': 'text/x-java',
    'cpp': 'text/x-c++src',
    'cs': 'text/x-csharp',
    'c': 'text/x-csrc',
    'h': 'text/x-csrc',
    'rb': 'ruby',
    'php': 'php',
    'swift': 'swift',
    'ts': 'text/typescript',
    'go': 'text/x-go',
    'html': 'htmlmixed',
    'xml': 'xml',
    'md': 'markdown',
    'markdown': 'markdown',
    'css': 'css',
    'scss': 'text/x-scss',
    'less': 'text/x-less',
    'json': 'application/json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'ini': 'text/x-ini',
    'toml': 'text/x-toml',
    'sh': 'shell',
    'ps1': 'shell',
    'sql': 'text/x-sql',
    'txt': 'text/plain',
    'log': 'text/x-log',
    'diff': 'diff',
    'patch': 'text/x-diff',
    'csv': 'text/x-csv',
    'properties': 'text/x-minecraft-properties'
};

let autoShowHints = true;
let autoLineDelete = true;
let alloReplaceTabsWithSpaces = true;

const editor = CodeMirror.fromTextArea(document.getElementById('editorTextarea'), {
    mode: 'text/plain',
    lineNumbers: true,
    lineWrapping: true,
    styleActiveLine: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    theme: "featherflow",
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    extraKeys: {
        "Cmd-F": false,
        "Ctrl-F": false,
        "Ctrl-Space": "autocomplete",
        "Backspace": (cm) => {
            const doc = cm.getDoc();
            const cursor = doc.getCursor();
            const line = doc.getLine(cursor.line);
            const selection = doc.getSelection();

            if (autoLineDelete && !selection && line.length !== 0 && /^\s*$/.test(line)) {
                doc.replaceRange("", {line: cursor.line, ch: 0}, {line: cursor.line, ch: line.length});
            }

            CodeMirror.commands.delCharBefore(cm);
        },
    },
});

editor.refresh();

editor.focus();

function replaceTabsWithSpaces(str, tabSize) {
    var spaces = ' '.repeat(tabSize);
    return str.replace(/\t/g, spaces);
}

let replacingTabs = false;

editor.on('change', function(instance, changeObj) {
    if (replacingTabs || !alloReplaceTabsWithSpaces) return;

    console.log("Allow: "+ alloReplaceTabsWithSpaces)

    if (changeObj.text.some(line => line.includes('\t'))) {
        console.log("REPLACING TABS YAYYY!");
        replacingTabs = true;

        const tabSize = instance.getOption('tabSize');
        let cursor = instance.getCursor();

        let newContent = instance.getValue().split('\n').map((line, index) => {
            let newLine = replaceTabsWithSpaces(line, tabSize);
            if (index === cursor.line) {
                var addedSpaces = newLine.length - line.length;
                cursor.ch += addedSpaces;
            }
            return newLine;
        }).join('\n');

        instance.setValue(newContent);
        instance.setCursor(cursor);

        replacingTabs = false;
    }
});

function setEditorMode(filePath) {
    const fileExtension = filePath.split('.').pop();
    const mode = modeMapping[fileExtension];

    console.log("Setting mode to ", mode);

    if (mode) editor.setOption('mode', mode);
    else editor.setOption('mode', 'text/plain');

    console.log(editor.getOption('mode'));
}

editor.on('contextmenu', function (editor, event) {
    event.preventDefault();

    const line = editor.lineAtHeight(event.y);
    const lineNumber = line + 1;

    window.api.invoke("showContextMenu", lineNumber, event.x, event.y);
});

function triggerAutocomplete() {
    editor.showHint({completeSingle: false});
}

editor.on("inputRead", function (cm, event) {
    if (autoShowHints) {
        let cursor = cm.getCursor();
        let token = cm.getTokenAt(cursor);
        const lineEndCharacters = [';', '{', '}', '(', ')', '[', ']'];
        if (!cm.state.completionActive && /\S/.test(token.string) && !lineEndCharacters.includes(token.string)) triggerAutocomplete();
    }
});

editor.on("keydown", function (cm, event) {
    if (event.key === "Enter" && cm.state.completionActive) {
        cm.state.completionActive.close();
    }
});

editor.on("update", function (cm, change) {
    if (cm.getOption("readOnly")) cm.getWrapperElement().classList.add("cm-read-only");
    else cm.getWrapperElement().classList.remove("cm-read-only");
})

function setSetting(setting, value) {
    console.log("Setting ", setting, " to ", value);

    if (setting === "autoShowHints") {
        autoShowHints = value;
        return;
    }

    if (setting === "autoLineDelete") {
        autoLineDelete = value;
        return;
    }

    if (setting === "replaceTabsWithSpaces") {
        alloReplaceTabsWithSpaces = value;
        return;
    }

    if (setting === "theme") return;

    editor.setOption(setting, value);
}

window.bridge.setEditorSetting((event, setting, value) => {
    setSetting(setting, value);
});

window.api.invoke("getEditorSettings").then((settings) => {
    for (const setting in settings) {
        setSetting(setting, settings[setting]);
    }
});

window.bridge.toggleReadMode((event, value) => {
    console.log("Setting readOnly to ", !editor.getOption('readOnly'));
    editor.setOption("readOnly", !editor.getOption('readOnly'));
});

window.bridge.formatEditor((event, format) => {
    switch (format) {
        case "copy":
            navigator.clipboard.writeText(editor.getSelection());
            break;
        case "cut":
            navigator.clipboard.writeText(editor.getSelection());
            editor.replaceSelection("");
            editor.focus();
            break;
        case "paste":
            navigator.clipboard.readText().then((text) => {
                editor.replaceSelection(text);
                editor.focus();
            });
            break;
    }
});