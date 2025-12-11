import { getLureIconPath, getIconPxSize, IconSize } from '../utils/fishIcons';

interface LureIconProps {
  bait: string;
  size?: IconSize;
  fallback?: React.ReactNode;
  className?: string;
}

export function LureIcon({
  bait,
  size = 'sm',
  fallback = null,
  className,
}: LureIconProps) {
  const iconPath = getLureIconPath(bait, size);

  if (!iconPath) return <>{fallback}</>;

  const pxSize = getIconPxSize(size);

  return (
    <img
      src={iconPath}
      alt={bait}
      width={pxSize}
      height={pxSize}
      className={className}
      style={{ objectFit: 'contain' }}
      loading="lazy"
    />
  );
}
