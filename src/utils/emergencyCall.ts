import type React from 'react';

/**
 * Utility for triggering native phone dialing actions on Android, mobile browsers, and PWAs.
 *
 * Requirements:
 * - Direct native phone dialing action on Android:
 *    1990 → tel:1990
 *    1912 → tel:1912
 *    119 → tel:119
 *    110 → tel:110
 * - Uses the browser/mobile-compatible JavaScript telephone action:
 *    window.location.href = "tel:NUMBER"
 * - Does NOT route through an internal LankaMate page.
 * - Does NOT open a normal web URL or link page.
 * - Makes the entire emergency button/card clickable.
 */

export const triggerPhoneDialer = (telNumber: string): void => {
  if (typeof window !== 'undefined' && telNumber) {
    window.location.href = `tel:${telNumber}`;
  }
};

export const handleEmergencyCall = (
  e?: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
  telNumber?: string
): void => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  if (telNumber) {
    triggerPhoneDialer(telNumber);
  }
};


