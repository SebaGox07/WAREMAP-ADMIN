(()=>{'use strict';
const $=id=>document.getElementById(id), cfg=window.WAREMAP_CONFIG||{};
let token='',data=[],active='',busy=false;
const apiBase=(cfg.url||'').replace(/\/$/,'');
const configured=/^https:\/\/[^/]+\.supabase\.co$/.test(apiBase)&&cfg.publishableKey&&!cfg.publishableKey.startsWith('REEMPLAZAR_');
const html=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function message(id,txt,ok=false){$(id).textContent=txt;$(id).classList.toggle('ok',ok)}
async function call(path,{method='GET',body,auth=true}={}){
 const headers={'apikey':cfg.publishableKey,Accept:'application/json'};
 if(body!==undefined)headers['Content-Type']='application/json';
 if(auth&&token)headers.Authorization=`Bearer ${token}`;
 const res=await fetch(apiBase+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'});
 if(!res.ok){const txt=await res.text();let msg;try{const e=JSON.parse(txt);msg=e.message||e.msg||e.error_description||txt}catch{msg=txt}throw new Error(`${res.status}: ${msg}`)}
 return res.status===204?null:res.json();
}
function setLogged(flag){$('loginView').hidden=flag;$('appView').hidden=!flag;$('logout').hidden=!flag;$('status').textContent=flag?'Administrador conectado':'Sin conexión'}
async function load(){if(!token)return;try{data=await call('/rest/v1/ubicaciones?select=codigo,rack,nivel,posicion,tipo3d,productos&order=codigo.asc&limit=200');if(!Array.isArray(data)||data.length!==105)throw new Error('Se esperaban 105 ubicaciones; la consulta devolvió '+(data.length||0));render();if(active)choose(active);$('status').textContent='● Datos online'}catch(e){$('status').textContent='⚠ Error de consulta';message('saveMsg','Error al cargar: '+e.message)}}
function render(){const used=data.filter(x=>Array.isArray(x.productos)&&x.productos.length).length;$('total').textContent=data.length;$('used').textContent=used;$('free').textContent=data.length-used;
 const term=$('search').value.trim().toLowerCase();const map=new Map(data.map(x=>[x.codigo,x]));let out='';
 for(let r=1;r<=5;r++){out+=`<section class="rack"><h3>RACK ${String(r).padStart(2,'0')}</h3>`;
 for(let n=3;n>=1;n--){out+=`<div class="rack-row"><span class="level">N${n}</span>`;
 for(let p=1;p<=7;p++){const code=`R${String(r).padStart(2,'0')}-N${n}-P${String(p).padStart(2,'0')}`,u=map.get(code);const has=!!(u&&u.productos&&u.productos.length);const matches=!term||(code+' '+(u?.productos||[]).map(x=>`${x.nombre} ${x.sku}`).join(' ')).toLowerCase().includes(term);out+=`<button type="button" data-code="${code}" class="slot ${has?'occupied':''} ${code===active?'active':''} ${matches?'':'dim'}" title="${html(code+' · '+(u?.productos||[]).map(x=>x.nombre).join(', '))}">${p}</button>`}
 out+='</div>'}out+='</section>'}
 $('map').innerHTML=out;
 $('map').querySelectorAll('[data-code]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.code)));
}
function choose(code){active=code;const u=data.find(x=>x.codigo===code);if(!u)return;renderSelection();$('locationName').textContent=`RACK ${Number(u.rack.slice(1))} · NIVEL ${u.nivel} · POSICIÓN ${u.posicion}`;$('locationState').textContent=u.productos.length?'Ocupada':'Vacía';$('editorInfo').textContent=code;$('editForm').hidden=false;$('tipo').value=u.productos.length?u.tipo3d:'vacio';$('products').innerHTML='';(u.productos||[]).forEach(addProduct);message('saveMsg','');updateFields()}
function renderSelection(){$('map').querySelectorAll('.slot').forEach(b=>b.classList.toggle('active',b.dataset.code===active))}
function addProduct(p={}){const div=document.createElement('div');div.className='product';div.innerHTML=`<div class="product-head"><span>Producto</span><button type="button" class="danger remove">Eliminar</button></div><div class="product-grid"><label>Código / SKU<input class="sku" maxlength="80" required value="${html(p.sku||'')}"></label><label>Cantidad<input class="qty" type="number" min="0" step="any" required value="${html(p.cantidad??'')}"></label><label class="wide">Nombre<input class="name" maxlength="150" required value="${html(p.nombre||'')}"></label><label class="wide">Unidad<input class="unit" maxlength="25" required value="${html(p.unidad||'Kg')}"></label></div>`;div.querySelector('.remove').onclick=()=>{div.remove();updateFields()};$('products').append(div);updateFields()}
function updateFields(){const n=$('products').children.length;if($('tipo').value==='vacio'&&n){$('tipo').value='big_bag'}if(!n){$('tipo').value='vacio'}}
$('tipo').addEventListener('change',()=>{if($('tipo').value==='vacio'&&$('products').children.length){if(confirm('Esta opción quitará todos los productos de la ubicación. ¿Continuar?'))$('products').innerHTML='';else $('tipo').value='big_bag'}if($('tipo').value!=='vacio'&&!$('products').children.length)addProduct()});
$('addProduct').onclick=()=>{if($('tipo').value==='vacio')$('tipo').value='big_bag';addProduct()};
$('empty').onclick=()=>{if(!active)return;if(!confirm(`¿Liberar ${active}? Se quitarán todos sus productos.`))return;$('tipo').value='vacio';$('products').innerHTML='';message('saveMsg','Haz clic en Guardar cambios para confirmar.')} ;
$('editForm').addEventListener('submit',async e=>{e.preventDefault();if(busy||!active)return;const products=[...$('products').children].map(el=>({sku:el.querySelector('.sku').value.trim(),nombre:el.querySelector('.name').value.trim(),cantidad:Number(el.querySelector('.qty').value),unidad:el.querySelector('.unit').value.trim()}));const tipo=products.length?$('tipo').value:'vacio';if(products.length&&tipo==='vacio')return message('saveMsg','Selecciona un tipo de almacenamiento.');if(products.some(p=>!p.sku||!p.nombre||!p.unidad||!Number.isFinite(p.cantidad)||p.cantidad<0))return message('saveMsg','Completa todos los campos con cantidades válidas.');busy=true;$('save').disabled=true;message('saveMsg','Guardando...');try{const key=active;await call(`/rest/v1/ubicaciones?codigo=eq.${encodeURIComponent(key)}`,{method:'PATCH',body:{tipo3d:tipo,productos:products}});await load();choose(key);message('saveMsg','Cambios guardados. WAREMAP los mostrará en su siguiente actualización.',true)}catch(err){message('saveMsg','No se pudo guardar: '+err.message)}finally{busy=false;$('save').disabled=false}});
$('loginForm').addEventListener('submit',async e=>{e.preventDefault();if(!configured)return message('loginMsg','Configura primero config.js con la URL y la clave pública de Supabase.');message('loginMsg','Verificando acceso...');try{const result=await call('/auth/v1/token?grant_type=password',{method:'POST',body:{email:$('email').value.trim(),password:$('password').value},auth:false});token=result.access_token;const admins=await call('/rest/v1/ubicaciones?select=codigo&limit=1');if(!Array.isArray(admins)||admins.length!==1)throw new Error('Este usuario no tiene permiso para administrar WAREMAP. Verifica el UUID en waremap_admins y las políticas RLS.');$('password').value='';setLogged(true);await load()}catch(err){token='';setLogged(false);message('loginMsg','Acceso rechazado: '+err.message)}});
$('logout').onclick=()=>{token='';data=[];active='';setLogged(false);message('loginMsg','Sesión cerrada.',true)};
$('refresh').onclick=load;$('search').addEventListener('input',render);
if(!configured)message('loginMsg','Falta configurar config.js. Consulta el README.');
})();
