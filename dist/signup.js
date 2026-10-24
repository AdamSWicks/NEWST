const signupSection=document.querySelector('#first-access');
const signupEmbed=document.querySelector('.klaviyo-form-TCY79p');
const signupStatus=document.querySelector('#signup-status');
let signupStarted=false;
function loadSignup(){
  if(signupStarted)return;
  signupStarted=true;
  const observer=new MutationObserver(()=>{
    if(signupEmbed.querySelector('input,form')){signupStatus.hidden=true;observer.disconnect();}
  });
  observer.observe(signupEmbed,{childList:true,subtree:true});
  const script=document.createElement('script');
  script.async=true;
  script.src='https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=YtHtHL';
  script.onerror=()=>{signupStatus.hidden=false;signupStatus.textContent='The signup form could not load. Please refresh the page and try again.';};
  document.body.appendChild(script);
}
document.querySelector('.hero-actions a[href="#first-access"]').addEventListener('click',loadSignup);
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)){loadSignup();observer.disconnect();}
  },{rootMargin:'200px'});
  observer.observe(signupSection);
}else loadSignup();
if(location.hash==='#first-access')loadSignup();
