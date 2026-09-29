import React, { useState, useEffect } from 'react';
import {
  Train,
  Car,
  Bus,
  Clock,
  Navigation,
  Compass,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Calculator,
  ExternalLink,
  Smartphone,
  Info,
  Phone,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { TransportGuide, PageId } from '../types';
import { transportData, cityDistanceMatrix } from '../data/transportData';
import { businessRegistrationService } from '../services/businessRegistrationService';

interface VerifiedTransportProvider {
  id: string;
  businessName: string;
  category: string;
  description: string;
  location: string;
  phone: string;
  whatsapp: string;
  openingHours: string;
  photos: string[];
  navigateUrl: string;
  ratesDescription?: string;
  transportDetails?: {
    vehicleType: string;
    vehicleNumber: string;
    passengerCapacity: number;
    driverAvailable: string;
  };
}

interface TransportViewProps {
  onNavigatePage: (page: PageId) => void;
}

export const TransportView: React.FC<TransportViewProps> = ({ onNavigatePage }) => {
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [originCity, setOriginCity] = useState<string>('Colombo');
  const [destinationCity, setDestinationCity] = useState<string>('Kandy');
  const [verifiedTransportProviders, setVerifiedTransportProviders] = useState<VerifiedTransportProvider[]>([]);

  useEffect(() => {
    const list: VerifiedTransportProvider[] = businessRegistrationService
      .getAllApprovedListings()
      .filter((b) =>
        ['Taxi / Car Hire', 'Van / Tourist Transport', 'Tuk-Tuk', 'Airport Transfer'].includes(
          b.business.category
        )
      )
      .map((b) => ({
        id: b.id,
        businessName: b.business.businessName,
        category: b.business.category,
        description: b.business.description,
        location: `${b.business.city}, ${b.business.district}`,
        phone: b.business.phone,
        whatsapp: b.business.whatsapp,
        openingHours: b.business.openingHours,
        photos:
          b.photos.additionalPhotos.length > 0
            ? b.photos.additionalPhotos
            : [b.photos.coverPhotoUrl].filter(Boolean),
        navigateUrl: `https://www.google.com/maps/search/?api=1&query=${b.business.coordinates.lat},${b.business.coordinates.lng}`,
        ratesDescription:
          b.services.transport?.priceDescription ||
          (b.services.transport?.startingPrice
            ? `LKR ${b.services.transport.startingPrice.toLocaleString()}`
            : undefined),
        transportDetails: b.services.transport
          ? {
              vehicleType: b.services.transport.vehicleType,
              vehicleNumber: b.services.transport.vehicleNumber,
              passengerCapacity: b.services.transport.passengerCapacity,
              driverAvailable: b.services.transport.driverAvailable,
            }
          : undefined,
      }));
    setVerifiedTransportProviders(list);
  }, []);

  const availableCities = ['Colombo', 'Kandy', 'Galle', 'Ella', 'Sigiriya', 'Nuwara Eliya', 'Yala', 'Jaffna', 'Mirissa'];

  // Route Matrix Lookup
  const routeFound = cityDistanceMatrix.find(
    (r) =>
      (r.from === originCity && r.to === destinationCity) ||
      (r.from === destinationCity && r.to === originCity)
  );

  const filteredGuides = transportData.filter(
    (t) => selectedMode === 'all' || t.type === selectedMode
  );

  return (
    <div className="bg-stone-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-stone-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Train className="w-3.5 h-3.5 text-emerald-700" />
            Island Transit & Mobility Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
            Sri Lanka Transport & Travel Modes
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-1 max-w-2xl">
            Everything you need to navigate Sri Lanka: the legendary scenic blue trains, metered tuk-tuks, modern highway express buses, and private chauffeur-driven vehicles.
          </p>
        </div>

        {/* Interactive Travel Distance & Time Calculator Widget */}
        <div className="bg-white rounded-2xl shadow-xs border border-stone-200 p-6 space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-amber-500" />
            <span>Sri Lanka Route & Distance Calculator</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Departure City</label>
              <select
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800"
              >
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Destination City</label>
              <select
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800"
              >
                {availableCities.filter((c) => c !== originCity).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <div className="w-full p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    Driving Distance
                  </span>
                  <span className="text-lg font-black text-emerald-950">
                    {routeFound ? `${routeFound.distanceKm} km` : '~150 km (approx)'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    Transit Duration
                  </span>
                  <span className="text-xs font-bold text-emerald-900">
                    {routeFound ? `${routeFound.carHours} hrs by Road` : '2 - 3.5 hrs'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {routeFound && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-950">Recommended Transport:</span>
                <span className="text-amber-900 font-medium">{routeFound.bestWay}</span>
              </div>
              {routeFound.trainHours && (
                <span className="text-stone-600">
                  Scenic Train Time: ~{routeFound.trainHours} hours
                </span>
              )}
            </div>
          )}
        </div>

        {/* Ride Booking Section */}
        <section id="ride-booking" className="bg-white rounded-2xl shadow-xs border border-stone-200 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                <span>On-Demand Transit</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
                Ride Booking
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                On-demand ride-hailing services in Sri Lanka for metered tuk-tuks, city cars, and airport transfers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* PickMe Card */}
            <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-5 flex flex-col justify-between space-y-4 hover:border-amber-300 transition-colors">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black text-lg shadow-2xs">
                      P
                    </div>
                    <div>
                      <h3 className="font-black text-base text-stone-900 leading-tight">PickMe</h3>
                      <span className="text-[11px] text-stone-500 font-medium">Sri Lanka's Popular Local Ride App</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold uppercase">
                    External Service
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 font-medium">
                  Book a ride through PickMe.
                </p>

                <p className="text-xs text-stone-500 leading-relaxed">
                  Widely used across Sri Lanka for verified metered tuk-tuks, flex cars, and airport transfers in Colombo, Kandy, Galle, and major tourist hubs.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-200/60">
                <a
                  id="btn-open-pickme"
                  href="https://pickme.lk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-bold text-xs transition-colors shadow-2xs cursor-pointer no-underline"
                  title="Open official PickMe service"
                >
                  <span>Open PickMe</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <p className="text-[11px] text-stone-500 text-center">
                  Opens official PickMe service / app
                </p>
              </div>
            </div>

            {/* Uber Card */}
            <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-5 flex flex-col justify-between space-y-4 hover:border-stone-400 transition-colors">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-lg shadow-2xs">
                      U
                    </div>
                    <div>
                      <h3 className="font-black text-base text-stone-900 leading-tight">Uber</h3>
                      <span className="text-[11px] text-stone-500 font-medium">Global Ride-Hailing Service</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-800 text-[10px] font-bold uppercase">
                    External Service
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 font-medium">
                  Book a ride through Uber.
                </p>

                <p className="text-xs text-stone-500 leading-relaxed">
                  Available in Greater Colombo, Kandy, and southern coastal expressway corridors for Uber Tuk, Uber Go, and Premier cars with cashless digital payment.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-200/60">
                <a
                  id="btn-open-uber"
                  href="https://m.uber.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black active:bg-stone-950 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer no-underline"
                  title="Open official Uber service"
                >
                  <span>Open Uber</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-300" />
                </a>
                <p className="text-[11px] text-stone-500 text-center">
                  Opens official Uber service / app
                </p>
              </div>
            </div>
          </div>

          {/* Provider Disclaimer Note */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-start gap-2.5 text-xs text-amber-950">
            <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Ride bookings are completed through the selected external service. Availability, fares and service terms are controlled by that provider.
            </p>
          </div>
        </section>

        {/* Verified Local Chauffeurs & Transport Partners from Business Registration Portal */}
        {verifiedTransportProviders.length > 0 && (
          <section className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md border border-emerald-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-amber-300 text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>LankaMate Verified Partners</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Verified Local Drivers, Vans & Private Chauffeurs
                </h3>
                <p className="text-xs sm:text-sm text-emerald-200">
                  Direct contact with registered independent drivers and transport businesses across Sri Lanka.
                </p>
              </div>


            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {verifiedTransportProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-emerald-900/80 border border-emerald-700/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-base text-white">{provider.businessName}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-amber-300 text-[10px] font-black border border-emerald-600 shrink-0">
                            ✓ Verified
                          </span>
                        </div>
                        <span className="text-xs text-emerald-300 block">{provider.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-amber-300 block">
                          {provider.ratesDescription || 'Direct Rates'}
                        </span>
                        <span className="text-[10px] text-emerald-300 font-mono">
                          {provider.openingHours}
                        </span>
                      </div>
                    </div>

                    {provider.photos[0] && (
                      <div className="h-32 rounded-xl overflow-hidden border border-emerald-700">
                        <img
                          src={provider.photos[0]}
                          alt={provider.businessName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <p className="text-xs text-emerald-100 line-clamp-2 leading-relaxed">
                      {provider.description}
                    </p>

                    {provider.transportDetails && (
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-[11px] text-emerald-200">
                        <div>
                          <strong>Vehicle:</strong> {provider.transportDetails.vehicleType}
                        </div>
                        <div>
                          <strong>Plate:</strong> {provider.transportDetails.vehicleNumber}
                        </div>
                        <div>
                          <strong>Capacity:</strong> {provider.transportDetails.passengerCapacity} Pax
                        </div>
                        <div>
                          <strong>Mode:</strong> {provider.transportDetails.driverAvailable}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate max-w-[150px]">{provider.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={provider.navigateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Navigation className="w-3.5 h-3.5 text-amber-400" />
                        <span>Navigate</span>
                      </a>
                      <a
                        href={`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={`tel:${provider.phone}`}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-black flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mode Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Transport Options' },
            { id: 'train', label: '🚂 Scenic Trains' },
            { id: 'tuktuk', label: '🛺 Tuk-Tuks (Three-Wheelers)' },
            { id: 'bus', label: '🚌 Highway Express Buses' },
            { id: 'taxi', label: '🚗 Private Chauffeurs & Cars' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                selectedMode === mode.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Transport Mode Detailed Cards */}
        <div className="space-y-8">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Photo & Badges */}
              <div className="lg:col-span-4 relative min-h-[220px] lg:min-h-full bg-stone-900">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider mb-1 inline-block">
                    {guide.type}
                  </span>
                  <h3 className="text-xl font-black">{guide.title}</h3>
                  <p className="text-xs text-amber-300 italic mt-0.5">{guide.tagline}</p>
                </div>
              </div>

              {/* Right Details */}
              <div className="lg:col-span-8 p-6 space-y-4">
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {guide.description}
                </p>

                {/* Price & Booking Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200/80 text-xs">
                  <div>
                    <span className="font-bold text-stone-900 block mb-0.5">Pricing Estimate:</span>
                    <span className="text-stone-600">{guide.pricingEstimate}</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block mb-0.5">How to Book:</span>
                    <span className="text-stone-600">{guide.bookingMethod}</span>
                  </div>
                </div>

                {/* Popular Routes Table */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                    Popular Routes & Fares:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {guide.popularRoutes.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg border border-stone-100"
                      >
                        <div>
                          <div className="font-bold text-stone-800">
                            {r.from} → {r.to}
                          </div>
                          <div className="text-[11px] text-stone-500">{r.duration}</div>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-800">{r.approxCostLkr}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-emerald-900 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                      Pros
                    </span>
                    <ul className="space-y-1 text-stone-600">
                      {guide.pros.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-stone-800 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Things to Consider
                    </span>
                    <ul className="space-y-1 text-stone-600">
                      {guide.cons.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tourist Tips */}
                <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/60 text-xs space-y-1.5">
                  <span className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                    Essential Tourist Tips:
                  </span>
                  <ul className="space-y-1 text-stone-700">
                    {guide.touristTips.map((tip, i) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
