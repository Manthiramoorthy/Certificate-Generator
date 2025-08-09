// csvParser.js
// Handles CSV file parsing and validation using PapaParse

const CSVParser = {
    parseCSVFile: function (file, onSuccess, onError) {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                if (results.errors.length > 0) {
                    onError('CSV parsing error: ' + results.errors[0].message);
                    return;
                }
                // Validate required columns
                const required = ['name', 'date_of_event', 'event_name', 'event_type'];
                const missing = required.filter(col => !results.meta.fields.includes(col));
                if (missing.length > 0) {
                    onError('Missing required columns: ' + missing.join(', '));
                    return;
                }
                onSuccess(results.data);
            },
            error: function (err) {
                onError('CSV parsing failed: ' + err.message);
            }
        });
    }
};
