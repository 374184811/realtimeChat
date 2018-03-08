/**
 * Created by Administrator on 2016/8/6.
 */
module.exports={
      isMobile:function(mobile){
            if(isNaN(mobile)){
               return false;
            }

            if (mobile.length<11) {
               return false;
            }

            if((/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])\d{0,4}\d{0,4}$/.test(mobile))){
            //if(/^1[|3|5|6|7|8]\d{9}$/.test(mobile)){
                  return true;
            }
            return false;
      },
      isEmail:function(str){
          return   /^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i.test(str);
      }
}