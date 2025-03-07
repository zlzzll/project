export default function(code:any) : string{
    if(code == 1009001){
        return  "登录失败"
    }
    else if (code == 1009002){
        return "注册失败"
    }
    else if (code == 1009003){
        return "刷新token失败"
    }
    else if (code == 1009004){
        return "非法token"
    }
    else if (code == 1009005){
        return "账号不存在或密码错误"
    }
    else if (code == 1009006){
        return "验证码超时或不匹配"
    }
    else if (code == 1009007){
        return "图片验证码获取间隔时间非法"
    }
    else if (code == 1009011){
        return "图片验证码生成异常"
    }
    else if (code == 1009012){
        return"邮箱验证码生成异常"
    }else{
        return `未知错误：${code}`
    }
}