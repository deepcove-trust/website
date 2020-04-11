import md5 from 'md5';

export function convertSize(bytes) {
    if (!bytes || bytes == 0) return 'n/a';

    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2).toFixed(2) + ' ' + sizes[i];
}

// Capitalize the first letter of a word
export function Capitalize(s){
    if (typeof s != 'string') return "";

    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function isExternalUrl(href) {
    if (!href) {
        return;
    }

    // If the hyperlink is external, add an icon to the end of the text
    return href.includes("http://") || href.includes("https://") && !href.includes(window.location.hostname);
}
// Is an object empty
export function isEmptyObj(x) {
    return !x || Object.keys(x).length == 0 
}

// Takes in a page name and section and returns the URL
export function PageUrl(pageName, pageSection) {
    if (!pageName) return null;

    let section = pageSection != "main" ? `${pageSection}/` : "";
    let page = pageName.replace(/\s+/g, '-').toLowerCase()
    return `${window.location.protocol}//${window.location.hostname}/${section}${page}`
}

// Returns a google maps API url. If the map imbeed is provided that is stripped.
export function PrepareGoogleMapsUrl(url) {
    let s = url.split(' ');
    for (let i = 0; i < s.length; i++) {
        // If we have "src" attribute, return the URL within it
        if (s[i].includes("src=")) {
            return s[i].split('"')[1];
        } else if (i == s.length - 1) {
            return url;
        }
    }
}

export function YouTubeVideoId(s) {
    // invalid or valid and doesn't have ?

    // If the string is invalid return it
    // maybe the user entered the ID
    if (!validUrl(s) || !s.includes('?')) {
        return s;
    }
   
    // Return the query value for 'v' - the video Id
    return new URLSearchParams(s.substr(s.indexOf('?') + 1)).get('v');
}

// Validate email string against RFC2822
export function validateEmail(address) {
    var regex = RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    return regex.test(address);
}

// Validate URL
export function validUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
}

export function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
}

// Polyfill to support Internet Explorer
// (doesn't support Math.trunc by default)
Math.trunc = Math.trunc || function (x) {
    if (isNaN(x)) {
        return NaN;
    }
    if (x > 0) {
        return Math.floor(x);
    }
    return Math.ceil(x);
};

// Generate the Gravatar URL, using the email hash
export function GravatarUrl(email) {
    // Settings
    const apiUrl = "https://www.gravatar.com/avatar";
    const size = 100;//Options: https://en.gravatar.com/site/implement/images#size
    const rating = "g";//Options: https://en.gravatar.com/site/implement/images#rating
    const defaultImg = "mp";//Options: https://en.gravatar.com/site/implement/images#default-image

    // No email provided
    if (!email) return;
    // Prepare the email
    email = email.toLowerCase().trim();
    // Return the Gravatar string
    return `${apiUrl}/${md5(email)}?r=${rating}&s=${size}&d=${defaultImg}`;
}