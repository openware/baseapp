import dompurify from 'dompurify';
import React from 'react';

export const stringToHTML = (str: string) => {
    const sanitizer = dompurify.sanitize;

    return <div dangerouslySetInnerHTML={{ __html: sanitizer(str) }}></div>;
};
