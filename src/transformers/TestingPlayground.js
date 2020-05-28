import { getTrimmedPathName } from './utils';

export const shouldTransform = (url) => {
  const { host, pathname, searchParams } = new URL(url);

  return (
    ['testing-playground.com', 'www.testing-playground.com'].includes(host) &&
    getTrimmedPathName(pathname).length === 0 &&
    Boolean(searchParams.get('markup'))
  );
};

export const getHTML = (url) => {
  return `<iframe src="${url}" width="100%" height="300" scrolling="no" frameborder="0" allowtransparency="true" allowfullscreen="true" style="overflow: hidden; display: block;" loading="lazy"></iframe>`;
};
