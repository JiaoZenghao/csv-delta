const escape = value => String(value).replace(/[&<>"']/g, char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const dictionary = {
  en: {title:'CSV Delta report',added:'Added',removed:'Removed',changed:'Changed',unchanged:'Unchanged',status:'Status',key:'Key',before:'Before',after:'After',settings:'Comparison settings',schema:'Column changes',keys:'Key columns',ignore:'Ignored columns',numeric:'Numeric columns',tolerance:'Absolute tolerance',none:'None',privacy:'This report contains your data. Choose who you share it with.',float:'Numeric comparison uses floating-point arithmetic. It is not suitable for exact financial accounting.'},
  zh: {title:'CSV Delta 差异报告',added:'新增',removed:'删除',changed:'修改',unchanged:'未变',status:'状态',key:'主键',before:'旧值',after:'新值',settings:'比较设置',schema:'列变化',keys:'主键列',ignore:'忽略列',numeric:'数值列',tolerance:'绝对容差',none:'无',privacy:'报告包含你的数据，请自行选择分享对象。',float:'数值比较使用浮点运算，不适用于要求精确十进制的财务核算。'}
};
/** A static report intentionally has no scripts, remote resources or persistent storage. */
export function createReport(result, {language='en'} = {}) {
  const t = dictionary[language] ?? dictionary.en;
  const list = values => values.length ? values.map(escape).join(', ') : t.none;
  const fields = values => values ? Object.entries(values).map(([column,value])=>`<div><strong>${escape(column)}</strong>: <span>${escape(value)}</span></div>`).join('') : '—';
  const rows = result.records.map((row,i)=>`<tr data-record="${i}" class="${row.type}"><td>${t[row.type]}</td><td>${escape(JSON.stringify(row.key))}</td><td>${fields(row.old)}</td><td>${fields(row.new)}${row.changes.length?'<ul>'+row.changes.map(change=>`<li><strong>${escape(change.column)}</strong>: <del>${escape(change.old)}</del> → <ins>${escape(change.new)}</ins></li>`).join('')+'</ul>':''}</td></tr>`).join('');
  return `<!doctype html>
<html lang="${language==='zh'?'zh-CN':'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>${t.title}</title><style>
body{font:15px/1.6 system-ui,sans-serif;color:#172b29;background:white;margin:32px auto;padding:0 24px;max-width:1200px}h1{font-size:32px}h2{font-size:20px;margin-top:28px}table{width:100%;border-collapse:collapse;font-size:14px}th,td{padding:12px;text-align:left;vertical-align:top;border:1px solid #d6e1de;overflow-wrap:anywhere;white-space:pre-wrap}th{background:#edf3f1}tr.added{background:#effaf4}tr.removed{background:#fff2ef}tr.changed{background:#fffbee}ins{color:#0d6844}del{color:#a33b32}ul{padding-left:20px}p{overflow-wrap:anywhere}@media print{body{margin:0;padding:0}tr{break-inside:avoid}}
</style></head><body><h1>${t.title}</h1><p>${t.privacy}</p><p>${Object.entries(result.counts).map(([type,count])=>`${t[type]}: <strong>${count}</strong>`).join(' · ')}</p>
<h2>${t.settings}</h2><p>${t.keys}: ${list(result.settings.keys)}<br>${t.ignore}: ${list(result.settings.ignore)}<br>${t.numeric}: ${list(result.settings.numeric)}<br>${t.tolerance}: ${escape(result.settings.tolerance)}</p><p>${t.float}</p>
<h2>${t.schema}</h2><p>${t.added}: ${list(result.columnsAdded)}<br>${t.removed}: ${list(result.columnsRemoved)}</p><table><thead><tr><th>${t.status}</th><th>${t.key}</th><th>${t.before}</th><th>${t.after}</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
}
