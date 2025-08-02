"use client"

import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const countries = [
  { slug: "china", name: "China", image: "/china.jpg" },
  { slug: "usa", name: "USA", image: "/usa.jpg" },
  { slug: "australia", name: "Australia", image: "/australia.jpg" },
  { slug: "egypt", name: "Egypt", image: "/Egypt.jpg" },
  { slug: "germany", name: "Germany", image: "/Germany.jpg" },
  { slug: "japan", name: "Japan", image: "/japan.jpg" },
  { slug: "oman", name: "Oman", image: "/Oman.jpg" },
  { slug: "qatar", name: "Qatar", image: "/Qatar.jpg" },
  { slug: "spain", name: "Spain", image: "/spain flag.jpg" },
  { slug: "nigeria", name: "Nigeria", image: "/Nigeria.jpg" },
  { slug: "saudi-arabia", name: "Saudi Arabia", image: "/Saudi Arabia.jpg" },
  { slug: "vietnam", name: "Vietnam", image: "/Vietnam.jpg" },
  { slug: "canada", name: "Canada", image: "/Canada.jpg" },
]

export default function HeroCountrySlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 3000 })]
  )

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Explore Visa & Travel by Country
        </h1>
        <p className="text-gray-600">
          Select a destination to read travel guides and visa blogs
        </p>
      </div>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {countries.map((c) => (
              <div
                key={c.slug}
                className="flex-[0_0_25%] sm:flex-[0_0_20%] md:flex-[0_0_12%] px-3"
              >
                <Link
                  href={`/blogs/${c.slug}`}
                  className="group relative flex flex-col items-center"
                >
                  <div
                    className="
                      country-circle relative w-24 h-24 rounded-full overflow-hidden
                      transition-all duration-500 group-hover:scale-110
                    "
                  >
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-center px-1">
                      {c.name}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {prevBtnEnabled && (
          <button
            onClick={scrollPrev}
            className="absolute top-1/2 -translate-y-1/2 left-2 bg-white shadow rounded-full p-2 hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {nextBtnEnabled && (
          <button
            onClick={scrollNext}
            className="absolute top-1/2 -translate-y-1/2 right-2 bg-white shadow rounded-full p-2 hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
