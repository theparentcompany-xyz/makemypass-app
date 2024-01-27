interface transformTableDataType {
  [key: string]: string;
}

export const transformTableData = (
  recentTableMapping: Record<string, string>,
  recentRegistrations: transformTableDataType[],
) => {
  return recentRegistrations.map((registration) => {
    const transformedRegistration: Record<string, string> = {};

    for (const key in recentTableMapping) {
      if (Object.prototype.hasOwnProperty.call(recentTableMapping, key)) {
        const newKey = recentTableMapping[key];
        transformedRegistration[newKey] = registration[key];
      }
    }

    return transformedRegistration;
  });
};
