const areEqualProps = (prevProps, nextProps) => {
    const keys = Object.keys(prevProps);

    return keys.every((key) => prevProps[key] === nextProps[key]);
};

export { areEqualProps };
