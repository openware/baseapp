export const changeElementPosition = (className: string, index: number, gapX: number, gapY: number) => {
    const targetElement = document.getElementsByClassName(className);

    window.onmousemove = e => {
        const x = e.clientX;
        const y = e.clientY;

        if (targetElement[index]) {
            (targetElement[index] as HTMLElement).style.top = `${+y + gapY}px`;
            (targetElement[index] as HTMLElement).style.left = `${+x + gapX}px`;
        }
    };
};
