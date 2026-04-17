import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase config ─────────────────────────────────────────────────────────
const supabase = createClient(
  "https://mgqfcguawioyjhyjswqw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncWZjZ3Vhd2lveWpoeWpzd3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MjIxMTIsImV4cCI6MjA5MTk5ODExMn0.A_0u3LAcW8oTt7sYmXEOHB6WOedUpZWn64ZixMZUXVY"
);

// ─── Estilos base (no cambian) ───────────────────────────────────────────────
const G = {50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d"};
const card = {background:"#fff",border:"1px solid #e5e7eb",borderRadius:16,overflow:"hidden"};
const pill = (bg,fg) => ({background:bg,color:fg,fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,display:"inline-block"});
const SHORTS = ["LUN","MAR","MIÉ","JUE","VIE","SÁB","DOM"];
const MONTHS = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const TIPO_META = {
  train:{label:"Entrenamiento",bg:"#dcfce7",fg:"#166534"},
  rest: {label:"Descanso", bg:"#f3f4f6",fg:"#4b5563"},
  padel:{label:"Pádel", bg:"#ede9fe",fg:"#5b21b6"},
  prep: {label:"Meal Prep 🍳",bg:"#fef3c7",fg:"#92400e"},
};

// ─── Storage shim (para checks/completados locales) ─────────────────────────
const storage = {
  get: async (key) => {
    try {
      if (typeof window !== "undefined" && window.storage && typeof window.storage.get === "function") {
        return await window.storage.get(key);
      }
      const v = localStorage.getItem(key);
      return v === null ? null : { value: v };
    } catch { return null; }
  },
  set: async (key, value) => {
    try {
      if (typeof window !== "undefined" && window.storage && typeof window.storage.set === "function") {
        return await window.storage.set(key, value);
      }
      localStorage.setItem(key, value);
    } catch {}
  },
};

const fmtDate = d => `${d.getDate()} ${MONTHS[d.getMonth()]}`;

function getCurrentWeekIdx(WEEKS_META) {
  const now = new Date();
  for (let i = WEEKS_META.length-1; i >= 0; i--)
    if (now >= new Date(WEEKS_META[i].start)) return Math.min(i, WEEKS_META.length-1);
  return 0;
}
function getCurrentDayIdx(WEEKS_META) {
  const wi = getCurrentWeekIdx(WEEKS_META);
  const diff = Math.floor((new Date() - new Date(WEEKS_META[wi].start)) / 86400000);
  return Math.max(0, Math.min(6, diff));
}
function getDays(weekIdx, WEEKS_META, TIPOS, MEAL_TPLS) {
  const start = new Date(WEEKS_META[weekIdx].start);
  return SHORTS.map((short,i) => {
    const d = new Date(start);
    d.setDate(d.getDate()+i);
    return {short, date:fmtDate(d), tipo:TIPOS[i], meals:MEAL_TPLS[i]};
  });
}
function calcSums(wi,di,completed, MEAL_M) {
  return MEAL_M.reduce((a,m,i) => {
    if (completed.has(`${wi}-${di}-${i}`)) { a.kcal+=m.kcal; a.p+=m.p; a.c+=m.c; a.f+=m.f; }
    return a;
  }, {kcal:0,p:0,c:0,f:0});
}

// ─── Componentes UI (sin cambios, solo reciben datos por props) ─────────────

function InfoModal({meal, info, onClose}) {
  if (!meal || !info) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e => e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:520,maxHeight:"82vh",overflowY:"auto",padding:"20px 16px 36px"}}>
        <div style={{width:36,height:4,background:"#e5e7eb",borderRadius:2,margin:"0 auto 18px"}}/>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:"#9ca3af",marginBottom:4}}>{meal.time}</div>
          <div style={{fontSize:18,fontWeight:800,color:"#111827",lineHeight:1.3,marginBottom:4}}>{meal.name}</div>
          <div style={{fontSize:12,color:"#9ca3af"}}>{meal.qty}</div>
        </div>
        <div style={{background:G[50],border:`1px solid ${G[200]}`,borderRadius:14,padding:"14px 14px",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:G[700],textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>📋 Elaboración</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {info.steps.map((s,i) => (
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:G[600],color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
                <div style={{fontSize:13,color:"#374151",lineHeight:1.4}}>{s}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"#faf5ff",border:"1px solid #e9d5ff",borderRadius:14,padding:"14px 14px"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#6d28d9",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>🔄 Alternativas</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {info.alts.map((a,i) => (
              <div key={i} style={{background:"#fff",border:"1px solid #e9d5ff",borderRadius:10,padding:"10px 12px",fontSize:13,color:"#374151",lineHeight:1.4}}>{a}</div>
            ))}
          </div>
        </div>
        <button onClick={onClose} style={{marginTop:18,width:"100%",padding:"12px",background:G[600],color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer"}}>Cerrar</button>
      </div>
    </div>
  );
}

function CheckIcon() {
  return <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><polyline points="1,4 4,7 9,1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function Ring({val,target,color,label}) {
  const R=20,C=2*Math.PI*R,pct=Math.min(1,val/target);
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1}}>
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={R} fill="none" stroke="#f3f4f6" strokeWidth="5"/>
        <circle cx="26" cy="26" r={R} fill="none" stroke={color} strokeWidth="5" strokeDasharray={C} strokeDashoffset={C*(1-pct)} strokeLinecap="round" transform="rotate(-90 26 26)"/>
        <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>{val}</text>
      </svg>
      <div style={{fontSize:10,color:"#9ca3af",textAlign:"center",lineHeight:1.3}}>
        <span style={{color:"#374151",fontWeight:600}}>{label}</span><br/>{target}g
      </div>
    </div>
  );
}

