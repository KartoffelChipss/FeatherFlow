let searchMatches = [];
let currentIndex = -1;

window.bridge.openSearch((event, data) => {
    openSearch();
});

// Function to open the search box and focus on the input
function openSearch() {
    document.getElementById('searchbox').classList.add('active');
    document.getElementById('search').focus();
}

// Function to close the search box
function closeSearch() {
    document.getElementById('searchbox').classList.remove('active');
    editor.focus();
}

// Function to find all occurrences of the search query in the editor
function findAll() {
    searchMatches = [];
    const query = document.getElementById('search').value.trim();
    if (!query) {
        updateResultCount();
        return;
    }

    let cursor = editor.getSearchCursor(query, null, {
        caseFold: true,
        multiline: true
    });

    while (cursor.findNext()) {
        searchMatches.push({ from: cursor.from(), to: cursor.to() });
    }

    updateResultCount();

    if (searchMatches.length > 0) {
        currentIndex = 0;
        findNext();
    } else {
        currentIndex = -1;
        updateResultCount();
    }
}

// Function to find the next occurrence of the search query in the editor
function findNext() {
    if (searchMatches.length === 0) return;
    currentIndex = (currentIndex + 1) % searchMatches.length;
    let match = searchMatches[currentIndex];
    editor.setSelection(match.from, match.to);
    editor.scrollIntoView({ from: match.from, to: match.to });
    updateResultCount();
}

// Function to find the previous occurrence of the search query in the editor
function findPrev() {
    if (searchMatches.length === 0) return;
    currentIndex = (currentIndex - 1 + searchMatches.length) % searchMatches.length;
    let match = searchMatches[currentIndex];
    editor.setSelection(match.from, match.to);
    editor.scrollIntoView({ from: match.from, to: match.to });
    updateResultCount();
}

// Function to update the displayed result count
function updateResultCount() {
    if (searchMatches.length === 0) {
        document.getElementById('search-current-result').textContent = '0';
        document.getElementById('search-result-count').textContent = '0';
    } else {
        document.getElementById('search-current-result').textContent = currentIndex + 1; // Displaying 1-based index
        document.getElementById('search-result-count').textContent = searchMatches.length;
    }
}

// Event listener to handle the Escape key for closing search box
window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeSearch();
    }
    if (e.key === 'Enter') {
        if (document.getElementById('searchbox').classList.contains('active')) {
            findAll();
        }
    }
});