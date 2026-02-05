export function createPageUrl(pageName: string) {
    // For HashRouter, the internal navigation should be relative to the hash
    if (pageName === 'Home') return '/';
    return '/' + pageName.replace(/ /g, '-');
}
