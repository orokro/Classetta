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
		var _protectedMethods = (_methods.filter(function(n){ return (n.access==PROTECTED); }));
		var	_staticMethods = (_methods.filter(function(n){ return (n.isStatic==true); }));
		var	_constMethods = (_methods.filter(function(n){ return (n.isConst==true); }));
		var _abstractMethods = (_methods.filter(function(n){ return (n.isAbstract==true); }));
		var _abstractFinalMethods = (_methods.filter(function(n){ return (n.isAbstract==true && n.isFinal==true); }));

		var _members = item.getMembers();
		var _publicMembers = (_members.filter(function(n){ return (n.access==PUBLIC); }));
		var	_privateMembers = (_members.filter(function(n){ return (n.access==PRIVATE); }));
		var _protectedMembers = (_members.filter(function(n){ return (n.access==PROTECTED); }));
		var	_staticMembers = (_members.filter(function(n){ return (n.isStatic==true); }));
		var	_constMembers = (_members.filter(function(n){ return (n.isConst==true); }));
		var	_initMembers = (_members.filter(function(n){ return (n.val!=null); }));
		
		//build one giant object of infos!
		var ret = {

			//pass through properties
			name: item.getName(),
			isPublic: item.getPublic(),
			isAbstract: item.getAbstract(),
			isFinal: item.getFinal(),

			//inheritance realted info:
			hasAncestor: item.getAncestor(),
			ancestor: item.getAncestor(),

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

			protectedMembers: _protectedMembers,
			hasProtectedMembers: (_protectedMembers.length>0),

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

			protectedMethods: _protectedMethods,
			hasProtectedMethods: (_protectedMethods.length>0),

			staticMethods: _staticMethods,
			hasStaticMethods: (_staticMethods.length>0),

			constMethods: _constMethods,
			hasConstMethods: (_constMethods.length>0),

			abstractMethods: _abstractMethods,
			hasAbstractMethods: (_abstractMethods.length>0),

			abstractFinalMethods: _abstractFinalMethods,
			hasAbstractFinalMethods: (_abstractFinalMethods.length>0)

		}//var ret

		return ret;

	}//inspect(item)

	//make a comment
	comment(str){
		return this.singleLineComments + str;
	}
	
	//wrap a string in multiline comments
	wrapMuliLineComment(str){

		str = str.split("\n");
		if(str[str.length-1]=='')
			str = this.multiLineComments.prefix +  str.slice(0, str.length-1).join("\n"+this.multiLineComments.prefix);
		else
			str = this.multiLineComments.prefix +  str.join("\n"+this.multiLineComments.prefix);

		return this.multiLineComments.open + str + this.multiLineComments.close;
	}

	//check if this supports a feature or not
	checkSupports(feature){
		if 	( 	(typeof(feature)==='undefined')
		  		||
				(feature!=true && feature!=false)
			)
			return true;
		else
			return feature;
	}


	//build the default commenting telling the user to goto the editor tab, etc.
	buildDefaultComment(){
		this.codeDOM.html(	this.wrapMuliLineComment(
								"Please create a class on the left, and edit it with the Editor tab!\n" + 
								"<-----" ));
	}

	//adds some comments with warnings
	buildCode_Warnings(item, info){

		var ret = this.getWarningText(info);

		//finish up the comment
		ret = this.wrapMuliLineComment(ret) + "\n";

		return ret;
	}


	//make the warning text bassed on the classes properities
	getWarningText(info){
		var ret = 	"Warning! The following "+this.langName+" code is automatically generated and may contain errors.\n" + 
					"Classetta tries to be accurate as possible, but only provides minimal error checking.\n" + 
					"Garbage In = Garbage Out. Make sure to use proper "+this.langName+" names, legal characters, not reserved words, etc.\n";

		//make a handy private method to generate a warning line
		var me = this;
		var hasWarnings = false;
		var warn = function(statement){ ret += ("\nWarning! " + statement); hasWarnings=true; };

		// CLASS LEVEL WARNINGS

			if(info.isAbstract && info.isFinal)
				warn("You specified both Abstract and Final. That's probably not what you meant.");

			if(info.isPublic==false && !this.checkSupports(this.features.private))
				warn(this.langName+" doesn't support Private classes.");

			if(info.isFinal && !this.checkSupports(this.features.final))
				warn(this.langName+" doesn't support Final classes.");

			if(info.isAbstract && !this.checkSupports(this.features.abstract))
				warn(this.langName+" doesn't support Abstract classes.");

			if(info.hasAncestor && !this.checkSupports(this.features.inheritance))
				warn(this.langName+" doesn't support Inheritance. Ignoring ancestor: "+info.ancestor);

			if(info.hasInterfaces && !this.checkSupports(this.features.interfaces))
				warn(this.langName+" doesn't support Interfaces. Ignoring: "+info.interfaces);

			if(!this.checkSupports(this.features.types))
				warn(this.langName+" is not a Typed language. Ignoring Method/Member Type declarations.");

		// MEMBER LEVEL WARNINGS

			if(info.hasConstMembers && !this.checkSupports(this.features.members.constants))
				warn(this.langName+" doesn't support Constant Members! Declaring as regular Members instead.");

			if(info.hasProtectedMembers && !this.checkSupports(this.features.members.protected))
				warn(this.langName+" doesn't support Protected Members! Declaring as Private Members instead.");

			if(info.hasPrivateMembers && !this.checkSupports(this.features.members.private))
				warn(this.langName+" doesn't support Private Members! Declaring as regular Members instead.");

			if(info.hasStaticMembers && !this.checkSupports(this.features.members.static))
				warn(this.langName+" doesn't support Static Members! Declaring as regular Members instead.");

		// METHOD LEVEL WARNINGS

			if(info.hasAbstractFinalMethods){
				var names = [];
				for(var i=0; i<info.abstractFinalMethods; i++)
					names.push(info.abstractFinalMethods[i].mName);
				warn("The Methods: [" + names.join(', ') + "] were specified as both Abstract and Final.  That's probably not what you meant.");
			}

			if(info.hasConstMethods && !this.checkSupports(this.features.methods.constants))
				warn(this.langName+" doesn't support Final Methods! Declaring as regular Methods instead.");

			if(info.hasAbstractMethods && !this.checkSupports(this.features.methods.abstract))
				warn(this.langName+" doesn't support Abstract Methods! Declaring as regular Methods instead.");

			if(info.hasProtectedMethods && !this.checkSupports(this.features.methods.protected))
				warn(this.langName+" doesn't support Protected Methods! Declaring as Private Methods instead.");

			if(info.hasPrivateMethods && !this.checkSupports(this.features.methods.private))
				warn(this.langName+" doesn't support Private Methods! Declaring as regular Methods instead.");

			if(info.hasStaticMethods && !this.checkSupports(this.features.methods.static))
				warn(this.langName+" doesn't support Static Methods! Declaring as regular Methods instead.");

		//add extra newline if has warnings
		if(hasWarnings) ret += "\n";

		//return our list of warnings!
		return ret;

	}

}