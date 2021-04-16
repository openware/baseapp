import * as React from 'react';

interface LogoIconProps {
    className?: string;
    
} 

export const LogoIcon: React.FC<LogoIconProps> = (props: LogoIconProps) => (

  <img className={props.className} src={require('./logo.png')} />

);
