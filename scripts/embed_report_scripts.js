const fs = require('fs');
const path = require('path');
const https = require('https');

const reportPath = path.join(__dirname, '../PROJECT_FINAL_REPORT.html');
const outputPath = path.join(__dirname, '../PROJECT_FINAL_REPORT_PORTABLE.html');

// CDN URLs
const markedUrl = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
const mermaidUrl = 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js';

function downloadContent(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
                return;
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Sanitize content to prevent breaking the script tag
                // We escape </script> to <\/script> inside strings
                const sanitized = data.replace(/<\/script>/g, '<\\/script>');
                resolve(sanitized);
            });
        }).on('error', reject);
    });
}

async function createPortableReport() {
    console.log('Reading HTML file...');
    if (!fs.existsSync(reportPath)) {
        console.error('Error: PROJECT_FINAL_REPORT.html not found!');
        return;
    }
    const originalHtml = fs.readFileSync(reportPath, 'utf8');

    console.log('Downloading Marked.js...');
    const markedJs = await downloadContent(markedUrl);

    console.log('Downloading Mermaid.js...');
    const mermaidJs = await downloadContent(mermaidUrl);

    console.log('Processing HTML content...');

    let html = originalHtml;

    // 1. Remove original library references from HEAD
    // We strictly look for the specific strings we know are in the file
    html = html.replace('<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>', '');
    html = html.replace('<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>', '');

    // 2. Remove the original rendering script at the bottom
    // We regex for the block that initializes mermaid
    const scriptRegex = /<script>\s*\/\/\s*Initialize Mermaid[\s\S]*?<\/script>/;
    if (scriptRegex.test(html)) {
        console.log('Found original rendering script. Removing it.');
        html = html.replace(scriptRegex, '');
    } else {
        console.warn('WARNING: Could not find original rendering script to remove. This might cause double execution.');
    }

    // 3. Inject Warning/Loading UI immediately after <body>
    const bodyStartTag = '<body>';
    const bodyStartIdx = html.indexOf(bodyStartTag);
    if (bodyStartIdx !== -1) {
        const loadingUi = `
    <div id="loading" style="font-family: sans-serif; font-size: 24px; color: #555; text-align: center; margin-top: 50px; padding: 20px; border: 1px solid #ccc; background: #f9f9f9;">
        <strong>Loading Report...</strong><br>
        <small>Please wait while the report renders. This may take a few seconds.</small>
    </div>
    <div id="error-box" style="display:none; background: #ffebeb; color: #d32f2f; padding: 20px; border: 1px solid #d32f2f; margin: 20px; font-family: monospace; white-space: pre-wrap;">
        <strong>Debug Log:</strong><br>
    </div>
    <script>
        // Early error handler
        window.onerror = function(msg, url, line) {
            const errorBox = document.getElementById('error-box');
            if (errorBox) {
                errorBox.style.display = 'block';
                errorBox.innerHTML += 'Global Error: ' + msg + '\\n';
                // Also show loading div just in case it was hidden prematurely
                const loading = document.getElementById('loading');
                if (loading) loading.innerHTML = '<strong>Error Loading Code</strong><br>Check the Debug Log below.';
            }
        };
    </script>
        `;
        html = html.slice(0, bodyStartIdx + bodyStartTag.length) + loadingUi + html.slice(bodyStartIdx + bodyStartTag.length);
        console.log('Injected Loading UI.');
    } else {
        console.error('CRITICAL: Could not find <body> tag!');
    }

    // 4. Inject Libraries AND Rendering Logic at the END of </body>
    // This prevents blocking the initial HTML paint
    const bodyEndTag = '</body>';
    const bodyEndIdx = html.indexOf(bodyEndTag);

    if (bodyEndIdx !== -1) {
        const newScripts = `
    <!-- Embedded Libraries (Moved to bottom for performance) -->
    <script>${markedJs}</script>
    <script>${mermaidJs}</script>
    
    <!-- Render Logic -->
    <script>
        (function() {
            try {
                console.log("Starting rendering process...");
                
                // Initialize Mermaid
                if (typeof mermaid !== 'undefined') {
                    mermaid.initialize({ startOnLoad: false, theme: 'default' });
                    console.log("Mermaid initialized.");
                } else {
                    throw new Error("Mermaid library failed to load.");
                }

                // Get Markdown
                const markdownEl = document.getElementById('raw-markdown');
                if (!markdownEl) throw new Error("Markdown content element (#raw-markdown) not found.");
                const markdown = markdownEl.textContent;
                if (!markdown || markdown.trim().length === 0) {
                     throw new Error("Markdown content is empty. Retrieval failed.");
                }
                console.log("Markdown content retrieved (" + markdown.length + " chars).");

                // Render Markdown
                if (typeof marked !== 'undefined') {
                     // Check if marked is an object with parse or a function
                     const parser = marked.parse ? marked.parse : marked;
                     const html = parser(markdown);
                     document.getElementById('content').innerHTML = html;
                     console.log("Markdown rendered to HTML.");
                } else {
                    throw new Error("Marked library failed to load.");
                }

                // Process Mermaid Blocks
                document.querySelectorAll('pre code.language-mermaid').forEach((block, index) => {
                    const graphDefinition = block.innerText;
                    const parentPre = block.parentElement;
                    const div = document.createElement('div');
                    div.className = 'mermaid';
                    div.id = 'mermaid-chart-' + index;
                    div.textContent = graphDefinition;
                    parentPre.replaceWith(div);
                });
                console.log("Mermaid blocks processed.");
                
                // Run Mermaid
                mermaid.run().then(() => {
                    console.log("Mermaid diagrams rendered.");
                }).catch(err => {
                    console.error("Mermaid run error:", err);
                });

                // Hide Loading
                const loadingDiv = document.getElementById('loading');
                if (loadingDiv) loadingDiv.style.display = 'none';
                console.log("Loading screen hidden.");

            } catch (err) {
                console.error(err);
                const errorBox = document.getElementById('error-box');
                if (errorBox) {
                    errorBox.style.display = 'block';
                    errorBox.innerHTML += 'Script Error: ' + err.message + '\\n';
                }
            }
        })();
    </script>
        `;

        html = html.slice(0, bodyEndIdx) + newScripts + html.slice(bodyEndIdx);
        console.log('Injected Scripts at the end of body.');
    } else {
        console.error('CRITICAL: Could not find </body> tag!');
    }

    fs.writeFileSync(outputPath, html);
    console.log(`Successfully created portable report at: ${outputPath}`);
}

createPortableReport().catch(err => console.error(err));
