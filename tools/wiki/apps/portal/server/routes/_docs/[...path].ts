import { getRequestURL } from 'h3';
import { normalizeTarget, proxyWithFallback } from '../../utils/proxy-upstream';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const path = event.context.params?.path || '';
  const search = getRequestURL(event).search;
  const target = normalizeTarget(config.docsUpstream, String(path), search);
  return proxyWithFallback(event, target, 'docs');
});
