var i,o=(t,s)=>{var e=t.indexOf(s);return[t[m](0,e),t[m](e+s[y])]},r=r=>(t,s)=>{var e;if(!r.t||!r.t(t,s))return(e=n(s)instanceof String?r.i&&r.i(t,s):r.h&&r.h(t,s))!==i?e:r.u?r.u(t,s):(e=t[s])instanceof Function?e.bind(t):e},t=!!globalThis.window,s=t=>"http://localhost:"+(t??9801),e=t?location.origin:s(process.env.PORT),M=/^\w+:\/\/localhost/.test(e)?O:T,n=Object,h=Proxy,a=n.assign,_="\r\n",u="Get_Supported_Events",l="Has_Event",c="get_supported_events",g="has_event",f="get_simple_caller_of_event",v="trivial_clone",p="default_info",d="default_security_level",w="sstp_version_table",m="substring",y="length",b="entries",S="proxy",E="then",O="local",T="external",x="";class N{get keys(){return n.keys(this)}get values(){return n.values(this)}get[b](){return n[b](this)}get[y](){return this.keys[y]}forEach(e){return this[b].forEach(([t,s])=>{this[t]=e(s,t)??s})}get[v](){return a(P(),this)}flat_map(e){let r=[];return this[b].map(([t,s])=>r.push(...s instanceof N?s.flat_map(e.bind(e,t)):[e(t,s)])),r}map(e){return this[b].map(([t,s])=>e(s,t))}push(t){return t.forEach(t=>t?this[t[0]]=t[1]:i),this}}var P=()=>new N;class C extends N{#t;#h;constructor(t,s,e={}){super(),this.#t=x+t,e[y]&&(this.#h=e),a(this,s)}get unknown_lines(){return this.#h||[]}get head(){return this.#t}toString(){return[this.#t,...this.unknown_lines,...this[b].map(([t,s])=>t+": "+s),x,x].join(_)}to_string(){return x+this}toJSON(){return{head:this.#t,unknown_lines:this.#h,body:this[v]}}get status_code(){return+this.#t.split(" ").find(t=>(t=+t)==t)}}var j="X-SSTP-PassThru-";class k extends C{constructor(t,s,e={}){return super(t,s,e),new h(this,{get:r({i:(t,s)=>j+s in t?t.get_passthrough(s):i})})}static from_string(t){let s,[e,...r]=t.split(_),i={},n=[];r[y]-=2;for(var h of r){var[a,u]=o(h,": ");/^\w[^\s]*$/.test(a)?i[s=a]=u:s?i[s]+=_+h:n.push(h)}return new k(e,i,n)}get_passthrough(t){return this[j+t]}#u;get passthroughs(){return this.#u??=P().push(this.map((t,s)=>s.startsWith(j)?[s.slice(16),t]:i))}get raw(){return this}}class q extends C{constructor(t){var s,e,r,i,[t,...n]=t.split(_);super(t,{});for(s of n)s&&([r,e]=o(s,""),[r,i]=o(r,"."),(this[r]||=P())[i]=e)}get_uuid_by(s,e){return this.uuids.find(t=>this[t][s]==e)}get_list_of(s){return this.uuids.map(t=>this[t][s])}get uuids(){return this.keys}get available(){return!!this[y]}toString(){return[this.head,x,...this.flat_map((t,s,e)=>t+"."+s+""+e),x,x].join(_)}toJSON(){return{head:this.head,fmo_infos:this[v]}}}class F{#o;#_;#l;#g;#v;constructor(t){this.#o=t,this[d]=t[d]}async check_event(t,s=this[d]){return this.#l?this.#g[s].includes(t):!!this.#_&&(this.#v[s][t]??=await this.#o[g](t))}get available(){return this.#_}get fast_query_available(){return this.#l}reset(){return this.clear(),this.init()}async init(){var t=this.#o;return this.#_=await t[g](l),this.#l=this.#_&&await t[g](u),this.#l&&(this.#g=await t[c]()),this}clear(){this.#_=this.#l=!1,this.#v={[O]:{},[T]:{}}}}var G="SEND";class I{#p;constructor(t,s){return this.RequestHeader={Origin:e},this[p]={Charset:"UTF-8"},this.host=s,this.sendername=t,this[w]={SEND:1.4,NOTIFY:1.1,COMMUNICATE:1.1,EXECUTE:1.2,GIVE:1.1},this[d]=M,this[S]=new h(this,{get:r({i:(t,s)=>s in t[w]?t.get_caller_of_method(s):/^On/.test(s)?t[f]("_"==(t=s)[2]?t[m](3):t):i})})}set host(t){this.#p=t||s()+"/api/sstp/v1"}get host(){return this.#p}set sendername(t){this[p].Sender=t||"jsstp-client"}get sendername(){return this[p].Sender}row_send(t){return new Promise((s,e)=>fetch(this.#p,{method:"POST",headers:this.RequestHeader,body:x+t})[E](t=>200!=t.status?e(t.status):t.text()[E](s)).catch(e))}costom_text_send(t,s){return this.row_send(new k(t,{...this[p],...s}))}costom_send(t,s){return this.costom_text_send(t,s)[E](t=>k.from_string(t))}get_caller_of_method(t){let s=t+" SSTP/"+this[w][t];return a(t=>this.costom_send(s,t),{get_raw:t=>this.costom_text_send(s,t)})}get_caller_of_event(s,e=G){return t=>this[S][e](a({Event:s},t))}[f](r,i=G){return(...t)=>{let s=0,e={};return t.forEach(t=>e["Reference"+s++]=t),this.get_caller_of_event(r,i)(e)}}get event(){return new h({},{get:(t,s)=>this[f](s)})}[g](t,s=this[d]){return this.event[l](t,s)[E](({Result:t})=>1==t)}[c](){return this.event[u]()[E](({[O]:t,[T]:s})=>({[O]:(t||x).split(","),[T]:(s||x).split(",")}))}get_fmo_infos(){return this[S].EXECUTE.get_raw({Command:"GetFMO"})[E](t=>new q(t))}available(){return this.get_fmo_infos()[E](t=>t.available).catch(()=>!1)}new_event_queryer(){return new F(this).init()}}a(I.prototype,{type:I,base_sstp_info_t:C,sstp_info_t:k,fmo_info_t:q,ghost_events_queryer_t:F}),t=new I;export{C as base_sstp_info_t,t as default,q as fmo_info_t,F as ghost_events_queryer_t,t as jsstp,I as jsstp_t,k as sstp_info_t}
