//构建一个包装器与http://localhost:9801/api/sstp/v1通信。
//发信方法：Content-Type: text/plain HTTP/1.1でPOST
//收信方法：HTTP/1.1 200 OKのContent-Type: text/plain

//定义一个包装器
/**
 * sstp包装器
 * @example
 * jsstp.SEND({
 *   Event: "OnTest",
 *   Script: "\\s[0]Hell Wold!\\e"
 * });
 * @var jsstp
 * @type {jsstp.type}
 * @global
 */
var jsstp = (/*@__PURE__*/() => {
	//一些会反复用到的常量或函数，提前定义以便在压缩时能够以短名称存在
	let object = Object;
	let assign = object.assign;
	let endline = "\r\n";
	/**
	 * 拓展object，提供一些简单且遍历的操作
	 */
	class info_object {
		/**
		 * @description 获取所有key的数组
		 */
		/*@__PURE__*/get keys() { return object.keys(this); }
		/**
		 * @description 获取所有value的数组
		 */
		/*@__PURE__*/get values() { return object.values(this); }
		/**
		 * @description 获取所有key-value对的数组
		 */
		/*@__PURE__*/get entries() { return object.entries(this); }
		/**
		 * @description 获取成员数量
		 */
		/*@__PURE__*/get length() { return this.keys.length; }
		/**
		 * @description 对每个key-value对执行某个函数
		 * @param {(value,key?)} func 要执行的函数
		 */
		/*@__PURE__*/forEach(func) {
			return this.entries.forEach(([key, value]) => {
				this[key] = func(value, key) || value;
			});
		}
		/**
		 * @description 复制一个新的对象
		 * @returns {info_object} 复制的对象
		 */
		/*@__PURE__*/get trivial_clone() {
			return assign(new_object(), this);
		}
		/**
		 * @description 遍历自身和子对象并返回一个由遍历结果构成的一维数组
		 * @param {(dimensions[...],value):any} func 要执行的函数，返回值将被添加到数组中
		 */
		/*@__PURE__*/flat_map(func) {
			let result = [];
			this.entries.map(([key, value]) => {
				if (value instanceof info_object)
					result.push(...value.flat_map(func.bind(func, key)));
				else
					result.push(func(key, value));
			});
			return result;
		}
	}
	//工具函数
	/**
	 * 生成一个新的info_object
	 * @returns {info_object} 生成的对象
	 */
	let new_object = /*@__PURE__*/() => new info_object();
	/**
	 * 以spliter分割字符串str，只对第一个匹配的分隔符做分割
	 * @param {String} str 需要分割的字符串
	 * @param {String} spliter 分隔符
	 * @returns {[String,String]} 分割后的字符串数组
	 * @example
	 * let [key,value] = key_value_split("key: value",": ");
	 */
	let key_value_split = /*@__PURE__*/(str, spliter) => {
		let index = str.indexOf(spliter);
		return [str.substring(0, index), str.substring(index + spliter.length)];
	}
	/**
	 * 判断某一string是否是事件名
	 * @param {String} str 要判断的string
	 * @returns {Boolean} 是否是事件名
	 */
	let is_event_name = /*@__PURE__*/(str) => str.startsWith("On");
	/**
	 * 获取重整过的事件名
	 * @param {String} str 要重整的事件名
	 * @returns {String} 重整后的事件名
	 */
	let get_reorganized_event_name = /*@__PURE__*/(str) => str[2] == "_" ? str.substring(3) : str;
	/**
	 * 判断一个数是否不是NaN
	 * @param {Number} num 要判断的数
	 * @returns {Boolean} 是否不是NaN
	 */
	let is_not_nan = /*@__PURE__*/(num) => num == num;
	/**
	 * 对代理的get方法进行封装，使其定义更为简单
	 */
	class get_handler {
		/**
		 * @param {{
		 * 	block:Function|undefined,
		 * 	string_key_handler:Function|undefined,
		 * 	symbol_key_handler:Function|undefined,
		 * 	default_handler:Function|undefined
		 * }} info 代理的get方法的信息
		 * @returns {Function} 代理的get方法
		 */
		constructor(info) {
			return (target, key) => {
				if (info.block && info.block(target, key))
					return;
				let result;
				switch (typeof key) {
					case "string":
						if (info.string_key_handler)
							result = info.string_key_handler(target, key);
						break;
					case "symbol":
						if (info.symbol_key_handler)
							result = info.symbol_key_handler(target, key);
						break;
				}
				if (result)
					return result;
				else if (info.default_handler)
					return info.default_handler(target, key)
				result = target[key];
				return result instanceof Function ? result.bind(target) : result;
			}
		}
	}
	//定义sstp报文类
	let x_sstp_passthru_head = "X-SSTP-PassThru-";
	/*
	sstp报文格式：
	SEND SSTP/1.1
	Charset: UTF-8
	Sender: SSTPクライアント
	Script: \h\s0テストー。\u\s[10]テストやな。
	Option: notranslate
	由一行固定的报文头和一组可选的报文体组成，以\r\n换行，结尾以\r\n\r\n结束。
	*/
	/**
	 * sstp报文类
	 * @example
	 * let info = jsstp.sstp_info_t.from_string("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
	 * console.log(info.head);//SSTP/1.4 200 OK
	 * console.log(info.Option);//notranslate
	 * @alias jsstp.sstp_info_t
	 */
	class sstp_info_t extends info_object {
		#head;
		/**
		 * 未知行的数组
		 * @type {Array<String>}
		 */
		#unknown_lines;

		/**
		 * 自拆分好的字符串报文或对象报文构造sstp_info_t，不建议直接使用
		 * @param {String} info_head 报文头
		 * @param {Object} info_body 对象格式的报文体
		 * @param {Array<String>|undefined} unknown_lines 未知行的数组
		 * @see {@link sstp_info_t.from_string}
		 * @ignore
		 */
		/*@__PURE__*/constructor(info_head, info_body, unknown_lines = {}) {
			super();
			this.#head = `${info_head}`;
			if (unknown_lines.length)
				this.#unknown_lines = unknown_lines;
			assign(this, info_body);
			return new Proxy(this, {
				get: new get_handler({
					string_key_handler: (target, key) => x_sstp_passthru_head + key in target ? target.get_passthrough(key) : undefined
				})
			});
		}
		/**
		 * 从字符串构造sstp_info_t
		 * @param {String} str 字符串报文
		 * @returns {sstp_info_t} 构造的sstp_info_t
		 * @example
		 * let info = sstp_info_t.from_string("SSTP/1.4 200 OK\r\nCharset: UTF-8\r\nSender: SSTPクライアント\r\nScript: \\h\\s0テストー。\\u\\s[10]テストやな。\r\nOption: notranslate\r\n\r\n");
		 */
		/*@__PURE__*/static from_string(str) {
			let [head, ...lines] = str.split(endline);
			let body = {};
			let unknown_lines = [];
			let last_key;
			//去掉最后的空行*2
			lines.length -= 2;
			for (let line of lines) {
				let [key, value] = key_value_split(line, ': ');
				if (!/^\w[^\s]*$/.test(key)) {
					if (last_key)
						body[last_key] += endline + line;
					else
						unknown_lines.push(line);
				}
				else
					body[last_key = key] = value;
			}
			return new sstp_info_t(head, body, unknown_lines);
		}
		/**
		 * 获取未知行的数组
		 * @returns {Array<String>} 未知行的数组
		 */
		/*@__PURE__*/get unknown_lines() { return this.#unknown_lines || []; }
		/**
		 * 获取报文头
		 * @returns {String} 报文头
		 */
		/*@__PURE__*/get head() { return this.#head; }
		//注入toString方法便于使用
		/**
		 * 获取字符串报文
		 * @returns {String} 字符串报文
		 * @ignore
		 */
		/*@__PURE__*/toString() {
			return [
				this.#head,
				...this.unknown_lines,
				...this.entries.map(([key, value]) => `${key}: ${value}`),
				"", ""//空行结尾
			].join(endline);
		}
		/**
		 * 获取字符串报文
		 * @returns {String} 字符串报文
		 */
		/*@__PURE__*/to_string() { return this.toString(); }//兼容命名
		/**
		 * 获取用于`JSON.stringify`的对象
		 * @returns {Object} 用于`JSON.stringify`的对象
		 * @ignore
		 */
		/*@__PURE__*/toJSON() {
			return {
				head: this.#head,
				unknown_lines: this.#unknown_lines,
				body: this.trivial_clone
			};
		}
		/**
		 * 获取报头返回码（若出现意外返回`NaN`）
		 * @returns {Number} 报头返回码（若出现意外则为`NaN`）
		 */
		/*@__PURE__*/get return_code() {
			//比如：SSTP/1.4 200 OK，返回200
			return +this.#head.split(" ").find(value => is_not_nan(+value));
		}
		/**
		 * 获取PassThru的值
		 * @param {String} key 获取的PassThru名称
		 * @returns {String|undefined} PassThru的值
		 */
		/*@__PURE__*/get_passthrough(key) { return this[x_sstp_passthru_head + key]; }
	}
	/**
	 * fmo报文类
	 * @example
	 * let fmo = jsstp.get_fmo_infos();
	 * let kikka_uuid = fmo.get_uuid_by("name", "橘花");
	 * if(kikka_uuid)
	 * 	console.log(fmo[kikka_uuid].ghostpath);
	 * @alias jsstp.fmo_info_t
	 * @see {@link jsstp_t.get_fmo_infos}
	 * @see {@link http://ssp.shillest.net/ukadoc/manual/spec_fmo_mutex.html}
	 */
	class fmo_info_t extends sstp_info_t {
		/**
		 * 自字符串构造fmo_info_t，不建议直接使用
		 * @param {String} fmo_info
		 * @ignore
		 */
		/*@__PURE__*/constructor(fmo_text) {
			let [head, ...lines] = fmo_text.split(endline);
			super(head, {});
			//fmo_info每个key的格式都是"uuid.属性名"
			for (let line of lines) {
				if (!line) continue;
				let [key, value] = key_value_split(line, String.fromCharCode(1));
				let [uuid, name] = key_value_split(key, ".");
				this[uuid] ||= new_object();
				this[uuid][name] = value;
			}
		}
		/**
		 * @param {String} name 要检查的属性名
		 * @param {String} value 期望的属性值
		 * @returns {String|undefined} 对应的uuid（如果有的话）
		 * @description 获取具有指定属性且属性值为指定值的fmo的uuid
		 * @example 
		 * let kikka_uuid = fmo_info.get_uuid_by("name", "橘花");
		 * @description 等价于`this.uuids.find(uuid => this[uuid][name] == value)`
		 */
		/*@__PURE__*/get_uuid_by(name, value) {
			return this.uuids.find(uuid => this[uuid][name] == value);
		}
		/**
		 * @param {String} name
		 * @returns {Array<String>}
		 * @description 获取所有指定属性的值
		 * @example
		 * let ghost_list = fmo_info.get_list_of("name");
		 * @description 等价于`this.uuids.map(uuid => this[uuid][name])`
		 */
		/*@__PURE__*/get_list_of(name) {
			return this.uuids.map(uuid => this[uuid][name]);
		}
		/**
		 * @description 获取所有uuid
		 */
		/*@__PURE__*/get uuids() { return this.keys; }
		/**
		 * @description 判断fmo是否有效
		 */
		/*@__PURE__*/get available() { return !!this.length; }
		//注入toString方法便于使用
		/**
		 * 获取字符串报文
		 * @returns {String} 字符串报文
		 * @ignore
		 */
		/*@__PURE__*/toString() {
			return [
				this.head,
				"",
				...this.flat_map((uuid, key, value) => uuid + "." + key + String.fromCharCode(1) + value),
				"", ""
			].join(endline);
		}
		/**
		 * 获取用于`JSON.stringify`的对象
		 * @returns {Object} 用于`JSON.stringify`的对象
		 * @ignore
		 */
		/*@__PURE__*/toJSON() {
			return {
				head: this.head,
				fmo_infos: this.trivial_clone
			};
		}
	}
	/**
	 * ghost事件查询器
	 * @example
	 * let ghost_events_queryer = jsstp.new_event_queryer();
	 * if(!ghost_events_queryer.available)
	 * 	console.log("当前ghost不支持事件查询");
	 * if(ghost_events_queryer.has_event("OnBoom"))
	 * 	jsstp.send({
	 * 		Event: "OnBoom"
	 * 	});
	 * @alias jsstp.ghost_events_queryer_t
	 * @see {@link jsstp_t.new_event_queryer}
	 */
	class ghost_events_queryer_t {
		/**
		 * 基础{@link jsstp_t}对象
		 * @type {jsstp_t}
		 */
		#base_jsstp;
		/**
		 * 是否有`Has_Event`方法
		 * @type {Boolean}
		 */
		#ghost_has_has_event;
		/**
		 * 是否有`Get_Supported_Events`方法
		 * @type {Boolean}
		 */
		#ghost_has_get_supported_events;
		/**
		 * 自`Get_Supported_Events`获取的事件列表
		 * @type {{local:Array<String>,external:Array<String>}}
		 * @example 
		 * {
		 * 	local:["On_connect","On_disconnect"],
		 * 	external:["On_connect"]
		 * }
		 */
		#ghost_event_list;
		/**
		 * 自`Has_Event`获取的事件列表缓存
		 * @type {{local:{String:Boolean},external:{String:Boolean}}}
		 * @example 
		 * {
		 * 	local:{On_connect:true,On_disconnect:true},
		 * 	external:{On_connect:true}
		 * }
		 * @description 仅当`#ghost_has_get_supported_events`为false时有效
		 */
		#ghost_event_list_cache;

		/**
		 * 构造一个事件查询器
		 * @param {jsstp_t} base_jsstp
		 */
		/*@__PURE__*/constructor(base_jsstp = jsstp) {
			this.#base_jsstp = base_jsstp;
		}
		/**
		 * 检查事件是否存在，ghost至少需要`Has_Event`事件的支持，并可以通过提供`Get_Supported_Events`事件来提高效率
		 * @param {String} event_name
		 * @param {String} security_level
		 * @returns {Promise<Boolean>}
		 * @example
		 * let result = await ghost_events_queryer.check_event("On_connect");
		 * @see 基于 {@link jsstp_t.has_event} 和 {@link jsstp_t.get_supported_events}
		 */
		/*@__PURE__*/async check_event(event_name, security_level = "local") {
			if (this.#ghost_has_get_supported_events)
				return this.#ghost_event_list[security_level].includes(event_name);
			else if (this.#ghost_has_has_event) {
				let charge = this.#ghost_event_list_cache[security_level][event_name];
				if (charge != undefined)
					return charge;
				let result = await this.#base_jsstp.has_event(event_name);
				this.#ghost_event_list_cache[security_level][event_name] = result;
				return result;
			}
			else
				return false;
		}
		/**
		 * 检查是否能够检查事件
		 * @returns {Promise<Boolean>}
		 * @example
		 * if(!ghost_events_queryer.available)
		 * 	console.error("无法检查事件");
		 */
		/*@__PURE__*/get available() { return this.#ghost_has_has_event; }
		/**
		 * 检查是否能够使用`Get_Supported_Events`快速获取支持的事件列表
		 * @returns {Promise<Boolean>}
		 * @example
		 * if(!ghost_events_queryer.fast_query_available)
		 * 	console.info("无法快速获取支持的事件列表");
		 * else
		 * 	console.info("好哦");
		 * @description 如果不支持也只是会变慢，`check_event`仍然可以使用
		 */
		/*@__PURE__*/get fast_query_available() { return this.#ghost_has_get_supported_events; }
		/**
		 * @returns {Promise<ghost_events_queryer_t>} this
		 */
		async reset() {
			this.clear();
			let jsstp = this.#base_jsstp;
			this.#ghost_has_has_event = await jsstp.has_event("Has_Event");
			this.#ghost_has_get_supported_events = this.#ghost_has_has_event && await jsstp.has_event("Get_Supported_Events");
			if (this.#ghost_has_get_supported_events)
				this.#ghost_event_list = await jsstp.get_supported_events();
			return this;
		}
		async init() { return this.reset(); }//省略await是合法的
		clear() {
			this.#ghost_has_has_event = this.#ghost_has_get_supported_events = false;
			this.#ghost_event_list_cache = { local: {}, external: {} };
		}
	}
	//SSTP协议版本号列表
	let sstp_version_table = {
		SEND: 1.4,
		NOTIFY: 1.1,
		COMMUNICATE: 1.1,
		EXECUTE: 1.2,
		GIVE: 1.1
	};
	/**
	 * 根据方法名称获取SSTP协议头
	 * @param {String} type 方法名称
	 * @returns {String} SSTP协议头
	 */
	let get_sstp_header = (type) => `${type} SSTP/${sstp_version_table[type]}`;
	//定义一个包装器
	/**
	 * jsstp对象
	 * @see {@link jsstp}
	 * @alias jsstp.type
	 * @example
	 * let my_jsstp=new jsstp.type("my_coooool_jsstp",sstp_server_url);
	 */
	class jsstp_t {
		/**
		 * 对象与服务器交互时的发送者名称
		 * @type {String}
		 */
		#host;
		/**
		 * 对自身的代理
		 * @type {Proxy}
		 */
		proxy;
		RequestHeader;
		default_info;
		static sstp_version_table = sstp_version_table;

		/**
		 * 基础jsstp对象
		 * @param {String} sendername 对象与服务器交互时的发送者名称
		 * @param {String} host 目标服务器地址
		 */
		/*@__PURE__*/constructor(sendername, host) {
			this.RequestHeader = {
				"Content-Type": "text/plain",
				"Origin": window.location.origin
			};
			this.default_info = { Charset: "UTF-8" };

			this.host = host;
			this.sendername = sendername;
			this.proxy = new Proxy(this, {
				get: new get_handler({
					string_key_handler: (target, key) => {
						if (key in sstp_version_table)
							return target.get_caller_of_method(key);
						if (is_event_name(key))
							return target.get_simple_caller_of_event(get_reorganized_event_name(key));
					}
				})
			});
			return this.proxy;
		}
		/**
		 * 修改host
		 * @param {string} host
		 */
		set host(host) { this.#host = host || "http://localhost:9801/api/sstp/v1"; }
		/*@__PURE__*/get host() { return this.#host; }
		/**
		 * 修改sendername
		 * @param {String} sendername
		 */
		set sendername(sendername) { this.default_info.Sender = sendername || "jsstp-client"; }
		/*@__PURE__*/get sendername() { return this.default_info.Sender; }
		/**
		 * 发送报文，但是不对返回结果进行处理
		 * @param {String} sstphead 报文头
		 * @param {Object} info 报文体
		 * @returns {Promise<String|undefined>} 返回一个promise  
		 * 若一切正常其内容为发送后得到的返回值，否则为`undefined`
		 */
		costom_text_send(sstphead, info) {
			//使用fetch发送数据
			return new Promise(
				(resolve, reject) =>
					fetch(this.host, {
						method: "POST",
						headers: this.RequestHeader,
						body: `${new sstp_info_t(sstphead, { ...this.default_info, ...info })}`
					}).then(response =>
						response.status != 200 ?
							reject(response.status) :
							response.text().then(resolve)
					).catch(reject)
			);
		}
		/**
		 * 发送报文
		 * @param {String} sstphead 报文头
		 * @param {Object} info 报文体
		 * @returns {Promise<sstp_info_t>} 返回一个promise
		 */
		async costom_send(sstphead, info) {
			return this.costom_text_send(sstphead, info).then(
				result => sstp_info_t.from_string(result)
			);
		}
		/**
		 * 获取指定方法的调用器
		 * @param {String} method_name 方法名称
		 * @returns {{
		 * 	(info: Object): Promise<sstp_info_t>,
		 * 	get_result_by_text(info: Object): Promise<String>
		 * }} 调用器
		 */
		get_caller_of_method(method_name) {
			let header = get_sstp_header(method_name);
			return assign((info) => this.costom_send(header, info), {
				get_result_by_text: (info) => this.costom_text_send(header, info)
			});
		}
		/**
		 * 获取指定事件的调用器
		 * @param {String} event_name 事件名称
		 * @param {String|undefined} method_name 方法名称
		 * @returns {Function} 调用器
		 */
		get_caller_of_event(event_name, method_name = "SEND") {
			return (info) => this.proxy[method_name](assign({ Event: event_name }, info));
		}
		/**
		 * 用于获取指定事件的简单调用器
		 * @param {String} event_name 事件名称
		 * @param {String|undefined} method_name 方法名称
		 * @returns {Function} 调用器
		 */
		get_simple_caller_of_event(event_name, method_name = "SEND") {
			return (...args) => {
				let reference_num = 0;
				let info = {};
				args.forEach((arg) =>
					info[`Reference${reference_num++}`] = arg
				);
				return this.get_caller_of_event(event_name, method_name)(info);
			};
		}
		/**
		 * 用于获取指定事件的简单调用器的代理
		 * @returns {Proxy}
		 * @example
		 * jsstp.event.OnTest("test");
		 */
		get event() {
			return new Proxy({}, {
				get: (target, prop) => this.get_simple_caller_of_event(prop)
			});
		}
		/**
		 * 判断是否存在某个事件
		 * 若可能频繁调用，使用{@link ghost_events_queryer_t}（通过{@link jsstp_t.new_event_queryer}获取）来查询
		 * @param {String} event_name 事件名
		 * @param {String} security_level 安全等级
		 * @returns {Promise<Boolean>} 是否存在
		 * @example
		 * jsstp.has_event("OnTest").then(result => console.log(result));
		 * @example
		 * //示例代码(AYA):
		 * SHIORI_EV.On_Has_Event : void {
		 * 	_event_name=reference.raw[0]
		 * 	_SecurityLevel=reference.raw[1]
		 * 	if !_SecurityLevel
		 * 		_SecurityLevel=SHIORI_FW.SecurityLevel
		 * 	if SUBSTR(_event_name,0,2) != 'On'
		 * 		_event_name='On_'+_event_name
		 * 	_result=0
		 * 	if TOLOWER(_SecurityLevel) == 'external'
		 * 		_event_name='ExternalEvent.'+_event_name
		 * 	_result=ISFUNC(_event_name)
		 * 	if !_result
		 * 		_result=ISFUNC('SHIORI_EV.'+_event_name)
		 * 	SHIORI_FW.Make_X_SSTP_PassThru('Result',_result)
		 * }
		 * SHIORI_EV.ExternalEvent.On_Has_Event{
		 * 	SHIORI_EV.On_Has_Event
		 * }
		 */
		/*@__PURE__*/async has_event(event_name, security_level = "external") {
			let result = (await this.event.Has_Event(event_name, security_level)).Result;
			return !!result && result != "0";
		}
		/**
		 * 以约定好的结构获取支持的事件，需要ghost支持`Get_Supported_Events`事件
		 * 若不确定ghost的支持情况，使用{@link ghost_events_queryer_t}（通过{@link jsstp_t.new_event_queryer}获取）来查询
		 * @returns {Promise<{local:string[],external:string[]}>} 包含local和external两个数组的Object
		 * @example
		 * jsstp.get_supported_events().then(result => console.log(result));
		 * @example
		 * //示例代码(AYA):
		 * SHIORI_EV.On_Get_Supported_Events: void {
		 * 	_L=GETFUNCLIST('On')
		 * 	_base_local_event_funcs=IARRAY
		 * 	foreach _L;_func{
		 * 		if SUBSTR(_func,2,1) == '_'
		 * 			_func=SUBSTR(_func,3,STRLEN(_func))
		 * 		_base_local_event_funcs,=_func
		 * 	}
		 * 	_L=GETFUNCLIST('SHIORI_EV.On')
		 * 	foreach _L;_func{
		 * 		if SUBSTR(_func,12,1) == '_'
		 * 			_func=SUBSTR(_func,13,STRLEN(_func))
		 * 		_base_local_event_funcs,=_func
		 * 	}
		 * 	SHIORI_FW.Make_X_SSTP_PassThru('local',ARRAYDEDUP(_base_local_event_funcs))
		 * 	_L=GETFUNCLIST('ExternalEvent.On')
		 * 	_base_external_event_funcs=IARRAY
		 * 	foreach _L;_func{
		 * 		if SUBSTR(_func,16,1) == '_'
		 * 			_func=SUBSTR(_func,17,STRLEN(_func))
		 * 		_base_external_event_funcs,=_func
		 * 	}
		 * 	_L=GETFUNCLIST('SHIORI_EV.ExternalEvent.On')
		 * 	foreach _L;_func{
		 * 		if SUBSTR(_func,26,1) == '_'
		 * 			_func=SUBSTR(_func,27,STRLEN(_func))
		 * 		_base_external_event_funcs,=_func
		 * 	}
		 * 	SHIORI_FW.Make_X_SSTP_PassThru('external',ARRAYDEDUP(_base_external_event_funcs))
		 * }
		 * SHIORI_EV.ExternalEvent.On_Get_Supported_Events{
		 * 	SHIORI_EV.On_Get_Supported_Events
		 * }
		 */
		/*@__PURE__*/async get_supported_events() {
			let info = await this.event.Get_Supported_Events();
			let [local, external] = [info.local, info.external];
			return {
				local: (local || "").split(","),
				external: (external || "").split(",")
			};
		}
		/**
		 * 获取fmo信息
		 * @returns {Promise<fmo_info_t>} fmo信息
		 * @example
		 * let fmo=await jsstp.get_fmo_infos();
		 * if(fmo.available)
		 * 	console.log(fmo);
		 */
		/*@__PURE__*/async get_fmo_infos() {
			return this.proxy.EXECUTE.get_result_by_text({
				Command: "GetFMO"
			}).then(
				fmo_text => new fmo_info_t(fmo_text)
			);
		}
		/**
		 * 获取当前ghost是否可用
		 * @returns {Promise<Boolean>} ghost是否可用
		 * @example
		 * if(await jsstp.available())
		 * 	//do something
		 * else
		 * 	console.error("ghost不可用,请检查ghost是否启动");
		 */
		/*@__PURE__*/async available() {
			return this.get_fmo_infos().then(fmo => fmo.available).catch(() => false);
		}
		/**
		 * 获取一个用于查询ghost所支持事件的queryer
		 * @returns {Promise<ghost_events_queryer_t>} 查询支持事件的queryer
		 * @example
		 * jsstp.new_event_queryer().then(queryer => 
		 * 	queryer.check_event("OnTest").then(result =>
		 * 		console.log(result)
		 * 	)
		 * );
		 */
		/*@__PURE__*/async new_event_queryer() { return (new ghost_events_queryer_t(this)).init(); }//省略await是合法的
	}
	//对定义中的所有类型补充到原型
	//纯为了压缩体积（不然每个类型都要写一遍`static`）
	assign(jsstp_t.prototype, {
		type: jsstp_t,
		sstp_info_t: sstp_info_t,
		fmo_info_t: fmo_info_t,
		ghost_events_queryer_t: ghost_events_queryer_t
	});
	//返回jsstp_t实例以初始化jsstp
	return new jsstp_t();
})();
