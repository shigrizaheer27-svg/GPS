const fs = require('fs');
const path = require('path');

const strings = {
  "onboarding_title_1": "Smart Navigation",
  "onboarding_desc_1": "Find the best routes avoiding traffic.",
  "onboarding_title_2": "3D Earth Map View",
  "onboarding_desc_2": "Explore places in beautiful satellite 3D view.",
  "onboarding_title_3": "Nearby Places",
  "onboarding_desc_3": "Discover restaurants, ATMs, and essentials nearby.",
  "onboarding_title_4": "Traffic Update",
  "onboarding_desc_4": "Get real-time traffic alerts on your route.",
  "next": "Next",
  "start": "Start"
};

const languages = ['ar', 'af', 'zh-CN', 'da', 'fr', 'de', 'el', 'hi', 'id', 'it', 'ja', 'ko', 'ms', 'fa', 'pt', 'ru', 'es', 'th', 'tr', 'ur', 'vi'];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  const valuesDir = path.join(__dirname, 'app/src/main/res/values');
  let engXml = fs.readFileSync(path.join(valuesDir, 'strings.xml'), 'utf8');
  for (const [key, val] of Object.entries(strings)) {
      engXml = engXml.replace('</resources>', `    <string name="${key}">${val.replace(/'/g, "\\'").replace(/&/g, "&amp;")}</string>\n</resources>`);
  }
  fs.writeFileSync(path.join(valuesDir, 'strings.xml'), engXml);
  
  for (const lang of languages) {
    const androidLang = lang === 'zh-CN' ? 'zh' : (lang === 'id' ? 'in' : lang);
    const langDir = path.join(__dirname, `app/src/main/res/values-${androidLang}`);
    let xml = fs.readFileSync(path.join(langDir, 'strings.xml'), 'utf8');
    
    console.log(`Translating extra to ${lang}...`);
    
    for (const [key, text] of Object.entries(strings)) {
       try {
           let q = encodeURIComponent(text);
           const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${q}`;
           const res = await fetch(url);
           const data = await res.json();
           let txt = '';
           if(data && data[0]) {
               for (const part of data[0]) {
                   if (part[0]) txt += part[0];
               }
           }
           if (txt) {
               val = txt.replace(/'/g, "\\'").replace(/&/g, "&amp;").replace(/</g, "&lt;");
               xml = xml.replace('</resources>', `    <string name="${key}">${val}</string>\n</resources>`);
           }
           await sleep(100);
       } catch (e) {}
    }
    fs.writeFileSync(path.join(langDir, 'strings.xml'), xml);
  }
}

main();
