### 概念
我们开发的h5页面需要在安卓端的WebView容器中运行时，有时候需要获取端上的某些信息，例如获取当前的位置信息、获取设备信息等等。这时候就需要一个桥梁，也就是JSB来进行实现。即**JSB是实现Native端和web端双向通信的一种机制。**
### WebView
webView是移动应用提供的运行web的环境，是移动端中的一个控件，为js运行提供了一个沙箱环境。WebView可以加载指定的url，拦截页面发出的各种请求，JSB的实现就依赖于WebView暴露的各种接口。
**渲染流程：**
在安卓渲染过程中，ui线程进行绘制的时候，如果有web内容，会调用到webkit thread线程来遍历web中的doc文件，然后生成一个display list，交给ui线程中的display list进行渲染。
### JSBridge的通信原理
实现JSBridge主要是以下两点：

- 将Native端的原生接口封装成Javascript接口
- 将web端JavaScript接口封装成原生接口
#### Native to Web
Native调用js相对简单，仅需要h5将js方法暴露在window上给Native调用即可
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692361312635-5857e137-f2a0-43aa-994d-baf99ef152e9.png#averageHue=%23fbfbfa&clientId=ufec21faa-569b-4&from=paste&id=u5c979470&originHeight=435&originWidth=679&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u7a889eb2-eec6-4af8-9e33-68585a8c2bf&title=)
#### Web to Native
##### 注入API
将Native相关接口注入到js的window对象上，一般来说这个对象内的方法名和Native相关方法名是相同的，此时web端就可以直接在全局下使用暴露的这个全局变量，进而调用原生端的方法。
此方法通信时间短，调用方便。
**客户端定义并注入js方法：**
```
public class NativeToJS {
      @JavascriptInterface  
        public void callAndroid(String msg){     
           Log.e("zw","JS调用了Android的callAndroid()，msg : " + msg);      
         }}
}
// 注入js方法 
webView.addJavascriptInterface(new AndroidToJS(),"android");
```
**前端调用:**
##### Scheme拦截
客户端和前端定义Scheme规范，前端加载scheme，客户端进行拦截，判断请求类型后进行执行对应逻辑
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692361312670-d782f637-a68a-4df4-a2e4-58e4089c47a5.png#averageHue=%23fdfcf7&clientId=ufec21faa-569b-4&from=paste&id=u64e64bea&originHeight=472&originWidth=650&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=ud65cefe9-68e7-445b-a4e6-8f23ed521ba&title=)
**前端发布请求的方法：**

- <a/>标签发送，需要用户手动触发
- location.href 可能会导致页面跳转
- ajax：安卓拦截ajax能力有所欠缺
- Iframe 

**定义jsb的请求格式：**
自定义业务自身专属的URL Scheme作为JSB的请求标识。例如字节内部实现的拦截式JSB中定义 bytedance://这样一个scheme
**前端调用：**
```jsx
window.prompt('bytedance://app.toast?title=hello')
```
**客户端拦截：**
```jsx
/ Java: 重载 onJsPrompt 方法，提取 prompt 内容判断是否需要拦截
    class MyWebViewClient extends WebChromeClient {
      @Override
      public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
        if (message.startsWith("bridge://")) {
          // 解析 // 后面的 action 和参数，调用相关的函数
          result.confirm("Yes!");
        }
        return true;
      }
    }
    webView.setWebViewClient(new MyWebViewClient());

```
### jsb的权限校验
由于第三方应用的存在，为了保证端能力调用的安全性，防止恶意软件或者网页随意获取用户信息，则需要对第三方调用jsb的能力进行管理
#### 权限分类

- Private ： 只有内网才可以访问
- protected： 第三方域名调用时需要进行权限校验
- Public: 所有域名的都可以进行访问
#### 管理流程
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692361312732-5d5cbfdb-04f4-4f8c-9bdb-2bfd51cbf719.png#averageHue=%23fcfbfb&clientId=ufec21faa-569b-4&from=paste&id=u3d3a2033&originHeight=530&originWidth=659&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u68f0962a-d66c-4443-a57a-3262f698b17&title=)
