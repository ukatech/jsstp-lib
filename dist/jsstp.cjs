var t,r=Object,i=Proxy,n=r.assign,h="\r\n",o=t=>t.toLowerCase(),u="Get_Supported_Events",a="Has_Event",_=o(u),l=o(a),c="get_simple_caller_of_event",g="trivial_clone",f="default_info",p="default_security_level",d="sstp_version_table",v="substring",w="length",y="available",m="split",b="entries",S="costom_text_send",x="forEach",E="get_caller_of_method",O="unknown_lines",T="get_caller_of_event",k="sendername",C="proxy",N="constructor",P="then",$="prototype",q="SEND",j="get_fmo_infos",F="get_passthrough",G="flat_map",I="RequestHeader",M="check_event",R="from_string",U="ghost_info",H="",X=H[N],A=o[N],D=0[N],V="X-SSTP-PassThru-",Y=(t,e)=>{var s=t.indexOf(e);return[t[v](0,s),t[v](s+e[w])]},z=(t,e)=>r(t)instanceof e,B=(t,e,s)=>(t[e]=s,1),K=(e,s,r)=>{return new i(e,n({get:(h=s,(e,s)=>{var r;if(!h.t?.(e,s))return(r=z(s,X)?h.i?.(e,s):h.h?.(e,s))!==t?r:h.u?h.u(e,s):z(r=e[s],A)?r.bind(e):r}),set:B},r));var h};class L extends A{constructor(t){return r.setPrototypeOf(t,new.target[$])}}var Q=t=>{throw t},W=t=>"http://localhost:"+(t??9801),Z=globalThis.window?location.origin:W(process.env.PORT),tt=/^\w+:\/\/localhost/.test(Z)?"local":"external",et=t=>n({},t);class st{constructor(t){n(this,t)}get keys(){return r.keys(this)}get values(){return r.values(this)}get[b](){return r[b](this)}get[w](){return this.keys[w]}[x](t){this[b][x](([e,s])=>{this[e]=t(s,e)??s})}get[g](){return n(rt(),this)}[G](t){let e=[];return this[b].map(([s,r])=>e.push(...z(r,st)?r[G](t.bind(t,s)):[t(s,r)])),e}map(t){return this[b].map(([e,s])=>t(s,e))}push(e){return e[x](e=>e?this[e[0]]=e[1]:t),this}every(t){return this[b].every(([e,s])=>t(s,e))}}var rt=t=>new st(t);class it extends st{#t;#e;constructor(t,e,s={}){super(),this.#t=H+t,s[w]&&(this.#e=s),n(this,e)}get[O](){return this.#e||[]}get head(){return this.#t}toString(){return[this.#t,...this[O],...this[b].map(([t,e])=>t+": "+e),H,H].join(h)}to_string(){return H+this}toJSON(){return{head:this.#t,[O]:this.#e,body:this[g]}}get status_code(){return+this.#t[m](" ").find(t=>(t=+t)==t)}}class nt extends it{constructor(e,s,i={}){return super(e,s,i),K(this,{i:(e,s)=>V+s in e&&!r.getOwnPropertyNames(nt[$]).includes(s)?e[F](s):t})}static[R](t){let e,[s,...r]=t[m](h),i={},n=[];r[w]-=2;for(let t of r){let[s,r]=Y(t,": ");/^\w[^\s]*$/.test(s)?i[e=s]=r:e?i[e]+=h+t:n.push(t)}return new nt(s,i,n)}[F](t){return this[V+t]}#s;get passthroughs(){return this.#s??=rt().push(this.map((e,s)=>s.startsWith(V)?[s.slice(16),e]:t))}get raw(){return this}}class ht extends it{constructor(t){var[t,...s]=t[m](h);super(t,{});for(let t of s)if(t){let[e,s]=Y(t,""),[r,i]=Y(e,".");(this[r]||=rt())[i]=s}}get_uuid_by(t,e){return this.uuids.find(s=>this[s][t]==e)}get_list_of(t){return this.uuids.map(e=>this[e][t])}get uuids(){return this.keys}get[y](){return!!this[w]}toString(){return[this.head,H,...this[G]((t,e,s)=>t+"."+e+""+s),H,H].join(h)}toJSON(){return{head:this.head,fmo_infos:this[g]}}}class ot extends L{#r;#i;#n;#h;#o;constructor(t){super((t,e=this[p])=>this[M](t,e)),this.#r=t,this[p]=t[p]}async[M](t,e=this[p]){return this.#n?this.#h[e].includes(t):!!this.#i&&(this.#o[e][t]??=await this.#r[l](t))}get[y](){return this.#i}get fast_query_available(){return this.#n}reset(){return this.clear(),this.init()}async init(){var t=this.#r;return this.#i=await t[l](a),this.#n=this.#i&&await t[l](u),this.#n&&(this.#h=await t[_]()),this}clear(){this.#i=this.#n=!1,this.#o={[e]:{},[s]:{}}}}class ut{#u;constructor(e,s){return this[I]={Origin:Z},this[f]={Charset:"UTF-8"},this.host=s,this[k]=e,this[d]={[q]:1.4,NOTIFY:1.1,COMMUNICATE:1.1,EXECUTE:1.2,GIVE:1.1},this[p]=tt,this[C]=K(this,{i:(e,s)=>z(e[d][s],D)?e[E](s):/^On/.test(s)?e[c]((t=>"_"==t[2]?t[v](3):t)(s)):t})}get clone(){var t=this;return n(new ut,{[I]:et(t[I]),[f]:et(t[f]),[p]:t[p],[d]:et(t[d]),host:t.host,[U]:t[U]})}by_fmo_info(t){var e=this.clone;return e[U]=t,e[f].ReceiverGhostHWnd=t.hwnd,e}for_all_ghost_infos(t){let e=rt();return this.get_fmo_infos().then(s=>{for(var r in s)e[r]=t?.(s[r]);return e})}for_all_ghosts(t){return this.for_all_ghost_infos(e=>t?.(this.by_fmo_info(e)))}set host(t){this.#u=t||W()+"/api/sstp/v1"}get host(){return this.#u}set[k](t){this[f].Sender=t||"jsstp-client"}get[k](){return this[f].Sender}async row_send(t){return 200!=(t=await fetch(this.#u,{method:"POST",headers:this[I],body:H+t})).status&&Q(t.status),t.text()}[S](t,e){return this.row_send(new nt(t,{...this[f],...e}))}costom_send(t,e){return this[S](t,e)[P](t=>nt[R](t))}[E](t){let e=t+" SSTP/"+this[d][t];return n(t=>this.costom_send(e,t),{get_raw:t=>this[S](e,t)})}#a(t,e,s,r){return new i(s,{get:(s,i)=>i in s?s[i]:this[r](t+"."+i,e)})}[T](t,e=q){return this.#a(t,e,s=>this[C][e](n({Event:t},s)),T)}[c](t,e=q){return this.#a(t,e,(...s)=>{let r=0,i={};return s[x](t=>i["Reference"+r++]=t),this[T](t,e)(i)},c)}get event(){return new i({},{get:(t,e)=>this[c](e)})}[l](t,e=this[p]){return this.event[a](t,e)[P](({Result:t})=>1==t)}[_](){return this.event[u]()[P](({[e]:t,[s]:r})=>({[e]:(t||H)[m](","),[s]:(r||H)[m](",")}))}[j](){return this[C].EXECUTE.get_raw({Command:"GetFMO"})[P](t=>new ht(t))}[y](){return this[j]()[P](t=>t[y],()=>!1)}[P](t,e){return this[y]()[P](s=>s?t?.(this[C]):(e??Q)(s))}new_event_queryer(){return new ot(this).init()}}n(ut[$],{type:ut,base_sstp_info_t:it,sstp_info_t:nt,fmo_info_t:ht,ghost_events_queryer_t:ot}),o=new ut,n(exports,{base_sstp_info_t:it,default:o,fmo_info_t:ht,ghost_events_queryer_t:ot,jsstp:o,jsstp_t:ut,sstp_info_t:nt,__esModule:!0})
