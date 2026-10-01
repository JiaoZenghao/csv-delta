/** Parse strict UTF-8 CSV text. Record numbers include the header, not physical lines. */
export function parseCSV(input, {delimiter = ',', maxRecords = 50000} = {}) {
  if (![',', ';', '\t'].includes(delimiter)) throw new Error('Unsupported delimiter.');
  if (!Number.isInteger(maxRecords) || maxRecords < 0) throw new Error('Invalid record limit.');
  const text = input.replace(/^\uFEFF/, '');
  if (!text.length) throw new Error('CSV is empty.');
  const records = [];
  let row = [], field = '', mode = 'plain', touched = false, record = 1;
  const fail = message => { throw new Error(`Record ${record}: ${message}`); };
  const endField = () => { row.push(field); field = ''; mode = 'plain'; };
  const endRecord = () => {
    // Ignore genuinely empty lines; a quoted empty value still counts as a record.
    if (touched || row.length || field.length) {
      endField();
      records.push(row);
      if (records.length > maxRecords + 1) fail(`Data record limit (${maxRecords}) exceeded.`);
    }
    row = []; field = ''; mode = 'plain'; touched = false; record++;
  };
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (mode === 'quoted') {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else mode = 'closed';
      } else field += char;
      continue;
    }
    if (char === delimiter) { touched = true; endField(); continue; }
    if (char === '\r' || char === '\n') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      endRecord(); continue;
    }
    if (mode === 'closed') fail('Unexpected character after closing quote.');
    if (char === '"') {
      if (field.length) fail('Quote must begin at the start of a field.');
      mode = 'quoted'; touched = true;
    } else { field += char; touched = true; }
  }
  if (mode === 'quoted') fail('Unclosed quote.');
  endRecord();
  if (!records.length) throw new Error('CSV is empty.');
  const [headers, ...rows] = records;
  if (headers.some(header => !header.trim())) throw new Error('Record 1: Empty header.');
  if (new Set(headers).size !== headers.length) throw new Error('Record 1: Duplicate header.');
  rows.forEach((values, index) => {
    if (values.length !== headers.length) throw new Error(`Record ${index + 2}: Expected ${headers.length} fields, got ${values.length}.`);
  });
  return {headers, rows};
}
