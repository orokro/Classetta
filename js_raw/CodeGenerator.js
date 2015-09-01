/*
	This the parent class for all the language code generators.
	Each language supported will extend this class and only write the method to generate code

	Code generators have the following responsibilities:
		- Manage the DOM for the area where the code will be displayed (in tabs..)
		- Generate code when given a new ClassItem object

*/
class CodeGenerator{

	constructor(DOM){

		//save reference to the dom element this code generator will reside in
		this.DOM = DOM;

	}

	//when generating warnings, or processing the lists of members and methods, some general pre-processing of the ClassItem would be useful
	inspect(item){

		//prevent some redundancy in the JSON
		var _methods = item.getMethods();
		var _publicMethods = (_methods.filter(function(n){ return (n.access==PUBLIC); }));
		var	_privateMethods = (_methods.filter(function(n){ return (n.access==PRIVATE); }));
		var	_staticMethods = (_methods.filter(function(n){ return (n.isStatic==true); }));
		var	_constMethods = (_methods.filter(function(n){ return (n.isConst==true); }));

		var _members = item.getMembers();
		var _publicMembers = (_members.filter(function(n){ return (n.access==PUBLIC); }));
		var	_privateMembers = (_members.filter(function(n){ return (n.access==PRIVATE); }));
		var	_staticMembers = (_members.filter(function(n){ return (n.isStatic==true); }));
		var	_constMembers = (_members.filter(function(n){ return (n.isConst==true); }));
		var	_initMembers = (_members.filter(function(n){ return (n.val!=null); }));
		

		var ret = {

			//pass through properties
			name: item.getName(),
			isPulic: item.getPublic(),
			isAbstract: item.getAbstract(),
			isFinal: item.getFinal(),


			//interface related info:
			hasInterfaces: item.getInterfaces().length>0,
			interfaces: item.getInterfaces(),


			//member related info:
			members: _members,
			hasMembers: (_members.length>0),

			publicMembers: _publicMembers,
			hasPublicMembers: (_publicMembers.length>0),

			privateMembers: _privateMembers,
			hasPrivateMembers: (_privateMembers.length>0),

			staticMembers: _staticMembers,
			hasStaticMembers: (_staticMembers.length>0),

			constMembers: _constMembers,
			hasConstMembers: (_constMembers.length>0),

			initMembers: _initMembers,
			hasInitMembers: (_initMembers.length>0),
			

			//method related info:
			methods: _methods,
			hasMethods: (_methods.length>0),

			publicMethods: _publicMethods,
			hasPublicMethods: (_publicMethods.length>0),

			privateMethods: _privateMethods,
			hasPrivateMethods: (_privateMethods.length>0),

			staticMethods: _staticMethods,
			hasStaticMethods: (_staticMethods.length>0),

			constMethods: _constMethods,
			hasConstMethods: (_constMethods.length>0),


		}//var ret

		return ret;

	}//inspect(item)

}