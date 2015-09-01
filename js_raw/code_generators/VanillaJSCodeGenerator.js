class VanillaJSCodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//build the area for the code:
		this.DOM.append("<pre><code class=\"javascript\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));

		//colorize it
		hljs.highlightBlock(this.codeDOM[0]);
	}
	//takes a class item and rebuilds the appropriate source code based on the class item for this language
	update(item){

		//variable to build the code
		var code = 	this.buildCode_Warnings(item) + "\n" + 
					this.buildCode_Definition(item) + "\n\n" +
					this.buildCode_Constructor(item) +
					"\t//...\n" + 
					"}\n\n" + 
					this.buildCode_Prototype(item) + 
					this.buildCode_Constants(item) +
					this.buildCode_StaticMembers(item) +
					this.buildCode_StaticMethods(item);

		//update the code inside the code tag
		this.codeDOM.html(code);

		//apply the code highlighting
		hljs.highlightBlock(this.codeDOM[0]);

	}

	//adds some comments with warnings
	buildCode_Warnings(item){

		var ret = 	"/*\n" + 
					"\tWarning! The following JavaScript code is automatically generated and may contain errors.\n" + 
					"\tCode.Design tries to be accurate as possible, but only provides minimal error checking.\n" + 
					"\tGarbage In = Garbage Out. Make sure to use proper JavaScript names, legal characters, not reserved words, etc.";

		//check for warnings
		if(item.getFinal() && item.getAbstract)
				ret += "\n\n\tWARNING: you specified this class as both Abstract and Final. That's probably not what you meant.";

		//finish up the comment
		ret += "\n*/";

		return ret;
	}

	//build essentially the first line of the class: the defition
	buildCode_Definition(item){

		//build the left part that usually looks like "public final class foo"
		var ret = 	'var ' + item.getName() + " = function(){ ";

		//if it extends anything, add that here:
		//var ancestor = item.getAncestor();
		//if(ancestor!=null && ancestor!='')
		//	ret += ' extends ' + ancestor;

		//if it implements any interfaces, add those here:
		var interfaces = item.getInterfaces();
		if(interfaces.length>0){
			ret += '//implements ';
			for(var i=0; i<interfaces.length; i++)
				ret += interfaces[i].mName + ', ';
			//truncate last two chars (', ')
			ret = ret.substring(0, ret.length - 2);
		}

		return ret;
	}

	//build a constructor method for the class:
	buildCode_Constructor(item){

		var ret="\t// Constructor\n";

		//if this class is abstract when a put in the abstract hack
		if(item.getAbstract()==true){

			ret += 	"\n\t// JavaScript doesn't natively support Abstract classes, but this solution is a hack that attempts to solve that.\n"+
					"\t// Found here: http://tinyurl.com/nhmhc4z\n" + 
					"\tif (new.target === " + item.getName() + "){\n" + 
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
	buildCode_Prototype(item){

		//use the otehr buildings to make the prototypes components
		var ret = 	item.getName() + ".prototype = {\n\n" + 
					this.buildCode_Members(item) + 
					this.buildCode_Methods(item);

		//remove the last comma:
		ret = ret.split(',');
		ret = ret.splice(0, ret.length-1).join(',') + ret[ret.length-1]

		//close the prototype area
		ret +=		"}\n\n";

		return ret;
	}
	//build out all the member variables
	buildCode_Members(item){

		var typeDefaults =  [null, 0, 0, 0, 0, '0.0', '0.0', '', '', 'false'];

		//get list of methods and filter out static methods and constants
		var members = item.getMembers().filter(function(n){ return (n.isStatic!=true && n.isConst!=true); });
		
		//code to return
		var ret = '';

		if(members.length>0){

			ret += 	"\t// Member Variables\n";

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
	buildCode_Methods(item){

		//get list of methods and filter out static ones
		var methods = item.getMethods().filter(function(n){ return (n.isStatic!=true); });

		//code to return
		var ret = '';

		if(methods.length>0){

			//code to return:
			ret = "\t// Methods\n";

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
	buildCode_Constants(item){

		var typeDefaults =  [null, 0, 0, 0, 0, '0.0', '0.0', '', '', 'false'];

		//get just constants
		var constants = item.getMembers().filter(function(n){ return (n.isConst==true); });

		var ret='';

		if(constants.length>0){

			ret += 	"// Constants\n" + 
					"// NOTE: JavaScript doesn't natively support constants.\n" +
					"// Using all caps is a convention, but doesn't actually make them immutable.\n"; 

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
	buildCode_StaticMembers(item){

		var typeDefaults =  [null, 0, 0, 0, 0, '0.0', '0.0', '', '', 'false'];

		//get just static members`
		var members = item.getMembers().filter(function(n){ return (n.isStatic==true); });

		var ret='';

		if(members.length>0){

			ret += 	"// Static Members\n";

			for(var i=0; i<members.length; i++){

				var member = members[i];

				ret +=  item.getName() + "." + members[i].mName;

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

	buildCode_StaticMethods(item){
		
		//get list of methods and filter only static ones
		var methods = item.getMethods().filter(function(n){ return (n.isStatic==true); });

		//code to return
		var ret = '';

		if(methods.length>0){

			//code to return:
			ret = "// Static Methods\n";

			//loop over methods
			for(var i=0; i<methods.length; i++){

				//get the method
				var method = methods[i];

				ret += 	item.getName() + "." + method.mName + " = function(){\n" + 
						"\t//...\n" + 
						"}\n";
			}//next i

		}//endif has methods

		return ret;
	}



}