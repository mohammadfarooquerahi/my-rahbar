const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.APPDATA, 'Code', 'User', 'History');
const targetWorkspace = 'myrahbar';
const workspacePath = 'c:\\Users\\HP\\vscode\\myrahbar';

// Map of target file path -> { timestamp, sourceFile }
const latestFiles = new Map();

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (file === 'entries.json') {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                const data = JSON.parse(content);
                if (data.resource && data.resource.toLowerCase().includes(targetWorkspace)) {
                    const resourcePathMatch = data.resource.match(/file:\/\/\/([a-zA-Z])%3A\/(.+)/);
                    if (resourcePathMatch) {
                        const drive = resourcePathMatch[1];
                        let filePath = drive + ':\\' + resourcePathMatch[2];
                        filePath = decodeURIComponent(filePath).replace(/\//g, '\\');
                        
                        if (filePath.toLowerCase().startsWith(workspacePath.toLowerCase())) {
                            // Find latest entry
                            if (data.entries && data.entries.length > 0) {
                                let latestEntry = data.entries[0];
                                for (const entry of data.entries) {
                                    if (entry.timestamp > latestEntry.timestamp) {
                                        latestEntry = entry;
                                    }
                                }
                                
                                const currentLatest = latestFiles.get(filePath);
                                if (!currentLatest || latestEntry.timestamp > currentLatest.timestamp) {
                                    const sourceFile = path.join(dir, latestEntry.id);
                                    if (fs.existsSync(sourceFile)) {
                                        latestFiles.set(filePath, {
                                            timestamp: latestEntry.timestamp,
                                            sourceFile: sourceFile
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            } catch(e) {
                // ignore
            }
        }
    }
}

console.log('Scanning VSCode history...');
walkDir(historyDir);

let restoredCount = 0;
for (const [targetPath, info] of latestFiles.entries()) {
    try {
        const dir = path.dirname(targetPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.copyFileSync(info.sourceFile, targetPath);
        console.log('Restored: ' + targetPath);
        restoredCount++;
    } catch(e) {
        console.error('Error restoring ' + targetPath + ':', e);
    }
}

console.log(`Successfully restored ${restoredCount} files from VSCode History.`);
