'use client';

import { useEffect } from 'react';

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold mb-2">Qualcosa è andato storto</h1>
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  );
}