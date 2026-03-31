import { getRequestURL } from 'h3';
import { normalizeTarget, proxyWithFallback } from '../utils/proxy-upstream';

function trimProxyPrefix(pathname: string, prefix: string) {
  const suffix = pathname.slice(prefix.length);
  return suffix.startsWith('/') ? suffix.slice(1) : suffix;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const requestUrl = getRequestURL(event);
  const pathname = requestUrl.pathname;
  const search = requestUrl.search;

  if (pathname === '/_docs' || pathname.startsWith('/_docs/')) {
    const suffix = trimProxyPrefix(pathname, '/_docs');
    const target = normalizeTarget(config.docsUpstream, suffix, search);
    return proxyWithFallback(event, target, 'docs');
  }

  if (pathname === '/_api-reference' || pathname.startsWith('/_api-reference/')) {
    const suffix = trimProxyPrefix(pathname, '/_api-reference');
    const target = normalizeTarget(config.scalarUpstream, suffix, search);
    return proxyWithFallback(event, target, 'scalar');
  }

  if (pathname === '/_storybook' || pathname.startsWith('/_storybook/')) {
    const suffix = trimProxyPrefix(pathname, '/_storybook');
    const target = normalizeTarget(config.storybookUpstream, suffix, search);
    return proxyWithFallback(event, target, 'storybook');
  }
});
