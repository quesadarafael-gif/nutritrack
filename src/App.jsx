import { useState, useEffect } from "react";
const G = {50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d"};
const card = {background:"#fff",border:"1px solid #e5e7eb",borderRadius:16,overflow:"hidden"};
const pill = (bg,fg) => ({background:bg,color:fg,fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,display:"inline-block"});
const SHORTS = ["LUN","MAR","MIÉ","JUE","VIE","SÁB","DOM"];
const TIPOS  = ["train","rest","train","padel","rest","rest","prep"];
const MONTHS = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const WEEKS_META = [
  {label:"Sem 16", range:"13 – 19 abr",      start:new Date("2026-04-13")},
  {label:"Sem 17", range:"20 – 26 abr",      start:new Date("2026-04-20")},
  {label:"Sem 18", range:"27 abr – 3 may",   start:new Date("2026-04-27")},
  {label:"Sem 19", range:"4 – 10 may",       start:new Date("2026-05-04")},
  {label:"Sem 20", range:"11 – 17 may",      start:new Date("2026-05-11")},
];
const MEAL_TPLS = [
  [{time:"07:00",name:"Avena con leche y huevos",qty:"80g avena · 250ml leche · 2 huevos revueltos · 1 plátano"},
   {time:"10:30",name:"Yogur griego + nueces + miel",qty:"200g yogur · 20g nueces · 10g miel"},
   {time:"14:00",name:"Pollo air fryer + arroz + brócoli",qty:"200g pechuga 185°C · 100g arroz crudo · 150g brócoli"},
   {time:"18:00",name:"Pan integral con atún y tomate",qty:"2 rebanadas · 1 lata atún 80g · tomate"},
   {time:"22:00",name:"Tortilla 4 huevos + patatas + ensalada",qty:"4 huevos · 200g patata cocida · ensalada verde"}],
  [{time:"07:00",name:"Huevos estrellados + tostadas + zumo",qty:"2 huevos · 2 rebanadas pan · 1 naranja exprimida"},
   {time:"10:30",name:"Requesón con manzana",qty:"200g requesón · 1 manzana"},
   {time:"14:00",name:"Lentejas con arroz",qty:"1 bote lentejas (400g) · 80g arroz crudo · ajo y pimentón"},
   {time:"18:00",name:"Batido casero",qty:"300ml leche · 1 plátano · 15g cacao puro"},
   {time:"21:30",name:"Merluza air fryer + patatas + ensalada",qty:"200g merluza 190°C 11min · 200g patatas dados"}],
  [{time:"07:00",name:"Avena con leche y huevos",qty:"80g avena · 250ml leche · 2 huevos revueltos · 1 plátano"},
   {time:"10:30",name:"Yogur griego + naranja + miel",qty:"200g yogur · 1 naranja · 10g miel"},
   {time:"14:00",name:"Pasta con atún y tomate",qty:"100g pasta cruda · 2 latas atún · 50g tomate frito · 20g queso"},
   {time:"18:00",name:"Pan con pechuga de pavo",qty:"2 rebanadas · 80g pavo fiambre · tomate"},
   {time:"22:00",name:"Muslos pollo air fryer + arroz + pimiento",qty:"250g muslos 180°C 22min · 80g arroz · pimiento asado"}],
  [{time:"07:00",name:"Avena reforzada + huevos + plátano",qty:"100g avena · 300ml leche · 2 huevos · 1 plátano grande"},
   {time:"10:30",name:"Yogur griego + nueces",qty:"200g yogur · 25g nueces"},
   {time:"14:00",name:"Pollo + arroz + judías verdes",qty:"200g pechuga air fryer · 120g arroz crudo · 150g judías"},
   {time:"17:00",name:"Pre-pádel ⚡ tostadas + mermelada + plátano",qty:"2 tostadas · 20g mermelada · 1 plátano (60 min antes)"},
   {time:"22:00",name:"Post-pádel: tortilla + atún + pan",qty:"4 huevos · 2 latas atún · 2 rebanadas pan integral"}],
  [{time:"07:00",name:"Tortitas de avena",qty:"80g avena + 2 huevos + 100ml leche en sartén · miel"},
   {time:"10:30",name:"Requesón con pera",qty:"200g requesón · 1 pera"},
   {time:"14:00",name:"Alubias con salchichas de pollo",qty:"1 bote alubias (400g) · 2 salchichas pollo · 60g arroz crudo"},
   {time:"18:00",name:"Leche con cacao + tostada con mantequilla",qty:"300ml leche · 15g cacao · 2 rebanadas · 10g mantequilla"},
   {time:"21:30",name:"Sardinas + pasta al tomate",qty:"80g pasta · 2 latas sardinas · tomate rallado · aceite"}],
  [{time:"07:00",name:"3 huevos revueltos + tostadas + zumo",qty:"3 huevos · 2 rebanadas pan · zumo de 2 naranjas"},
   {time:"11:00",name:"Yogur con avena cruda y plátano",qty:"200g yogur · 40g avena · 1 plátano"},
   {time:"14:00",name:"Contramuslos air fryer + patatas asadas",qty:"300g contramuslos 185°C 22min · 200g patatas · ensalada"},
   {time:"18:00",name:"Batido leche + plátano + cacao",qty:"300ml leche · 1 plátano · 15g cacao"},
   {time:"21:30",name:"Macarrones con carne picada",qty:"100g pasta · 150g carne picada · 80g tomate frito · orégano"}],
  [{time:"07:00",name:"Avena con leche + 2 huevos + miel",qty:"80g avena · 250ml leche · 2 huevos revueltos · 10g miel"},
   {time:"11:00",name:"Fruta variada + nueces",qty:"2 piezas fruta de temporada · 30g nueces"},
   {time:"14:00",name:"Arroz con pollo guisado 🍳",qty:"200g pollo · 100g arroz crudo · ½ pimiento · tomate · caldo"},
   {time:"18:00",name:"Yogur griego + plátano + miel",qty:"200g yogur · 1 plátano · 10g miel"},
   {time:"21:30",name:"Pizza casera exprés (air fryer)",qty:"2 tortillas trigo · 60g tomate frito · 80g mozzarella · 1 lata atún · 8min 180°C"}],
];
// Elaboración + alternativas para cada comida (7 días × 5 comidas)
const MEAL_INFO = [
  // LUN
  [{steps:["Calienta la leche 2 min en microondas","Añade la avena, remueve y deja reposar 2 min","Haz los huevos revueltos en sartén con spray a fuego medio","Sirve el plátano entero al lado"],alts:["🥞 Tortitas de avena: 80g avena + 2 huevos + 100ml leche, cuaja en sartén 2 min por lado","🍞 Tostadas con huevo frito y queso fresco: 2 rebanadas pan + 2 huevos + 60g queso fresco"]},
   {steps:["Vierte el yogur en un bol","Trocea las nueces con los dedos encima","Añade la miel en hilo fino","Listo en 1 minuto"],alts:["🧀 Requesón 200g con 80g frutas del bosque congeladas (descongelar la noche anterior)","🥛 200ml kéfir con 30g granola y 10g miel"]},
   {steps:["Sazona la pechuga con sal, ajo en polvo y orégano","Air fryer 185°C · 16-18 min · gira a mitad","Pon a cocer el arroz 18 min con una pizca de sal","Cuece el brócoli al vapor en microondas 5 min con film"],alts:["🍗 200g muslos de pollo misma receta (+2 min) + 100g arroz + 150g brócoli","🐟 200g merluza air fryer 190°C 11 min + 100g arroz + 150g judías verdes"]},
   {steps:["Tuesta el pan 2 min en tostadora","Escurre bien el atún de la lata","Coloca rodajas de tomate y encima el atún","Opcional: unas gotas de aceite de oliva"],alts:["🐟 2 rebanadas pan integral + 1 lata sardinas 85g + 50g pimiento asado de bote","🥑 6 crackers integrales + 100g requesón + 1 lata atún 80g"]},
   {steps:["Cuece las patatas en dados 10 min en agua con sal","Bate 4 huevos con sal y pimienta","Mezcla patatas escurridas con el huevo batido","Cuaja en sartén antiadherente a fuego medio-bajo, tapa 5 min"],alts:["🍳 4 huevos revueltos + 150g champiñones salteados con ajo y AOVE","🧀 4 huevos (2×tortilla francesa) + 80g jamón york + 20g queso"]}],
  // MAR
  [{steps:["Calienta la sartén con spray de aceite","Fríe los huevos a fuego medio-alto 2-3 min","Tuesta el pan mientras tanto","Exprime la naranja directamente en vaso"],alts:["🥚 3 huevos revueltos con 30g queso rallado al microondas 2 min + 2 tostadas pan","🫐 200g yogur griego + 100g frutas del bosque + 2 huevos duros (cocer aparte 12 min)"]},
   {steps:["Parte la manzana en dados o láminas","Pon el requesón en bol y coloca la fruta encima","Opcional: toque de canela o miel"],alts:["🍐 200g requesón + 1 pera + 20g nueces troceadas","🍌 200g yogur griego + 1 plátano en rodajas + 10g cacao puro"]},
   {steps:["Abre y escurre el bote de lentejas","Sofríe ajo laminado en AOVE 1 min","Añade lentejas + pimentón ahumado, rehoga 3 min","Sirve sobre el arroz cocido previamente"],alts:["🫘 400g garbanzos cocidos salteados con 100g espinacas + 1 huevo duro + 80g arroz","🍲 400g alubias blancas de bote con 50g tomate frito + 80g arroz cocido"]},
   {steps:["Pon leche fría en vaso alto","Añade el plátano en trozos y el cacao","Bate con batidora de mano 30 segundos","Tomar frío o a temperatura ambiente"],alts:["🍫 150g yogur griego + 1 plátano + 15g cacao + 100ml leche, batido","☕ 300ml leche caliente con 15g cacao + 2 tortitas de arroz (35g)"]},
   {steps:["Sazona la merluza con sal, limón y ajo en polvo","Air fryer 190°C · 10-12 min · sin voltear","Corta patatas en dados 2cm, spray aceite, 200°C 18 min (pon antes)","Sirve con unas hojas de lechuga y tomate"],alts:["🐟 200g salmón air fryer 190°C 10 min + 200g patatas dados + ensalada verde","🍤 200g gambas peladas al ajillo (sartén 3 min) + 200g patatas + lechuga"]}],
  // MIÉ
  [{steps:["Igual que el lunes: leche caliente + avena 2 min","Huevos revueltos en sartén con spray","Plátano al lado"],alts:["🥣 Overnight oats: 80g avena + 200ml leche + 100g yogur, reposar en nevera desde noche anterior + 1 plátano","🍳 2 huevos al plato en microondas 2 min + 2 tostadas pan integral + 250ml leche"]},
   {steps:["Pela la naranja y separa los gajos","Vierte el yogur en bol","Coloca los gajos encima y añade la miel"],alts:["🍓 200g yogur griego + 100g fresas + 10g miel","🥭 200g yogur griego + 100g mango congelado (descongelar) + 10g miel"]},
   {steps:["Cuece la pasta al dente según paquete (9-11 min)","Escurre, reserva. Mezcla en caliente con tomate frito","Añade el atún escurrido y el queso rallado","Remueve bien hasta que el queso se funda"],alts:["🍝 100g pasta + 2 huevos fritos + 30g queso parmesano (carbonara express)","🫙 100g pasta + 40g pesto de bote + 1 lata atún 80g + 80g tomates cherry"]},
   {steps:["Tuesta el pan","Coloca las lonchas de pavo fiambre","Añade rodajas de tomate fresco","Opcional: mostaza o un chorrito de AOVE"],alts:["🧀 2 rebanadas pan integral + 60g queso fresco + 60g jamón york + tomate","🥫 2 rebanadas pan integral + 40g hummus + 80g pechuga pavo fiambre"]},
   {steps:["Sazona los muslos con sal, ajo, pimentón y AOVE","Air fryer 180°C · 20-22 min · da la vuelta a mitad","Asa el pimiento en el mismo air fryer 10 min antes","Cuece el arroz en paralelo"],alts:["🍗 250g contramuslos rellenos de 30g queso + 50g espinacas, palillo para cerrar, air fryer 185°C 22 min + 80g arroz","🌮 250g muslos desmigados del meal prep sobre 80g arroz con 100g yogur natural + ajo + limón"]}],
  // JUE
  [{steps:["Leche caliente + 100g avena, reposar 3 min","Huevos revueltos en sartén (aquí 2 huevos)","Plátano grande al lado: clave para energía pre-día de pádel"],alts:["🥞 Tortitas: 100g avena + 2 huevos + 120ml leche + 1 plátano chafado en la masa, cuaja en sartén","🍌 100g avena fría overnight (leche 300ml) + 2 huevos duros aparte + 1 plátano"]},
   {steps:["Yogur en bol","Trocea las nueces por encima","Sin miel hoy: las nueces ya aportan grasas buenas"],alts:["🫐 200g yogur griego + 80g arándanos frescos o congelados + 10g semillas de chía","🧀 200g requesón + 1 manzana en dados + 15g nueces troceadas"]},
   {steps:["Pechuga sazonada, air fryer 185°C 16-18 min","Cuece 120g arroz (más cantidad que otros días por el pádel)","Judías verdes: microondas 5 min con film o hervidas 8 min","Aliña con AOVE y sal"],alts:["🐟 200g merluza air fryer 190°C 11 min + 120g arroz crudo cocido + 150g judías verdes","🍗 200g pechuga sartén con 20ml salsa de soja + 120g arroz + 100g brócoli vapor"]},
   {steps:["Tuesta las rebanadas de pan","Unta la mermelada bien repartida","Añade el plátano en rodajas encima o al lado","⏱️ Come esto 60 min antes del partido"],alts:["⚡ 1 plátano grande + 2 dátiles Medjool + vaso de agua con pizca de sal (más simple y rápido)","🍌 2 rebanadas pan integral + 20g miel + 1 plátano + 200ml zumo de naranja natural"]},
   {steps:["Post-partido: haz esto en menos de 30 min","Bate 4 huevos con sal, cuaja en sartén antiadherente","Calienta el pan (tostadora 2 min)","Abre y escurre las 2 latas de atún","Monta el plato: tortilla + atún encima + pan al lado"],alts:["🥩 4 huevos revueltos + 200g requesón + 2 rebanadas pan integral (muy rápido)","🍗 200g pechuga del meal prep (microondas 2 min) + 100g arroz + 1 huevo duro"]}],
  // VIE
  [{steps:["Tritura en bol: 80g avena + 2 huevos + 100ml leche","Calienta sartén antiadherente con spray","Vierte cucharadas grandes y cuaja 2 min por lado","Sirve con miel por encima"],alts:["🍌 Misma receta + 1 plátano chafado en la masa (añade carbos y sabor natural)","🥣 80g avena cocida con 250ml leche + 2 huevos revueltos aparte (si no tienes tiempo de tortitas)"]},
   {steps:["Parte la pera en dados","Pon el requesón en bol","Coloca la fruta encima, opcional toque de canela"],alts:["🍎 200g requesón + 1 manzana en dados + 10g miel","🫐 200g requesón + 80g arándanos frescos + 15g nueces troceadas"]},
   {steps:["Calienta las alubias del bote en sartén con ajo y AOVE 3 min","Añade las salchichas cortadas en rodajas, saltea 5 min","Incorpora el arroz cocido y mezcla bien","Salpimenta al gusto"],alts:["🫘 400g alubias + 2 salchichas de pavo (menos grasa que pollo) + 60g arroz cocido","🍲 400g alubias + 80g tomate frito + 1 huevo escalfado encima (sin arroz, más ligero)"]},
   {steps:["Calienta la leche y disuelve el cacao removiendo bien","Tuesta el pan y unta la mantequilla","Acompañar juntos"],alts:["☕ 250ml café con leche + 2 tostadas con 10ml AOVE y tomate rallado (más salado)","🍫 300ml leche fría + 15g cacao + 2 onzas 70% chocolate negro (20g) sin tostar"]},
   {steps:["Cuece la pasta al dente","Escurre y añade las sardinas desmigadas con su aceite","Ralla tomate fresco encima o usa tomate de bote","Remueve y sirve"],alts:["🐟 80g pasta + 1 lata caballa en aceite 115g + 40g pesto de bote","🍝 80g pasta + 1 lata atún 80g + 40g aceitunas negras + 80g tomates cherry + AOVE"]}],
  // SÁB
  [{steps:["Calienta sartén con spray a fuego vivo","Fríe los 3 huevos (o revuélvelos si prefieres)","Tuesta el pan mientras tanto","Exprime las 2 naranjas en vaso"],alts:["🧆 3 huevos revueltos + 150g champiñones laminados salteados con ajo + 2 tostadas pan","🥚 3 huevos revueltos + 30g queso rallado + 60g jamón york + 2 tostadas + zumo 1 naranja"]},
   {steps:["Vierte el yogur en bol","Añade la avena cruda directamente (sin cocer)","Coloca el plátano en rodajas encima"],alts:["🥣 200g yogur griego + 40g avena cocida con 150ml leche + 1 plátano encima","🍌 200g yogur griego + 30g granola tostada + 10g miel (sustituye la avena cruda por granola)"]},
   {steps:["Sazona contramuslos con sal, ajo y pimentón","Air fryer 185°C · 22 min · da vuelta a mitad","Patatas en dados con spray y sal, 200°C 18 min (pon 4 min antes que el pollo)","Ensalada verde de guarnición"],alts:["🍗 300g muslos (misma receta exacta) + 200g patatas dados + ensalada","🥩 250g secreto ibérico air fryer 200°C 10 min + 200g patatas dados + lechuga tomate"]},
   {steps:["Calienta la leche y disuelve el cacao","Añade el plátano en rodajas o bátelo todo junto","Servir frío o caliente"],alts:["🍌 150g yogur griego + 1 plátano + 15g cacao + 100ml leche, batido con batidora","☕ 250ml café con leche + 1 plátano entero + 20g nueces (snack sólido)"]},
   {steps:["Sofríe la carne picada con ajo en sartén 8 min","Añade el tomate frito y el orégano, cuece 5 min","Cuece los macarrones al dente según paquete","Mezcla pasta con la salsa y sirve"],alts:["🍝 100g macarrones + 2 latas atún 80g + 80g tomate frito + orégano (sin carne, listo en 12 min)","🍖 100g macarrones + 150g pollo del meal prep desmigado + 80g tomate frito + 20g queso"]}],
  // DOM
  [{steps:["Calienta la leche 2 min","Añade la avena y deja reposar 2 min","Haz los huevos revueltos en sartén","Añade la miel por encima de la avena"],alts:["🥞 Tortitas: 80g avena + 2 huevos + 100ml leche + 10g miel encima (receta viernes)","🍳 2 tostadas pan integral + 20g mantequilla de cacahuete + 2 huevos duros (12 min cocción)"]},
   {steps:["Coge 2 piezas de fruta de temporada (lo que tengas)","Trocea y pon en bol","Añade las nueces al lado"],alts:["🍓 200g yogur griego + 150g fruta variada troceada + 20g nueces (más proteína)","🥭 300ml leche + 150g fruta variada + 15g cacao, batido (si no tienes mucha hambre)"]},
   {steps:["Sofríe el pollo troceado con ajo y pimiento 5 min","Añade el tomate y el caldo, sube fuego hasta que hierva","Añade el arroz crudo, baja a fuego medio","Tapa y cuece 18 min hasta que absorba el caldo"],alts:["🍲 200g gambas peladas congeladas (descongelar) mismo proceso que el pollo + 100g arroz crudo","🫘 150g lentejas secas cocidas (30 min) + 100g arroz crudo + ½ pimiento + tomate (sin proteína animal)"]},
   {steps:["Yogur en bol","Añade rodajas de plátano","Miel por encima"],alts:["🧀 200g requesón + 1 plátano en rodajas + 15g cacao puro (sin miel)","🍌 200g yogur griego + 1 plátano + 2 dátiles Medjool troceados + 15g nueces"]},
   {steps:["Extiende tomate frito sobre las tortillas","Añade la mozzarella rallada o en lonchas","Coloca el atún escurrido encima","Air fryer 180°C · 7-8 min · vigila que no se queme el borde"],alts:["🍕 2 tortillas trigo + 60g tomate frito + 80g mozzarella + 80g pavo fiambre (sin atún)","🧇 2 tortillas trigo + 150g pollo del meal prep desmigado + 40g queso rallado + 50g tomate frito, enrollar y air fryer 180°C 5 min"]}],
];
const MEAL_M = [
  {kcal:598,p:30,c:80,f:18},{kcal:308,p:20,c:30,f:12},
  {kcal:893,p:45,c:120,f:25},{kcal:475,p:25,c:60,f:15},{kcal:582,p:30,c:75,f:18},
];
const TARGET = {kcal:2856,p:150,c:365,f:88};
const TIPO_META = {
  train:{label:"Entrenamiento",bg:"#dcfce7",fg:"#166534"},
  rest: {label:"Descanso",    bg:"#f3f4f6",fg:"#4b5563"},
  padel:{label:"Pádel",       bg:"#ede9fe",fg:"#5b21b6"},
  prep: {label:"Meal Prep 🍳",bg:"#fef3c7",fg:"#92400e"},
};
const SHOP_MENSUAL = [{
  cat:"Despensa · compra 1 vez al mes",
  items:[
    {n:"Aceite de oliva virgen extra",q:"2 L",p:"~€8,00"},
    {n:"Arroz blanco",q:"3 kg",p:"~€3,60"},
    {n:"Pasta / macarrones",q:"3 kg",p:"~€3,00"},
    {n:"Avena en copos",q:"1,5 kg",p:"~€3,90"},
    {n:"Atún al natural (latas 80g)",q:"30 latas",p:"~€18,00"},
    {n:"Sardinas en aceite (latas)",q:"8 latas",p:"~€7,20"},
    {n:"Lentejas cocidas (bote 400g)",q:"8 botes",p:"~€6,40"},
    {n:"Alubias cocidas (bote 400g)",q:"4 botes",p:"~€3,60"},
    {n:"Tomate frito (bote)",q:"6 uds",p:"~€4,80"},
    {n:"Cacao puro en polvo",q:"500 g",p:"~€5,00"},
    {n:"Miel",q:"500 g",p:"~€4,00"},
    {n:"Mermelada",q:"2 botes",p:"~€3,00"},
    {n:"Nueces (envasadas al vacío)",q:"500 g",p:"~€7,50"},
    {n:"Tortillas de trigo",q:"2 packs",p:"~€2,40"},
    {n:"Sal, orégano, pimentón, ajo polvo",q:"surtido",p:"~€3,00"},
  ]
}];
const SHOP_SEMANAL = [
  {cat:"Proteínas · renovar cada semana",items:[
    {n:"Pechugas de pollo",q:"1,5 kg",p:"~€6,00"},
    {n:"Contramuslos / muslos",q:"700 g",p:"~€2,50"},
    {n:"Huevos L",q:"18 uds",p:"~€3,50"},
    {n:"Merluza congelada / fresca",q:"400 g",p:"~€3,00"},
    {n:"Carne picada mixta",q:"300 g",p:"~€3,00"},
    {n:"Salchichas de pollo",q:"1 pack",p:"~€2,00"},
    {n:"Pechuga pavo fiambre",q:"150 g",p:"~€1,80"},
  ]},
  {cat:"Lácteos · renovar cada semana",items:[
    {n:"Leche entera",q:"4 L",p:"~€3,60"},
    {n:"Yogur griego natural",q:"6 × 200 g",p:"~€4,00"},
    {n:"Requesón / queso fresco",q:"400 g",p:"~€2,50"},
    {n:"Mozzarella (bola)",q:"125 g",p:"~€1,30"},
    {n:"Queso rallado",q:"100 g",p:"~€1,20"},
    {n:"Mantequilla",q:"125 g",p:"~€1,20"},
  ]},
  {cat:"Fruta y verdura · renovar cada semana",items:[
    {n:"Plátanos",q:"~1,5 kg",p:"~€1,50"},
    {n:"Naranjas",q:"1,5 kg",p:"~€1,80"},
    {n:"Manzanas / peras",q:"4–6 uds",p:"~€1,50"},
    {n:"Brócoli",q:"1 ud",p:"~€1,20"},
    {n:"Pimientos (rojo/verde)",q:"3 uds",p:"~€1,50"},
    {n:"Tomates",q:"500 g",p:"~€1,20"},
    {n:"Judías verdes",q:"200 g",p:"~€1,00"},
    {n:"Patatas",q:"2 kg",p:"~€1,80"},
  ]},
  {cat:"Pan · renovar cada semana",items:[
    {n:"Pan integral de molde",q:"1 bolsa",p:"~€1,80"},
  ]},
];
const AF_TIMES = [
  {f:"Pechuga (200g)",t:"185°C",m:"16–18 min",tip:"Da la vuelta a mitad"},
  {f:"Muslos / contramuslos",t:"180°C",m:"20–22 min",tip:"Con piel: queda crujiente"},
  {f:"Merluza / pescado",t:"190°C",m:"10–12 min",tip:"Sin voltear"},
  {f:"Patatas (dados)",t:"200°C",m:"18–20 min",tip:"Remoja 10 min antes"},
  {f:"Brócoli / verdura",t:"180°C",m:"10–12 min",tip:"Spray aceite + sal"},
  {f:"Pizza tortilla",t:"180°C",m:"7–8 min",tip:"Vigila que no se queme"},
];
const PREP_STEPS = [
  ["Arroz (1 kg) a cocer","20 min"],
  ["Air fryer: 600g pechuga + 400g muslos 180°C","22 min"],
  ["Hierve 6 huevos duros mientras tanto","12 min"],
  ["Hierve 500g de pasta con sal","10 min"],
  ["Abre botes de lentejas y alubias (lista para la semana)","0 min"],
];
const TIPS = [
  "Sin subida de peso en 2 semanas → añade 100–150 kcal en carbos",
  "Pésate cada lunes en ayunas, mismo horario siempre",
  "El meal prep del domingo cubre 4–5 días de almuerzos",
  "Si fallas un día → no recuperes, sigue el plan normal",
  "Pre-pádel: come 60 min antes para no ir lleno al partido",
];

// Storage shim: usa localStorage en producción (web) o window.storage si existe (Claude artifacts)
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
function getCurrentWeekIdx() {
  const now = new Date();
  for (let i = WEEKS_META.length-1; i >= 0; i--)
    if (now >= WEEKS_META[i].start) return Math.min(i, WEEKS_META.length-1);
  return 0;
}
function getCurrentDayIdx() {
  const wi = getCurrentWeekIdx();
  const diff = Math.floor((new Date() - WEEKS_META[wi].start) / 86400000);
  return Math.max(0, Math.min(6, diff));
}
function getDays(weekIdx) {
  const start = WEEKS_META[weekIdx].start;
  return SHORTS.map((short,i) => {
    const d = new Date(start); d.setDate(d.getDate()+i);
    return {short, date:fmtDate(d), tipo:TIPOS[i], meals:MEAL_TPLS[i]};
  });
}
function calcSums(wi,di,completed) {
  return MEAL_M.reduce((a,m,i) => {
    if (completed.has(`${wi}-${di}-${i}`)) { a.kcal+=m.kcal; a.p+=m.p; a.c+=m.c; a.f+=m.f; }
    return a;
  }, {kcal:0,p:0,c:0,f:0});
}
// ─── Meal Info Modal ──────────────────────────────────────────────────────────
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
        <circle cx="26" cy="26" r={R} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={C} strokeDashoffset={C*(1-pct)} strokeLinecap="round" transform="rotate(-90 26 26)"/>
        <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>{val}</text>
      </svg>
      <div style={{fontSize:10,color:"#9ca3af",textAlign:"center",lineHeight:1.3}}>
        <span style={{color:"#374151",fontWeight:600}}>{label}</span><br/>{target}g
      </div>
    </div>
  );
}
function MacroPanel({wi,di,completed}) {
  const s = calcSums(wi,di,completed);
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
        <Ring val={s.p} target={TARGET.p} color={G[600]}  label="Proteína"/>
        <Ring val={s.c} target={TARGET.c} color="#7c3aed" label="Carbos"/>
        <Ring val={s.f} target={TARGET.f} color="#f59e0b" label="Grasas"/>
      </div>
    </div>
  );
}
function MealRow({meal, mi, wi, di, completed, toggleMeal, onInfo}) {
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
function WeekPills({weekIdx,setWeekIdx}) {
  const curW = getCurrentWeekIdx();
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
function DayPills({wi,selDay,setSelDay,completed}) {
  const days=getDays(wi), curW=getCurrentWeekIdx(), curD=getCurrentDayIdx();
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
function MealList({wi, di, completed, toggleMeal}) {
  const [modalMi, setModalMi] = useState(null);
  const day = getDays(wi)[di];
  const info = MEAL_INFO[di];
  return (
    <>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:".07em",textTransform:"uppercase",color:"#9ca3af",marginBottom:8}}>Toca ✓ para marcar · ⓘ para ver elaboración</div>
      <div style={card}>
        {day.meals.map((m,i) => (
          <MealRow key={i} meal={m} mi={i} wi={wi} di={di} completed={completed} toggleMeal={toggleMeal} onInfo={setModalMi}/>
        ))}
      </div>
      <InfoModal
        meal={modalMi !== null ? day.meals[modalMi] : null}
        info={modalMi !== null ? info[modalMi] : null}
        onClose={() => setModalMi(null)}
      />
    </>
  );
}
function TodayView({completed, toggleMeal}) {
  const curWi=getCurrentWeekIdx(), curDi=getCurrentDayIdx();
  const totalDays = WEEKS_META.length * 7;
  const [flatIdx, setFlatIdx] = useState(curWi*7 + curDi);
  const wi = Math.floor(flatIdx/7), di = flatIdx%7;
  const day=getDays(wi)[di], meta=TIPO_META[day.tipo];
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
      <MacroPanel wi={wi} di={di} completed={completed}/>
      <MealList wi={wi} di={di} completed={completed} toggleMeal={toggleMeal}/>
    </div>
  );
}
function WeekView({completed, toggleMeal}) {
  const curW=getCurrentWeekIdx(), curD=getCurrentDayIdx();
  const [wi,setWi]=useState(curW);
  const [di,setDi]=useState(curD);
  const handleWeek = w => { setWi(w); setDi(w===curW?curD:0); };
  const days=getDays(wi), day=days[di], meta=TIPO_META[day.tipo];
  return (
    <div>
      <div style={{fontSize:20,fontWeight:800,color:"#111827",marginBottom:14}}>{WEEKS_META[wi].label} · 2026</div>
      <WeekPills weekIdx={wi} setWeekIdx={handleWeek}/>
      <div style={{fontSize:12,color:"#9ca3af",marginBottom:14}}>{WEEKS_META[wi].range}</div>
      <DayPills wi={wi} selDay={di} setSelDay={setDi} completed={completed}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:16,color:"#111827"}}>{day.date}</div>
        <span style={pill(meta.bg,meta.fg)}>{meta.label}</span>
      </div>
      <MacroPanel wi={wi} di={di} completed={completed}/>
      <MealList wi={wi} di={di} completed={completed} toggleMeal={toggleMeal}/>
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
function ShoppingView({monthCk,weekCk,toggleMonth,toggleWeek}) {
  const [selWeek,setSelWeek]=useState(getCurrentWeekIdx());
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
        <WeekPills weekIdx={selWeek} setWeekIdx={setSelWeek}/>
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
function InfoView() {
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
export default function App() {
  const [tab,setTab]         = useState("hoy");
  const [completed,setComp]  = useState(new Set());
  const [monthCk,setMonthCk] = useState(new Set());
  const [weekCk,setWeekCk]   = useState(new Set());
  const [ready,setReady]     = useState(false);
  useEffect(() => {
    (async () => {
      try { const r=await storage.get("nt_meals2"); if(r) setComp(new Set(JSON.parse(r.value))); } catch {}
      try { const r=await storage.get("nt_month");  if(r) setMonthCk(new Set(JSON.parse(r.value))); } catch {}
      try { const r=await storage.get("nt_week");   if(r) setWeekCk(new Set(JSON.parse(r.value))); } catch {}
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
  if (!ready) return <div style={{height:300,display:"flex",alignItems:"center",justifyContent:"center",color:"#9ca3af",fontSize:14,fontFamily:"system-ui,sans-serif"}}>Cargando NutriTrack...</div>;
  return (
    <div style={{fontFamily:"system-ui,-apple-system,sans-serif",maxWidth:520,margin:"0 auto",background:"#f9fafb"}}>
      <div style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"14px 16px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:"#111827",letterSpacing:"-.5px"}}>NutriTrack</div>
            <div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>73 kg · 1.86 m · Objetivo: masa muscular</div>
          </div>
          <div style={{background:G[100],borderRadius:12,padding:"8px 14px",textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:800,color:G[700],lineHeight:1}}>2.856</div>
            <div style={{fontSize:9,color:G[500],fontWeight:700,textTransform:"uppercase",letterSpacing:".05em"}}>kcal / día</div>
          </div>
        </div>
      </div>
      <div style={{padding:"16px 14px 80px"}}>
        {tab==="hoy"    && <TodayView  completed={completed} toggleMeal={toggleMeal}/>}
        {tab==="semana" && <WeekView   completed={completed} toggleMeal={toggleMeal}/>}
        {tab==="compra" && <ShoppingView monthCk={monthCk} weekCk={weekCk} toggleMonth={toggleMonth} toggleWeek={toggleWeek}/>}
        {tab==="info"   && <InfoView/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:520,zIndex:100}}>
        <NavBar tab={tab} setTab={setTab}/>
      </div>
    </div>
  );
}