function MacroPanel({wi,di,completed,TARGET,MEAL_M}) {
  const s = calcSums(wi,di,completed,MEAL_M);
  const pct = Math.min(100,Math.round(s.kcal/TARGET.kcal*100));
  return (
    <div style={{...card,padding:16,marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:10}}>
        <div>
          <div style={{fontSize:11,color:"#9ca3af",marginBottom:2}}>calorías consumidas hoy</div>
          <div style={{fontSize:26,fontWeight:800,color:"#111827",lineHeight:1}}>
            {s.kcal}<span style={{fontSize:13,fontWeight:400,color:"#9ca3af"}}>&nbsp;/ {TARGET.kcal} kcal</span>
          </div>
        </div>
        <div style={{fontSize:24,fontWeight:800,color:s.kcal>=TARGET.kcal?G[600]:"#d1d5db"}}>{pct}%</div>
      </div>
      <div style={{height:8,background:"#f3f4f6",borderRadius:4,overflow:"hidden",marginBottom:14}}>
        <div style={{height:"100%",background:`linear-gradient(90deg,${G[600]},${G[400]})`,borderRadius:4,width:`${pct}%`,transition:"width .5s ease"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-around"}}>
        <Ring val={s.p} target={TARGET.p} color={G[600]} label="Proteína"/>
        <Ring val={s.c} target={TARGET.c} color="#7c3aed" label="Carbos"/>
        <Ring val={s.f} target={TARGET.f} color="#f59e0b" label="Grasas"/>
      </div>
    </div>
  );
}

function MealRow({meal, mi, wi, di, completed, toggleMeal, onInfo, MEAL_M}) {
  const key=`${wi}-${di}-${mi}`, done=completed.has(key), m=MEAL_M[mi];
  return (
    <div style={{display:"flex",gap:10,padding:"13px 14px",background:done?G[50]:"#fff",borderTop:"1px solid #f3f4f6",alignItems:"center"}}>
      <button onClick={() => toggleMeal(key)} style={{width:28,height:28,borderRadius:"50%",flexShrink:0,border:`2px solid ${done?G[600]:"#d1d5db"}`,background:done?G[600]:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",cursor:"pointer",padding:0}}>
        {done && <CheckIcon/>}
      </button>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:11,color:"#9ca3af",marginBottom:2}}>{meal.time}</div>
        <div style={{fontSize:14,fontWeight:600,marginBottom:3,lineHeight:1.3,color:done?G[700]:"#111827",textDecoration:done?"line-through":"none",opacity:done?.65:1}}>{meal.name}</div>
        <div style={{fontSize:12,color:done?G[400]:"#9ca3af",lineHeight:1.4}}>{meal.qty}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:15,fontWeight:700,color:done?G[600]:"#374151"}}>{m.kcal}</div>
          <div style={{fontSize:10,color:"#9ca3af"}}>kcal · {m.p}g P</div>
        </div>
        <button onClick={() => onInfo(mi)} style={{width:26,height:26,borderRadius:"50%",border:"1.5px solid #e5e7eb",background:"#f9fafb",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,padding:0,transition:"all .15s"}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8" strokeWidth="3"/><line x1="12" y1="12" x2="12" y2="17"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function WeekPills({weekIdx,setWeekIdx,WEEKS_META}) {
  const curW = getCurrentWeekIdx(WEEKS_META);
  return (
    <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:2}}>
      {WEEKS_META.map((w,i) => {
        const active=weekIdx===i, isCur=i===curW;
        return (
          <button key={i} onClick={() => setWeekIdx(i)} style={{flexShrink:0,padding:"7px 14px",borderRadius:20,cursor:"pointer",border:`1.5px solid ${active?G[600]:"#e5e7eb"}`,background:active?G[600]:"#fff",color:active?"#fff":isCur?G[700]:"#374151",fontWeight:active?700:isCur?600:400,fontSize:13}}>
            {w.label}{isCur?" ·":""}
          </button>
        );
      })}
    </div>
  );
}

