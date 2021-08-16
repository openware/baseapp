import React from 'react';
import dompurify from 'dompurify';

export const stringToHTML = (str: string) => {
	const sanitizer = dompurify.sanitize;
	
	return <div dangerouslySetInnerHTML={{__html: sanitizer(str)}}></div>;
};
