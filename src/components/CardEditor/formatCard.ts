export const removeIdsFromArrays = (obj: any): any => {
	if (Array.isArray(obj)) {
		// recorremos cada elemento del array
		return obj.map((item) => removeIdsFromArrays(item));
	} else if (obj !== null && typeof obj === "object") {
		const result: any = {};
		for (const key in obj) {
			if (key === "id") {
				// eliminamos id solo si está dentro de un array
				continue;
			}
			const value = obj[key];
			// si es array, procesamos recursivamente
			if (Array.isArray(value)) {
				result[key] = value.map((v) => removeIdsFromArrays(v));
			} else if (value !== null && typeof value === "object") {
				result[key] = removeIdsFromArrays(value);
			} else {
				result[key] = value;
			}
		}
		return result;
	}
	return obj; // primitivos los devolvemos tal cual
};
