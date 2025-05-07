import React, { useEffect, useState } from 'react';

type RemoteImageProps = {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
};

export const RemoteImage: React.FC<RemoteImageProps> = ({
  src,
  alt = '',
  className,
  style,
  fallback = null,
}) => {
  const isSvg = src.endsWith('.svg');
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isSvg) return;

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch ${src}`);
        return res.text();
      })
      .then(setSvgContent)
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  }, [src, isSvg]);

  if (isSvg) {
    if (error) return <>{fallback}</>;
    if (!svgContent) return <>{fallback}</>;

    return (
      <div
        className={className}
        style={style}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }

  return <img src={src} alt={alt} className={className} style={style} onError={() => setError(true)} />;
};
