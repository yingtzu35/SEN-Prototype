export const definitions = [
 {id:'recall',name:'開放抽回'}, {id:'withdraw',name:'開放撤案'},
 {id:'assign',name:'派案'}, {id:'report',name:'填寫評估報告'},
 {id:'opinion',name:'陳述意見'}, {id:'review',name:'審查'},
 {id:'committee',name:'鑑輔會審查結果',required:true},
 {id:'publish',name:'結果公告／學校接收',required:true}
];
export function initialState() {return {
 batch:{name:'115 學年度・第一梯次',start:'',end:'',items:['初次鑑定','重新鑑定'],identities:['在校學生'],stages:['國小'],grades:['一年級','二年級','三年級','四年級','五年級','六年級'],document:'',approval:''},
 defaultsApplied:false,
 flows:Object.fromEntries(definitions.map(f=>[f.id,{selected:!!f.required,mode:f.required?'pending':'manual',open:false,start:'',end:''}])),
 cases:[{id:'SEN-001',name:'林小安',school:'光明國小',grade:'三年級',identity:'在校學生',item:'初次鑑定',stage:'國小',status:'已提報',history:[{time:'2026/10/20 09:30',text:'學校提報學生（假資料）'}]},
 {id:'SEN-002',name:'陳小晴',school:'和平國小',grade:'五年級',identity:'在校學生',item:'重新鑑定',stage:'國小',status:'已派案',history:[{time:'2026/10/20 10:00',text:'學校提報學生（假資料）'},{time:'2026/10/21 14:20',text:'完成派案（假資料）'}]},
 {id:'SEN-003',name:'張小宇',school:'光明國小',grade:'二年級',identity:'在校學生',item:'初次鑑定',stage:'國小',status:'報告已完成',history:[{time:'2026/10/20 11:00',text:'學校提報學生（假資料）'},{time:'2026/10/22 15:00',text:'評估報告完成（假資料）'}]}]
};}
export function validRange(start,end){return !!start && !!end && start<=end;}
export function applyDefaults(state){if (!state.defaultsApplied && validRange(state.batch.start,state.batch.end)){for (const id of ['assign','report']) Object.assign(state.flows[id],{selected:true,mode:'manual',open:true});state.defaultsApplied=true;}}
export function flowState(state,id,now){const f=state.flows[id]; if(!f.selected)return {open:false,label:'未選用'};if(f.mode==='pending')return {open:false,label:'待確認'};if(id==='publish'&&(!state.batch.document.trim()||!state.batch.approval))return {open:false,label:'缺少文號／核定日期'};if(f.mode==='auto'){if(!validRange(f.start,f.end))return {open:false,label:'區間未完成'};return {open:now>=f.start&&now<=f.end,label:now>=f.start&&now<=f.end?'開放中':'區間外'};}return {open:f.open,label:f.open?'開放中':'已關閉'};}
export const actions=[{id:'assign',role:'管理端',name:'派案',result:'已派案'},{id:'report',role:'評估人員',name:'撰寫評估報告',result:'報告已完成'},{id:'review',role:'審查人員',name:'審查',result:'審查已完成'},{id:'committee',role:'管理端',name:'鑑輔會審查結果',result:'鑑輔會結果已登錄'},{id:'publish',role:'學校端',name:'學校接收學生鑑定結果',result:'學校已接收'}];
export function actionGate(state,action,role,now){if(role!==action.role)return {open:false,label:`限${action.role}操作`};return flowState(state,action.id,now);}
export function submissionGate(state,now){return validRange(state.batch.start,state.batch.end)&&now>=state.batch.start&&now<=state.batch.end;}
