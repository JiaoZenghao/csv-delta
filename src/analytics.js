// No application state, URL queries, file names or CSV contents enter analytics.
export function visitURL(endpoint, page, referrer, privacy={}) {
  if(privacy.doNotTrack==='1' || privacy.globalPrivacyControl===true) return null;
  try {
    const site=new URL(endpoint), location=new URL(page);
    if(site.protocol!=='https:' || !/^[a-z0-9-]+\.goatcounter\.com$/.test(site.hostname) || site.port || site.username || site.password || site.pathname!=='/' || site.search || site.hash) return null;
    if(location.origin!=='https://jiaozenghao.github.io' || !['/csv-delta/','/csv-delta/index.html'].includes(location.pathname)) return null;
    const url=new URL('/count',site);
    url.searchParams.set('p','/csv-delta/');
    url.searchParams.set('t','CSV Delta');
    try { const source=new URL(referrer); if(['http:','https:'].includes(source.protocol)) url.searchParams.set('r',source.origin); } catch {}
    url.searchParams.set('rnd',String(Date.now()));
    return url.href;
  } catch { return null; }
}
if(typeof document!=='undefined') {
  const endpoint=document.querySelector('meta[name="goatcounter-site"]')?.content;
  const url=visitURL(endpoint,location.href,document.referrer,navigator);
  if(url) {
    const pixel=new Image(1,1);
    pixel.referrerPolicy='no-referrer';
    pixel.src=url;
  }
}
