"use client";

import { Camera } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type PropertyImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
  className?: string;
  fallbackClassName?: string;
  iconClassName?: string;
};

export function PropertyImage({
  src,
  alt,
  sizes,
  priority,
  loading,
  className,
  fallbackClassName,
  iconClassName,
}: PropertyImageProps) {
  const [hasError, setHasError] = useState(!src?.trim());

  useEffect(() => {
    setHasError(!src?.trim());
  }, [src]);

  if (hasError) {
    return (
      <div role="img" aria-label="Property image unavailable" className={fallbackClassName}>
        <Camera aria-hidden="true" className={iconClassName} strokeWidth={1.75} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={loading}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
