export function isExternalUrl(href) {
    if (!href) {
        return;
    }

    // If the hyperlink is external, add an icon to the end of the text
    return href.includes("http://") || href.includes("https://") && !href.includes(window.location.hostname);
}

// Validate email string against RFC2822
export function validateEmail(address) {
    var regex = RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    return regex.test(address);
}