function DayPills({wi,selDay,setSelDay,completed,WEEKS_META,TIPOS,MEAL_TPLS}) {
  const days=getDays(wi,WEEKS_META,TIPOS,MEAL_TPLS), curW=getCurrentWeekIdx(WEEKS_META), curD=getCurrentDayIdx(WEEKS_META);
  return (
    <div style={{display:"flex",gap:5,marginBottom:18,overflowX:"auto",paddingBottom:2}}>
      {days.map((d,i) => {
        const done=d.meals.filter((_,mi) => completed.has(`${wi}-${i}-${mi}`)).length;
        const active=selDay===i, isToday=wi===curW&&i===curD;
        return (
          <button key={i} onClick={() => setSelDay(i)} style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",padding:"9px 10px 7px",borderRadius:14,cursor:"pointer",border:`1.5px solid ${active?G[600]:"#e5e7eb"}`,background:active?G[100]:isToday?"#fafafa":"#fff",gap:3,minWidth:50}}>
            <span style={{fontSize:11,fontWeight:700,color:active?G[700]:"#374151"}}>{d.short}</span>
            <span style={{fontSize:10,color:active?G[600]:"#9ca3af"}}>{done}/5</span>
            <div style={{height:3,width:28,borderRadius:2,background:"#e5e7eb",overflow:"hidden"}}>
              <div style={{height:"100%",background:active?G[600]:G[200],width:`${done/5*100}%`,transition:"width .3s"}}/>
            </div>
            {isToday && <div style={{width:4,height:4,borderRadius:"50%",background:G[500],marginTop:1}}/>}
          </button>
        );
      })}
    </div>
  );
}

function MealList({wi, di, completed, toggleMeal, MEAL_TPLS, MEAL_INFO, MEAL_M, WEEKS_META, TIPOS}) {
  const [modalMi, setModalMi] = useState(null);
  const day = getDays(wi,WEEKS_META,TIPOS,MEAL_TPLS)[di];
  const info = MEAL_INFO[di];
  return (
    <>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:".07em",textTransform:"uppercase",color:"#9ca3af",marginBottom:8}}>Toca ✓ para marcar · ⓘ para ver elaboración</div>
      <div style={card}>
        {day.meals.map((m,i) => (
          <MealRow key={i} meal={m} mi={i} wi={wi} di={di} completed={completed} toggleMeal={toggleMeal} onInfo={setModalMi} MEAL_M={MEAL_M}/>
        ))}
      </div>
      <InfoModal meal={modalMi !== null ? day.meals[modalMi] : null} info={modalMi !== null ? info[modalMi] : null} onClose={() => setModalMi(null)} />
    </>
  );
}

