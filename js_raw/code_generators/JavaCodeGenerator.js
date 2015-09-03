class JavaCodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//Make note of language name
		this.langName = "Java";

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
		this.DOM.append("<pre><code class=\"java\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));

	}

	//builds the code!
	buildCode(item, info){

		//variable to build the code
		var ret = 	this.buildCode_Warnings(item, info) +
					this.buildCode_Definition(item, info) + "\n\n" +
					this.buildCode_Constructor(item, info) + "\n\n" +
					this.buildCode_Methods(item, info) + 
					this.buildCode_Members(item, info) +
					"}";

		return ret;
	}

	//build essentially the first line of the class: the defition
	buildCode_Definition(item){

		//build the left part that usually looks like "public final class foo"
		var ret = 	((item.getPublic())?'public ':'private ') +
					((item.getFinal())?'final ':'') +
					((item.getAbstract())?'abstract ':'')+
					'class ' + item.getName();

		//if it extends anything, add that here:
		var ancestor = item.getAncestor();
		if(ancestor!=null && ancestor!='')
			ret += ' extends ' + ancestor;

		//if it implements any interfaces, add those here:
		var interfaces = item.getInterfaces();
		if(interfaces.length>0){
			ret += ' implements ';
			for(var i=0; i<interfaces.length; i++)
				ret += interfaces[i].mName + ', ';
			//truncate last two chars (', ')
			ret = ret.substring(0, ret.length - 2);
		}

		//finally add the '{'
		ret += ' {';
		return ret;

	}

	//build a constructor method for the class:
	buildCode_Constructor(item){

		var ret="\t// Constructor\n" + 
				"\tpublic " + item.getName() + "(){\n";

		//if the class has an ancestor lets call super in the constructor!
		if(item.getAncestor()!=null && item.getAncestor!="")
			ret += 	"\n\t\t// call super constructor\n" + 
					"\t\tsuper();\n";

		ret +=	"\n\t\t//...\n" +
				"\t}";
		return ret;
	}

	//build out all the methods
	buildCode_Methods(item){

		var typeToStr = ['void', 'int', 'short', 'long', 'byte', 'float', 'double', 'char', 'String', 'boolean'];
		var accessToStr = ['private', 'public'];

		//get list of methods
		var methods = item.getMethods();

		//code to return
		var ret = '';

		if(methods.length>0){

			//code to return:
			ret = "\t// Methods\n";

			//loop over methods
			for(var i=0; i<methods.length; i++){

				//get the method
				var method = methods[i];

				ret += 	"\t" + 
						accessToStr[method.access] + ' ' +
						((method.isStatic)?'static ':'') +
						((method.isConst)?'final ':'') +
						typeToStr[parseInt(method.mType)] + ' ' + 
						method.mName + "(){\n" + 
						"\t\t//...\n" + 
						"\t}\n\n";
			}//next i

		}//endif has methods

		return ret;
	}

	//build out all the member variables
	buildCode_Members(item){

		var typeToStr = ['void', 'int', 'short', 'long', 'byte', 'float', 'double', 'char', 'String', 'boolean'];
		var accessToStr = ['private', 'public'];

		//get list of methods
		var members = item.getMembers();
		
		//code to return
		var ret = '';

		if(members.length>0){

			//code to return:
			ret = "\t// Member Variables\n";

			//loop over methods
			for(var i=0; i<members.length; i++){

				//get the method
				var member = members[i];

				ret += 	"\t" + 
						accessToStr[member.access] + ' ' +
						((member.isStatic)?'static ':'') +
						((member.isConst)?'final ':'') +
						typeToStr[parseInt(member.mType)] + ' ' + 
						member.mName;

				if(member.val != null){
					switch(parseInt(member.mType)){
						case INT:
						case DOUBLE:
							ret += " = " + member.val;
							break;
						case SHORT:
							ret += " = (short)" + member.val;
							break;
						case LONG:
							ret += " = (long)" + member.val;
							break;
						case BYTE:
							ret += " = (byte)" + member.val;
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
				}//has default value

				//apply the semicolon and new line
				ret += ";\n";

			}//next i

		}//endif has methods

		return ret;
	}

}