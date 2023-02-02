import React from 'react';

const Preview = () => {
  return <iframe src="/" className="w-full h-80 md:h-full pt-2" allowFullScreen></iframe>;
};

export default React.memo(Preview);
