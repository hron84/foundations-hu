#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get directory paths
const huFolder = __dirname;
const localizationsFolder = path.dirname(huFolder);
const enFolder = path.join(localizationsFolder, 'en');

try {
    // Read all files from English folder
    const files = fs.readdirSync(enFolder);

    files.forEach(file => {
        // Skip directory entries
        if (file === '.' || file === '..') {
            return;
        }

        const enFilePath = path.join(enFolder, file);
        const huFilePath = path.join(huFolder, file);

        // Check if it's a file (not a directory)
        if (fs.statSync(enFilePath).isFile()) {
            if (!fs.existsSync(huFilePath)) {
                // Copy new file if it doesn't exist in Hungarian folder
                fs.copyFileSync(enFilePath, huFilePath);
                console.log(` >> Copied new file: ${file}`);
            } else if (file.endsWith('.json')) {
                // Merge JSON files
                try {
                    let enContent = fs.readFileSync(enFilePath, 'utf8');
                    let huContent = fs.readFileSync(huFilePath, 'utf8');

                    // Check for BOM (Byte Order Mark) presence before removing
                    const enHasBOM = enContent.charCodeAt(0) === 0xFEFF;
                    const huHasBOM = huContent.charCodeAt(0) === 0xFEFF;
                    
                    // Remove BOM if present for parsing
                    if (enHasBOM) enContent = enContent.slice(1);
                    if (huHasBOM) huContent = huContent.slice(1);

                    let enJson, huJson;

                    // Parse Hungarian JSON file
                    try {
                        huJson = JSON.parse(huContent);
                    } catch (huParseError) {
                        console.log(` !! Error: Failed to parse HUNGARIAN file: ${file}`);
                        console.log(` !! Hungarian file path: ${huFilePath}`);
                        console.log(` !! Parse error: ${huParseError.message}`);
                        
                        // Additional debugging info
                        const firstChars = huContent.substring(0, 20).split('').map(c => 
                            c.charCodeAt(0) > 32 && c.charCodeAt(0) < 127 ? c : `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`
                        ).join('');
                        console.log(` !! First 20 characters (with unicode): ${firstChars}`);
                        console.log(` !! File size: ${huContent.length} bytes`);
                        
                        return; // Skip this file
                    }

                    // Parse English JSON file
                    try {
                        enJson = JSON.parse(enContent);
                    } catch (enParseError) {
                        console.log(` !! Error: Failed to parse ENGLISH file: ${file}`);
                        console.log(` !! English file path: ${enFilePath}`);
                        console.log(` !! Parse error: ${enParseError.message}`);
                        
                        // Additional debugging info
                        const firstChars = enContent.substring(0, 20).split('').map(c => 
                            c.charCodeAt(0) > 32 && c.charCodeAt(0) < 127 ? c : `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`
                        ).join('');
                        console.log(` !! First 20 characters (with unicode): ${firstChars}`);
                        console.log(` !! File size: ${enContent.length} bytes`);
                        
                        return; // Skip this file
                    }

                    // Deep merge function to preserve Hungarian translations and add missing English keys
                    function deepMerge(english, hungarian) {
                        const result = {};
                        
                        // First, copy all English keys
                        for (const key in english) {
                            if (english.hasOwnProperty(key)) {
                                if (typeof english[key] === 'object' && english[key] !== null && !Array.isArray(english[key])) {
                                    // If it's an object, recursively merge
                                    if (hungarian.hasOwnProperty(key) && typeof hungarian[key] === 'object' && hungarian[key] !== null && !Array.isArray(hungarian[key])) {
                                        result[key] = deepMerge(english[key], hungarian[key]);
                                    } else {
                                        // Hungarian doesn't have this object, copy English version
                                        result[key] = english[key];
                                    }
                                } else {
                                    // It's a primitive value, use Hungarian if exists, otherwise English
                                    result[key] = hungarian.hasOwnProperty(key) ? hungarian[key] : english[key];
                                }
                            }
                        }
                        
                        // Then, add any Hungarian-only keys (in case there are extra translations)
                        for (const key in hungarian) {
                            if (hungarian.hasOwnProperty(key) && !english.hasOwnProperty(key)) {
                                result[key] = hungarian[key];
                            }
                        }
                        
                        return result;
                    }
                    
                    // Perform deep merge
                    const mergedJson = deepMerge(enJson, huJson);

                    // Create backup of original Hungarian file
                    fs.copyFileSync(huFilePath, huFilePath + '.bak');

                    // Prepare final content with BOM if original Hungarian file had it
                    let finalContent = JSON.stringify(mergedJson, null, 2);
                    if (huHasBOM) {
                        finalContent = '\uFEFF' + finalContent;
                    }

                    // Write merged JSON with preserved BOM status
                    fs.writeFileSync(huFilePath, finalContent, 'utf8');
                    console.log(` >> Updated file: ${file}${huHasBOM ? ' (BOM preserved)' : ''}`);

                } catch (generalError) {
                    console.log(` !! Warning: General error processing file: ${file}`);
                    console.log(` !! Error: ${generalError.message}`);
                }
            }
        }
    });

    console.log('Update completed successfully!');

} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
}