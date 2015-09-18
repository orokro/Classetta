class CppCodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//Make note of language name
		this.langName = "C++";

		//set up comment styles
		this.singleLineComments = "// ";
		this.multiLineComments = { 	  open: '/*\n',
									 close: '\n*/',
									prefix: "\t"	};

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
							methods: {
									 },
							members: {
									 }
						};
						
		//build the area for the code:
		this.DOM.append("<pre><code class=\"cpp\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));

	}

	//builds the code!
	buildCode(item, info){

		//variable to build the code
		var ret = 	this.buildCode_Warnings(item, info) +
					this.buildCode_Definition(item, info) + "\n\n" +
					this.buildCode_Constructor(item, info) + "\n\n" +
					this.buildCode_Destructor(item, info) + "\n\n" +
					this.buildCode_PublicItems(item, info) + 
					this.buildCode_ProtectedItems(item, info) + 
					this.buildCode_PrivateItems(item, info) + 
					"}";

		return ret;
	}
	
	//build essentially the first line of the class: the defition
	buildCode_Definition(item, info){

		var ret='';

		//check if this code requires strings:
		var arr1 = info.methods.filter(function(n){ return (n.mType==STRING); });
		var arr2 = info.members.filter(function(n){ return (n.mType==STRING); });
		if(arr1.length>0 || arr2.length>0)
			ret += 	"#include &lt;string&gt;\n" +
					"using std::string;\n\n";

		if(!info.isPublic)
			ret += 	this.comment("NOTE: to have a private class, it must be placed under the \"private:\" header of the containing class:")+
					"private:\n";

		//build the left part that usually looks like "public final class foo"
		ret += 		'class ' + info.name + ' ' + 
					((info.isFinal)?'final ':'');
					//((info.isAbstract)?'abstract ':'')+
					

		//if it extends anything, add that here:
		if(info.hasAncestor)
			ret += ': public ' + info.ancestor;

		//if it implements any interfaces, add those here:
		if(info.hasInterfaces){
			if(info.hasAncestor)
				ret += ', ';
			else
				ret += ' : ';
			for(var i=0; i<info.interfaces.length; i++)
				ret += 'public ' + info.interfaces[i].mName + ', ';
			//truncate last two chars (', ')
			ret = ret.substring(0, ret.length - 2);
		}

		//finally add the '{'
		ret += ' {';
		return ret;

	}

	//build a constructor method for the class:
	buildCode_Constructor(item, info){

		var ret="\t" + this.comment("Constructor") + 
				"\t" + info.name + "()";

		//if the class has an ancestor lets call super in the constructor!
		if(info.hasAncestor)
			ret += 	" : " + info.ancestor  + "()";

		ret +=	"{\n" + 
				"\n\t\t" + this.comment("...") +
				"\t}";
		return ret;
	}

	//build a constructor method for the class:
	buildCode_Destructor(item, info){

		var ret="\t" + this.comment("Destructor") + 
				"\t~" + info.name + "()";

		ret +=	"{\n" + 
				"\n\t\t" + this.comment("...") +
				"\t}";
		return ret;
	}

	//build all the public items at once
	buildCode_PublicItems(item, info){

		//make sure there actually are public items:
		if(!info.hasPublicMembers && !info.hasPublicMethods)
			return '';

		var ret = 	"\t" + this.comment("Public Items past this point:") + 
					"\tpublic:\n";

		//if it has public members, add them now:
		if(info.hasPublicMembers)
			ret += "\n" + this.buildCode_Members(info.publicMembers, item, info);

		//if it has public methods, add them now:"
		if(info.hasPublicMethods)
			ret += "\n" + this.buildCode_Methods(info.publicMethods, item, info);

		return ret;
	}

	//build all the protected items at once
	buildCode_ProtectedItems(item, info){

		//make sure there actually are protected items:
		if(!info.hasProtectedMembers && !info.hasProtectedMethods)
			return '';

		var ret = 	"\t" + this.comment("Protected Items past this point:") + 
					"\tprotected:\n";

		//if it has public members, add them now:
		if(info.hasProtectedMembers)
			ret += "\n" + this.buildCode_Members(info.protectedMembers, item, info);

		//if it has public methods, add them now:"
		if(info.hasProtectedMethods)
			ret += "\n" + this.buildCode_Methods(info.protectedMethods, item, info);

		return ret;
	}

	//build all the private items at once
	buildCode_PrivateItems(item, info){

		//make sure there actually are private items:
		if(!info.hasPrivateMembers && !info.hasPrivateMethods)
			return '';

		var ret = 	"\t" + this.comment("Private Items past this point:") + 
					"\tprivate:\n";

		//if it has public members, add them now:
		if(info.hasPrivateMembers)
			ret += "\n" + this.buildCode_Members(info.privateMembers, item, info);

		//if it has public methods, add them now:"
		if(info.hasPrivateMethods)
			ret += "\n" + this.buildCode_Methods(info.privateMethods, item, info);

		return ret;
	}

	//build out all the methods
	buildCode_Methods(methods, item, info){

		var typeToStr = ['void', 'int', 'short int', 'long int', 'char', 'float', 'double', 'char', 'string', 'bool'];

		//code to return
		var ret = '';

		if(info.hasMethods){

			//code to return:
			ret = "\t" + this.comment("Methods");

			//loop over methods
			for(var i=0; i<methods.length; i++){

				//get the method
				var method = methods[i];

				if(method.isAbstract)
					ret += "\t" + 
							'virtual ' +
							typeToStr[parseInt(method.mType)] + ' ' + 
							method.mName + "()" +
							((method.isConst)?' final':'') +
							+ " = 0\n\n";
				else
					ret += 	"\t" + 
							((method.isStatic && !method.isAbstract)?'static ':'') +
							typeToStr[parseInt(method.mType)] + ' ' + 
							method.mName + "()" +
							((method.isConst)?' final':'') +
							"{\n" + 
							"\t\t" + this.comment("...") + 
							"\t}\n\n";
			}//next i

		}//endif has methods

		return ret;
	}

	//build out all the member variables
	buildCode_Members(members, item, info){

		var typeToStr = ['void', 'int', 'short int', 'long int', 'char', 'float', 'double', 'char', 'string', 'bool'];
		var typeDefaults =  ["Null", 0, 0, 0, 0, '0.0', '0.0', '', '', 'False'];

		//code to return
		var ret = '';

		if(info.hasMembers){

			//code to return:
			ret = "\t" + this.comment("Member Variables");

			//loop over methods
			for(var i=0; i<members.length; i++){

				//get the method
				var member = members[i];

				ret += 	"\t" + 
						((member.isConst)?'const ':'') +
						((member.isStatic)?'static ':'') +
						typeToStr[parseInt(member.mType)] + ' ' + 
						member.mName;

				if(member.val != null){
					switch(parseInt(member.mType)){
						case INT:
						case DOUBLE:
							ret += " = " + member.val;
							break;
						case SHORT:
							ret += " = (short int)" + member.val;
							break;
						case LONG:
							ret += " = (long int)" + member.val;
							break;
						case BYTE:
							ret += " = (char)" + member.val;
							break;
						case FLOAT:
							ret += " = " + member.val + 'f';
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
					if(member.isConst)
						ret += " = " + typeDefaults[member.mType];
				}//has default value

				//apply the semicolon and new line
				ret += ";\n";

			}//next i

		}//endif has methods

		return ret;
	}

	// build out some useful common code structures
	buildExtraSamplesCode(){

		return 	"// Conditionals\nif(someVar==true){\n\t// ...\n}else if(otherVar>10){\n\t// ...\n}else{"+
				"\n\t// ...\n}\n\n// Switch only works with numbers / chars\nswitch(someVar){\n\tcase 1:\n"+
				"\tcase 2:\n\tcase 3:\n\t\t// ...\n\t\tbreak;\n\tcase 4:\n\t\t// ...\n\t\tbreak;\n\tdefault:\n\t\t// .."+
				".\n}\n\n// For loop\nfor(int i=0; i<10; i++){\n\t// ...\n}\n\n// While loops\nwhile(true){"+
				"\n\t// ...\n}\n\n// Do-while loops\ndo{\n\t// ...\n}while(true);"+
				"";
	}

}