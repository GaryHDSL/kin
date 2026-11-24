import { supabase, isSupabaseConfigured, showMessage } from './supabase.js';
const form=document.getElementById('listingForm'), message=document.getElementById('listingMessage'), list=document.getElementById('agentListings');
let currentUser=null;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if(!isSupabaseConfigured){list.textContent='Connect the Supabase project to use agent listings.';showMessage(message,'Database setup is not complete.','error');}
else{
 const {data:{session}}=await supabase.auth.getSession();
 if(!session) location.replace('client-login.html');
 else{
  currentUser=session.user;document.getElementById('accountEmail').textContent=currentUser.email;
  const {data:profile,error}=await supabase.from('profiles').select('full_name,role').eq('id',currentUser.id).maybeSingle();
  if(error||profile?.role!=='agent'){document.querySelector('.agent-grid').hidden=true;list.innerHTML='<p class="muted">Your agent application is awaiting approval. You can sign in as a client while Core Webber reviews your application.</p>';document.getElementById('welcome').textContent='Agent access pending';}
  else{document.getElementById('welcome').textContent='Welcome, '+(profile.full_name||'Agent');await loadListings();}
 }
}
async function loadListings(){
 const {data,error}=await supabase.from('properties').select('id,title,listing_type,price,currency,suburb,city,status,created_at').eq('agent_id',currentUser.id).order('created_at',{ascending:false});
 if(error){list.textContent='Could not load listings: '+error.message;return;}
 const rows=data||[];document.getElementById('totalCount').textContent=rows.length;document.getElementById('reviewCount').textContent=rows.filter(x=>x.status==='pending_review').length;document.getElementById('publishedCount').textContent=rows.filter(x=>x.status==='published').length;
 list.innerHTML=rows.length?rows.map(x=>'<article class="record-item"><strong>'+esc(x.title)+'</strong><small>'+esc(x.suburb)+', '+esc(x.city)+' · '+esc(x.listing_type==='rent'?'To rent':'For sale')+' · '+esc(x.currency||'ZAR')+' '+Number(x.price||0).toLocaleString('en-ZA')+'</small><span class="status-tag">'+esc(x.status.replaceAll('_',' '))+'</span></article>').join(''):'<p class="muted">You have not posted any properties yet. Use the form to submit your first listing.</p>';
}
form.addEventListener('submit',async e=>{
 e.preventDefault();if(!currentUser)return;const d=new FormData(form);const urls=String(d.get('image_urls')||'').split(/\n|,/).map(x=>x.trim()).filter(Boolean);
 if(urls.some(url=>{try{return !['http:','https:'].includes(new URL(url).protocol)}catch{return true}})){showMessage(message,'Please enter valid http or https image URLs only.','error');return;}
 const payload={agent_id:currentUser.id,title:d.get('title'),description:d.get('description'),listing_type:d.get('listing_type'),property_type:d.get('property_type'),price:Number(d.get('price')),currency:'ZAR',address:d.get('address'),suburb:d.get('suburb'),city:d.get('city'),bedrooms:d.get('bedrooms')===''?null:Number(d.get('bedrooms')),bathrooms:d.get('bathrooms')===''?null:Number(d.get('bathrooms')),image_urls:urls,features:String(d.get('features')||'').split(',').map(x=>x.trim()).filter(Boolean),status:'pending_review'};
 showMessage(message,'Submitting your property for review…');const {error}=await supabase.from('properties').insert(payload);if(error){showMessage(message,'Could not submit listing: '+error.message,'error');return;}showMessage(message,'Listing submitted. It will appear on the public website after Core Webber approves it.','success');form.reset();await loadListings();
});
document.getElementById('signOutBtn').addEventListener('click',async()=>{if(isSupabaseConfigured)await supabase.auth.signOut();location.href='client-login.html';});