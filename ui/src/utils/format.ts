export const linkify = (text: string) => {
    // Simple regex to detect URLs
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
        const href = url.startsWith('http') ? url : `http://${url}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${url}</a>`;
    });
};

export const isUrl = (text: string) => {
    return /^(https?:\/\/|www\.)/i.test(text);
};
