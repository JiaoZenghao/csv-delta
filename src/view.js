export function displayFields(record,side) {
  const values=record[side];
  if(!values) return [];
  const columns=record.type==='changed'?record.changes.map(change=>change.column):Object.keys(values);
  return columns.filter(column=>Object.hasOwn(values,column)).map(column=>({column,value:values[column]}));
}
