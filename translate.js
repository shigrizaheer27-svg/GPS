const fs = require('fs');
const path = require('path');

const strings = {
  "app_name": "Pro GPS Router Tracker",
  "travel_tools": "Travel Tools",
  "more_tools": "More Tools",
  "current_location": "Current Location",
  "my_location": "My Location",
  "voice_route": "Voice Route",
  "satellite_map": "Satellite Map",
  "traffic_map": "Traffic Map",
  "settings": "Settings",
  "select_language": "Select Language",
  "done": "Done",
  "share_location": "Share Location",
  "copy_address": "Copy Address",
  "premium": "Premium",
  "unlock_feature": "Unlock Feature",
  "watch_ad": "Watch Ad",
  "go_premium": "Go Premium",
  "search_your_destination": "Search your destination",
  "search_place_or_address": "Search place or address...",
  "start_route": "Start Route",
  "address_copied": "Address copied",
  "location_not_available": "Location not available",
  "ad_not_ready": "Ad not ready, please try again",
  "watch_full_ad_to_unlock": "Watch full ad to unlock this feature",
  "find_route": "Find Route",
  "from": "FROM",
  "to": "TO",
  "route_finder": "Route Finder",
  "no_places_found": "No places found",
  "gps_navigation_tools": "GPS & Navigation Tools",
  "your_ultimate_travel_companion": "Your ultimate travel companion",
  "map_routes": "Map Routes",
  "map_views": "Map views",
  "explore_unique_and_essential_tools": "Explore unique and essential tools designed specifically for travelers.",
  "access_specialized_calculators": "Access specialized calculators, converters, and informative tools.",
  "new_user_only_rs300": "New User only   Rs.300",
  "start_weekly_at": "Start Weekly at %1$s",
  "restore_purchases": "Restore Purchases",
  "enjoy_our_gps_pro_version": "Enjoy our GPS Pro Version",
  "remove_ads": "Remove Ads",
  "unlock_all_pro_features": "Unlock All Pro Features",
  "unlimited_usage": "Unlimited Usage",
  "or_text": "OR",
  "loading_ad": "Loading Ad...",
  "preparing_maps_and_location": "Preparing maps and location...",
  "no_internet_connection": "No Internet Connection",
  "please_check_your_internet_connection_and_try_again": "Please check your internet connection and try again.",
  "open_network_settings": "Open Network Settings",
  "either_watch_an_ad_or_upgrade": "Either watch an ad or upgrade to premium to unlock this feature",
  "unlock_this_feature": "Unlock this feature",
  "weather": "Weather",
  "distance": "Distance",
  "area_measure": "Area Measure",
  "compass": "Compass",
  "speedometer": "Speedometer",
  "altitude": "Altitude",
  "coordinates": "Coordinates",
  "world_clock": "World Clock",
  "translate": "Translate",
  "currency": "Currency",
  "flashlight": "Flashlight",
  "parking": "Parking",
  "fuel_cost": "Fuel Cost",
  "allow_location": "Allow Location",
  "this_app_needs_location_access": "This app needs location access",
  "please_enable_location_permissions_in_android_settings": "Please enable location permissions in Android Settings",
  "open_settings": "Open Settings",
  "cancel": "Cancel",
  "save": "Save",
  "pro": "PRO",
  "ok": "OK",
  "buy_premium": "Buy Premium",
  "retry": "Retry",
  "start_free_trial": "Start Free Trial"
};

const languages = ['ar', 'af', 'zh-CN', 'da', 'fr', 'de', 'el', 'hi', 'id', 'it', 'ja', 'ko', 'ms', 'fa', 'pt', 'ru', 'es', 'th', 'tr', 'ur', 'vi'];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  const valuesDir = path.join(__dirname, 'app/src/main/res/values');
  if (!fs.existsSync(valuesDir)) fs.mkdirSync(valuesDir, { recursive: true });

  let engXml = '<resources>\n';
  for (const [key, val] of Object.entries(strings)) {
    engXml += `    <string name="${key}">${val.replace(/'/g, "\\'").replace(/&/g, "&amp;")}</string>\n`;
  }
  engXml += '</resources>';
  fs.writeFileSync(path.join(valuesDir, 'strings.xml'), engXml);
  
  for (const lang of languages) {
    const androidLang = lang === 'zh-CN' ? 'zh' : (lang === 'id' ? 'in' : lang);
    const langDir = path.join(__dirname, `app/src/main/res/values-${androidLang}`);
    if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });
    
    let xml = '<resources>\n';
    console.log(`Translating to ${lang}...`);
    
    const entries = Object.entries(strings);
    const textArr = entries.map(e => e[1]);
    let translatedArr = [];

    const batchSize = 10;
    for (let i = 0; i < textArr.length; i += batchSize) {
        const batch = textArr.slice(i, i + batchSize);
        const promises = batch.map(async (text, idx) => {
            for(let r=0; r<3; r++) {
               try {
                  let q = encodeURIComponent(text.replace('%1$s', '___PARAM___'));
                  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${q}`;
                  const res = await fetch(url);
                  const data = await res.json();
                  let txt = '';
                  if(data && data[0]) {
                     for (const part of data[0]) {
                         if (part[0]) txt += part[0];
                     }
                  }
                  return txt.replace('___PARAM___', '%1$s');
               } catch(e) {
                 await sleep(getRandomInt(100, 300));
               }
            }
            return text; // fallback
        });
        
        const results = await Promise.all(promises);
        translatedArr.push(...results);
        await sleep(getRandomInt(200, 500));
    }
    
    for (let i = 0; i < entries.length; i++) {
        let val = translatedArr[i] || textArr[i];
        // Fix quotes and special chars
        val = val.replace(/'/g, "\\'").replace(/&/g, "&amp;").replace(/</g, "&lt;");
        xml += `    <string name="${entries[i][0]}">${val}</string>\n`;
    }
    
    xml += '</resources>';
    fs.writeFileSync(path.join(langDir, 'strings.xml'), xml);
  }
}

function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

main().catch(console.error);
