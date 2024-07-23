// Function to include HTML file
export function includeHTML(filePath, targetElement, callback) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load HTML file');
            }
            return response.text();
        })
        .then(html => {
            // Inject HTML content into target element
            document.getElementById(targetElement).innerHTML = html;
            if (callback) callback();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to load an HTML file with a script
export function loadHTMLWithScript(filePath, targetElement, scriptPath) {
    includeHTML(filePath, targetElement, function() {
        if (scriptPath) {
            var script = document.createElement('script');
            script.src = scriptPath;
            document.body.appendChild(script);
        }
    });
}

// Function to load an HTML file with a script and a callback function
export function loadHTMLWithScriptAndCallback(filePath, targetElement, scriptPath, callbackFunction) {
    includeHTML(filePath, targetElement, function() {
        if (scriptPath) {
            var script = document.createElement('script');
            script.src = scriptPath;
            script.onload = function() {
                if (callbackFunction) callbackFunction();
            };
            document.body.appendChild(script);
        } else if (callbackFunction) {
            callbackFunction();
        }
    });
}
    