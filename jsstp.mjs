export var jsstp=(()=>{let s="Has_Event",r="Get_Supported_Events";class _{#t;#i;constructor(t,e,s){this.#t=""+t,this.#i=s||[],Object.assign(this,e)}static from_string(t){var s,r,n,[t,...h]=t.split("\r\n"),a={},o=[],u=[": ",""];for(s of h)if(s){let t,e;for(var l of u)if(~(e=s.indexOf(l))){t=l;break}t?([r,n]=[s.slice(0,e),s.slice(e+t.length)],a[r]=n):o.push(h[i])}return new _(t,a,o)}get unknown_lines(){return this.#i}get head(){return this.#t}toString(){let t=this.#t+"\r\n";for(var e in this)t+=`${e}: ${this[e]}\r\n`;return t+"\r\n"}to_string(){return this.toString()}toJSON(){var t={head:this.#t,body:Object.assign({},this)};return this.#i.length&&(t.unknown_lines=this.#i),t}get return_code(){for(var t in this.#t.split(" "))if(!isNaN(t))return parseInt(t);return-1}get_passthrough(t){return this["X-SSTP-PassThru-"+t]}}class e{constructor(t={}){for(var e in t){var s=e.split("."),r=s[0],s=s[1];this[r]||(this[r]={}),this[r][s]=t[e]}}get_uuid_by(t,e){for(var s in this)if(this[s][t]==e)return s;return null}get_list_of(t){var e,s=[];for(e in this)s.push(this[e][t]);return s}get uuids(){return Object.keys(this)}get keys(){return this.uuids}get length(){return this.keys.length}get available(){return!!this.length}}class t{#h;#o;#u;#l;#_;constructor(t=jsstp){this.#h=t}async check_event(t,e="local"){var s;return this.#u?this.#l[e].includes(t):!!this.#o&&(null!=(s=this.#_[e][t])?s:(s=await this.#h.has_event(t),this.#_[e][t]=s))}get available(){return this.#o}get supported_events_available(){return this.#u}async reset(){return this.clear(),this.#o=await this.#h.has_event(s),this.#u=await this.#h.has_event(r),this.#u&&(this.#l=await this.#h.get_supported_events()),this}async init(){return this.reset()}clear(){this.#o=!1,this.#u=!1,this.#l=this.#_={local:{},external:{}}}}let n=(t,e,s)=>{null==s||""==s?delete t[e]:t[e]=s};class h{#v;#g;#p;constructor(t,e){this.#v={"Content-Type":"text/plain",Origin:window.location.origin},this.#g={Charset:"UTF-8"},this.host=e,this.sendername=t}set_RequestHeader(t,e){n(this.#v,t,e)}set default_info(t){this.#g=t}get default_info(){return this.#g}set_default_info(t,e){n(this.#g,t,e)}set host(t){this.#p=t||"http://localhost:9801/api/sstp/v1"}get host(){return this.#p}set sendername(t){this.#g.Sender=t||"jsstp-client"}get sendername(){return this.#g.Sender}costom_send(t,e,s){t=new _(t,{...this.#g,...e});const r={method:"POST",headers:this.#v,body:""+t};e=(e,s)=>{fetch(this.#p,r).then(t=>{200!=t.status?s(t.status):t.text().then(t=>e(_.from_string(t)))})};if(!s)return new Promise(e);e(s,()=>{})}async has_event(t,e="external"){t=(await this.SEND({Event:s,Reference0:t,Reference1:e})).get_passthrough("Result");return!!t&&"0"!=t}async get_supported_events(){var t=await this.SEND({Event:r}),e=t.get_passthrough("local"),t=t.get_passthrough("external");return{local:(e||"").split(","),external:(t||"").split(",")}}async get_fmo_infos(){let t={};try{t=await this.EXECUTE({Command:"GetFMO"})}catch(t){}return new e(t)}async available(){return(await this.get_fmo_infos()).available}async new_event_queryer(){return new t(this).init()}}let a={SEND:"1.4",NOTIFY:"1.1",COMMUNICATE:"1.1",EXECUTE:"1.2",GIVE:"1.1"};var o=h.prototype;for(let s in a)o[s]=function(t,e){return this.costom_send(s+" SSTP/"+a[s],t,e)};return Object.assign(o,{type:h,sstp_info_t:_,fmo_info_t:e,ghost_events_queryer_t:t}),new h})();