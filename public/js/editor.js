const modeMapping = {
    'js': 'javascript',
    'py': 'python',
    'java': 'text/x-java',
    'cpp': 'text/x-c++src',
    'cs': 'text/x-csharp',
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
    'csv': 'text/x-csv'
};

let autoShowHints = true;

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
    extraKeys: {
        "Cmd-F": false,
        "Ctrl-F": false,
        "Ctrl-Space": "autocomplete"
    },
});

function setEditorMode(filePath) {
    const fileExtension = filePath.split('.').pop(); // Get the file extension
    const mode = modeMapping[fileExtension]; // Get corresponding CodeMirror mode

    console.log("Setting mode to ", mode);

    if (mode) {
        editor.setOption('mode', mode);
    } else {
        editor.setOption('mode', 'text/plain');
    }

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

editor.on("inputRead", function(cm, event) {
    if (autoShowHints) {
        let cursor = cm.getCursor();
        let token = cm.getTokenAt(cursor);
        if (!cm.state.completionActive && /\S/.test(token.string)) triggerAutocomplete();
    }
});

editor.on("keydown", function(cm, event) {
    // If enter is pressed while the autocomplete dropdown is active
    if (event.key === "Enter" && cm.state.completionActive) {
        cm.state.completionActive.close();
    }
});

function setSetting(setting, value) {
    console.log("Setting ", setting, " to ", value);

    if (setting === "autoShowHints") {
        autoShowHints = value;
        return;
    }

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

window.bridge.formatEditor((event, format) => {
    switch (format) {
        case "copy":
            copySelection();
            break;
        case "cut":
            cutSelection();
            break;
        case "paste":
            pasteClipboard();
            break;
    }
});

function copySelection() {
    const selection = editor.getSelection();
    navigator.clipboard.writeText(selection);
}

function cutSelection() {
    const selection = editor.getSelection();
    navigator.clipboard.writeText(selection);
    editor.replaceSelection("");
    editor.focus();
}

function pasteClipboard() {
    navigator.clipboard.readText().then((text) => {
        editor.replaceSelection(text);
        editor.focus();
    });
}