// test translation with multiple q
const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=hello&q=world`;
fetch(url).then(r=>r.json()).then(d=>console.log(JSON.stringify(d)));
