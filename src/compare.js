const decimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
function sameValue(a, b, numeric, tolerance) {
  if (a === b) return true;
  if (!numeric || !decimal.test(a) || !decimal.test(b)) return false;
  const left = Number(a), right = Number(b);
  return Number.isFinite(left) && Number.isFinite(right) && Math.abs(left - right) <= tolerance;
}
function indexRows(data, keys, side) {
  const indexes = keys.map(key => data.headers.indexOf(key));
  const indexed = new Map();
  data.rows.forEach((row, index) => {
    const key = indexes.map(i => row[i]);
    if (key.some(value => !value.trim())) throw new Error(`${side} record ${index + 2}: Empty key field.`);
    const encoded = JSON.stringify(key);
    if (indexed.has(encoded)) throw new Error(`${side} record ${index + 2}: Duplicate key (${key.join(', ')}).`);
    indexed.set(encoded, {key, values: Object.fromEntries(data.headers.map((header,i)=>[header,row[i]]))});
  });
  return indexed;
}
/** Compare parsed files. Column additions/removals are separate from row modifications. */
export function compareCSV(oldData, newData, {keys, ignore = [], numeric = [], tolerance = 0} = {}) {
  if (!Array.isArray(keys) || !keys.length || new Set(keys).size !== keys.length) throw new Error('Choose at least one distinct key column.');
  const common = oldData.headers.filter(column=>newData.headers.includes(column));
  if (keys.some(column=>!common.includes(column))) throw new Error('Key columns must exist in both files.');
  for (const columns of [ignore,numeric]) {
    if (!Array.isArray(columns) || columns.some(column=>!common.includes(column))) throw new Error('Selected columns must exist in both files.');
  }
  if (ignore.some(column=>keys.includes(column))) throw new Error('Key columns cannot be ignored.');
  if (numeric.some(column=>keys.includes(column) || ignore.includes(column))) throw new Error('Numeric columns cannot be key or ignored columns.');
  if (!Number.isFinite(tolerance) || tolerance < 0) throw new Error('Tolerance must be a finite, non-negative number.');
  const columns = common.filter(column=>!keys.includes(column) && !ignore.includes(column));
  const numericSet = new Set(numeric);
  const oldRows = indexRows(oldData,keys,'Old');
  const newRows = indexRows(newData,keys,'New');
  const records = [];
  const counts = {added:0,removed:0,changed:0,unchanged:0};
  for (const [encoded, before] of oldRows) {
    const after = newRows.get(encoded);
    const changes = after ? columns.filter(column=>!sameValue(before.values[column],after.values[column],numericSet.has(column),tolerance))
      .map(column=>({column,old:before.values[column],new:after.values[column]})) : [];
    const type = !after ? 'removed' : changes.length ? 'changed' : 'unchanged';
    records.push({type,key:before.key,old:before.values,new:after?.values ?? null,changes}); counts[type]++;
  }
  for (const [encoded,after] of newRows) {
    if (!oldRows.has(encoded)) { records.push({type:'added',key:after.key,old:null,new:after.values,changes:[]}); counts.added++; }
  }
  return {
    counts,
    columnsAdded: newData.headers.filter(column=>!oldData.headers.includes(column)),
    columnsRemoved: oldData.headers.filter(column=>!newData.headers.includes(column)),
    records,
    settings: {keys:[...keys],ignore:[...ignore],numeric:[...numeric],tolerance}
  };
}
