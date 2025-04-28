const editorSection = document.getElementById('editor');
const previewSection = document.getElementById('preview');
const previewContent = document.getElementById('previewContent');
const viewButtons = document.querySelectorAll('header .right .buttons button');

function setView(viewmode) {
    viewButtons.forEach((button) => {
        button.classList.remove('active');
    });

    document.getElementById(`${viewmode}-btn`).classList.add('active');

    if (viewmode === 'editor') {
        editorSection.classList.add('active');
        editorSection.style.width = '100%';
        previewSection.classList.remove('active');
        previewSection.style.width = '0%';
    } else if (viewmode === 'preview') {
        editorSection.classList.remove('active');
        editorSection.style.width = '0%';
        previewSection.classList.add('active');
        previewSection.style.width = '100%';
    } else {
        editorSection.classList.add('active');
        editorSection.style.width = '50%';
        previewSection.classList.add('active');
        previewSection.style.width = '50%';
    }
}

window.bridge.fullscreenChanged((e, fullscreen) => {
    if (fullscreen)
        document.querySelector('header').classList.add('fullscreen');
    else document.querySelector('header').classList.remove('fullscreen');
});

function setProperty(name, value) {
    console.log('Setting property: ', name, ' to ', value);
    root.style.setProperty(name, value);
}

const fontSizesEditor = [10, 12, 15, 16, 18, 20, 22, 24, 26];
const fontSizesPreview = [12, 14, 16, 18, 20, 22, 24, 26, 28];

let fontSizeIndexEditor = 2;
let fontSizeIndexPreview = 2;

function updateFontSize() {
    setProperty(
        '--font-size-editor',
        `${fontSizesEditor[fontSizeIndexEditor]}px`
    );
    setProperty(
        '--font-size-preview',
        `${fontSizesPreview[fontSizeIndexPreview]}px`
    );
}

window.bridge.changeZoom((e, data) => {
    console.log('Changing zoom: ', data);
    if (!data || !data.instruction) return;

    switch (data.instruction) {
        case 'reset':
            fontSizeIndexEditor = 2;
            fontSizeIndexPreview = 2;
            updateFontSize();
            break;
        case 'increase':
            fontSizeIndexEditor = Math.min(
                fontSizeIndexEditor + 1,
                fontSizesEditor.length - 1
            );
            fontSizeIndexPreview = Math.min(
                fontSizeIndexPreview + 1,
                fontSizesPreview.length - 1
            );
            updateFontSize();
            break;
        case 'decrease':
            fontSizeIndexEditor = Math.max(fontSizeIndexEditor - 1, 0);
            fontSizeIndexPreview = Math.max(fontSizeIndexPreview - 1, 0);
            updateFontSize();
            break;
    }
});

window.bridge.closeWindow((e, data) => {
    if (openedFile && openedFile.content !== originalContent) {
        console.log('Unsaved changes detected: ', openedFile);
        window.api.invoke('showUnsavedChangesDialog', openedFile);
    } else {
        console.log('No unsaved changes detected. Closing window.');
        window.api.invoke('close', {});
    }
});
