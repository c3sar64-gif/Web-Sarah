export function getYouTubeId(url?: string | null): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export function getYouTubeEmbedUrl(url?: string | null): string | null {
  const id = getYouTubeId(url)
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}

export function getYouTubeThumbnailUrl(url?: string | null): string | null {
  const id = getYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}
