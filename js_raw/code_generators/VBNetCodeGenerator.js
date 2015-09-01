class VBNetCodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//Make note of language name
		this.langName = "VB.NET";
		
		//build the area for the code:
		this.DOM.append("<pre><code class=\"vbnet\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));

	}

	//takes a class item and rebuilds the appropriate source code based on the class item for this language
	update(item){

		//if the item is null, just update with the default comment
		if((typeof(item)==="undefined") || item==null){
			buildDefaultComment();
			return;
		}

		//inspect useful data on our item:
		var info = this.inspect(item);

		//variable to build the code
		var code = 	this.buildCode_Warnings(item, info) + "\n" + 
					this.buildCode_Definition(item, info) + "\n\n" +
					this.buildCode_Members(item, info) +
					this.buildCode_Constructor(item, info) + "\n\n" +
					this.buildCode_Methods(item, info) + 
					"End Class";

		//update the code inside the code tag
		this.codeDOM.html(code);

		//apply the code highlighting
		hljs.highlightBlock(this.codeDOM[0]);

	}

	//build the default commenting telling the user to goto the editor tab, etc.
	buildDefaultComment(){
		this.codeDOM.html(	"'Please create a class on the left, and edit it with the Editor tab!\n" + 
							"'<-----" );
	}

	//adds some comments with warnings
	buildCode_Warnings(item){

		var ret = 	"'Warning! The following "+this.langName+" code is automatically generated and may contain errors.\n" + 
					"'Classetta tries to be accurate as possible, but only provides minimal error checking.\n" + 
					"'Garbage In = Garbage Out. Make sure to use proper "+this.langName+" names, legal characters, not reserved words, etc.";
					

		//check for warnings
		if(item.getFinal() && item.getAbstract)
				ret += "\n\n'WARNING: you specified this class as both Abstract and Final. That's probably not what you meant.";

		//finish up the comment
		ret += "\n";

		return ret;
	}

	//build essentially the first line of the class: the defition
	buildCode_Definition(item, info){

		//build the left part that usually looks like "public final class foo"
		var ret = 	((info.isPublic)?'Public ':'Private ') +
					((info.isFinal)?'NotInheritable ':'') +
					((info.isAbstract)?'MustInherit ':'')+
					'Class ' + info.name;

		//if it extends anything, add that here:
		var ancestor = item.getAncestor();
		if(ancestor!=null && ancestor!='')
			ret += '\n\tInherits ' + ancestor;

		//if it implements any interfaces, add those here:
		var interfaces = item.getInterfaces();
		if(interfaces.length>0){
			for(var i=0; i<interfaces.length; i++)
				ret += "\n\tImplements " + interfaces[i].mName;
		}

		return ret;

	}

	//build out all the member variables
	buildCode_Members(item){

		//var typeToStr = ['void', 'int', 'short', 'long', 'byte', 'float', 'double', 'char', 'String', 'boolean'];
		var typeToStr = ['Void', 'Integer', 'Integer', 'Long', 'Byte', 'Single', 'Double', 'String', 'String', 'Boolean'];
		var accessToStr = ['Private', 'Public'];
		var typeDefaults =  ["Null", 0, 0, 0, 0, '0.0', '0.0', '', '', 'False'];

		//get list of methods
		var members = item.getMembers();
		
		//code to return
		var ret = '';

		if(members.length>0){

			//code to return:
			ret = "\t'Member Variables\n";

			//loop over methods
			for(var i=0; i<members.length; i++){

				//get the method
				var member = members[i];

				ret += 	"\t" + 
						accessToStr[member.access] + ' ' +
						((member.isStatic && !member.isConst)?'Shared ':'') +
						((member.isConst)?'Const ':'') +
						member.mName + 
						" As " + typeToStr[parseInt(member.mType)];
						

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
							ret += " = \"" + member.val + "\"";
							break;
						case STRING:
							ret += " = \"" + member.val + "\"";
							break;
						case BOOLEAN:
							ret += " = " + member.val.toString().substr(0,1).toUpperCase() + member.val.toString().substr(1);
							break
					}//swatch
				}//has default value

				//apply the semicolon and new line
				ret += "\n";

			}//next i
			ret += "\n";
		}//endif has methods

		return ret;
	}

	//build a constructor method for the class:
	buildCode_Constructor(item){

		var ret="\t'Constructor\n" + 
				"\tPublic Sub New()\n";

		//if the class has an ancestor lets call super in the constructor!
		if(item.getAncestor()!=null && item.getAncestor!="")
			ret += 	"\n\t\t'call super constructor\n" + 
					"\t\tMyBase.new()\n";

		ret +=	"\n\t\t'...\n" +
				"\tEnd Sub";
		return ret;
	}

	//build out all the methods
	buildCode_Methods(item){

		var typeToStr = ['Void', 'Integer', 'Integer', 'Long', 'Byte', 'Single', 'Double', 'String', 'String', 'Boolean'];
		var accessToStr = ['Private', 'Public'];

		//get list of methods
		var methods = item.getMethods();

		//code to return
		var ret = '';

		if(methods.length>0){

			//code to return:
			ret = "\t'Methods\n";

			//loop over methods
			for(var i=0; i<methods.length; i++){

				//get the method
				var method = methods[i];

				var VBMethodType = ((method.mType==VOID)?"Sub":"Function");

				ret += 	"\t" + 
						accessToStr[method.access] + ' ' +
						((method.isStatic)?'Shared ':'') +
						((method.isConst)?'NotOverridable ':'') +
						VBMethodType + " " + 
						method.mName + "()" + 
						((method.mType==VOID)?"":" As " + typeToStr[parseInt(method.mType)]) + "\n" + 
						"\t\t'...\n" + 
						"\tEnd " + VBMethodType + "\n\n";
			}//next i

		}//endif has methods

		return ret;
	}

}