function TodayView({completed, toggleMeal, data}) {
  const {WEEKS_META,TIPOS,MEAL_TPLS,MEAL_INFO,MEAL_M,TARGET} = data;
  const curWi=getCurrentWeekIdx(WEEKS_META), curDi=getCurrentDayIdx(WEEKS_META);
  const totalDays = WEEKS_META.length * 7;
  const [flatIdx, setFlatIdx] = useState(curWi*7 + curDi);
  const wi = Math.floor(flatIdx/7), di = flatIdx%7;
  const day=getDays(wi,WEEKS_META,TIPOS,MEAL_TPLS)[di], meta=TIPO_META[day.tipo];
  const doneCt=day.meals.filter((_,i) => completed.has(`${wi}-${di}-${i}`)).length;
  const isToday = wi===curWi && di===curDi;
  const ArrowBtn = ({dir}) => {
    const disabled = dir===-1 ? flatIdx===0 : flatIdx===totalDays-1;
    return (
      <button onClick={() => !disabled && setFlatIdx(f=>f+dir)} style={{width:34,height:34,borderRadius:"50%",border:`1.5px solid ${disabled?"#f3f4f6":"#e5e7eb"}`,background:disabled?"#fafafa":"#fff",cursor:disabled?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s",padding:0}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={disabled?"#d1d5db":G[600]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {dir===-1 ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}
        </svg>
      </button>
    );
  };
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <ArrowBtn dir={-1}/>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontSize:26,fontWeight:800,color:"#111827",lineHeight:1}}>{isToday?"Hoy":day.short}</div>
              {isToday && <span style={pill(G[100],G[700])}>Hoy</span>}
            </div>
            <div style={{fontSize:13,color:"#9ca3af",marginTop:3}}>{day.short} · {day.date} · {WEEKS_META[wi].label}</div>
          </div>
          <ArrowBtn dir={1}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
          <span style={pill(meta.bg,meta.fg)}>{meta.label}</span>
          <span style={{fontSize:12,color:"#9ca3af"}}>{doneCt}/5 ✓</span>
        </div>
      </div>
      <MacroPanel wi={wi} di={di} completed={completed} TARGET={TARGET} MEAL_M={MEAL_M}/>
      <MealList wi={wi} di={di} completed={completed} toggleMeal={toggleMeal} MEAL_TPLS={MEAL_TPLS} MEAL_INFO={MEAL_INFO} MEAL_M={MEAL_M} WEEKS_META={WEEKS_META} TIPOS={TIPOS}/>
    </div>
  );
}

function WeekView({completed, toggleMeal, data}) {
  const {WEEKS_META,TIPOS,MEAL_TPLS,MEAL_INFO,MEAL_M,TARGET} = data;
  const curW=getCurrentWeekIdx(WEEKS_META), curD=getCurrentDayIdx(WEEKS_META);
  const [wi,setWi]=useState(curW);
  const [di,setDi]=useState(curD);
  const handleWeek = w => { setWi(w); setDi(w===curW?curD:0); };
  const days=getDays(wi,WEEKS_META,TIPOS,MEAL_TPLS), day=days[di], meta=TIPO_META[day.tipo];
  return (
    <div>
      <div style={{fontSize:20,fontWeight:800,color:"#111827",marginBottom:14}}>{WEEKS_META[wi].label} · 2026</div>
      <WeekPills weekIdx={wi} setWeekIdx={handleWeek} WEEKS_META={WEEKS_META}/>
      <div style={{fontSize:12,color:"#9ca3af",marginBottom:14}}>{WEEKS_META[wi].range}</div>
      <DayPills wi={wi} selDay={di} setSelDay={setDi} completed={completed} WEEKS_META={WEEKS_META} TIPOS={TIPOS} MEAL_TPLS={MEAL_TPLS}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:16,color:"#111827"}}>{day.date}</div>
        <span style={pill(meta.bg,meta.fg)}>{meta.label}</span>
      </div>
      <MacroPanel wi={wi} di={di} completed={completed} TARGET={TARGET} MEAL_M={MEAL_M}/>
      <MealList wi={wi} di={di} completed={completed} toggleMeal={toggleMeal} MEAL_TPLS={MEAL_TPLS} MEAL_INFO={MEAL_INFO} MEAL_M={MEAL_M} WEEKS_META={WEEKS_META} TIPOS={TIPOS}/>
    </div>
  );
}

function ShopItem({item,done,onToggle,square}) {
  return (
    <div onClick={onToggle} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:done?G[50]:"#fff",cursor:"pointer",transition:"background .15s",borderTop:"1px solid #f3f4f6"}}>
      <div style={{width:20,height:20,flexShrink:0,borderRadius:square?5:"50%",border:`1.5px solid ${done?G[600]:"#d1d5db"}`,background:done?G[600]:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {done && <CheckIcon/>}
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:500,color:done?G[700]:"#111827",textDecoration:done?"line-through":"none",opacity:done?.6:1}}>{item.n}</div>
        <div style={{fontSize:11,color:"#9ca3af"}}>{item.q}</div>
      </div>
      <div style={{fontSize:12,fontWeight:700,color:done?G[400]:G[600]}}>{item.p}</div>
    </div>
  );
}

