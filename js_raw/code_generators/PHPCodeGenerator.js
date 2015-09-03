class PHPCodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//Make note of language name
		this.langName = "PHP";

		//set up comment styles
		this.singleLineComments = "// ";
		this.multiLineComments = { 	  open: '/*\n',
									 close: '\n*/',
									prefix: "\t"	};

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
							private: false,
							types: false,
							methods: {
									 },
							members: {
									 }
						};
						
		//build the area for the code:
		this.DOM.append("<pre><code class=\"php\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));

	}

	//builds the code!
	buildCode(item, info){

		//variable to build the code
		var ret = 	this.buildCode_Warnings(item, info) +
					this.buildCode_Definition(item, info)  + "\n" +
					this.buildCode_Members(item, info) + "\n" +
					this.buildCode_Constructor(item, info) + "\n\n" +
					this.buildCode_Methods(item, info) + 
					"}";

		return ret;
	}
	
	//build essentially the first line of the class: the defition
	buildCode_Definition(item, info){

		//build the left part that usually looks like "public final class foo"
		var ret = 	((info.isFinal)?'final ':'') +
					((info.isAbstract)?'abstract ':'')+
					'class ' + info.name;
		//((item.getPublic())?'public ':'private ') +

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

		var accessToStr = ['private', 'public', 'protected'];

		//get list of methods
		var members = info.members;
		
		//code to return
		var ret = "";

		if(info.hasMembers){

			//handle constants first since the syntax is slightly different
			var constants = members.filter(function(n){ return (n.isConst==true); });
			if(constants.length>0){

				ret += "\n\t" + this.comment("Class Constants");
				for(var i=0; i<constants.length; i++){

					var constant = constants[i];
					ret += "\tconst " + constant.mName;

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
								ret += " = " + constant.val.toString().toUpperCase();
								break
						}//swatch
					}else{
						ret += ' = NULL';
					}//has default value

					ret += ";\n";
				}//next i

				//ret += "\n";

			}//end if has constants

			//now that we handled constants, lets filter them out
			members = members.filter(function(n){ return (n.isConst!=true); });

			if(members.length>0){

				//code to return:
				ret += "\n\t" + this.comment("Member Variables");

				//loop over methods
				for(var i=0; i<members.length; i++){

					//get the method
					var member = members[i];

					ret += 	"\t" + 
							accessToStr[member.access] + ' ' +
							((member.isStatic)?'static ':'') +
							'$' + member.mName;

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
								ret += " = " + member.val.toString().toUpperCase();
								break
						}//swatch
					}//has default value

					//apply the semicolon and new line
					ret += ";\n";

				}//next i

			}//end if has non constants

		}//endif has methods

		return ret;
	}

	//build a constructor method for the class:
	buildCode_Constructor(item, info){

		var ret="\t" + this.comment("Constructor") + 
				"\tfunction __construct(){\n";

		//if the class has an ancestor lets call super in the constructor!
		if(item.getAncestor()!=null && item.getAncestor!="")
			ret += 	"\n\t\t" + this.comment("Call Super Constructor") + 
					"\t\tparent::__construct();\n";

		ret +=	"\n\t\t" + this.comment("...") +
				"\t}";
		return ret;
	}

	//build out all the methods
	buildCode_Methods(item, info){

		var accessToStr = ['private', 'public', 'protected'];

		//get list of methods
		var methods = info.methods;

		//code to return
		var ret = '';

		if(info.hasMethods){

			//code to return:
			ret = "\t" + this.comment("Methods");

			//loop over methods
			for(var i=0; i<methods.length; i++){

				//get the method
				var method = methods[i];

				ret += 	"\t" + 
						((method.isConst)?'final ':'') +
						accessToStr[method.access] + ' ' +
						((method.isStatic)?'static ':'') +
						"function " + 
						method.mName + "(){\n" + 
						"\t\t" + this.comment("...") + 
						"\t}\n\n";
			}//next i

		}//endif has methods

		return ret;
	}

}