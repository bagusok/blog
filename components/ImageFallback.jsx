import Image from 'next/image';
import { useState } from 'react';

export default function ImageFallback({ src, ...rest }) {
  const [imgSrc, setImgSrc] = useState(false);
  const [oldSrc, setOldSrc] = useState(src);
  if (oldSrc !== src) {
    setImgSrc(false);
    setOldSrc(src);
  }

  const fallbackSrc = '/images/no-image.png';

  return (
    <Image
      {...rest}
      src={imgSrc ? fallbackSrc : src}
      onErrorCapture={() => {
        setImgSrc(true);
      }}
    />
  );
}
