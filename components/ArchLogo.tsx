import React from 'react';

export default function ArchLogo({ className = "h-7 w-auto", fill = "#463f3a" }: { className?: string; fill?: string }) {
  return (
    <img
      src="/arch-logo.svg"
      alt="ARCH"
      className={className}
      style={{ display: 'block', height: '1.75rem', width: 'auto' }}
    />
  );
}
