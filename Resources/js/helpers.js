export function isExternalUrl(href) {
    if (!href) {
        return;
    }

    // If the hyperlink is external, add an icon to the end of the text
    return href.includes("http://") || href.includes("https://") && !href.includes(window.location.hostname);
}