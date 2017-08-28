/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	processLogin:function(req,res){
		User.findOne({regno:req.param('regno')},function(err,data){
			if(data){
				Timetable.findOne({regno:data.regno},function(err,tt){
					return res.json(200,{tt:tt,token:jwt.issue({id:data.id})});
				});
			}
			else{
				var vit=require('request');
				var url="https://myffcs.in:10443/campus/vellore/login/?regNo="+req.param('regno')+"&psswd="+req.param('passwd');
				vit.post(url,function(err,response,body){
					//console.log(body);
					var url="https://myffcs.in:10443/campus/vellore/timetable2/?regNo="+req.param('regno')+"&psswd="+req.param('passwd');
					vit.post(url,function(err,response,body){
						var timetable=JSON.parse(body).timetable;
						//console.log(timetable);
						var url="https://myffcs.in:10443/campus/vellore/personalDetails/?regNo="+req.param('regno')+"&psswd="+req.param('passwd');
						vit.post(url,function(err,response,body){
							var detail=JSON.parse(body);
							//console.log(detail);
							Timetable.create({regno:req.param('regno')},function(err,time_t){
								time_t.timetable=timetable;
								time_t.save();
								console.log(time_t);
							});
						});
					});
				});
			}
		});
	}
};