function ShoppingView({monthCk,weekCk,toggleMonth,toggleWeek,data}) {
  const {WEEKS_META,SHOP_MENSUAL,SHOP_SEMANAL} = data;
  const [selWeek,setSelWeek]=useState(getCurrentWeekIdx(WEEKS_META));
  const mTotal=SHOP_MENSUAL.reduce((a,c)=>a+c.items.length,0);
  const mDone=SHOP_MENSUAL.reduce((a,c,ci)=>a+c.items.filter((_,ii)=>monthCk.has(`m-${ci}-${ii}`)).length,0);
  const wTotal=SHOP_SEMANAL.reduce((a,c)=>a+c.items.length,0);
  const wDone=SHOP_SEMANAL.reduce((a,c,ci)=>a+c.items.filter((_,ii)=>weekCk.has(`w${selWeek}-${ci}-${ii}`)).length,0);
  return (
    <div>
      <div style={{fontSize:20,fontWeight:800,color:"#111827",marginBottom:4}}>Lista de compra</div>
      <div style={{fontSize:12,color:G[600],fontWeight:600,marginBottom:20}}>Abril 2026 · Despensa mensual + perecederos semanales</div>
      <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:14,padding:"12px 14px",marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#92400e"}}>🛒 Compra mensual</div>
            <div style={{fontSize:11,color:"#b45309",marginTop:2}}>Duran todo el mes · compra 1 sola vez</div>
            <div style={{fontSize:12,fontWeight:700,color:"#b45309",marginTop:4}}>~€82–92 / mes</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:18,fontWeight:800,color:mDone===mTotal?G[600]:"#92400e"}}>{mDone}/{mTotal}</div>
            <div style={{fontSize:10,color:"#b45309"}}>completado</div>
          </div>
        </div>
        <div style={{height:4,background:"#fef3c7",borderRadius:2,overflow:"hidden",marginTop:10}}>
          <div style={{height:"100%",background:"#f59e0b",width:`${mTotal>0?mDone/mTotal*100:0}%`,borderRadius:2,transition:"width .4s"}}/>
        </div>
      </div>
      {SHOP_MENSUAL.map((cat,ci) => (
        <div key={ci} style={{marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>{cat.cat}</div>
          <div style={card}>
            {cat.items.map((item,ii) => (
              <ShopItem key={ii} item={item} done={monthCk.has(`m-${ci}-${ii}`)} onToggle={() => toggleMonth(`m-${ci}-${ii}`)} square/>
            ))}
          </div>
        </div>
      ))}
      <div style={{background:G[50],border:`1px solid ${G[200]}`,borderRadius:14,padding:"12px 14px",marginBottom:12,marginTop:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:G[700]}}>🥦 Compra semanal</div>
            <div style={{fontSize:11,color:G[600],marginTop:2}}>Perecederos · renovar cada semana</div>
            <div style={{fontSize:12,fontWeight:700,color:G[600],marginTop:4}}>~€42–52 / semana</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:18,fontWeight:800,color:wDone===wTotal?G[600]:G[700]}}>{wDone}/{wTotal}</div>
            <div style={{fontSize:10,color:G[600]}}>esta semana</div>
          </div>
        </div>
        <div style={{height:4,background:G[200],borderRadius:2,overflow:"hidden",marginTop:10}}>
          <div style={{height:"100%",background:G[500],width:`${wTotal>0?wDone/wTotal*100:0}%`,borderRadius:2,transition:"width .4s"}}/>
        </div>
      </div>
      <div style={{marginBottom:14}}>
        <WeekPills weekIdx={selWeek} setWeekIdx={setSelWeek} WEEKS_META={WEEKS_META}/>
        <div style={{fontSize:11,color:"#9ca3af"}}>{WEEKS_META[selWeek].range}</div>
      </div>
      {SHOP_SEMANAL.map((cat,ci) => (
        <div key={ci} style={{marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>{cat.cat}</div>
          <div style={card}>
            {cat.items.map((item,ii) => (
              <ShopItem key={ii} item={item} done={weekCk.has(`w${selWeek}-${ci}-${ii}`)} onToggle={() => toggleWeek(`w${selWeek}-${ci}-${ii}`)}/>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoView({data}) {
  const {AF_TIMES,PREP_STEPS,TIPS} = data;
  const [openPrep,setOpenPrep]=useState(true);
  return (
    <div>
      <div style={{fontSize:20,fontWeight:800,color:"#111827",marginBottom:16}}>Guía rápida</div>
      <div style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>Air Fryer · tiempos exactos</div>
      <div style={card}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 64px 76px",padding:"8px 14px 4px",borderBottom:"1px solid #f3f4f6"}}>
          {["Alimento","Temp.","Tiempo"].map(h => (
            <div key={h} style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".05em",paddingBottom:4}}>{h}</div>
          ))}
        </div>
        {AF_TIMES.map((row,i) => (
          <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 64px 76px",padding:"11px 14px",alignItems:"center",borderTop:"1px solid #f3f4f6"}}>
            <div>
              <div style={{fontSize:13,fontWeight:500,color:"#111827"}}>{row.f}</div>
              <div style={{fontSize:11,color:"#9ca3af"}}>{row.tip}</div>
            </div>
            <span style={{fontSize:11,fontWeight:700,background:"#fef3c7",color:"#92400e",padding:"3px 8px",borderRadius:6,width:"fit-content"}}>{row.t}</span>
            <span style={{fontSize:11,fontWeight:700,background:G[100],color:G[700],padding:"3px 8px",borderRadius:6,width:"fit-content"}}>{row.m}</span>
          </div>
        ))}
      </div>
      <div style={{marginTop:20}}>
        <div onClick={() => setOpenPrep(!openPrep)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10,cursor:"pointer"}}>
          <span>Meal Prep Domingo · plan de 2h</span>
          <span style={{color:G[600],fontSize:14}}>{openPrep?"▲":"▼"}</span>
        </div>
        {openPrep && (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {PREP_STEPS.map(([txt,t],i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,...card,padding:"11px 14px"}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:G[100],border:`1px solid ${G[200]}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:12,fontWeight:800,color:G[700]}}>{i+1}</span>
                </div>
                <div style={{flex:1,fontSize:13,color:"#374151"}}>{txt}</div>
                <span style={{fontSize:11,color:"#9ca3af",flexShrink:0}}>{t}</span>
              </div>
            ))}
            <div style={{background:G[50],border:`1px solid ${G[200]}`,borderRadius:12,padding:"10px 14px",fontSize:12,color:G[700],fontWeight:500}}>
              Resultado: proteína + carbos + huevos para 4–5 días en la nevera 🎉
            </div>
          </div>
        )}
      </div>
      <div style={{marginTop:20}}>
        <div style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>Consejos clave</div>
        <div style={{background:G[50],border:`1px solid ${G[200]}`,borderRadius:16,padding:14,display:"flex",flexDirection:"column",gap:10}}>
          {TIPS.map((t,i) => (
            <div key={i} style={{display:"flex",gap:10,fontSize:13,color:G[700]}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:G[400],marginTop:5,flexShrink:0}}/>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavBar({tab,setTab}) {
  const items = [
    {id:"hoy",label:"Hoy",icon:a=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?G[600]:"#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>},
    {id:"semana",label:"Semana",icon:a=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?G[600]:"#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>},
    {id:"compra",label:"Compra",icon:a=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?G[600]:"#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>},
    {id:"info",label:"Info",icon:a=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={a?G[600]:"#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8" strokeWidth="3"/><line x1="12" y1="12" x2="12" y2="17"/></svg>},
  ];
  return (
    <div style={{display:"flex",background:"#fff",borderTop:"2px solid #f3f4f6"}}>
      {items.map(it => {
        const active=tab===it.id;
        return (
          <button key={it.id} onClick={() => setTab(it.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"10px 4px 8px",border:"none",background:"transparent",cursor:"pointer",borderBottom:`2px solid ${active?G[600]:"transparent"}`,marginBottom:-2,transition:"all .15s"}}>
            {it.icon(active)}
            <span style={{fontSize:10,fontWeight:active?700:400,color:active?G[700]:"#9ca3af"}}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── App principal: carga datos de Supabase ─────────────────────────────────

export default function App() {
  const [tab,setTab] = useState("hoy");
  const [completed,setComp] = useState(new Set());
  const [monthCk,setMonthCk] = useState(new Set());
  const [weekCk,setWeekCk] = useState(new Set());
  const [ready,setReady] = useState(false);
  const [appData, setAppData] = useState(null);

  // Cargar datos de Supabase + localStorage
  useEffect(() => {
    (async () => {
      // 1. Cargar datos de Supabase
      const { data: rows, error } = await supabase.from("app_data").select("key, data");
      if (error) { console.error("Supabase error:", error); return; }

      const db = {};
      rows.forEach(r => { db[r.key] = r.data; });

      const profile = db.profile || {weight:73,height:1.86,goal:"masa muscular",kcal:2856,protein:150,carbs:365,fat:88};
      const TARGET = {kcal:profile.kcal, p:profile.protein, c:profile.carbs, f:profile.fat};

      setAppData({
        profile,
        TARGET,
        MEAL_M: db.meal_macros || [],
        TIPOS: db.day_types || [],
        WEEKS_META: db.weeks || [],
        MEAL_TPLS: db.meals || [],
        MEAL_INFO: [db.meal_info_0||[], db.meal_info_1||[], db.meal_info_2||[], db.meal_info_3||[], db.meal_info_4||[], db.meal_info_5||[], db.meal_info_6||[]],
        SHOP_MENSUAL: db.shop_monthly || [],
        SHOP_SEMANAL: db.shop_weekly || [],
        AF_TIMES: db.air_fryer || [],
        PREP_STEPS: db.prep_steps || [],
        TIPS: db.tips || [],
      });

      // 2. Cargar estado local (checks)
      try { const r=await storage.get("nt_meals2"); if(r) setComp(new Set(JSON.parse(r.value))); } catch {}
      try { const r=await storage.get("nt_month"); if(r) setMonthCk(new Set(JSON.parse(r.value))); } catch {}
      try { const r=await storage.get("nt_week"); if(r) setWeekCk(new Set(JSON.parse(r.value))); } catch {}

      setReady(true);
    })();
  },[]);

  const toggleMeal = key => setComp(prev => {
    const n=new Set(prev); n.has(key)?n.delete(key):n.add(key);
    storage.set("nt_meals2",JSON.stringify([...n])).catch(()=>{});
    return n;
  });
  const toggleMonth = key => setMonthCk(prev => {
    const n=new Set(prev); n.has(key)?n.delete(key):n.add(key);
    storage.set("nt_month",JSON.stringify([...n])).catch(()=>{});
    return n;
  });
  const toggleWeek = key => setWeekCk(prev => {
    const n=new Set(prev); n.has(key)?n.delete(key):n.add(key);
    storage.set("nt_week",JSON.stringify([...n])).catch(()=>{});
    return n;
  });

  if (!ready || !appData) return <div style={{height:300,display:"flex",alignItems:"center",justifyContent:"center",color:"#9ca3af",fontSize:14,fontFamily:"system-ui,sans-serif"}}>Cargando NutriTrack...</div>;

  return (
    <div style={{fontFamily:"system-ui,-apple-system,sans-serif",maxWidth:520,margin:"0 auto",background:"#f9fafb"}}>
      <div style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"14px 16px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:"#111827",letterSpacing:"-.5px"}}>NutriTrack</div>
            <div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>{appData.profile.weight} kg · {appData.profile.height} m · Objetivo: {appData.profile.goal}</div>
          </div>
          <div style={{background:G[100],borderRadius:12,padding:"8px 14px",textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:800,color:G[700],lineHeight:1}}>{appData.TARGET.kcal.toLocaleString("es-ES")}</div>
            <div style={{fontSize:9,color:G[500],fontWeight:700,textTransform:"uppercase",letterSpacing:".05em"}}>kcal / día</div>
          </div>
        </div>
      </div>
      <div style={{padding:"16px 14px 80px"}}>
        {tab==="hoy" && <TodayView completed={completed} toggleMeal={toggleMeal} data={appData}/>}
        {tab==="semana" && <WeekView completed={completed} toggleMeal={toggleMeal} data={appData}/>}
        {tab==="compra" && <ShoppingView monthCk={monthCk} weekCk={weekCk} toggleMonth={toggleMonth} toggleWeek={toggleWeek} data={appData}/>}
        {tab==="info" && <InfoView data={appData}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:520,zIndex:100}}>
        <NavBar tab={tab} setTab={setTab}/>
      </div>
    </div>
  );
}
