const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        var isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walk(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    });
}

const OLD_PKG = 'com.example';
const NEW_PKG = 'com.capra.gps.navigation.map.route';

// 1. Rename packages in all kotlin/xml files
walk('app/src', (filePath) => {
    if (filePath.endsWith('.kt') || filePath.endsWith('.xml') || filePath.endsWith('.pro')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(/com\.example/g, NEW_PKG);
        
        // Let's also patch the specific files for ads and strings
        
        if (filePath.endsWith('build.gradle.kts')) {
             newContent = newContent.replace(/applicationId = ".+"/g, `applicationId = "${NEW_PKG}"`);
        }
        
        if (filePath.includes('AdViews.kt')) {
             newContent = newContent.replace(/ca-app-pub-3940256099942544\/6300978111/g, 'ca-app-pub-7556889965399172/4053432242'); // banner
             newContent = newContent.replace(/ca-app-pub-3940256099942544\/2247696110/g, 'ca-app-pub-7556889965399172/5310673598'); // native
        }
        
        if (filePath.includes('AdManager.kt')) {
             newContent = newContent.replace(/ca-app-pub-3940256099942544\/9257395921/g, 'ca-app-pub-7556889965399172/7584312289'); // app open
             newContent = newContent.replace(/ca-app-pub-3940256099942544\/1033173712/g, 'ca-app-pub-7556889965399172/7775883975'); // interstitial
             newContent = newContent.replace(/ca-app-pub-3940256099942544\/5224354917/g, 'ca-app-pub-7556889965399172/5149720631'); // rewarded
        }
        
        if (filePath.includes('AndroidManifest.xml')) {
             newContent = newContent.replace(/ca-app-pub-3940256099942544~3347511713/g, 'ca-app-pub-7556889965399172~6849276111');
        }

        if (filePath.includes('BillingManager.kt')) {
             newContent = newContent.replace(/aws\.gps\.pro/g, 'aws.gps.pro'); // just in case
             newContent = newContent.replace(/val productId = ".+"/g, `val productId = "aws.gps.pro"`);
        }
        
        // Privacy Policy URL replacement
        if (filePath.includes('HomeScreen.kt') || filePath.includes('SettingsScreen.kt')) {
             newContent = newContent.replace(/"https:\/\/google\.com"/g, 
                 `"https://sites.google.com/view/caprainnovationsprivacypolicy/privacy-policy"`);
        }
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
        }
    }
});

// Update build.gradle.kts
let buildGradlePath = 'app/build.gradle.kts';
let bgContent = fs.readFileSync(buildGradlePath, 'utf8');
bgContent = bgContent.replace(/applicationId = ".+"/g, `applicationId = "${NEW_PKG}"`);
bgContent = bgContent.replace(/namespace = ".+"/g, `namespace = "${NEW_PKG}"`);
fs.writeFileSync(buildGradlePath, bgContent, 'utf8');

// Also aggressively replace app names in all translations
walk('app/src/main/res', (filePath) => {
    if (filePath.endsWith('strings.xml')) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Look for the app_name tag
        let newContent = content.replace(/<string name="app_name">[^<]+<\/string>/g, '<string name="app_name">GPS Satellite Map View</string>');
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
        }
    }
});
