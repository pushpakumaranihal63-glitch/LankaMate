import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Flame,
  Heart,
  Sparkles,
  MapPin,
  Clock,
  Info,
  DollarSign,
  Search,
  Check,
} from 'lucide-react';
import { FoodItem, Restaurant, PageId } from '../types';
import { foodItems, famousRestaurants } from '../data/foodData';
import { useTranslation } from '../i18n/LanguageContext';

interface FoodViewProps {
  onToggleFavourite: (item: any) => void;
  isFavourite: (id: string) => boolean;
  onNavigatePage: (page: PageId) => void;
}

export const FoodView: React.FC<FoodViewProps> = ({
  onToggleFavourite,
  isFavourite,
  onNavigatePage,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'dishes' | 'restaurants'>('dishes');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dietaryFilter, setDietaryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Main Dish', 'Street Food', 'Breakfast/Dinner', 'Seafood', 'Dessert & Drinks'];

  const filteredDishes = foodItems.filter((item) => {
    const matchesCat =
      selectedCategory === 'All' ||
      item.category === selectedCategory ||
      (selectedCategory === 'Main Dish' && item.category === 'Main Dish');
    const matchesDiet =
      dietaryFilter === 'All' ||
      (dietaryFilter === 'vegetarian' && item.isVegetarian) ||
      (dietaryFilter === 'vegan' && item.isVegan);
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sinhalaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesDiet && matchesSearch;
  });

  const filteredRestaurants = famousRestaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.cuisineType || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-stone-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-stone-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700" />
            {t('Culinary Odyssey of Ceylon')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
            {t('Sri Lankan Food & Restaurants')}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-2xl">
            {t('Savor an explosion of fresh coconut milk, aromatic Ceylon cinnamon, roasted curry powders, and sweet jaggery treacle. Discover what to eat and where to find it.')}
          </p>
        </div>

        {/* Tab Selector: Dishes vs Restaurants */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('dishes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'dishes'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {t('Iconic Sri Lankan Dishes')} ({foodItems.length})
            </button>

            <button
              onClick={() => setActiveTab('restaurants')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'restaurants'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {t('Recommended Restaurants & Street Stalls')} ({famousRestaurants.length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search food or places...')}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
            />
          </div>
        </div>

        {/* Dishes Tab View */}
        {activeTab === 'dishes' && (
          <div className="space-y-6">
            {/* Category and Dietary Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-500">{t('Category:')}</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {t(cat)}
                </button>
              ))}

              <div className="h-4 w-px bg-stone-300 mx-1 hidden sm:block" />

              <span className="text-xs font-bold text-stone-500">{t('Dietary:')}</span>
              <button
                onClick={() => setDietaryFilter(dietaryFilter === 'vegetarian' ? 'All' : 'vegetarian')}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  dietaryFilter === 'vegetarian'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-stone-700 border border-stone-200'
                }`}
              >
                🌱 {t('Vegetarian')}
              </button>
              <button
                onClick={() => setDietaryFilter(dietaryFilter === 'vegan' ? 'All' : 'vegan')}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  dietaryFilter === 'vegan'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-stone-700 border border-stone-200'
                }`}
              >
                🥑 {t('100% Vegan')}
              </button>
            </div>

            {/* Food Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((food) => (
                <div
                  key={food.id}
                  className="bg-white rounded-2xl shadow-xs hover:shadow-md border border-stone-200 overflow-hidden flex flex-col justify-between transition-all"
                >
                  <div>
                    {/* Food Photo Header */}
                    <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      {/* Spice Level Indicator Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-amber-300 font-bold">
                        <Flame className="w-3 h-3 text-red-500 fill-red-500" />
                        <span>{t('Spice Level')}: {food.spiceLevel} / 5</span>
                      </div>

                      {/* Bookmark */}
                      <button
                        onClick={() =>
                          onToggleFavourite({
                            id: food.id,
                            type: 'food',
                            title: food.name,
                            subtitle: `${food.category} • ${food.priceIndication}`,
                            image: food.image,
                            linkPage: 'food',
                            targetId: food.id,
                          })
                        }
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-stone-800 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                        title={t('Save to Favourites')}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isFavourite(food.id) ? 'fill-red-500 text-red-500' : 'text-stone-700'
                          }`}
                        />
                      </button>

                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h3 className="text-xl font-black tracking-tight">{food.name}</h3>
                        <p className="text-xs text-amber-300 font-medium">
                          {food.sinhalaName} • {t(food.category)}
                        </p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3">
                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                        {food.description}
                      </p>

                      {/* Ingredients list */}
                      <div className="space-y-1 text-xs">
                        <span className="font-bold text-stone-700 block text-[11px] uppercase tracking-wider">
                          {t('Key Ingredients:')}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {food.ingredientsOrSpecialties.map((ing, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px]"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* How to eat cultural tip */}
                      {food.culturalNote && (
                        <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/60 text-xs text-amber-950 space-y-0.5">
                          <span className="font-bold block text-[11px]">{t('How to Eat & Savor:')}</span>
                          <p className="text-stone-600 text-[11px] leading-relaxed">{food.culturalNote}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Price & Recommended Place */}
                  <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-bold">{t('Price Guide')}</span>
                      <span className="font-bold text-emerald-950">{food.priceIndication}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block font-bold">{t('Best Spot')}</span>
                      <span className="font-medium text-stone-700 truncate block max-w-[130px]">
                        {food.location || t('Islandwide street stalls & tea shops')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restaurants Tab View */}
        {activeTab === 'restaurants' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRestaurants.map((rest) => (
              <div
                key={rest.id}
                className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                    <img
                      src={rest.image}
                      alt={rest.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-800 text-white text-xs font-bold">
                      {t(rest.category)}
                    </span>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="flex items-center gap-1 text-[11px] text-amber-300 font-medium">
                        <MapPin className="w-3 h-3" />
                        <span>{rest.location || 'Sri Lanka'}</span>
                      </div>
                      <h3 className="text-2xl font-black">{rest.name}</h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {rest.description}
                    </p>

                    {/* Specialties */}
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-stone-800 block">{t('Must-Order Specialties:')}</span>
                      <div className="flex flex-wrap gap-1">
                        {rest.ingredientsOrSpecialties.map((spec, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-100 font-medium text-[11px]"
                          >
                            ★ {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tourist Insider Tip */}
                    {rest.culturalNote && (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-700 flex items-start gap-2">
                        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{rest.culturalNote}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-bold text-stone-800">{rest.priceIndication}</span>
                  <span className="text-emerald-800 font-bold">{t(rest.category)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
