import { api } from '@/lib/api';
import HeroSlider from '@/components/home/HeroSlider';
import DramaRow from '@/components/home/DramaRow';
import LatestGrid from '@/components/home/LatestGrid';
import GenreList from '@/components/home/GenreList';
import TopRanking from '@/components/home/TopRanking';

export default async function HomePage() {
  // Fetch home data from API (with dummy fallback)
  const homeData = await api.getHome();

  return (
    <div className="min-h-screen">
      {/* Hero Banner Slider */}
      <HeroSlider banners={homeData.banners} />

      {/* Main Content */}
      <div className="space-y-4">
        {/* Trending Now */}
        <DramaRow
          title="🔥 Trending Now"
          dramas={homeData.trending}
          viewAllLink="/genre/trending"
        />

        {/* Latest Updates Grid */}
        <LatestGrid updates={homeData.latest} />

        {/* Genre List */}
        <GenreList genres={homeData.genres} />

        {/* Two Column Layout for Rankings */}
        <div className="container-main py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top 10 Today */}
            <TopRanking
              title="📈 Top 10 Today"
              dramas={homeData.topToday}
              type="today"
            />

            {/* Top 10 This Week */}
            <TopRanking
              title="🏆 Top 10 This Week"
              dramas={homeData.topWeek}
              type="week"
            />
          </div>
        </div>

        {/* More Trending with Ranks */}
        <DramaRow
          title="⭐ Popular This Season"
          dramas={homeData.trending}
          viewAllLink="/genre/popular"
          showRank
        />
      </div>
    </div>
  );
}
