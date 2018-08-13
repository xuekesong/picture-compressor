/*
  title: kyc认证
  time: 18/7/17
  author: xueke
*/

$(function() {
  var ImageCompressor = window.ImageCompressor;
  var _file_icon = document.querySelector('input[type=file]').files[0];

  var previewFiles = function () {
    var files = document.querySelector('input[type=file]').files;
    var fileObj = document.querySelector('input[type=file]').files[0]; // js 获取文件对象
    
    var readAndPreview = function (file) {
      if ( /\.(jpeg|png|jpg)$/i.test(file.name) ) {
        photoCompress(fileObj, {
          quality: 0.6
        }, function(base64Codes){
          $('.kyc-verification .key-verification__upload').css({'background-image': "url('"+base64Codes+"')", 'background-size': 'contain'});
          $('.kyc-verification .key-verification__upload .key-verification__upload--content .key-verification__upload--content--phone').hide();
          $('.kyc-verification .key-verification__upload .key-verification__upload--content .key-verification__upload--content--desc').hide();
          $('.kyc-verification .key-verification__upload .key-verification__upload--content').css('background-color', 'transparent');
          $('.key-verification__upload--content--file').attr('data-bgd', 'verifity_bgd');
        })
      }
    }
    if (files) {
      [].forEach.call(files, readAndPreview);
    }
  }

  var photoCompress = function (file,w,objDiv){
    var ready=new FileReader();
    /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
    ready.readAsDataURL(file);
    ready.onload=function(){
      var re=this.result;
      canvasDataURL(re,w,objDiv);
    }
  }

  var canvasDataURL = function (path, obj, callback){
    var img = new Image();
    img.src = path;
    img.onload = function(){
      var that = this;
      // 默认按比例压缩
      var w = that.width,
          h = that.height,
          scale = w / h;
      w = obj.width || w;
      h = obj.height || (w / scale);
      var quality = 0.7;  // 默认图片质量为0.7
      //生成canvas
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      // 创建属性节点
      var anw = document.createAttribute('width');
      anw.nodeValue = w;
      var anh = document.createAttribute('height');
      anh.nodeValue = h;
      canvas.setAttributeNode(anw);
      canvas.setAttributeNode(anh);
      ctx.drawImage(that, 0, 0, w, h);
      // 图像质量
      if(obj.quality && obj.quality <= 1 && obj.quality > 0){
        quality = obj.quality;
      }
      // quality值越小，所绘制出的图像越模糊
      var base64 = canvas.toDataURL('image/jpeg', quality);
      // 回调函数返回base64的值
      callback(base64);
    }
  }
  
  //点击获取图片
  $('.key-verification__upload--content--file').on('change', function() {
    previewFiles();
  })

  var kyc_flag = 1;
  //提交图片
  
  $('.key-verification__btn').off().on('click', function (e) {
    var file = document.querySelector('input[type=file]').files[0];// js 获取文件对象
    if ($('.key-verification__upload--content--file').attr('data-bgd') == '') {
      return false;
    }

    if (0 == kyc_flag) {
      return false;
    }

    kyc_flag = 0;
    var _width = 512;
    var _height = 384;
    $('.loading').css('display', 'inline-block');
    if (document.querySelector('input[type=file]').files[0].size / 1024 < 500) {
      _width = 512;
      _height = 384;
    } else {
      _width = 1024;
      _height = 768;
    }
    var options = {
      checkOrientation: true,
      maxWidth: undefined,
      maxHeight: undefined,
      minWidth: 0,
      minHeight: 0,
      width: _width,
      height: _height,
      quality: 0.8,
      mimeType: '',
      convertSize: 5000000,
      success: function (result) {
        var formData = new FormData();
        formData.append('photo', result);
        
        if (result.size/1024 > 500) {
          kyc_flag = 1;
          return false;
        }

        $.ajax({
          url: url,
          type: 'POST',
          processData: false,
          contentType: false,
          async:false,
          data: formData,
          dataType:'json',
        }).done(function (data) {
          if (0 == data.code) {
           //成功
            return false;
          }
          kyc_flag = 1;
        })
      },
      error: function (e) {
        kyc_flag = 1;
      }
    }
    
    new ImageCompressor(file, options);
  })
})