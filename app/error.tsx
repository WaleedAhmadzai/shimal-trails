"use client";

import { Button } from "@/components/common/Button";

// error.tsx must be a Client Component: it receives reset() to retry.
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-page flex min-h-[70svh] flex-col justify-center pt-28 pb-16">
      <p className="font-mono text-sm tracking-[0.3em] text-apricot">SOMETHING WENT WRONG</p>
      <h1 className="mt-4 max-w-2xl text-5xl leading-[0.98] sm:text-7xl">A rockfall on the road.</h1>
      <p className="mt-5 max-w-xl text-lg text-muted">
        This page hit an unexpected error. Try again, or head back to the start.
        {error.digest && <span className="mt-2 block font-mono text-xs">Reference: {error.digest}</span>}
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="outline">Go home</Button>
      </div>
    </section>
  );
}
