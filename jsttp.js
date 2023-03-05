//构建一个包装器与http://localhost:9801/api/sstp/v1通信。
//发信方法：Content-Type: text/plain HTTP/1.1でPOST
//收信方法：HTTP/1.1 200 OKのContent-Type: text/plain

//定义sttp报文类
/*
sttp报文格式：
SEND SSTP/1.0
Charset: UTF-8
Sender: SSTPクライアント
Script: \h\s0テストー。\u\s[10]テストやな。
Option: notranslate
由一行固定的报文头和一组可选的报文体组成，以\r\n换行，结尾以\r\n\r\n结束。
*/
class sttp_info_t {
    constructor(info_head, info_body) {
        if(info_head == undefined){
            info_head = "SEND SSTP/1.0";
        }
        if(info_body == undefined){
            info_body = new Map();
        }
        this.head = info_head;//string
        this.body = info_body;//map[string]string
    }
    //自字符串报文构造
    static from_string(str) {
        var thehead = str.split("\r\n")[0];
        var thebody = new Map();
        var body = str.split("\r\n\r\n")[1];
        var body_list = body.split("\r\n");
        for (var i = 0; i < body_list.length; i++) {
            var key = body_list[i].split(": ")[0];
            var value = body_list[i].split(": ")[1];
            thebody[key] = value;
        }
        return new sttp_info_t(thehead, thebody);
    }
    //设置报文头
    set_head(head) {
        this.head = head;
    }
    //设置报文体中的一项
    set(key, value) {
        this.body[key] = value;
    }
    //获取报文体中的一项
    get(key) {
        return this.body[key];
    }
    //获取报文体
    get_body() {
        return this.body;
    }
    //获取报文头
    get_head() {
        return this.head;
    }
    //获取报文
    to_string() {
        var str = this.head + "\r\n";
        for (var key in this.body) {
            str += key + ": " + this.body[key] + "\r\n";
        }
        str += "\r\n";
        return str;
    }
};
//定义一个包装器
class jsttp_t {
    constructor(sendername) {
        if(sendername == undefined){
            sendername = "jsstp-client";
        }
        //定义一个属性
        this.host = "http://localhost:9801/api/sstp/v1";
        //补充base_post方法所需要的xhr对象
        this.base_post_prototype = new XMLHttpRequest();
        this.base_post_prototype.open("POST", this.host, true);
        this.base_post_prototype.setRequestHeader("Content-Type", "text/plain");
        //初始化默认的报文
        this.default_info = new Map();
        this.default_info["Charset"] = "UTF-8";
        this.default_info["Sender"] = sendername;
    }
    //设置默认报文
    set_default_info(info) {
        this.default_info = info;
    }
    set_default_info(key, value) {
        this.default_info[key] = value;
    }
    #base_post(data, callback) {
        //使用base_post_prototype对象发送数据
        var xhr = this.base_post_prototype;
        xhr.open("POST", this.host, true);
        //设置回调函数
        xhr.onreadystatechange = function () {
            //如果xhr.readyState == 4 && xhr.status == 200
            if (xhr.readyState == 4 && xhr.status == 200) {
                //执行callback方法
                callback(sttp_info_t.from_string(xhr.responseText));
            }
        };
        //发送数据
        xhr.send(data);
    }
    //发送报文
    send(info, callback) {
        //若info是sttp_info_t类型
        if (info instanceof sttp_info_t) {
            //获取报文
            var data = info.to_string();
            //使用base_post发送
            this.#base_post(data, callback);
        }
        //若info是类似map类型的可迭代对象
        else if (typeof (info) == "object") {
            //获取报文
            var data = new sttp_info_t();
            data.set_head("NOTIFY SSTP/1.1");
            for (var key in this.default_info) {
                data.set(key, this.default_info[key]);
            }
            for (var key in info) {
                data.set(key, info[key]);
            }
            //使用base_post发送
            this.#base_post(data.to_string(), callback);
        }
        //否则记录错误
        else {
            console.error("jsttp.send: wrong type of info: " + typeof(info));
        }
    }
};

var jsttp = new jsttp_t();
