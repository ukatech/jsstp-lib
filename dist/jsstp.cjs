var t=t=>t.toLowerCase(),e=(t,e)=>{var s=t.indexOf(e);return[t[b](0,s),t[b](s+e[x])]},s=t=>(e,s)=>{var r;if(!t.t||!t.t(e,s))return(r=o(s)instanceof String?t.i&&t.i(e,s):t.h&&t.h(e,s))!==i?r:t.u?t.u(e,s):(r=e[s])instanceof Function?r.bind(e):r};class r extends Function{constructor(t){return o.setPrototypeOf(t,new.target.prototype)}}var i,n=!!globalThis.window,h=t=>"http://localhost:"+(t??9801),u=n?location.origin:h(process.env.PORT),a=/^\w+:\/\/localhost/.test(u)?U:J,o=Object,_=Proxy,l=o.assign,c="\r\n",g="Get_Supported_Events",f="Has_Event",d=t(g),p=t(f),v="get_simple_caller_of_event",w="trivial_clone",m="default_info",y="default_security_level",S="sstp_version_table",b="substring",x="length",E="available",O="split",T="entries",k="costom_text_send",P="forEach",C="get_caller_of_method",F="unknown_lines",N="get_caller_of_event",$="sendername",j="proxy",q="then",G="SEND",I="get_fmo_infos",M="get_passthrough",U="local",J="external",R="",A="X-SSTP-PassThru-";class D{get keys(){return o.keys(this)}get values(){return o.values(this)}get[T](){return o[T](this)}get[x](){return this.keys[x]}[P](t){this[T][P](([e,s])=>{this[e]=t(s,e)??s})}get[w](){return l(H(),this)}flat_map(t){let e=[];return this[T].map(([s,r])=>e.push(...r instanceof D?r.flat_map(t.bind(t,s)):[t(s,r)])),e}map(t){return this[T].map(([e,s])=>t(s,e))}push(t){return t[P](t=>t?this[t[0]]=t[1]:i),this}}var H=()=>new D;class V extends D{#t;#e;constructor(t,e,s={}){super(),this.#t=R+t,s[x]&&(this.#e=s),l(this,e)}get[F](){return this.#e||[]}get head(){return this.#t}toString(){return[this.#t,...this[F],...this[T].map(([t,e])=>t+": "+e),R,R].join(c)}to_string(){return R+this}toJSON(){return{head:this.#t,[F]:this.#e,body:this[w]}}get status_code(){return+this.#t[O](" ").find(t=>{return(t=+t)==t})}}class Y extends V{constructor(t,e,r={}){return super(t,e,r),new _(this,{get:s({i:(t,e)=>A+e in t?t[M](e):i})})}static from_string(t){let s,[r,...i]=t[O](c),n={},h=[];i[x]-=2;for(let t of i){let[r,i]=e(t,": ");/^\w[^\s]*$/.test(r)?n[s=r]=i:s?n[s]+=c+t:h.push(t)}return new Y(r,n,h)}[M](t){return this[A+t]}#s;get passthroughs(){return this.#s??=H().push(this.map((t,e)=>e.startsWith(A)?[e.slice(16),t]:i))}get raw(){return this}}class z extends V{constructor(t){var[t,...r]=t[O](c);super(t,{});for(let t of r)if(t){let[s,r]=e(t,""),[i,n]=e(s,".");(this[i]||=H())[n]=r}}get_uuid_by(t,e){return this.uuids.find(s=>this[s][t]==e)}get_list_of(t){return this.uuids.map(e=>this[e][t])}get uuids(){return this.keys}get[E](){return!!this[x]}toString(){return[this.head,R,...this.flat_map((t,e,s)=>t+"."+e+""+s),R,R].join(c)}toJSON(){return{head:this.head,fmo_infos:this[w]}}}class B extends r{#r;#i;#n;#h;#u;constructor(t){super((t,e=this[y])=>this.check_event(t,e)),this.#r=t,this[y]=t[y]}async check_event(t,e=this[y]){return this.#n?this.#h[e].includes(t):!!this.#i&&(this.#u[e][t]??=await this.#r[p](t))}get[E](){return this.#i}get fast_query_available(){return this.#n}reset(){return this.clear(),this.init()}async init(){var t=this.#r;return this.#i=await t[p](f),this.#n=this.#i&&await t[p](g),this.#n&&(this.#h=await t[d]()),this}clear(){this.#i=this.#n=!1,this.#u={[U]:{},[J]:{}}}}class K{#o;constructor(t,e){return this.RequestHeader={Origin:u},this[m]={Charset:"UTF-8"},this.host=e,this[$]=t,this[S]={[G]:1.4,NOTIFY:1.1,COMMUNICATE:1.1,EXECUTE:1.2,GIVE:1.1},this[y]=a,this[j]=new _(this,{get:s({i:(t,e)=>e in t[S]?t[C](e):/^On/.test(e)?t[v]((t=>"_"==t[2]?t[b](3):t)(e)):i})})}set host(t){this.#o=t||h()+"/api/sstp/v1"}get host(){return this.#o}set[$](t){this[m].Sender=t||"jsstp-client"}get[$](){return this[m].Sender}row_send(t){return new Promise((e,s)=>{return fetch(this.#o,{method:"POST",headers:this.RequestHeader,body:R+t})[q](t=>200!=t.status?s(t.status):t.text()[q](e),s)})}[k](t,e){return this.row_send(new Y(t,{...this[m],...e}))}costom_send(t,e){return this[k](t,e)[q](t=>Y.from_string(t))}[C](t){let e=t+" SSTP/"+this[S][t];return l(t=>this.costom_send(e,t),{get_raw:t=>this[k](e,t)})}#a(t,e,s,r){return new _(s,{get:(s,i)=>i in s?s[i]:this[r](t+"."+i,e)})}[N](t,e=G){return this.#a(t,e,s=>this[j][e](l({Event:t},s)),N)}[v](t,e=G){return this.#a(t,e,(...s)=>{let r=0,i={};return s[P](t=>i["Reference"+r++]=t),this[N](t,e)(i)},v)}get event(){return new _({},{get:(t,e)=>this[v](e)})}[p](t,e=this[y]){return this.event[f](t,e)[q](({Result:t})=>1==t)}[d](){return this.event[g]()[q](({[U]:t,[J]:e})=>({[U]:(t||R)[O](","),[J]:(e||R)[O](",")}))}[I](){return this[j].EXECUTE.get_raw({Command:"GetFMO"})[q](t=>new z(t))}[E](){return this[I]()[q](t=>t[E],()=>!1)}[q](t,e){return this[E]()[q](s=>s?t(this):e(),e)}new_event_queryer(){return new B(this).init()}}l(K.prototype,{type:K,base_sstp_info_t:V,sstp_info_t:Y,fmo_info_t:z,ghost_events_queryer_t:B});module.exports=new K
