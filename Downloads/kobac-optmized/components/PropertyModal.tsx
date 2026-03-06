'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react'
import { Property } from '@/lib/types'
import AgentCard from './AgentCard'

interface PropertyModalProps {
    property: Property
    onClose: () => void
}

export default function PropertyModal({ property, onClose }: PropertyModalProps) {
    const [imgIdx, setImgIdx] = useState(0)
    const total = property.images.length

    // Reset to first image whenever the property changes
    useEffect(() => {
        setImgIdx(0)
    }, [property.id])

    const prev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation()
        setImgIdx(i => (i - 1 + total) % total)
    }, [total])
    const next = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation()
        setImgIdx(i => (i + 1) % total)
    }, [total])

    // Close on Escape, keyboard nav
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
        }
        document.addEventListener('keydown', handler)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handler)
            document.body.style.overflow = ''
        }
    }, [onClose, prev, next])

    const listedDate = new Date(property.listedAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
    })

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                    <h2 className="font-bold text-gray-900 text-lg">Property Details</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row">
                    {/* Left: image carousel — ALL images rendered at once for instant switching */}
                    <div className="md:w-[45%] flex-shrink-0 p-4">
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">

                            {/* Every image rendered into the DOM at once inside its own
                                div. Visibility controlled by opacity only — no src swap,
                                no re-mount. Next.js <Image> gives us automatic resize +
                                WebP/AVIF compression so each file is tiny (~50-150 KB
                                instead of the original MB-sized R2 file). */}
                            {property.images.map((src, i) => (
                                <div
                                    key={src + i}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        opacity: i === imgIdx ? 1 : 0,
                                        transition: 'opacity 0.2s ease',
                                        pointerEvents: i === imgIdx ? 'auto' : 'none',
                                    }}
                                >
                                    <Image
                                        src={src}
                                        alt={`${property.title} – image ${i + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 45vw"
                                        priority={i === 0}
                                        quality={75}
                                    />
                                </div>
                            ))}

                            {/* Counter */}
                            {total > 1 && (
                                <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-medium z-10">
                                    {imgIdx + 1}/{total}
                                </span>
                            )}

                            {/* Arrows */}
                            {total > 1 && (
                                <>
                                    <button
                                        onClick={prev}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors z-10"
                                    >
                                        <ChevronLeft className="w-4 h-4 text-gray-800" />
                                    </button>
                                    <button
                                        onClick={next}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors z-10"
                                    >
                                        <ChevronRight className="w-4 h-4 text-gray-800" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail dots */}
                        {total > 1 && (
                            <div className="flex gap-1.5 justify-center mt-3">
                                {property.images.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setImgIdx(i)}
                                        className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: details */}
                    <div className="flex-1 p-4 pt-2 md:pt-4">
                        <h3 className="text-blue-600 font-bold text-2xl mb-1">{property.title}</h3>
                        <p className="text-green-600 font-bold text-3xl mb-3">
                            ${property.price}
                            <span className="text-gray-400 font-normal text-sm ml-1">/{property.priceUnit}</span>
                        </p>

                        {/* Location badges */}
                        <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg w-fit">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm font-medium">{property.district}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg w-fit">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm font-medium">{property.landmark}</span>
                            </div>
                        </div>

                        {/* Date only (ID removed) */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Lasoo dhigay {listedDate}
                            </span>
                        </div>

                        {/* Stats grid with real icons */}
                        {(property.bedrooms > 0 || property.bathrooms > 0) && (
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {property.bedrooms > 0 && (
                                    <div className="bg-blue-50/60 rounded-xl p-3 flex flex-col items-center gap-1">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/icons/bed.webp" alt="Bedrooms" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                                        <span className="font-bold text-gray-900 text-xl">{property.bedrooms}</span>
                                        <span className="text-blue-600 text-xs font-semibold">Qol</span>
                                    </div>
                                )}
                                {property.bathrooms > 0 && (
                                    <div className="bg-blue-50/60 rounded-xl p-3 flex flex-col items-center gap-1">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/icons/shower.webp" alt="Bathrooms" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                                        <span className="font-bold text-gray-900 text-xl">{property.bathrooms}</span>
                                        <span className="text-blue-600 text-xs font-semibold">Suuli</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-2">
                            <h4 className="font-bold text-gray-900 mb-1 text-sm">Faah-Faahin</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">{property.description}</p>
                        </div>

                        {/* Agent card */}
                        <AgentCard agent={property.agent} />
                    </div>
                </div>
            </div>
        </div>
    )
}
