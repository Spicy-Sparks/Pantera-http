export const errorToObject = (error) => {
    const keys = Object.getOwnPropertyNames(error);
    return Object.fromEntries((keys.map((errorKey) => [
        errorKey,
        error[errorKey]
    ])));
};
