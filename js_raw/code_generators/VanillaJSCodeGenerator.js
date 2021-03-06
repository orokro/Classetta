class VanillaJSCodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//Make note of language name
		this.langName = "Vanilla JavaScript";

		//set up comment styles
		this.singleLineComments = "// ";
		this.multiLineComments = { 	  open: '/*\n',
									 close: '\n*/',
									prefix: "\t"	};

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
							inheritance: false,
							interfaces: false,
							final: false,
							abstract: false,
							private: false,
							types: false,
							methods: {
										final: false,
										abstract: false,
										private: false,
										protected: false
									 },
							members: {
										final: false,
										private: false,
										protected: false
									 }
						};
						
		//build the area for the code:
		this.DOM.append("<pre><code class=\"javascript\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));

		//colorize it
		hljs.highlightBlock(this.codeDOM[0]);
	}

	//builds the code!
	buildCode(item, info){

		//variable to build the code
		var ret = 	this.buildCode_Warnings(item, info) + 
					this.buildCode_Definition(item, info) + "\n\n" +
					this.buildCode_Constructor(item, info) +
					"\t" + this.comment("...") + 
					"}\n\n" + 
					this.buildCode_Prototype(item, info) + 
					this.buildCode_Constants(item, info) +
					this.buildCode_StaticMembers(item, info) +
					this.buildCode_StaticMethods(item, info);

		return ret;
	}
	
	//build essentially the first line of the class: the defition
	buildCode_Definition(item, info){

		//build the left part that usually looks like "public final class foo"
		var ret = 	'var ' + info.name + " = function(){ ";

		//if it extends anything, add that here:
		//var ancestor = item.getAncestor();
		//if(ancestor!=null && ancestor!='')
		//	ret += ' extends ' + ancestor;

		//if it implements any interfaces, add those here:
		if(info.hasInterfaces){
			ret += this.comment('implements ', false);
			for(var i=0; i<info.interfaces.length; i++)
				ret += info.interfaces[i].mName + ', ';
			//truncate last two chars (', ')
			ret = ret.substring(0, ret.length - 2);
		}

		return ret;
	}

	//build a constructor method for the class:
	buildCode_Constructor(item, info){

		var ret="\t" + this.comment("Constructor");

		//if this class is abstract when a put in the abstract hack
		if(info.isAbstract){

			ret += 	"\n\t" + this.comment("JavaScript doesn't natively support Abstract classes, but this solution is a hack that attempts to solve that.") +
					"\t" + this.comment("Found here: http://tinyurl.com/nhmhc4z") + 
					"\tif (new.target === " + info.name + "){\n" + 
					"\t\tthrow new TypeError(\"Cannot construct Abstract instances directly\");\n" + 
					"\t}\n\n";

		}
		/*
		//if the class has an ancestor lets call super in the constructor!
		if(item.getAncestor()!=null && item.getAncestor!="")
			ret += 	"\n\t// call super constructor\n" + 
					"\tsuper();\n";*/

		return ret;
	}
	
	//make the prototype
	buildCode_Prototype(item, info){

		//use the otehr buildings to make the prototypes components
		var ret = 	info.name + ".prototype = {\n\n" + 
					this.buildCode_Members(item, info) + 
					this.buildCode_Methods(item, info);

		//remove the last comma:
		ret = ret.split(',');
		ret = ret.splice(0, ret.length-1).join(',') + ret[ret.length-1]

		//close the prototype area
		ret +=		"}\n\n";

		return ret;
	}

	//build out all the member variables
	buildCode_Members(item, info){

		var typeDefaults =  [null, 0, 0, 0, 0, '0.0', '0.0', '', '', 'false'];

		//get list of methods and filter out static methods and constants
		var members = item.getMembers().filter(function(n){ return (n.isStatic!=true && n.isConst!=true); });
		
		//code to return
		var ret = '';

		if(members.length>0){

			ret += 	"\t" + this.comment("Member Variables");

			for(var i=0; i<members.length; i++){

				var itm = members[i];

				ret += "\t" + itm.mName + ": ";

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

				//add semicolon and new line
				ret += ",\n";

			}//next i

			ret += "\n";
		}

		return ret;
	}

	//build out all the methods
	buildCode_Methods(item, info){

		//get list of methods and filter out static ones
		var methods = item.getMethods().filter(function(n){ return (n.isStatic!=true); });

		//code to return
		var ret = '';

		if(methods.length>0){

			//code to return:
			ret = "\t" + this.comment("Methods");

			//loop over methods
			for(var i=0; i<methods.length; i++){

				//get the method
				var method = methods[i];

				ret += 	"\t" + method.mName + ": function(){\n" + 
						"\t\t//...\n" + 
						"\t},\n";
			}//next i

		}//endif has methods

		return ret;
	}

	//filter out and display constants before the class actually starts
	buildCode_Constants(item, info){

		var typeDefaults =  [null, 0, 0, 0, 0, '0.0', '0.0', '', '', 'false'];

		//get just constants
		var constants = info.constMembers;

		var ret='';

		if(info.hasConstMembers){

			ret += 	this.comment("Constants") + 
					this.comment("NOTE: JavaScript doesn't natively support constants.") +
					this.comment("Using all caps is a convention, but doesn't actually make them immutable."); 

			for(var i=0; i<constants.length; i++){

				var constant = constants[i];

				//get conver the name to CONSTANT_STYLE
				var name = constant.mName.replace(/([A-Z].)/g, '_$1');
				if(name.charAt(0)=='_') name = name.substr(1);
				name = name.toUpperCase();

				ret +=  item.getName() + "." + name + " = ";

				if(constant.val != null){
					switch(parseInt(constant.mType)){
						case INT:
						case DOUBLE:
						case SHORT:
						case LONG:
						case BYTE:
						case FLOAT:
							ret += constant.val;
							break;						
						case CHAR:
							ret += "'" + constant.val + "'";
							break;
						case STRING:
							ret += "\"" + constant.val + "\"";
							break;
						case BOOLEAN:
							ret += constant.val.toString();
							break
					}//swatch
				}else{
					ret += typeDefaults[constant.mType];
				}//has default value

				//add semicolon and new line
				ret += ";\n";

			}//next i

			ret += "\n";
		}

		return ret;

	}

	//build out just the static members
	buildCode_StaticMembers(item, info){

		var typeDefaults =  [null, 0, 0, 0, 0, '0.0', '0.0', '', '', 'false'];

		//get just static members`
		var members = info.staticMembers;

		var ret='';

		if(info.hasStaticMembers){

			ret += 	this.comment("Static Members");

			for(var i=0; i<members.length; i++){

				var member = members[i];

				ret +=  info.name + "." + members[i].mName;

				if(member.val != null){
					switch(parseInt(member.mType)){
						case INT:
						case DOUBLE:
						case SHORT:
						case LONG:
						case BYTE:
						case FLOAT:
							ret += " = " + member.val;
							break;						
						case CHAR:
							ret += " = '" + member.val + "'";
							break;
						case STRING:
							ret += " = \"" + member.val + "\"";
							break;
						case BOOLEAN:
							ret += " = " + member.val.toString();
							break
					}//swatch
				}else{
					ret += " = " + typeDefaults[member.mType];
				}//has default value

				//add semicolon and new line
				ret += ";\n";

			}//next i

			ret += "\n";
		}

		return ret;
	}

	buildCode_StaticMethods(item, info){
		
		//get list of methods and filter only static ones
		var methods = info.staticMethods;

		//code to return
		var ret = '';

		if(info.hasStaticMethods){

			//code to return:
			ret = this.comment("Static Methods");

			//loop over methods
			for(var i=0; i<methods.length; i++){

				//get the method
				var method = methods[i];

				ret += 	info.name + "." + method.mName + " = function(){\n" + 
						"\t//...\n" + 
						"}\n";
			}//next i

		}//endif has methods

		return ret;
	}

	// build out some useful common code structures
	buildExtraSamplesCode(){

		return 	"// Conditionals\nif(someVar==true){\n\t// ...\n}else if(otherVar>10){\n\t// ...\n}else{"+
				"\n\t// ...\n}\n\n// Switch can use numbers or string labels\nswitch(someVar){\n\tcase 1:"+
				"\n\tcase 2:\n\tcase 3:\n\t\t// ...\n\t\tbreak;\n\tcase 4:\n\t\t// ...\n\t\tbreak;\n\tcase \"five\":\n\t\t"+
				"// JS can use string labels also\n\t\tbreak;\n\tdefault:\n\t\t// ...\n}\n\n// For loop\nfor("+
				"var i=0; i<10; i++){\n\t// ...\n}\n\n// For In loop\n// NOTE: Look this one up, it's g"+
				"ot some gotcha's.\nitems = [1, 2, 3, 4, 5];\nfor(var i in items){\n\t// ...\n}\n\n// Wh"+
				"ile loops\nwhile(true){\n\t// ...\n}\n\n// Do-while loops\ndo{\n\t// ...\n}while(true);"+
				"";
	}

}