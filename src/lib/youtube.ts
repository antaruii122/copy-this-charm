
/**
 * Extracts the YouTube Video ID from various URL formats.
 */
export const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Parses ISO 8601 duration (e.g. PT1H2M10S) into seconds.
 */
export const parseISODuration = (duration: string): number => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = (parseInt(match[1] || '0') || 0);
    const minutes = (parseInt(match[2] || '0') || 0);
    const seconds = (parseInt(match[3] || '0') || 0);

    return (hours * 3600) + (minutes * 60) + seconds;
};

interface YouTubeVideoDetails {
    title: string;
    durationSeconds: number;
    thumbnailUrl: string;
    description: string;
}

/**
 * Fetches video details from YouTube Data API.
 */
export const fetchYouTubeDetails = async (videoId: string, apiKey: string): Promise<YouTubeVideoDetails | null> => {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("YouTube API Error:", errorData);
            if (response.status === 403) throw new Error("API Key inválida o cuota excedida.");
            if (response.status === 400) throw new Error("Petición inválida.");
            throw new Error(`Error de YouTube (${response.status})`);
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            throw new Error("Video no encontrado (privado o eliminado).");
        }

        const item = data.items[0];
        const duration = parseISODuration(item.contentDetails.duration);
        const snippet = item.snippet;

        return {
            title: snippet.title,
            durationSeconds: duration,
            thumbnailUrl: snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
            description: snippet.description || ""
        };
    } catch (error) {
        throw error; // Propagate error to UI
    }
};
