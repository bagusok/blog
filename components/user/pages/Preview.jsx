import React from 'react';

const Preview = ({ src }) => {
  return <iframe src={src} className="w-full h-80 md:h-full pt-2" allowFullScreen></iframe>;
};

export default React.memo(Preview);
