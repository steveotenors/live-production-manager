'use client';

import { useState, useEffect } from 'react';

export default function ClientLayout({ children }) {
  return (
    <div>
      {/* Very minimal wrapper */}
      {children}
    </div>
  );
} 