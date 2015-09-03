class RubyCodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//Make note of language name
		this.langName = "Ruby";

		//set up comment styles
		this.singleLineComments = "# ";
		this.multiLineComments = { 	  open: '=begin\n',
									 close: '\n=end',
									prefix: "\t"	};

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
							abstract: false,
							final: false,
							private: false,
							protected: false,
							types: false,
							methods: {
										abstract: false,
										final: false,
										protected: false
									 },
							members: {
										protected: false
									 }
						};
						
		//build the area for the code:
		this.DOM.append("<pre><code class=\"ruby\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));

		//colorize it
		hljs.highlightBlock(this.codeDOM[0]);
	}

	//builds the code!
	buildCode(item, info){

		//variable to build the code
		var ret = 	this.buildCode_Warnings(item, info) +
					this.buildCode_Definition(item, info) +
					this.buildCode_Constants(item, info) + 
					this.buildCode_PublicMembers(item, info) + 
					this.buildCode_StaticMembers(item, info) + "\n" + 
					this.buildCode_Constructor(item, info) +
					this.buildCode_Members(item, info) + "\n" +
					"\t\t" + this.comment("...") + 
					"\tend\n\n" + 
					this.buildCode_PublicMethods(item, info) +
					this.buildCode_PrivateMethods(item, info) + 
					"end";

		return ret;
	}
	
	//build essentially the first line of the class: the defition
	buildCode_Definition(item, info){

		//build the left part that usually looks like "public final class foo"
		var ret = 	'class ' + info.name; 

		//if it extends anything, add that here:
		if(info.hasAncestor)
			ret += ' < ' + info.ancestor;

		//add newline
		ret += "\n";

		return ret;

		// just a note: Ruby doesn't natively support private classes, final classes, abstract classes, or interfaces.

	}

	//build out all the constant variables for this class... ugh
	buildCode_Constants(item, info){

		//filter out non-constants:
		var constants = info.constMembers;

		var ret='';

		if(info.hasConstMembers){

			ret = "\n\t" + this.comment("Class Constants");

			//loop over methods
			for(var i=0; i<constants.length; i++){

				//get the constant
				var constant = constants[i];

				//get the name of the constant and make sure it's first letter is uppercase:
				ret += "\t" + this.firstToUpper(constant.mName);

				if(constant.val != null){
					switch(parseInt(constant.mType)){
						case INT:
						case SHORT:
						case LONG:
						case BYTE:
						case FLOAT:
						case DOUBLE:
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
					ret += " = Nil";
				}//endif has default value
				
				//apply the new line
				ret += "\n";

			}//next i

		}//end if has constants

		return ret;
	}

	//build out all the constant variables for this class... ugh
	buildCode_PublicMembers(item, info){

		//filter out constant/static members:
		var members = item.getMembers().filter(function(n){ return (n.isConst!=true && n.isStatic!=true); });

		//filter just the public methods:
		members = members.filter(function(n){ return (n.access==PUBLIC) });

		var ret='';

		if(members.length>0){

			ret = 	"\n\t" + this.comment("Public members") + 
					"\t" + this.comment("NOTE: in addition to a 'attr_accessor', Ruby also implements:") + 
					"\t" + this.comment("attr_reader (for public read access only)") +
					"\t" + this.comment("attr_writer (for public write access only)");


			//loop over methods
			for(var i=0; i<members.length; i++){

				//get the constant
				var member = members[i];

				ret += "\tattr_accessor :" + member.mName + "\n";

			}//next i

		}//end if has members

		return ret;
	}


	//in Ruby public member variables and static member variables have slightly different syntax than regular memember varaibles.
	buildCode_StaticMembers(item, info){

		//get list of members
		var members = info.members;
		
		//code to return
		var ret = '';

		//filter out just static members
		members = members.filter(function(n){ return (n.isStatic==true); });
		
		if(members.length>0){

			//code to return:
			ret = "\n\t" + this.comment("Class Variables (static)");

			//loop over methods
			for(var i=0; i<members.length; i++){

				//get the method
				var member = members[i];

				if(member.isStatic){

					ret += "\t@@" + member.mName;

					if(member.val != null){
						switch(parseInt(member.mType)){
							case INT:
							case SHORT:
							case LONG:
							case BYTE:
							case FLOAT:
							case DOUBLE:
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
						ret += " = Nil";
					}//endif has default value
				
				//apply the new line
				ret += "\n";

				}//endif static

			}//next i

		}//endif has methods

		return ret;
	}

	//build a constructor method for the class:
	buildCode_Constructor(item, info){

		var ret="\t" + this.comment("Constructor") + 
				"\tdef initialize()\n"

		//if the class has an ancestor lets call super in the constructor!
		if(info.hasAncestor)
			ret += 	"\n\t\t" + this.comment("Call Super Constructor") + 
					"\t\tsuper()\n";

		return ret;
	}

	//build out all the member variables inside the initialize function in ruby
	buildCode_Members(item, info){

		//get list of members
		var members = info.members;
		
		//filter out static and constant methods
		members = members.filter(function(n){ return ( n.isStatic!=true && n.isConst!=true ); });

		//code to return
		var ret = '';

		if(members.length>0){

			//code to return:
			ret = "\n\t\t" + this.comment("Instance Variables");

			//loop over methods
			for(var i=0; i<members.length; i++){

				//get the method
				var member = members[i];

				ret += "\t\t@" + member.mName;

				if(member.val != null){
					switch(parseInt(member.mType)){
						case INT:
						case SHORT:
						case LONG:
						case BYTE:
						case FLOAT:
						case DOUBLE:
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
					ret += " = Nil";
				}//endif has default value
				
				//apply the new line
				ret += "\n";

			}//next i

		}//endif has methods

		return ret;
	}

	//build out all public methods
	buildCode_PublicMethods(item, info){

		//filter out just the public methods
		var methods = item.getMethods().filter(function(n){ return (n.access==PUBLIC); });

		var ret='';

		if(methods.length>0){

			ret += 	"\t" + this.comment("Public Methods") + 
					"\tpublic\n\n";

			//build the methods
			ret += this.buildCode_Methods(methods);

		}

		return ret;
	}

	//build out all private methods
	buildCode_PrivateMethods(item, info){

		//filter out just the public methods
		var methods = item.getMethods().filter(function(n){ return (n.access==PRIVATE || n.access==PROTECTED); });

		var ret='';

		if(methods.length>0){

			ret += 	"\t" + this.comment("Private Methods") + 
					"\tprivate\n\n";

			//build the methods
			ret += this.buildCode_Methods(methods);

		}

		return ret;
	}

	//helper function for buildCode_PublicMethods and buildCode_PrivateMethods build out all the methods
	buildCode_Methods(methods){

		//code to return
		var ret = '';

		if(methods.length>0){

			//loop over methods
			for(var i=0; i<methods.length; i++){

				//get the method
				var method = methods[i];

				ret += 	"\tdef " + ((method.isStatic)?'self.':'') + method.mName + "()\n" + 
						"\t\t" + this.comment("...") +
						"\tend\n\n";

			}//next i

		}//endif has methods

		return ret;
	}

}