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
					return res.json(200,{message:"Success",token:jwt.issue({id:data.id})});
				});
			}
			else{
				var vit=require('request');
				var url="https://myffcs.in:10443/campus/vellore/login/?regNo="+req.param('regno')+"&psswd="+req.param('passwd');
				vit.post(url,function(err,response,body){
					//console.log(body);
					var url="https://myffcs.in:10443/campus/vellore/timetable2/?regNo="+req.param('regno')+"&psswd="+req.param('passwd');
					vit.post(url,function(err,response,body){
						//console.log(response);
						var timetable=JSON.parse(body).timetable;
						//console.log(timetable);
						var url="https://myffcs.in:10443/campus/vellore/personalDetails/?regNo="+req.param('regno')+"&psswd="+req.param('passwd');
						vit.post(url,function(err,response,body){
							var detail=JSON.parse(body);
							//console.log(detail);
							Timetable.create({regno:req.param('regno')},function(err,time_t){
								time_t.timetable=timetable;
								time_t.save();
								//console.log(time_t);
								User.create({regno:req.param('regno')},function(err,user){
									user.name=detail.general.name;
									user.phoneno=detail.permanentAddress.mobileno;
									user.timetable=time_t.id;
									user.save();
									var i=0;
									var j=0;
									var arr=['8:00to8:50','9:00to9:50','10:00to10:50','11:00to11:50','12:00to12:50','14:00to14:50','15:00to15:50','16:00to16:50','17:00to17:50','18:00to18:50','19:00to19:50','20:00to20:50'];
									var arrl=['8:00to8:50','8:51to9:40','10:00to10:50','10:51to11:40','11:50to12:40','12:41to13:30','14:00to14:50','14:51to15:40','16:00to16:50','16:51to17:40','17:50to18:40','18:41to19:30','19:31to20:20','20:21to21:10'];
									for(i=0;i<timetable.length;i++){
										for(j=0;j<arr.length;j++){
											var flag=timetable[i].theory[arr[j]];
											var n=flag.lastIndexOf('-')-1;
											var slot="";
											while(flag[n]!='-' && flag!=""){
												slot+=flag[n];
												n--;
											}
											var sl=slot.split("").reverse().join("");
											if(user.slots.indexOf(sl)==-1 && slot!=""){
												user.slots.push(sl);
											}
										}
										for(j=0;j<arrl.length;j++){
											var flag=timetable[i].lab[arrl[j]];
											var n=flag.lastIndexOf('-')-1;
											var slot="";
											while(flag[n]!='-' && flag!=""){
												slot+=flag[n];
												n--;
											}
											var sl=slot.split("").reverse().join("");
											if(user.slots.indexOf(sl)==-1 && slot!=""){
												user.slots.push(sl);
											}
										}
									}
									user.save();
									return res.json(200,{message:"Success",token:jwt.issue({id:user.id})});
									//console.log(user);
								});
							});
						});
					});
				});
			}
		});
	},
	getTimeTable:function(req,res){
		User.findOne({regno:req.param('query')},function(err,data){
			if(data){
				Timetable.findOne({regno:data.regno},function(err,tt){
					// console.log(tt);
					// console.log(data.name);
					// console.log(data.regno);
					//console.log(data.slots);
					var result={tt:tt.timetable,name:data.name,regno:data.regno};
					return res.json(200,{result:result});
				});
			}
			else{
				User.find({name:req.param('query')},function(err,data){
					if(data){
						var i;
						var regno=[];
						//console.log(data);
						for(i=0;i<data.length;i++){
							regno.push(data[i].regno);
						}
						Timetable.find({regno:regno},function(err,t_data){
							var i=0;
							var result=[];
							for(i=0;i<t_data.length;i++){
								result.push({tt:t_data[i].timetable,name:data[i].name,regno:data[i].regno});
							}
							return res.json(200,{result:result});
						});
					}
				});
			}	
		});
	}
};

