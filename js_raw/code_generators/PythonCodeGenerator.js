class PythonCodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//Make note of language name
		this.langName = "Python";

		//set up comment styles
		this.singleLineComments = "# ";
		this.multiLineComments = { 	  open: '\"\"\"\n',
									 close: '\n\"\"\"',
									prefix: "\t"	};

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
							private: false,
							final: false,
							interfaces: false,
							types: false,
							methods: {
										final: false,
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
		this.DOM.append("<pre><code class=\"python\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));

	}

	//builds the code!
	buildCode(item, info){

		//variable to build the code
		var ret = 	this.buildCode_Warnings(item, info) +
					this.buildCode_Definition(item, info) +
					this.buildCode_StaticMembers(item, info) + "\n" + 
					this.buildCode_Constructor(item, info) +
					this.buildCode_Members(item, info) + "\n" +
					"\t\t" + this.comment("...") + "\n" + 
					this.buildCode_Methods(item, info);

		return ret;
	}
	
	//build essentially the first line of the class: the defition
	buildCode_Definition(item, info){

		//build the left part that usually looks like "public final class foo"
		var ret = 	"\n\nclass " + ((info.isPublic)?'':'_') + info.name; 

		//if it extends anything, add that here:
		if(info.hasAncestor)
			ret += '(' + info.ancestor + ')';

		//add the colon and new line before a possible abstract class definition
		ret += ":\n";

		//if this class is abstract, use the Python ABC thingy
		if(info.isAbstract){
			ret = "from abc import ABCMeta, abstractmethod\n\n" + ret;
			ret += "\t__metaclass__ = ABCMeta\n";
		}
		return ret;

	}

	//in python the static members are declared seperately from the isntance variables, so here a sperate method to do that
	buildCode_StaticMembers(item, info){

		//get list of members
		var members = info.staticMembers;
		
		//code to return
		var ret = '';

		if(info.hasStaticMembers){

			//code to return:
			ret = "\n\t" + this.comment("Class Variables (static)");

			//loop over methods
			for(var i=0; i<members.length; i++){

				//get the method
				var member = members[i];

				if(member.isStatic){

					ret += "\t" + ((member.access==PUBLIC)?'':'_') + member.mName;

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
								ret += " = " + this.firstToUpper(member.val);
								break
						}//swatch
				
					}else{
						ret += " = None";
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
				"\tdef __init__(self):\n"

		//if the class has an ancestor lets call super in the constructor!
		if(info.hasAncestor)
			ret += 	"\n\t\t" + this.comment("Call Super Constructor") + 
					"\t\tself.super(self, " + info.name + ").__init__()\n";
					//"\t\t" + info.ancestor + ".__init__(self)\n";
		return ret;
	}

	//build out all the member variables
	buildCode_Members(item, info){

		//get list of members
		var members = info.members.filter(function(n){ return (n.isStatic!=true); });
		
		//code to return
		var ret = '';

		if(members.length>0){

			//code to return:
			ret = "\n\t\t" + this.comment("Instance Variables");

			//loop over methods
			for(var i=0; i<members.length; i++){

				//get the method
				var member = members[i];

				if(!member.isStatic){

					ret += "\t\tself." + ((member.access==PUBLIC)?'':'_') + member.mName;

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
								ret += " = " + this.firstToUpper(member.val);
								break
						}//swatch
					}else{
						ret += " = None";
					}//endif has default value
				
				//apply the new line
				ret += "\n";

				}//endif not static

			}//next i

		}//endif has methods

		return ret;
	}

	//build out all the methods
	buildCode_Methods(item, info){

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

				if(method.isStatic)
					ret +=	"\t@staticmethod\n";
				if(method.isAbstract)
					ret += 	"\t@abc.abstractmethod\n";
				
				ret += 		"\tdef " + ((method.access==PUBLIC)?'':'_') + method.mName + ((method.isStatic)?"()":"(self)") + ":\n";

				if(method.isAbstract)
					ret +=	"\t\t\"\"\"Abstract Method: "+ method.mName +" Documentation...\"\"\"\n"+
							"\t\treturn\n\n";

				ret +=		"\t\t"+this.comment("...")+"\n\n";

			}//next i

		}//endif has methods

		return ret;
	}
	
	// build out some useful common code structures
	buildExtraSamplesCode(){

		return 	"# Conditionals\nif someVar==true:\n\t# ...\nelif otherVar>10):\n\t# ...\nelse:\n\t# ...\n\n"+
				"# For loop\nfor i in range(1, 10):\n\t# ...\n\n# For Each loop\nitems = [1, 2, 3, 4, 5"+
				"]\nfor itm in items:\n\t# ...\n\n# While loop\nwhile true:\n\t# ..."+
				"";
	}

}