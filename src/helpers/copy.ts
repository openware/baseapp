export const copy = (id: string) => {
    const copyText: HTMLInputElement | null = document.querySelector(`#${id}`);

    if (copyText) {
        copyText.select();

        document.execCommand('copy');
        (window.getSelection() as any).removeAllRanges(); // tslint:disable-line
    }
};
