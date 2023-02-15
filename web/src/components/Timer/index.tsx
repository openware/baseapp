import React, { useEffect, useState } from 'react';

interface TimerProps {
    initialMinutes: number;
    initialSeconds: number;
    updateTimer?: boolean;
    className?: string;
    handleRequest?: () => void;
    showTimer?: boolean;
}

export const Timer = (props: TimerProps) => {
    const { initialMinutes = 0, initialSeconds = 0, handleRequest, showTimer } = props;
    const [minutes, setMinutes] = useState(initialMinutes);
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        setSeconds(initialSeconds);
        setMinutes(initialMinutes);
    }, [props.updateTimer]);

    useEffect(() => {
        let myInterval = setInterval(() => {
            if (+seconds > 0) {
                setSeconds(+seconds - 1);
            }
            if (+seconds === 0) {
                if (+minutes === 0) {
                    handleRequest && handleRequest();
                    setSeconds(initialSeconds);
                    setMinutes(initialMinutes);
                    clearInterval(myInterval);
                } else {
                    setMinutes(+minutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000);

        return () => {
            clearInterval(myInterval);
        };
    }, [initialMinutes, initialSeconds, minutes, seconds]);

    const renderTimer = React.useMemo(() => {
        if (showTimer) {
            return +minutes === 0 && +seconds === 0 ? (
                <div className={props.className}>00:00</div>
            ) : (
                <div className={props.className}>
                    {+minutes < 10 ? `0${minutes}` : minutes}:{+seconds < 10 ? `0${seconds}` : seconds}
                </div>
            );
        }

        return null;
    }, [showTimer]);

    return renderTimer;
};
