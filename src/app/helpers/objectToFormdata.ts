export function objectToFormdata(obj: any): FormData {
    const formData = new FormData();
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (value instanceof Array && value[0] instanceof File) {
                for (const file of value) {
                    formData.append(key, file);
                }
            } else if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        }
    }
    return formData;
}