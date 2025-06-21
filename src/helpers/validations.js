export const validateField = (value) => {
    return !String(value || "").trim() ? "Обязательно" : "";
};

export const validateNumber = (value) => {
    const strValue = String(value || "").trim();
    if (!strValue) return "Обязательно";
    if (!/^[0-9]+$/.test(strValue)) return "Должно быть числом";
    return "";
};