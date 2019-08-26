export function isExternalUrl(href) {
    if (!href) {
        return;
    }

    // If the hyperlink is external, add an icon to the end of the text
    return href.includes("http://") || href.includes("https://") && !href.includes(window.location.hostname);
}

// Takes in a page name and section and returns the URL
export function PageUrl(pageName, pageSection) {
    if (!pageName) return null;

    let section = pageSection != "main" ? pageSection : "";
    let page = pageName.replace(/\s+/g, '-').toLowerCase()
    return `${window.location.protocol}/${window.location.hostname}/${section}${page}`
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

// Validate email string against RFC2822
export function validateEmail(address) {
    var regex = RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    return regex.test(address);
}