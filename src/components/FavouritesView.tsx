import React, { useState } from 'react';
import { Heart, Trash2, ArrowRight, MapPin, Hotel, UtensilsCrossed, Compass } from 'lucide-react';
import { FavouriteItem, PageId } from '../types';
import { destinationsData } from '../data/destinationsData';

interface FavouritesViewProps {
  favourites: FavouriteItem[];
  onRemoveFavourite: (id: string) => void;
  onClearFavourites: () => void;
  onNavigatePage: (page: PageId) => void;
  onSelectDestinationModal: (dest: any) => void;
}

export const FavouritesView: React.FC<FavouritesViewProps> = ({
  favourites,
  onRemoveFavourite,
  onClearFavourites,
  onNavigatePage,
  onSelectDestinationModal,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredItems = favourites.filter(
    (item) => filterType === 'all' || item.type === filterType
  );

  const handleOpenItem = (item: FavouriteItem) => {
    if (item.type === 'destination') {
      const dest = destinationsData.find((d) => d.id === item.targetId);
      if (dest) {
        onSelectDestinationModal(dest);
        onNavigatePage('destinations');
        return;
      }
    }
    onNavigatePage(item.linkPage);
  };

  return (
    <div className="bg-stone-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-red-600 text-red-600" />
              Your Personal Saved Collection
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
              Saved Favourites ({favourites.length})
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-2xl">
              Access your bookmarked Sri Lankan destinations, heritage stays, and iconic culinary specialties anytime.
            </p>
          </div>

          {favourites.length > 0 && (
            <button
              onClick={onClearFavourites}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer w-fit"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Favourites</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        {favourites.length > 0 && (
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: `All Items (${favourites.length})` },
              { id: 'destination', label: 'Destinations' },
              { id: 'hotel', label: 'Hotels' },
              { id: 'food', label: 'Food & Dishes' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  filterType === f.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {favourites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 space-y-4 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-stone-900">No Favourites Saved Yet</h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-md mx-auto">
              Tap the heart icon on any Sri Lankan destination, boutique hotel, or authentic dish to save it here for quick access during your journey.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => onNavigatePage('destinations')}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Explore Destinations
              </button>
              <button
                onClick={() => onNavigatePage('hotels')}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Browse Hotels
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-xs hover:shadow-md border border-stone-200 overflow-hidden flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-emerald-800 text-white text-[10px] font-bold uppercase tracking-wider">
                      {item.type}
                    </span>

                    <button
                      onClick={() => onRemoveFavourite(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-red-600 hover:bg-red-50 flex items-center justify-center cursor-pointer transition-colors"
                      title="Remove from Favourites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="text-xl font-black">{item.title}</h3>
                      <p className="text-xs text-amber-300 font-medium">{item.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 font-medium">Saved in LankaMate</span>
                  <button
                    onClick={() => handleOpenItem(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
