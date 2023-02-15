const areEqualSelectedProps = (key, props) => (prevProps, nextProps) => {
    return props.every((prop) => prevProps[key][prop] === nextProps[key][prop]);
};

export { areEqualSelectedProps };
