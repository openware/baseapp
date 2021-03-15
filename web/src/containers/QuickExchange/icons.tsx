import * as React from 'react';

export const ArrowRight = () => {
    return (
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.5" d="M1 1L6 6L1 11" stroke="white" strokeWidth="2"/>
        </svg>
    );
};

export const WarningIcon = () => {
    return (
      <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 11.77H11V0.77H0V11.77Z" fill="url(#pattern0)"/>
          <defs>
              <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use href="#image0" transform="scale(0.015625)"/>
              </pattern>
              <image id="image0" width="64" height="64" href="data:image/png;base64,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"/>
          </defs>
      </svg>
    );
};
