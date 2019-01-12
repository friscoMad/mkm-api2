// Code copied from https://github.com/mathiasvr/querystring to allow using the library in the browser without
// the need to import the whole browserified version.

// Disabled linting of file as a lot of changes would be needed
/* eslint-disable */

const hexTable = new Array(256);
for (let i = 0; i < 256; i += 1) hexTable[i] = `%${((i < 16 ? '0' : '') + i.toString(16)).toUpperCase()}`;

export default function (str) {
    // replaces encodeURIComponent
    // http://www.ecma-international.org/ecma-262/5.1/#sec-15.1.3.4
    if (typeof str !== 'string') str += '';
    let out = '';
    let lastPos = 0;

    for (let i = 0; i < str.length; ++i) {
        let c = str.charCodeAt(i);

        // These characters do not need escaping (in order):
        // ! - . _ ~
        // ' ( ) *
        // digits
        // alpha (uppercase)
        // alpha (lowercase)
        if (c === 0x21 || c === 0x2D || c === 0x2E || c === 0x5F || c === 0x7E
        || (c >= 0x27 && c <= 0x2A)
        || (c >= 0x30 && c <= 0x39)
        || (c >= 0x41 && c <= 0x5A)
        || (c >= 0x61 && c <= 0x7A)) {
            continue;
        }

        if (i - lastPos > 0) out += str.slice(lastPos, i);

        // Other ASCII characters
        if (c < 0x80) {
            lastPos = i + 1;
            out += hexTable[c];
            continue;
        }

        // Multi-byte characters ...
        if (c < 0x800) {
            lastPos = i + 1;
            out += hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)];
            continue;
        }
        if (c < 0xD800 || c >= 0xE000) {
            lastPos = i + 1;
            out += hexTable[0xE0 | (c >> 12)]
             + hexTable[0x80 | ((c >> 6) & 0x3F)]
             + hexTable[0x80 | (c & 0x3F)];
            continue;
        }
        // Surrogate pair
        ++i;
        var c2;
        if (i < str.length) c2 = str.charCodeAt(i) & 0x3FF;
        else throw new URIError('URI malformed');
        lastPos = i + 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | c2);
        out += hexTable[0xF0 | (c >> 18)]
           + hexTable[0x80 | ((c >> 12) & 0x3F)]
           + hexTable[0x80 | ((c >> 6) & 0x3F)]
           + hexTable[0x80 | (c & 0x3F)];
    }
    if (lastPos === 0) return str;
    if (lastPos < str.length) return out + str.slice(lastPos);
    return out;
}
