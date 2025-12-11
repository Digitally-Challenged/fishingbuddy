import { getFishIconPath, getIconPxSize, IconSize } from '../utils/fishIcons';

interface FishIconProps {
  species: string;
  size?: IconSize;
  fallback?: React.ReactNode;
  className?: string;
}

export function FishIcon({
  species,
  size = 'sm',
  fallback = null,
  className,
}: FishIconProps) {
  const iconPath = getFishIconPath(species, size);

  if (!iconPath) return <>{fallback}</>;

  const pxSize = getIconPxSize(size);

  return (
    <img
      src={iconPath}
      alt={species}
      width={pxSize}
      height={pxSize}
      className={className}
      style={{ objectFit: 'contain' }}
      loading="lazy"
    />
  );
}
