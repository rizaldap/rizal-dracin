import { Metadata } from 'next';
import { api } from '@/lib/api';
import WatchView from '@/components/player/WatchView';
import EpisodeSidebar from '@/components/player/EpisodeSidebar';

interface WatchPageProps {
    params: {
        dramaId: string;
        episodeId: string;
    };
}

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
    // In real app, fetch episode/drama data
    return {
        title: `Episode ${params.episodeId} - Watch Now`,
        description: 'Stream drama dengan kualitas terbaik',
    };
}

export default async function WatchPage({ params }: WatchPageProps) {
    // Fetch episode and drama data
    const episodes = await api.getEpisodes(params.dramaId);
    const episode = episodes.find((ep) => ep.id === params.episodeId) || episodes[0];
    const drama = await api.getDrama(params.dramaId);

    if (!episode) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Episode not found.
            </div>
        );
    }

    const currentIndex = episodes.findIndex((ep) => ep.id === episode.id);
    const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;
    const nextEpisode = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Main Content */}
            <div className="container-main py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Player Section */}
                    <WatchView
                        drama={drama}
                        episode={episode}
                        prevEpisode={prevEpisode}
                        nextEpisode={nextEpisode}
                    />

                    {/* Right: Episode Sidebar */}
                    <div className="lg:w-80 flex-shrink-0">
                        <EpisodeSidebar
                            episodes={episodes}
                            currentEpisodeId={episode.id}
                            dramaTitle={drama.title}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

