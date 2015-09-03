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

	//takes a class item and rebuilds the appropriate source code based on the class item for this language
	update(item){

		//if the item is null, just update with the default comment
		if((typeof(item)==="undefined") || item==null){
			this.buildDefaultComment();
			hljs.highlightBlock(this.codeDOM[0]);
			return;
		}

		//inspect useful data on our item:
		var info = this.inspect(item);

		//variable to build the code
		var code = 	this.buildCode_Warnings(item, info) +
					this.buildCode_Definition(item, info)  + "\n" +
					this.buildCode_Members(item, info) + "\n" +
					this.buildCode_Constructor(item, info) + "\n\n" +
					this.buildCode_Methods(item, info) + 
					"}";

		//update the code inside the code tag
		this.codeDOM.html(code);

		//apply the code highlighting
		hljs.highlightBlock(this.codeDOM[0]);

	}

	//build essentially the first line of the class: the defition
	buildCode_Definition(item){

		//build the left part that usually looks like "public final class foo"
		var ret = 	((item.getFinal())?'final ':'') +
					((item.getAbstract())?'abstract ':'')+
					'class ' + item.getName();
		//((item.getPublic())?'public ':'private ') +

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
				"\tfunction __construct(){\n";

		//if the class has an ancestor lets call super in the constructor!
		if(item.getAncestor()!=null && item.getAncestor!="")
			ret += 	"\n\t\t// call super constructor\n" + 
					"\t\tparent::__construct();\n";

		ret +=	"\n\t\t//...\n" +
				"\t}";
		return ret;
	}

	//build out all the methods
	buildCode_Methods(item){

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
						((method.isConst)?'final ':'') +
						accessToStr[method.access] + ' ' +
						((method.isStatic)?'static ':'') +
						"function " + 
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
		var ret = "";

		if(members.length>0){

			//handle constants first since the syntax is slightly different
			var constants = members.filter(function(n){ return (n.isConst==true); });
			if(constants.length>0){

				ret += "\n\t// Class Constants\n";
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
				ret += "\n\t// Member Variables\n";

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

}