
(function(module) {
    //注册 before after
	Function.prototype.before = function(func){
	    var me = this;
		
		return function(){
		    if(func.apply(this, arguments) === false){
			    return false;
			}
			
			return me.apply(this, arguments);
		}
	}
	
	Function.prototype.after = function(func){
	    var me = this;
		
		return function(){
		    var ret = me.apply(this, arguments) 
		    if(ret === false){
			    return false;
			}
			
			func.apply(this, arguments);
			
			return ret;
		}
	}
	
    var statisticsTimer = (function(){
	    //内部变量
		var sfilename = "D:\\log.txt";
		//内部函数
		
		//写入log日志
		var readFile =function(filename){   
            var fso = new ActiveXObject("Scripting.FileSystemObject"),
                f = fso.OpenTextFile(filename,1),
                s = "";
			
            while (!f.AtEndOfStream) s += f.ReadLine()+"/n";   
			
            f.Close();   
			
            return s;   
       }   
  
       //写文件   
       var writeFile = function(filename, filecontent){   
           var fso, f, s;   
		   
		   filename = filename || sfilename;
		   
           fso = new ActiveXObject("Scripting.FileSystemObject");      
           f = fso.OpenTextFile(filename,8,true);   
           f.WriteLine(filecontent);     
           f.Close();   
       }   

	    return {
		  logTime: function(func, funcName){
		      return func = (function(){
			      var d;
				  
				  return func.before(function(){
				      d = +new Date;
				  }).after(function(){
				      //console.log((new Date()).toString()+"函数:"+funcName+" 执行时间:"+(+new Date -d)+'秒');
					  var logContent = (new Date()).toGMTString()+"函数:"+funcName+" 执行时间:"+(+new Date -d)+'秒';
					  writeFile('', logContent);
				  });
			  })();
		  }
		}
	})();
	
	module.statisticsTimer = statisticsTimer;
	
})(window);