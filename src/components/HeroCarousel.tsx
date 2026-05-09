"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface Post {
  slug: string;
  titulo: string;
  resumo: string;
  categoria: string;
  tags: string[];
  data: string;
  autor: string;
}

function slugToImage(slug: string): string | null {
  const map: Record<string, string> = {
    'cuidados-com-corrente-da-moto': 'Cuidados essenciais com a corrente da sua moto.png',
    'como-escolher-capacete-ideal': 'Como escolher o capacete ideal para sua segurança.png',
    'portao-automatico-vantagens': 'Portão automático vantagens, tipos e cuidados.png',
    'oleo-de-moto-troca-correta': 'Óleo de moto quando trocar e qual usar.png',
    'grades-de-ferro-seguranca': 'Grades de ferro segurança sem perder o estilo.png',
    'pneus-de-moto-quando-trocar': 'Pneus de moto sinais de que está na hora de trocar.png',
  }
  const filename = map[slug]
  return filename ? `/images/${encodeURIComponent(filename)}` : null
}

function formatDate(data: string) {
  return new Date(data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const CATEGORY_COLORS: Record<string, { badge: string }> = {
  Manutenção: { badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  Segurança: { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  Serralheria: { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
}

export default function HeroCarousel({ posts }: { posts: Post[] }) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % posts.length)
  }, [posts.length])

  useEffect(() => {
    if (isPaused || posts.length <= 1) return
    const timer = setInterval(next, 30000)
    return () => clearInterval(timer)
  }, [isPaused, next, posts.length])

  const post = posts[current]
  const cat = CATEGORY_COLORS[post.categoria] || CATEGORY_COLORS.Manutenção

  return (
    <div
      className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-2xl overflow-hidden bg-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {posts.map((p, i) => {
        const pimg = slugToImage(p.slug)
        return (
          <div key={p.slug}
            className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            {pimg && (
              <Image src={pimg} alt={p.titulo} fill className="object-cover" sizes="100vw" priority={i === 0} />
            )}
          </div>
        )
      })}

      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent z-20" />

      <Link href={`/blog/${post.slug}`} className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-30 group">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${cat.badge}`}>
            {post.categoria}
          </span>
          <time className="text-xs text-gray-400">{formatDate(post.data)}</time>
        </div>
        <h2 className="text-xl md:text-3xl font-bold text-white mb-2 leading-tight group-hover:text-orange-400 transition-colors">
          {post.titulo}
        </h2>
        <p className="text-sm md:text-base text-gray-300 max-w-2xl line-clamp-2">{post.resumo}</p>
        <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-orange-400 group-hover:text-orange-300 transition-colors">
          Ler artigo <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </Link>

      <div className="absolute bottom-3 md:bottom-5 right-4 md:right-10 z-30 flex items-center gap-2">
        {posts.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2 bg-orange-400' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
