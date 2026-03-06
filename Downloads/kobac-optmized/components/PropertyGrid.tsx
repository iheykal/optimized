'use client'

import { useState, useMemo } from 'react'
import { LayoutGrid, List, RefreshCw, Filter, MapPin } from 'lucide-react'
import { Property } from '@/lib/types'
import { DISTRICTS, PROPERTY_TYPES } from '@/lib/data'
import PropertyCard from './PropertyCard'
import PropertyModal from './PropertyModal'

interface PropertyGridProps {
    properties: Property[]
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [filterType, setFilterType] = useState('')
    const [filterDistrict, setFilterDistrict] = useState('')
    const [selected, setSelected] = useState<Property | null>(null)
    const [key, setKey] = useState(0)

    const filtered = useMemo(() => {
        return properties.filter(p => {
            const typeMatch = !filterType || p.type === filterType
            const districtMatch = !filterDistrict || p.district === filterDistrict
            return typeMatch && districtMatch
        })
    }, [properties, filterType, filterDistrict])

    const refresh = () => {
        setFilterType('')
        setFilterDistrict('')
        setKey(k => k + 1)
    }

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Section heading */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Properties</h2>
                    <p className="text-green-600 text-sm mt-0.5">Discover our curated selection of premium properties</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={refresh}
                        className="flex items-center gap-1.5 border border-green-500 text-green-600 hover:bg-green-50 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Refresh
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'grid'
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        Grid
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'list'
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <List className="w-3.5 h-3.5" />
                        List
                    </button>
                    <div className="flex items-center gap-1 border border-blue-300 text-blue-600 text-sm font-medium px-3 py-1.5 rounded-lg">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Mogadishu</span>
                    </div>
                </div>
            </div>

            {/* Filter bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 mb-4 flex flex-wrap items-center gap-4">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    className="border-0 outline-none bg-transparent text-gray-700 text-sm font-medium cursor-pointer pr-2"
                >
                    <option value="">All Types</option>
                    {PROPERTY_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
                <div className="w-px h-5 bg-gray-200" />
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <select
                    value={filterDistrict}
                    onChange={e => setFilterDistrict(e.target.value)}
                    className="border-0 outline-none bg-transparent text-gray-700 text-sm font-medium cursor-pointer pr-2"
                >
                    <option value="">All Districts</option>
                    {DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>

            {/* Count */}
            <p className="text-sm text-gray-500 mb-4 font-medium">{filtered.length} properties</p>

            {/* Grid / List */}
            <div
                key={key}
                className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5'
                        : 'flex flex-col gap-4'
                }
            >
                {filtered.length === 0 ? (
                    <div className="col-span-3 py-20 text-center text-gray-400">
                        <p className="text-4xl mb-3">🏠</p>
                        <p className="font-medium">No properties found for selected filters.</p>
                    </div>
                ) : (
                    filtered.map((p, i) => (
                        <PropertyCard
                            key={p.id}
                            property={p}
                            viewMode={viewMode}
                            index={i}
                            onClick={() => setSelected(p)}
                        />
                    ))
                )}
            </div>

            {/* Modal */}
            {selected && (
                <PropertyModal property={selected} onClose={() => setSelected(null)} />
            )}
        </section>
    )
}
