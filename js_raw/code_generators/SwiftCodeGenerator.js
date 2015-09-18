class SwiftCodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//Make note of language name
		this.langName = "Swift";

		//set up comment styles
		this.singleLineComments = "// ";
		this.multiLineComments = { 	  open: '/*\n',
									 close: '\n*/',
									prefix: "\t"	};

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
							abstract: false,
							methods: {
										abstract: false,
										protected: false
									 },
							members: {
										protected: false
									 }
						};
						
		//build the area for the code:
		this.DOM.append("<pre><code class=\"swift\"></code></pre>");

		//cache reference to the PRE tag
		this.codeDOM = $(this.DOM.find('code'));

	}

	//builds the code!
	buildCode(item, info){

		//variable to build the code
		var ret = 	this.buildCode_Warnings(item, info) +
					this.buildCode_Definition(item, info) + "\n\n" +
					this.buildCode_Members(item, info) +
					this.buildCode_Constructor(item, info) + "\n\n" +
					this.buildCode_Destructor(item, info) + "\n\n" +
					this.buildCode_Methods(item, info) + 
					"}";

		return ret;
	}
	
	//build essentially the first line of the class: the defition
	buildCode_Definition(item, info){

		//build the left part that usually looks like "public final class foo"
		var ret = 	((info.isPublic)?'public ':'internal ') +
					((info.isFinal)?'final ':'') +
					'class ' + info.name;

		//if it extends anything, add that here:
		if(info.hasAncestor)
			ret += ': ' + info.ancestor;

		//if it implements any interfaces, add those here:
		if(info.hasInterfaces){
			if(info.hasAncestor)
				ret += ', ';
			else
				ret += ': ';
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

		var typeToStr = ['', 'Int', 'Int16', 'Int64', 'Int8', 'Float', 'Double', 'Character', 'String', 'Boolean'];
		var accessToStr = ['private', 'public', 'private'];

		//get list of methods
		var members = info.members;
		
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
						accessToStr[member.access] + ' ' +
						((member.isFinal)?'final ':'') +
						((member.isStatic)?'static ':'') +
						((member.isConst)?'let ':'var ') +
						member.mName + 
						((member.mType!=VOID) ? ": " + typeToStr[parseInt(member.mType)]:"");

				if(member.val != null){
					switch(parseInt(member.mType)){
						case INT:
						case SHORT:
						case LONG:
						case BYTE:
						case DOUBLE:
							ret += " = " + member.val;
							break;
						case FLOAT:
							ret += " = " + member.val + 'f';
							break;
						case CHAR:
						case STRING:
							ret += " = \"" + member.val + "\"";
							break;
						case BOOLEAN:
							ret += " = " + member.val.toString();
							break
					}//swatch
				}//has default value

				//apply the new line
				ret += "\n";

			}//next i

			//apply the new line
			ret += "\n";

		}//endif has methods

		return ret;
	}

	//build a constructor method for the class:
	buildCode_Constructor(item, info){

		var ret="\t" + this.comment("Constructor") + 
				"\tinit()";

		ret +=	"{\n" + 
				"\n\t\t" + this.comment("...") +
				(info.hasAncestor ? "\n\t\t" + this.comment("Call Super Constructor") + "\t\tsuper.init()\n":"") + 
				"\t}";
		return ret;
	}

	//build a Destructor method for the class:
	buildCode_Destructor(item, info){

		var ret="\t" + this.comment("Optional Destructor") + 
				"\tdeinit ";

		ret +=	"{" + 
				"\n\t\t" + this.comment("...") +
				"\t}";
		return ret;
	}

	//build out all the methods
	buildCode_Methods(item, info){

		var typeToStr = ['', 'Int', 'Int16', 'Int64', 'Int8', 'Float', 'Double', 'Character', 'String', 'Boolean'];
		var accessToStr = ['private', 'public', 'private'];

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
						accessToStr[method.access] + ' ' +
						((method.isStatic)?'static ':'') +
						((method.isConst)?'final ':'') +
						"func " + method.mName + "()" + 
						((method.mType!=VOID)?" -> " + typeToStr[parseInt(method.mType)] + ' ':"") + 
						"{\n" + 
						"\t\t" + this.comment("...") + 
						"\t}\n\n";
			}//next i

		}//endif has methods

		return ret;
	}

	// build out some useful common code structures
	buildExtraSamplesCode(){

		return 	"// Conditionals\nif someVar==true {\n\t// ...\nelse if otherVar>10 {\n\t// ...\n} else "+
				"{\n\t// ...\n}\n\n// Switchs are powerful in Swift. See tinyurl.com/pwesoa4 for more "+
				"info.\nswitch approximateCount {\ncase 0:\n    naturalCount = \"no\"\n\n    // Note: th"+
				"ere are no implicit fallthroughs.\n    // \"break\" can be used, but is not require"+
				"d\n    break\ncase 1..<5:\n    naturalCount = \"a few\"\ncase 5..<12:\n    naturalCount"+
				" = \"several\"\ncase 12..<100:\n    naturalCount = \"dozens of\"\ncase 100..<1000:\n    "+
				"naturalCount = \"hundreds of\"\ndefault:\n    naturalCount = \"many\"\n}\n\n// For loop\nf"+
				"or i in 0..9 {\n\t// ...\n}\n\n// For loop without increment variable for simplly loo"+
				"ping N times:\nfor _ in 1...N {\n\t// ...\n}\n\n// More traditional For loop\nfor var i"+
				"=0; i<10; i++ {\n\t// ...\n}\n\n// For In loop\nlet names = [\"Anna\", \"Alex\", \"Brian\", "+
				"\"Jack\"]\nfor name in names {\n    print(\"Hello, \(name)!\")\n}\n\n// While loops\nwhile"+
				" true {\n\t// ...\n}\n\n// repeat-while loops, like Do-while loops\nrepeat {\n\t// ...\n}"+
				" while true"+
				"";
	}

}