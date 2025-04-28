export const combineUrlAndPath = (url: string, path: string): string => {
  if (!url) return path;
  if (!path) return url;
  
  const urlEndsWithSlash = url.endsWith('/');
  const pathStartsWithSlash = path.startsWith('/');
  
  if (urlEndsWithSlash && pathStartsWithSlash) {
    return url + path.substring(1);
  } else if (!urlEndsWithSlash && !pathStartsWithSlash) {
    return url + '/' + path;
  }
  
  return url + path;
};
