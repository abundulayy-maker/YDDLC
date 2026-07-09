function applyTypewriterEffect(element, speed = 100) {
    const textToType = element.textContent;
    element.textContent = '';
    let index = 0;

    function typeNextCharacter() {
        if (index < textToType.length) {
            element.textContent += textToType.charAt(index);
            index++;
            setTimeout(typeNextCharacter, speed);
        }
    }
    typeNextCharacter();
}

window.addEventListener('DOMContentLoaded', () => {
    const typewriterElements = document.querySelectorAll('.giant-type-text');
    typewriterElements.forEach(element => applyTypewriterEffect(element, 100));
});

const htmlFiles = ['windows.html', 'macos.html', 'olderarchives.html'];

document.getElementById('search-btn').addEventListener('click', executeSearch);
document.getElementById('search-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') executeSearch();
});

async function executeSearch() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = 'Searching...'; 

    if (!query) {
        resultsContainer.innerHTML = 'Please enter a search term.';
        return;
    }

    let matchedLinks = [];

    for (const file of htmlFiles) {
        try {
            const response = await fetch(file);
            if (!response.ok) continue; 
            
            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const links = doc.querySelectorAll('a.download-link');
            
            links.forEach(link => {
                const linkText = link.textContent.toLowerCase();
                if (linkText.includes(query)) {
                    const clonedLink = link.cloneNode(true);
                    matchedLinks.push(clonedLink);
                }
            });
        } catch (error) {
            console.error(`Error reading ${file}:`, error);
        }
    }

    resultsContainer.innerHTML = '';
    if (matchedLinks.length === 0) {
        resultsContainer.innerHTML = 'No files found.';
    } else {
        matchedLinks.forEach(link => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.appendChild(link);
            resultsContainer.appendChild(div);
        });
    }
}
