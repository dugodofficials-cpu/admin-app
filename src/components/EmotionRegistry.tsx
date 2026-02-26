'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';

export default function EmotionRegistry({ children }: { children: ReactNode }) {
  const [cache] = useState(() => {
    const cache = createCache({ key: 'css', prepend: true });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    const entries = Object.entries(cache.inserted).filter(
      ([, value]) => typeof value === 'string',
    );

    if (entries.length === 0) {
      return null;
    }

    const names = entries.map(([name]) => name).join(' ');
    const styles = entries.map(([, value]) => value).join(' ');

    return (
      <style
        data-emotion={`${cache.key} ${names}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
