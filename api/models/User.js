/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	name:{
  		type:'string',
  	},
  	regno:{
  		type:'string',
  		required:true,
  		unique:true
  	},
  	phoneno:{
  		type:'string',
  	},
  	timetable:{
  		type:'string',
  	},
  	slots:{
  		type:'array',
  		defaultsTo:[]
  	}
  }
};

