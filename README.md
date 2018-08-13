# image-compressor
在用image-compressor.min.js压缩图片进行上传图片的时候，在windows电脑的qq浏览器中发现不兼容Promise对象，提示‘Promise’未定义...<br/>

解决方法如下：<br/>
在image-compressor.min.js之前引入es5-shim.min.js和polyfills-promise.js就👌了，具体可详细阅读👇<br/>
<a href="https://itbilu.com/javascript/js/4kPFKTWq.html#how">ECMAScript 6 Promise对象学习之Promise兼容方案</a><br/>

压缩方法详细说明https://xkeshi.github.io/image-compressor/