import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import Link from 'next/link';
import { API_BASE } from 'lib/api';

type Announcement = {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  body_richtext?: string;
  banner_image?: string;
  banner_image_url?: string;
  published_at?: string;
  start_at?: string;
  end_at?: string;
  is_featured: boolean;
  created_at: string;
};

export default async function AnnouncementsPage() {

  let announcements: Announcement[] = [];
  try {
    // Allow Next to decide caching strategy during build; avoid `no-store` which forces dynamic server usage
    const res = await fetch(`${API_BASE}/api/announcements`);
    const data = await res.json();
    announcements = data.announcements || [];
  } catch (err) {
    console.error('Failed to fetch announcements:', err);
  }

  function formatDate(dateString?: string) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-600 py-20 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            📢 Announcements & Updates
          </h1>
          <p className="text-2xl text-white/95 max-w-2xl mx-auto leading-relaxed font-medium">
            Stay informed with our latest news, promotions, and important updates from Pool Beanbags! ✨
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {announcements.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📢</div>
            <h3 className="text-2xl font-semibold text-base-content mb-4">No active announcements</h3>
            <p className="text-base-content/60 text-lg">Check back later for promotions and updates.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Announcement - Hero Style */}
            {announcements.filter(a => a.is_featured).length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-base-content mb-8 text-center">Featured Announcement</h2>
                {announcements.filter(a => a.is_featured).map(announcement => (
                  <Card key={announcement.id} className="overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                    {announcement.banner_image_url && (
                      <div className="relative h-96 overflow-hidden">
                        <img
                          src={announcement.banner_image_url}
                          alt={announcement.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-8 left-8 right-8">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="badge badge-primary badge-lg text-white shadow-lg">Featured</span>
                            <span className="text-white/90 text-sm font-medium">
                              {formatDate(announcement.start_at)} - {formatDate(announcement.end_at)}
                            </span>
                          </div>
                          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">{announcement.title}</h2>
                          {announcement.excerpt && (
                            <p className="text-xl text-white/90 leading-relaxed max-w-2xl">{announcement.excerpt}</p>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="p-8">
                      {!announcement.banner_image_url && (
                        <>
                          <div className="flex items-center gap-3 mb-6">
                            <span className="badge badge-primary badge-lg">Featured</span>
                            <span className="text-base-content/60 text-sm">
                              {formatDate(announcement.start_at)} - {formatDate(announcement.end_at)}
                            </span>
                          </div>
                          <h2 className="text-4xl font-bold text-base-content mb-6 leading-tight">{announcement.title}</h2>
                          {announcement.excerpt && (
                            <p className="text-xl text-base-content/80 mb-8 leading-relaxed">{announcement.excerpt}</p>
                          )}
                        </>
                      )}
                      {announcement.body_richtext && (
                        <div
                          className="prose prose-xl max-w-none text-base-content/90 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: announcement.body_richtext }}
                        />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Regular Announcements - Blog Style Grid */}
            {announcements.filter(a => !a.is_featured).length > 0 && (
              <>
                <h2 className="text-3xl font-bold text-base-content mb-8 text-center">Latest Updates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {announcements.filter(a => !a.is_featured).map(announcement => (
                    <Card key={announcement.id} className="group overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                      {announcement.banner_image_url && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={announcement.banner_image_url}
                            alt={announcement.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4">
                            <span className="badge badge-outline badge-sm bg-white/90 text-base-content shadow-lg">
                              {formatDate(announcement.created_at)}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-base-content/60 font-medium">
                            {formatDate(announcement.start_at)} - {formatDate(announcement.end_at)}
                          </span>
                          {!announcement.banner_image_url && (
                            <span className="badge badge-outline badge-sm">
                              {formatDate(announcement.created_at)}
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-base-content mb-3 leading-tight group-hover:text-primary transition-colors">
                          {announcement.title}
                        </h3>
                        {announcement.excerpt && (
                          <p className="text-base-content/70 mb-4 leading-relaxed line-clamp-3">
                            {announcement.excerpt}
                          </p>
                        )}
                        {announcement.body_richtext && (
                          <div
                            className="prose prose-sm max-w-none text-base-content/80 line-clamp-4"
                            dangerouslySetInnerHTML={{ __html: announcement.body_richtext.replace(/<[^>]*>/g, '').substring(0, 200) + '...' }}
                          />
                        )}
                        <div className="mt-4 pt-4 border-t border-base-200">
                          <div className="flex items-center justify-between text-sm text-base-content/60">
                            <span>Published {formatDate(announcement.created_at)}</span>
                            <span className="font-medium">Read more →</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary-focus text-primary-content font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
