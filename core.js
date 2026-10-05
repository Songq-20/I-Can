(function(root){
'use strict';
const day = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const parse = s => {const [y,m,d]=s.split('-').map(Number);const x=new Date(0);x.setFullYear(y,m-1,d);x.setHours(0,0,0,0);return x;};
const valid = s => typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && s>='1900-01-01' && day(parse(s))===s;
const shift = (s,n) => {const d=parse(s);d.setDate(d.getDate()+n);return day(d);};
const span = (a,b) => Math.round((Date.UTC(...a.split('-').map((v,i)=>Number(v)-(i===1?1:0)))-Date.UTC(...b.split('-').map((v,i)=>Number(v)-(i===1?1:0))))/86400000);
function fresh(today=day(new Date())){return {version:2,goalName:'禁欲打卡',motto:'今天只完成今天。',startDate:today,records:{},resets:[],modifiedAt:0};}
function normalize(raw,today=day(new Date())){
 if(!raw || typeof raw!=='object' || Array.isArray(raw) || ![1,2].includes(raw.version) || !valid(raw.startDate) || raw.startDate>today) throw Error('记录格式或起始日期不正确');
 const out={...fresh(today),goalName:String(raw.goalName||'禁欲打卡').slice(0,20),motto:String(raw.motto||'').slice(0,60),startDate:raw.startDate,modifiedAt:Number(raw.modifiedAt)||0};
 if(raw.version===1){
  if(!raw.checkins || typeof raw.checkins!=='object' || Array.isArray(raw.checkins) || !Array.isArray(raw.resets)) throw Error('旧版记录格式不正确');
  for(const [d,r] of Object.entries(raw.checkins)){if(!valid(d)||d>today)throw Error('备份包含无效或未来日期');if(r)out.records[d]={status:'success',sex:0,masturbation:0,note:''};}
  for(const r of raw.resets){if(!valid(r.date)||r.date>today)throw Error('历史重置日期无效');out.resets.push({...r});out.records[r.date]={status:'failure',sex:0,masturbation:0,note:String(r.note||'').slice(0,500),legacyReset:true};}
 }else{
  if(!raw.records || typeof raw.records!=='object' || Array.isArray(raw.records))throw Error('备份缺少每日记录');
  for(const [d,r] of Object.entries(raw.records)){
   if(!valid(d)||d>today||!r||!['success','failure'].includes(r.status))throw Error('备份包含无效记录');
   for(const k of ['sex','masturbation'])if(!Number.isInteger(r[k])||r[k]<0||r[k]>99)throw Error('次数应为 0–99 的整数');
   if(r.status==='success'&&(r.sex||r.masturbation))throw Error('成功记录不能同时含有射精次数');
   out.records[d]={status:r.status,sex:r.sex,masturbation:r.masturbation,note:String(r.note||'').slice(0,500),legacyReset:!!r.legacyReset};
  }
  out.resets=Array.isArray(raw.resets)?raw.resets.filter(r=>valid(r.date)&&r.date<=today):[];
 }
 const earliest=Object.keys(out.records).sort()[0];if(earliest&&earliest<out.startDate)out.startDate=earliest;
 return out;
}
function stats(state,start,end){
 start=start<state.startDate?state.startDate:start;
 const s={success:0,failure:0,unknown:0,sex:0,masturbation:0,days:0,rate:0,coverage:0};
 if(start>end)return s;
 s.days=span(end,start)+1;
 for(const [d,r] of Object.entries(state.records)){if(d<start||d>end)continue;s[r.status]++;s.sex+=r.sex;s.masturbation+=r.masturbation;}
 s.unknown=s.days-s.success-s.failure;s.rate=Math.round(s.success/s.days*100);s.coverage=Math.round((s.success+s.failure)/s.days*100);return s;
}
function streaks(state,today=day(new Date())){
 let end=today;if(!state.records[end])end=shift(end,-1);
 let current=0;while(end>=state.startDate && state.records[end]?.status==='success'){current++;end=shift(end,-1);}
 let best=0,run=0,previous='';
 for(const d of Object.keys(state.records).filter(d=>d<=today).sort()){
  if(state.records[d].status!=='success'){run=0;previous=d;continue;}
  run=previous&&shift(previous,1)===d?run+1:1;best=Math.max(best,run);previous=d;
 }
 return {current,best};
}
const api={day,parse,valid,shift,span,fresh,normalize,stats,streaks};
if(typeof module!=='undefined')module.exports=api;else root.CheckinCore=api;
})(globalThis);
