class TypeScriptCodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//Make note of language name
		this.langName = "TypeScript";

		//set up comment styles
		this.singleLineComments = "// ";
		this.multiLineComments = { 	  open: '/*\n',
									 close: '\n*/',
									prefix: "\t"	};

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
							abstract: false,
							final: false,
							private: false,
							methods: {
										final: false,
										abstract: false,
									 },
							members: {
									 }
						};
						
		//build the area for the code:
		this.DOM.append("<pre><code class=\"typescript\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));

		//colorize it
		hljs.highlightBlock(this.codeDOM[0]);
	}

	//builds the code!
	buildCode(item, info){

		//variable to build the code
		var ret = 	this.buildCode_Warnings(item, info) +
					this.buildCode_Definition(item, info) + "\n" +
					this.buildCode_Members(item, info) +
					this.buildCode_Constructor(item, info) + "\n" +
					this.buildCode_MemberAssignments(item, info) + 
					"\t\t" + this.comment("...") +
					"\t}\n\n" + 
					this.buildCode_Methods(item, info) + 
					this.buildCode_Constants(item, info) + 
					"}";

		return ret;
	}
	
	//build essentially the first line of the class: the defition
	buildCode_Definition(item, info){

		//build the left part that usually looks like "public final class foo"
		var ret = 	'class ' + info.name;

		//if it extends anything, add that here:
		if(info.hasAncestor)
			ret += ' extends ' + info.ancestor;

		//if it implements any interfaces, add those here:
		if(info.hasInterfaces){
			ret += ' implements ';
			for(var i=0; i<info.interfaces.length; i++)
				ret += info.interfaces[i].mName + ', ';
			//truncate last two chars (', ')
			ret = ret.substring(0, ret.length - 2);
		}

		//finally add the '{'
		ret += ' {';
		return ret;

	}

	//build out all the member variables
	buildCode_Members(item, info){

		var typeToStr = ['void', 'number', 'number', 'number', 'number', 'number', 'number', 'string', 'string', 'boolean'];
		var typeDefaults =  [null, 0, 0, 0, 0, '0.0', '0.0', '', '', 'false'];
		var accessToStr = ['private', 'public', 'protected'];

		//get list of members and filter statics
		var statics = item.getMembers().filter(function(n){ return (n.isStatic==true && n.isConst!=true); });
		
		//code to return
		var ret = '';

		if(statics.length>0){

			//code to return:
			ret = "\n\t" + this.comment("Static Member Variables");

			//loop over methods
			for(var i=0; i<statics.length; i++){

				//get the method
				var itm = statics[i];

				ret += 	"\tstatic " + itm.mName + ': ' + typeToStr[parseInt(itm.mType)];

				if(itm.val != null){
					switch(parseInt(itm.mType)){
						case INT:
						case DOUBLE:
						case SHORT:
						case LONG:
						case BYTE:
						case FLOAT:
							ret += " = " + itm.val;
							break;
						case CHAR:
							ret += " = '" + itm.val + "'";
							break;
						case STRING:
							ret += " = \"" + itm.val + "\"";
							break;
						case BOOLEAN:
							ret += " = " + itm.val.toString();
							break
					}//swatch
				}else{
					ret += " = " + typeDefaults[itm.mType];
				}//has default value

				//apply the semicolon and new line
				ret += ";\n";

			}//next i

		}//endif has methods

		//now lets get a list of the non-statics, non-constants
		var members = item.getMembers().filter(function(n){ return ( n.isStatic!=true && n.isConst!=true); });

		if(members.length>0){

			//code to return:
			ret += "\n\t" + this.comment("Member Variables");

			//loop over methods
			for(var i=0; i<members.length; i++){

				//get the method
				var itm = members[i];

				ret += 	"\t" + accessToStr[itm.access] + ' ' + itm.mName + ': ' + typeToStr[parseInt(itm.mType)] + ";\n";
			}//next i

		}//endif has methods

		return ret;
	}

	//build a constructor method for the class:
	buildCode_Constructor(item, info){

		var ret="\n\t" + this.comment("Constructor") + 
				"\tconstructor(){\n";

		//if the class has an ancestor lets call super in the constructor!
		if(item.getAncestor()!=null && item.getAncestor!="")
			ret += 	"\n\t\t" + this.comment("Call Super Constructor") + 
					"\t\tsuper();\n";
		return ret;
	}

	//build out all the member variables
	buildCode_MemberAssignments(item, info){

		var typeToStr = ['void', 'int', 'short', 'long', 'byte', 'float', 'double', 'char', 'String', 'boolean'];

		//get list of methods that are not static or constants
		var members = item.getMembers().filter(function(n){ return (n.isStatic!=true && n.isConst!=true); });
		
		//filter out members that do actually have an initial value
		members = members.filter(function(n){ return (n.val!=null); });

		//code to return
		var ret = '';

		if(members.length>0){

			//code to return:
			ret = "\t\t" + this.comment("Initialize Member Variables");

			//loop over methods
			for(var i=0; i<members.length; i++){

				//get the method
				var itm = members[i];

				ret += 	"\t\tthis." + itm.mName;

				//since we filted the members arealdy, it's gaurented to have a value
				//no need to check again
				switch(parseInt(itm.mType)){
					case INT:
					case DOUBLE:
					case SHORT:
					case LONG:
					case BYTE:
					case FLOAT:
						ret += " = " + itm.val;
						break;
					case CHAR:
						ret += " = '" + itm.val + "'";
						break;
					case STRING:
						ret += " = \"" + itm.val + "\"";
						break;
					case BOOLEAN:
						ret += " = " + itm.val.toString();
						break
				}//swatch


				//apply the semicolon and new line
				ret += ";\n";

			}//next i

			ret += "\n";
		}//endif has methods

		return ret;
	}

	//build out all the methods
	buildCode_Methods(item, info){

		var typeToStr = ['void', 'number', 'number', 'number', 'number', 'number', 'number', 'string', 'string', 'boolean'];
		var accessToStr = ['private', 'public'];

		//get list of methods
		var methods = item.getMethods();

		//code to return
		var ret = '';

		if(methods.length>0){

			//code to return:
			ret = "\t" + this.comment("Methods");

			//loop over methods
			for(var i=0; i<methods.length; i++){

				//get the method
				var method = methods[i];

				ret += 	"\t" + 
						accessToStr[method.access] + ' ' +
						((method.isStatic)?'static ':'') +
						method.mName + "(): " + typeToStr[parseInt(method.mType)] + "{\n" + 
						"\t\t" + this.comment("...") + 
						"\t}\n\n";
			}//next i

		}//endif has methods

		return ret;
	}

	buildCode_Constants(item, info){

		var typeToStr = ['void', 'number', 'number', 'number', 'number', 'number', 'number', 'string', 'string', 'boolean'];
		var typeDefaults =  [null, 0, 0, 0, 0, '0.0', '0.0', '', '', 'false'];
		var accessToStr = ['private', 'public', 'protected'];

		//get list of members and filter statics
		var constants = info.constMembers;
		
		//code to return
		var ret = '';

		if(info.hasConstMembers){

			//code to return:
			ret = 	"\t" + this.comment("Constants") +
					"\t" + this.comment("NOTE: TypeScript does not natively support constants.") + 
					"\t" + this.comment("This section is a workaround described here: http://tinyurl.com/op776sg");

			//loop over methods
			for(var i=0; i<constants.length; i++){

				//get the method
				var itm = constants[i];

				ret += 	"\tpublic static get " + itm.mName + ': ' + typeToStr[parseInt(itm.mType)] + " { return ";

				if(itm.val != null){
					switch(parseInt(itm.mType)){
						case INT:
						case DOUBLE:
						case SHORT:
						case LONG:
						case BYTE:
						case FLOAT:
							ret += itm.val;
							break;
						case CHAR:
							ret += "'" + itm.val + "'";
							break;
						case STRING:
							ret += "\"" + itm.val + "\"";
							break;
						case BOOLEAN:
							ret += itm.val.toString();
							break
					}//swatch
				}else{
					ret += typeDefaults[itm.mType];
				}//has default value

				//apply the semicolon and new line
				ret += "; }\n";

			}//next i

			ret += "\n";

		}//endif has methods

		return ret;
	}

	// build out some useful common code structures
	buildExtraSamplesCode(){

		return 	"// Conditionals\nif(someVar==true){\n\t// ...\n}else if(otherVar>10){\n\t// ...\n}else{"+
				"\n\t// ...\n}\n\n// Switch can use numbers or string labels\nswitch(someVar){\n\tcase 1:"+
				"\n\tcase 2:\n\tcase 3:\n\t\t// ...\n\t\tbreak;\n\tcase 4:\n\t\t// ...\n\t\tbreak;\n\tcase \"five\":\n\t\t"+
				"// JS can use string labels also\n\t\tbreak;\n\tdefault:\n\t\t// ...\n}\n\n// For loop\nfor("+
				"let i=0; i<10; i++){\n\t// ...\n}\n\n// For In loop\n// NOTE: Look this one up, it's g"+
				"ot some gotcha's.\nitems = [1, 2, 3, 4, 5];\nfor(let i in items){\n\t// ...\n}\n\n// Fo"+
				"r Of Loop\n// NOTE: look up for details, but this is closer to for-each\nfor(let i"+
				" of items){\n\t// ...\n}\n\n// While loops\nwhile(true){\n\t// ...\n}\n\n// Do-while loops\n"+
				"do{\n\t// ...\n}while(true);"+
				"";
	}

}