class ES6CodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//Make note of language name
		this.langName = "JavaScript ES6";

		//set up comment styles
		this.singleLineComments = "// ";
		this.multiLineComments = { 	  open: '/*\n',
									 close: '\n*/',
									prefix: "\t"	};

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
							interfaces: false,
							abstract: false,
							final: false,
							private: false,
							types: false,
							methods: {
										final: false,
										abstract: false,
										private: false,
										protected: false
									 },
							members: {
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
					this.buildCode_Constants(item, info) +
					this.buildCode_Definition(item, info) + "\n\n" +
					this.buildCode_Constructor(item, info) + "\n" +
					this.buildCode_Members(item, info) + 
					"\t\t" + this.comment("...") + 
					"\t}\n\n" + 
					this.buildCode_Methods(item, info) + 
					"}\n\n" + 
					this.buildCode_StaticMembers(item, info) +
					this.buildCode_StaticMethods(item, info);

		return ret;
	}
	
	//filter out and display constants before the class actually starts
	buildCode_Constants(item, info){

		//get just constants
		var constants = info.constMembers;

		var ret='';

		if(info.hasConstMembers){

			ret += 	"\n" + this.comment("Constants") + 
					this.comment("NOTE: Unless I'm misunderstanding the documentation, class constants must actually be global to be used throughout the class.") + 
					this.comment("If they're defined in the constructor() they will only be available in the constructors scope... Way to go ES6 /s");

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
	buildCode_Definition(item, info){

		//build the left part that usually looks like "public final class foo"
		var ret = 	'class ' + info.name;

		//if it extends anything, add that here:
		if(info.hasAncestor)
			ret += ' extends ' + info.ancestor;

		//finally add the '{'
		ret += ' {';
		return ret;

	}

	//build a constructor method for the class:
	buildCode_Constructor(item, info){

		var ret="\t" + this.comment("Constructor") + 
				"\tconstructor(){\n";

		//if this class is abstract when a put in the abstract hack
		if(info.isAbstract){

			ret += 	"\n\t\t" + this.comment("ES6 doesn't natively support Abstract classes, but this solution is a hack that attempts to solve that.") +
					"\t\t" + this.comment("Found here: http://tinyurl.com/om5xm8w") + 
					"\t\tif (new.target === " + info.name + "){\n" + 
					"\t\t\tthrow new TypeError(\"Cannot construct Abstract instances directly\");\n" + 
					"\t\t}\n";

		}

		//if the class has an ancestor lets call super in the constructor!
		if(info.hasAncestor)
			ret += 	"\n\t\t" + this.comment("Call Super Constructor") + 
					"\t\tsuper();\n";

		return ret;
	}

	//build out all the member variables
	buildCode_Members(item, info){

		//get list of methods and filter out static methods and constants
		var members = item.getMembers().filter(function(n){ return (n.isStatic!=true && n.isConst!=true); });
		
		//code to return
		var ret = '';

		if(members.length>0){

			//code to return:
			ret = "\t\t" + this.comment("Member Variables");

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

				ret += 	"\t" + method.mName + "(){\n" + 
						"\t\t" + this.comment("...") + 
						"\t}\n\n";
			}//next i

		}//endif has methods

		return ret;
	}

	//build out just the static members
	buildCode_StaticMembers(item, info){

		//get just static members
		var members = info.staticMembers;

		var ret='';

		if(info.hasStaticMembers){

			ret += this.comment("Static Members");

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
					ret += " = null";
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

				ret += 	info.name + "." + method.mName + "(){\n" + 
						"\t" + this.comment("...") + 
						"}\n\n";
			}//next i

		}//endif has methods

		return ret;
	}

}