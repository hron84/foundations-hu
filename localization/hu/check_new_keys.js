const fs = require('fs');
const files = [
  'achievements.json', 'achievements.release.json', 'agents.json', 'agents.release.json',
  'buildings.json', 'buildings.release.json', 'dlc_guivre_garden.json', 'dlc_kickstarter_church.json',
  'events.json', 'events.release.json', 'general.json', 'general.release.json',
  'help.json', 'help.release.json', 'ks_content.json', 'languages.json',
  'legal.json', 'loading_tips.json', 'menu.json', 'military.json', 'military.release.json',
  'music.json', 'rules.json', 'rules.release.json', 'tutorial.json',
  'unlockables.json', 'unlockables.release.json', 'village_aspirations.json', 
  'village_aspirations.release.json', 'whatsnew.json'
];

function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    return content.slice(1);
  }
  return content;
}

function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? prefix + '.' + key : key;
    keys.push(fullKey);
    if (typeof value === 'object' && value !== null) {
      keys.push(...getAllKeys(value, fullKey));
    }
  }
  return keys;
}

for (const file of files) {
  try {
    const currentContent = stripBOM(fs.readFileSync(file, 'utf8'));
    const backupContent = stripBOM(fs.readFileSync(`old2/${file}.bak`, 'utf8'));
    const current = JSON.parse(currentContent);
    const backup = JSON.parse(backupContent);
    
    const currentKeys = new Set(getAllKeys(current));
    const backupKeys = new Set(getAllKeys(backup));
    
    const newKeys = [...currentKeys].filter(key => !backupKeys.has(key));
    
    if (newKeys.length > 0) {
      console.log(`\n=== ${file} ===`);
      console.log(`New keys found: ${newKeys.length}`);
      newKeys.forEach(key => console.log(`  + ${key}`));
    }
  } catch (error) {
    console.log(`Error checking ${file}: ${error.message}`);
  }
}