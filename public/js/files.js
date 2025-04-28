let openedFile = null
let originalContent = null

function setFilename(name) {
    document.getElementById('fileName').innerText = name
    document.querySelector('title').innerText = name
}

function setFileEdited(value) {
    if (value) {
        document.getElementById('dot').classList.add('active')
    } else {
        document.getElementById('dot').classList.remove('active')
    }
}

window.bridge.fileOpened((e, file) => {
    console.log('File opened: ', file)
    const fileContent = file.content

    setFilename(file.name)
    originalContent = file.content
    openedFile = file
    setEditorMode(file.path)

    const cursorPos = editor.getCursor()
    const scrollInfo = editor.getScrollInfo() // Capture the current scroll position

    editor.setValue(file.content)
    editor.setCursor(cursorPos)
    editor.scrollTo(scrollInfo.left, scrollInfo.top) // Restore the scroll position
})

editor.on('change', () => {
    const content = editor.getValue()

    if (content !== originalContent) {
        openedFile.content = content
        setFileEdited(true)
    } else {
        setFileEdited(false)
    }
})

window.bridge.requestFileSave((event, path, name) => {
    console.log('Save requested: ', path, name)
    window.api
        .invoke('saveFile', {
            file: openedFile,
            path: path,
            name: name,
            content: editor.getValue(),
        })
        .then((file) => {
            file.content = editor.getValue()
            setFilename(file.name)
            setFileEdited(false)
            openedFile = file
        })
    originalContent = editor.getValue()
    setFilename(name)
    setFileEdited(false)
})
