const products=[
{name:'Foundation Tee',type:'Contoured jersey construction · 220–240 GSM',price:75,colours:['Black','White','Tan'],description:'A clean shoulder. A lightly tapered body. An everyday foundation designed around a considered fit.',fabric:'220–240gsm cotton jersey development specification.',fit:'Fitted / athletic. Final measurements to follow sample approval.'},
{name:'Foundry Crew',type:'Structured loopback construction · 400 GSM',price:150,colours:['Black','White','Tan'],description:'A substantial everyday layer with structured shoulders, a clean body and discreet chest branding.',fabric:'Approximately 400gsm cotton loopback development specification.',fit:'Regular-athletic. Final measurements to follow sample approval.'},
{name:'Standard Hoodie',type:'Engineered double-layer hood · 450 GSM',price:160,colours:['Black','White','Tan'],description:'Considered weight and a controlled silhouette. A shaped double-layer hood without dangling drawstrings.',fabric:'Approximately 450gsm development specification.',fit:'Structured with a clean torso. Final measurements to follow sample approval.'},
{name:'Weatherproof Jacket',type:'Articulated technical shell · Matte finish',price:600,colours:['Black','White','Tan'],description:'A tailored technical layer with a protective hood and a quiet matte finish. Weather protection is being developed through material and construction testing.',fabric:'Technical shell system in development. Performance ratings are not yet validated.',fit:'Tailored with room for layering. Final measurements to follow sample approval.'},
{name:'Workshop Denim',type:'Reinforced straight-taper denim · 13–14 OZ',price:180,colours:['Black','Stonewash'],description:'A comfortable thigh and a controlled taper. Considered pocket geometry, reinforced details and restrained rear branding.',fabric:'13–14oz denim development specification.',fit:'Straight-taper. Final measurements to follow sample approval.'}
];
const imageNames=['tee','crew','hoodie','jacket','denim'];
const selection=products.map(()=>({colour:'Black',version:0,pending:null,error:''}));
const imageFor=(i,c)=>`assets/${imageNames[i]}${c==='Black'?'':'-'+c.toLowerCase()}.png`;
const altFor=(i,c)=>`${products[i].name} in ${c.toLowerCase()} — editorial concept mockup`;
const swatches=(i,context)=>`<div class="colour-selector" role="group" aria-label="${products[i].name} colour${context==='detail'?' in product details':''}">${products[i].colours.map(c=>`<button type="button" class="colour-button" data-colour="${c}" data-colour-product="${i}" aria-label="${c}" aria-pressed="${selection[i].colour===c}" title="${c}"><span class="swatch ${c.toLowerCase()}" aria-hidden="true"></span></button>`).join('')}</div><span class="selected-colour" data-colour-label="${i}" aria-live="polite">${selection[i].colour}</span>`;
document.querySelector('#products').innerHTML=products.map((p,i)=>`<article class="product-card" data-card="${i}"><button type="button" class="product-photo" data-open-product="${i}" aria-haspopup="dialog" aria-label="View ${p.name} details"><img data-product-image="${i}" src="${imageFor(i,'Black')}" alt="${altFor(i,'Black')}" loading="lazy" width="1086" height="1448"><span class="photo-index">001 / 0${i+1}</span><span class="photo-action" aria-hidden="true">↗</span></button><div class="product-card-copy"><h3 class="product-name">${p.name}</h3><span class="product-type">${p.type}</span><div class="product-card-bottom"><div class="colour-control">${swatches(i,'card')}</div><button type="button" class="explore-label" data-open-product="${i}" aria-haspopup="dialog" aria-label="Explore ${p.name}">Explore piece <span aria-hidden="true">↗</span></button></div></div></article>`).join('');

const dialog=document.querySelector('dialog');
let trigger,openProduct=null;
const imageCache=new Map();
function loadImage(src){
  if(!imageCache.has(src))imageCache.set(src,new Promise((resolve,reject)=>{
    const image=new Image();image.onload=()=>resolve();image.onerror=()=>{imageCache.delete(src);reject(new Error('Image unavailable'))};image.src=src;
  }));
  return imageCache.get(src);
}
function syncColour(i){
  const state=selection[i];
  document.querySelectorAll(`[data-product-image="${i}"]`).forEach(image=>{
    const src=imageFor(i,state.colour);if(image.getAttribute('src')!==src)image.src=src;
    image.alt=altFor(i,state.colour);image.setAttribute('aria-busy',String(Boolean(state.pending)));
  });
  document.querySelectorAll(`[data-colour-product="${i}"]`).forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.colour===state.colour)));
  document.querySelectorAll(`[data-colour-label="${i}"]`).forEach(label=>{label.textContent=state.pending?`Loading ${state.pending.toLowerCase()}…`:state.error||state.colour;});
}
async function selectColour(i,colour){
  if(!products[i]?.colours.includes(colour))return;
  const state=selection[i],version=++state.version;
  state.pending=colour;state.error='';syncColour(i);
  try{await loadImage(imageFor(i,colour));if(version!==state.version)return;state.colour=colour;state.pending=null;syncColour(i);}
  catch(error){if(version!==state.version)return;state.pending=null;state.error=`${colour} image unavailable. Please try again.`;syncColour(i);}
}
function openDetails(i,button){
  trigger=button;openProduct=i;const p=products[i],state=selection[i];
  document.querySelector('#product-detail').innerHTML=`<p class="eyebrow">Collection 001 / In development</p><h2 id="product-title">${p.name}</h2><p class="detail-price">£${p.price}</p><img class="detail-image" data-product-image="${i}" src="${imageFor(i,state.colour)}" alt="${altFor(i,state.colour)}"><div class="detail-colours">${swatches(i,'detail')}</div><p>${p.description}</p><p><strong>Fabric direction</strong><br>${p.fabric}</p><p><strong>Fit direction</strong><br>${p.fit}</p><p class="detail-note">Concept imagery. This piece is in development and is not yet available to order. Final materials, fit and manufacturing details will be confirmed after sampling. Colour swatches are illustrative.</p>`;
  syncColour(i);dialog.showModal();
}
document.addEventListener('click',event=>{
  const colour=event.target.closest('[data-colour-product]');
  if(colour){selectColour(Number(colour.dataset.colourProduct),colour.dataset.colour);return;}
  const open=event.target.closest('[data-open-product]');if(open)openDetails(Number(open.dataset.openProduct),open);
});
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog.addEventListener('close',()=>{openProduct=null;trigger?.focus()});
