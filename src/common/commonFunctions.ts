interface transformTableDataType {
  [key: string]: any;
}

export const transformTableData = (
  recentTableMapping: Record<string, string>,
  recentRegistrations: transformTableDataType[],
) => {
  return recentRegistrations.map((registration) => {
    const transformedRegistration: Record<string, any> = {};

    for (const key in recentTableMapping) {
      if (recentTableMapping.hasOwnProperty(key)) {
        const newKey = recentTableMapping[key];
        transformedRegistration[newKey] = registration[key];
      }
    }

    return transformedRegistration;
  });
};
