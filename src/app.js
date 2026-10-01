import {parseCSV} from './csv.js';
import {compareCSV} from './compare.js';
import {createReport} from './report.js';
import {messages} from './i18n.js';
import {example} from './example.js';
import {displayFields} from './view.js';

const $ = id => document.getElementById(id);
const state = {language:'en',raw:{old:null,new:null},data:{old:null,new:null},versions:{old:0,new:0},result:null,filter:'differences',page:0};
const t = key => messages[state.language][key];
const element = (tag,text,className) => { const node=document.createElement(tag); if(text!==undefined) node.textContent=text; if(className) node.className=className; return node; };
function message(text='',error=false) { $('message').textContent=text; $('message').hidden=!text; $('message').classList.toggle('error',error); }
function invalidate(showNotice=false) {
  const hadResult=Boolean(state.result);
  state.result=null; $('result-content').hidden=true; $('empty').hidden=false; $('export').disabled=true;
  $('result-rows').replaceChildren(); $('counts').replaceChildren();
  if(showNotice && hadResult) message(t('changedSettings'));
}
function selected(group) { return [...$(group).querySelectorAll('input:checked')].map(input=>input.value); }
function settings() { return {keys:selected('keys'),ignore:selected('ignore'),numeric:selected('numeric'),tolerance:Number($('tolerance').value)}; }
function updateExclusions() {
  const keys=selected('keys'), ignored=selected('ignore');
  for(const group of ['ignore','numeric']) for(const input of $(group).querySelectorAll('input')) {
    input.disabled=keys.includes(input.value) || (group==='numeric' && ignored.includes(input.value));
    if(input.disabled) input.checked=false;
  }
}
function renderRules(preset) {
  const ready=Boolean(state.data.old && state.data.new);
  $('rules').hidden=!ready; $('ready').hidden=ready;
  if(!ready) return;
  const common=state.data.old.headers.filter(header=>state.data.new.headers.includes(header));
  const initial=preset ?? {keys:[common.includes('id')?'id':common[0]],ignore:[],numeric:[]};
  for(const group of ['keys','ignore','numeric']) {
    $(group).replaceChildren();
    for(const column of common) {
      const label=element('label',undefined,'choice'), input=element('input');
      input.type='checkbox'; input.name=group; input.value=column; input.checked=initial[group].includes(column);
      label.append(input,element('span',column)); $(group).append(label);
    }
  }
  updateExclusions(); $('compare').disabled=!common.length;
  if(!common.length) message(state.language==='zh'?'两份文件没有共同列。':'The files have no common columns.',true);
}
function fileLabels() {
  for(const side of ['old','new']) $(''+side+'-name').textContent=state.raw[side] ? `${state.raw[side].name}${state.data[side]?' · '+state.data[side].rows.length+' '+t('rows'):''}` : t('noFile');
}
function reparse(preset) {
  state.data={old:null,new:null}; invalidate(); message();
  for(const side of ['old','new']) {
    if(!state.raw[side]) continue;
    try { state.data[side]=parseCSV(state.raw[side].text,{delimiter:$('delimiter').value==='tab'?'\t':$('delimiter').value}); }
    catch(error) { message(`${t('error')} — ${t(side)}: ${error.message}`,true); }
  }
  fileLabels(); renderRules(preset);
}
async function loadFile(side) {
  const version=++state.versions[side], file=$(side+'-file').files[0];
  state.raw[side]=null; state.data[side]=null; invalidate(); renderRules(); fileLabels();
  if(!file) return;
  if(file.size>10*1024*1024) { message(`${t(side)}: ${t('oversize')}`,true); return; }
  message(t('loading'));
  try {
    const buffer=await file.arrayBuffer();
    if(version!==state.versions[side]) return;
    let text;
    try { text=new TextDecoder('utf-8',{fatal:true}).decode(buffer); }
    catch { throw new Error(t('encoding')); }
    state.raw[side]={text,name:file.name}; reparse();
  } catch(error) { if(version===state.versions[side]) message(`${t('error')} — ${t(side)}: ${error.message}`,true); }
}
function compare() {
  invalidate(); message();
  if(!state.data.old || !state.data.new) return;
  if(!$('tolerance').checkValidity()) { $('tolerance').reportValidity(); return; }
  try {
    state.result=compareCSV(state.data.old,state.data.new,settings()); state.filter='differences'; state.page=0;
    $('empty').hidden=true; $('result-content').hidden=false; $('export').disabled=false; renderResult();
  } catch(error) { message(`${t('error')} — ${error.message}`,true); }
}
function fieldValues(cell,fields,changedClass) {
  if(!fields.length) { cell.textContent='—'; return; }
  for(const field of fields) {
    const value=element('div',undefined,'field-value'+(changedClass?' '+changedClass:''));
    value.append(element('strong',field.column),element('span',field.value)); cell.append(value);
  }
}
function renderResult() {
  if(!state.result) return;
  const result=state.result;
  $('counts').replaceChildren();
  for(const [type,count] of Object.entries(result.counts)) { const node=element('div',undefined,'count '+type); node.append(element('strong',count),element('span',t(type))); $('counts').append(node); }
  $('schema').replaceChildren(); $('schema').hidden=!result.columnsAdded.length&&!result.columnsRemoved.length;
  if(!$('schema').hidden) {
    $('schema').append(element('strong',t('columnChanges')));
    for(const [key,columns] of [['columnsAdded',result.columnsAdded],['columnsRemoved',result.columnsRemoved]]) if(columns.length) $('schema').append(element('p',t(key)+': '+columns.join(', ')));
    $('schema').append(element('p',t('schemaOnly'),'fine-print'));
  }
  $('filters').replaceChildren();
  for(const type of ['differences','all','added','removed','changed','unchanged']) {
    const button=element('button',t(type)); button.type='button'; button.setAttribute('aria-pressed',String(state.filter===type));
    button.addEventListener('click',()=>{state.filter=type;state.page=0;renderResult();}); $('filters').append(button);
  }
  const rows=result.records.filter(row=>state.filter==='all' || (state.filter==='differences'?row.type!=='unchanged':row.type===state.filter));
  const pages=Math.max(1,Math.ceil(rows.length/100)); state.page=Math.min(state.page,pages-1);
  $('result-total').textContent=`${rows.length} ${t('rows')}`; $('result-rows').replaceChildren();
  for(const record of rows.slice(state.page*100,(state.page+1)*100)) {
    const row=element('tr'); const status=element('td'); status.append(element('span',t(record.type),'status '+record.type));
    const key=element('td',JSON.stringify(record.key),'key-values'), before=element('td'), after=element('td');
    fieldValues(before,displayFields(record,'old'),record.type==='changed'?'before-change':'');
    fieldValues(after,displayFields(record,'new'),record.type==='changed'?'after-change':'');
    row.append(status,key,before,after); $('result-rows').append(row);
  }
  $('no-matches').hidden=rows.length!==0;
  $('previous').disabled=state.page===0; $('next').disabled=state.page+1>=pages;
  $('page-label').textContent=`${t('page')} ${state.page+1} ${t('of')} ${pages}`;
}
function translate() {
  const oldSettings=state.data.old&&state.data.new?settings():undefined;
  document.documentElement.lang=state.language==='zh'?'zh-CN':'en';
  document.querySelectorAll('[data-i18n]').forEach(node=>node.textContent=t(node.dataset.i18n));
  $('language').textContent=state.language==='en'?'中文':'English'; $('language').setAttribute('aria-label',state.language==='en'?'Switch to Chinese':'切换为英文');
  fileLabels(); renderRules(oldSettings); renderResult();
}
$('old-file').addEventListener('change',()=>loadFile('old'));
$('new-file').addEventListener('change',()=>loadFile('new'));
$('delimiter').addEventListener('change',()=>reparse());
$('rules').addEventListener('change',()=>{updateExclusions();invalidate(true);});
$('tolerance').addEventListener('input',()=>invalidate(true));
$('compare').addEventListener('click',compare);
$('example').addEventListener('click',()=>{
  for(const side of ['old','new']) { state.versions[side]++; $(side+'-file').value=''; state.raw[side]={text:example[side],name:side==='old'?'before.csv':'after.csv'}; }
  $('delimiter').value=','; $('tolerance').value='0';
  reparse({keys:['sku','region'],ignore:['updated_at'],numeric:['price']}); compare();
});
$('clear').addEventListener('click',()=>{
  for(const side of ['old','new']) { state.versions[side]++; state.raw[side]=null; $(side+'-file').value=''; }
  $('tolerance').value='0'; reparse();
});
$('language').addEventListener('click',()=>{state.language=state.language==='en'?'zh':'en';translate();});
$('previous').addEventListener('click',()=>{state.page--;renderResult();});
$('next').addEventListener('click',()=>{state.page++;renderResult();});
$('export').addEventListener('click',()=>{
  if(!state.result) return;
  const blob=new Blob([createReport(state.result,{language:state.language})],{type:'text/html;charset=utf-8'});
  const url=URL.createObjectURL(blob), link=element('a'); link.href=url;link.download=t('reportName'); document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
});
translate();
