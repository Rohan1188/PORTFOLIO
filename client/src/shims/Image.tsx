// Drop-in replacement for next/image: plain <img> with lazy loading unless `priority`.
export default function Image({ src, alt, width, height, priority, unoptimized, sizes, className, style }: any) {
  return <img src={src} alt={alt ?? ""} width={width} height={height} sizes={sizes} className={className} style={style} loading={priority ? "eager" : "lazy"} decoding="async" />;
}
