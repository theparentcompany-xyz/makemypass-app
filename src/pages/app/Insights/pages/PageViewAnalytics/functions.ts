type PageRegisterData = {
  [key: string]: {
    'Page view': { [key: string]: number };
    Register: { [key: string]: number };
  };
};

type TableRow = {
  'Page View': number | null;
  register: number | null;
  'Conversion Rate(%)': number | null;
};

type TransformedData = {
  [key: string]: TableRow[];
};

export function transformData(jsonData: PageRegisterData): TransformedData {
  const result: TransformedData = {};

  // Loop through each top-level key (browser, device_type, etc.)
  for (const type in jsonData) {
    const pageViewData = jsonData[type]['Page view'];
    const registerData = jsonData[type]['Register'];

    // Create an array to hold the table rows for this type
    const tableRows: TableRow[] = [];

    // Combine both page view and register data into a single list of keys
    const allKeys = new Set([...Object.keys(pageViewData), ...Object.keys(registerData)]);

    // For each key, create a table row with page view and register view
    allKeys.forEach((key) => {
      tableRows.push({
        [type]: key,
        'Page View': pageViewData[key] || null, // Use null if the value is missing
        register: registerData[key] || null,
        'Conversion Rate(%)': registerData[key]
          ? Number(((registerData[key] / pageViewData[key]) * 100).toFixed(2))
          : null,
      });
    });

    tableRows.sort((a, b) => {
      if (a.register === null) return 1;
      if (b.register === null) return -1;
      return b.register - a.register;
    });

    // Assign the tableRows array to the result object under the current type
    result[type] = tableRows;
  }

  return result;
}
