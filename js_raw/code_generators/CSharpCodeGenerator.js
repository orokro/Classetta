class CSharpCodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//build the area for the code:
		this.DOM.append("<pre><code class=\"cs\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));

	}

	//takes a class item and rebuilds the appropriate source code based on the class item for this language
	update(item){

		//variable to build the code
		var code = 	this.buildCode_Warnings(item) + "\n" + 
					this.buildCode_Definition(item) + "\n\n" +
					this.buildCode_Constructor(item) + "\n\n" +
					this.buildCode_Methods(item) + 
					this.buildCode_Members(item) +
					"}";

		//update the code inside the code tag
		this.codeDOM.html(code);

		//apply the code highlighting
		hljs.highlightBlock(this.codeDOM[0]);

	}

	//adds some comments with warnings
	buildCode_Warnings(item){

		var ret = 	"/*\n" + 
					"\tWarning! The following C# code is automatically generated and may contain errors.\n" + 
					"\tCode.Design tries to be accurate as possible, but only provides minimal error checking.\n" + 
					"\tGarbage In = Garbage Out. Make sure to use proper C# names, legal characters, not reserved words, etc.";

		//check for warnings
		if(item.getFinal() && item.getAbstract)
				ret += "\n\n\tWARNING: you specified this class as both Abstract and Sealed. That's probably not what you meant.";

		//finish up the comment
		ret += "\n*/";

		return ret;
	}

	//build essentially the first line of the class: the defition
	buildCode_Definition(item){

		//build the left part that usually looks like "public final class foo"
		var ret = 	((item.getPublic())?'public ':'private ') +
					((item.getFinal())?'sealed ':'') +
					((item.getAbstract())?'abstract ':'')+
					'class ' + item.getName();

		//if it extends anything, add that here:
		var ancestor = item.getAncestor();
		var hasAncestor = (ancestor!=null && ancestor!='');
		if(hasAncestor)
			ret += ' : ' + ancestor;

		//if it implements any interfaces, add those here:
		var interfaces = item.getInterfaces();
		if(interfaces.length>0){
			if(hasAncestor)
				ret += ', ';
			else
				ret += ' : ';
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
				"\tpublic " + item.getName() + "()";

		//if the class has an ancestor lets call super in the constructor!
		if(item.getAncestor()!=null && item.getAncestor!="")
			ret += 	" : base()";

		ret +=	"{\n" + 
				"\n\t\t//...\n" +
				"\t}";
		return ret;
	}

	//build out all the methods
	buildCode_Methods(item){

		var typeToStr = ['void', 'int', 'short', 'long', 'byte', 'float', 'double', 'char', 'string', 'bool'];
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
						((method.isConst)?'sealed override ':'') +
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

		var typeToStr = ['void', 'int', 'short', 'long', 'byte', 'float', 'double', 'char', 'string', 'bool'];
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
						((member.isConst)?'const ':'') +
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