class ES6CodeGenerator extends CodeGenerator {

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
					this.buildCode_Constants(item) +
					this.buildCode_Definition(item) + "\n\n" +
					this.buildCode_Constructor(item) + "\n" +
					this.buildCode_Members(item) + 
					"\t\t//...\n" + 
					"\t}\n\n" + 
					this.buildCode_Methods(item) + 
					
					"}\n\n" + 
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
					"\tWarning! The following JavaScript ES6 code is automatically generated and may contain errors.\n" + 
					"\tCode.Design tries to be accurate as possible, but only provides minimal error checking.\n" + 
					"\tGarbage In = Garbage Out. Make sure to use proper JavaScript ES6 names, legal characters, not reserved words, etc.";

		//check for warnings
		if(item.getFinal() && item.getAbstract)
				ret += "\n\n\tWARNING: you specified this class as both Abstract and Final. That's probably not what you meant.";

		//finish up the comment
		ret += "\n*/";

		return ret;
	}

	//filter out and display constants before the class actually starts
	buildCode_Constants(item){

		//get just constants
		var constants = item.getMembers().filter(function(n){ return (n.isConst==true); });

		var ret='';

		if(constants.length>0){

			ret += 	"\n// Constants\n" + 
					"// NOTE: Unless I'm misunderstanding the documentation, class constants must actually be global to be used throughout the class.\n" + 
					"// If they're defined in the constructor() they will only be available in the constructors scope... Way to go ES6 /s\n"

			for(var i=0; i<constants.length; i++){

				var constant = constants[i];

				ret += "const " + constants[i].mName;

				if(constant.val != null){
					switch(parseInt(constant.mType)){
						case INT:
						case DOUBLE:
						case SHORT:
						case LONG:
						case BYTE:
						case FLOAT:
							ret += " = " + constant.val;
							break;						
						case CHAR:
							ret += " = '" + constant.val + "'";
							break;
						case STRING:
							ret += " = \"" + constant.val + "\"";
							break;
						case BOOLEAN:
							ret += " = " + constant.val.toString();
							break
					}//swatch
				}else{
					ret += " = null";
				}//has default value

				//add semicolon and new line
				ret += ";\n";

			}//next i

			ret += "\n";
		}

		return ret;

	}

	//build essentially the first line of the class: the defition
	buildCode_Definition(item){

		//build the left part that usually looks like "public final class foo"
		var ret = 	'class ' + item.getName();

		//if it extends anything, add that here:
		var ancestor = item.getAncestor();
		if(ancestor!=null && ancestor!='')
			ret += ' extends ' + ancestor;

		//finally add the '{'
		ret += ' {';
		return ret;

	}

	//build a constructor method for the class:
	buildCode_Constructor(item){

		var ret="\t// Constructor\n" + 
				"\tconstructor(){\n";

		//if this class is abstract when a put in the abstract hack
		if(item.getAbstract()==true){

			ret += 	"\n\t\t// ES6 doesn't natively support Abstract classes, but this solution is a hack that attempts to solve that.\n"+
					"\t\t// Found here: http://tinyurl.com/om5xm8w\n" + 
					"\t\tif (new.target === " + item.getName() + "){\n" + 
					"\t\t\tthrow new TypeError(\"Cannot construct Abstract instances directly\");\n" + 
					"\t\t}\n";

		}

		//if the class has an ancestor lets call super in the constructor!
		if(item.getAncestor()!=null && item.getAncestor!="")
			ret += 	"\n\t\t// call super constructor\n" + 
					"\t\tsuper();\n";

		return ret;
	}

	//build out all the member variables
	buildCode_Members(item){

		//get list of methods and filter out static methods and constants
		var members = item.getMembers().filter(function(n){ return (n.isStatic!=true && n.isConst!=true); });
		
		//code to return
		var ret = '';

		if(members.length>0){

			//code to return:
			ret = "\t\t// Member Variables\n";

			//loop over methods
			for(var i=0; i<members.length; i++){

				//get the method
				var member = members[i];

				ret += "\t\tthis." + member.mName;

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
					ret += " = null";
				}//has default value

				//apply the semicolon and new line
				ret += ";\n";

			}//next i

			ret += "\n";

		}//endif has methods

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

				ret += 	"\t" + method.mName + "(){\n" + 
						"\t\t//...\n" + 
						"\t}\n\n";
			}//next i

		}//endif has methods

		return ret;
	}

	//build out just the static members
	buildCode_StaticMembers(item){

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
					ret += " = null";
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

				ret += 	item.getName() + "." + method.mName + "(){\n" + 
						"\t//...\n" + 
						"}\n\n";
			}//next i

		}//endif has methods

		return ret;
	}

}