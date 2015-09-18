class VBNetCodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//Make note of language name
		this.langName = "VB.NET";

		//set up comment styles
		this.singleLineComments = "'";
		this.multiLineComments = { 	  open: '',
									 close: '',
									prefix: "'"	};

		//set up what this class supports:
		//Note: support is assumed by default, so this only has to disable features
		this.features = {
							methods: {
									 },
							members: {
									 }
						};

		//build the area for the code:
		this.DOM.append("<pre><code class=\"vbnet\"></code></pre>");

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
					this.buildCode_Methods(item, info) + 
					"End Class";

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
		if(info.hasAncestor)
			ret += '\n\tInherits ' + info.ancestor;

		//if it implements any interfaces, add those here:
		if(info.hasInterfaces){
			for(var i=0; i<info.interfaces.length; i++)
				ret += "\n\tImplements " + info.interfaces[i].mName;
		}

		return ret;

	}

	//build out all the member variables
	buildCode_Members(item, info){

		//var typeToStr = ['void', 'int', 'short', 'long', 'byte', 'float', 'double', 'char', 'String', 'boolean'];
		var typeToStr = ['Void', 'Integer', 'Integer', 'Long', 'Byte', 'Single', 'Double', 'String', 'String', 'Boolean'];
		var accessToStr = ['Private', 'Public', 'Protected'];
		var typeDefaults =  ["Null", 0, 0, 0, 0, '0.0', '0.0', '', '', 'False'];

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
							ret += " = " + this.firstToUpper(member.val);
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
	buildCode_Constructor(item, info){

		var ret="\t" + this.comment("Constructor") + 
				"\tPublic Sub New()\n";

		//if the class has an ancestor lets call super in the constructor!
		if(info.hasAncestor)
			ret += 	"\n\t\t" + this.comment("Call Super Constructor") + 
					"\t\tMyBase.new()\n";

		ret +=	"\n\t\t" + this.comment("...") +
				"\tEnd Sub";
		return ret;
	}

	//build out all the methods
	buildCode_Methods(item, info){

		var typeToStr = ['Void', 'Integer', 'Integer', 'Long', 'Byte', 'Single', 'Double', 'String', 'String', 'Boolean'];
		var accessToStr = ['Private', 'Public', 'Protected'];

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

				var VBMethodType = ((method.mType==VOID)?"Sub":"Function");

				ret += 	"\t" + 
						accessToStr[method.access] + ' ' +
						((method.isStatic)?'Shared ':'') +
						((method.isConst)?'NotOverridable ':'') +
						VBMethodType + " " + 
						method.mName + "()" + 
						((method.mType==VOID)?"":" As " + typeToStr[parseInt(method.mType)]) + "\n" + 
						"\t\t" + this.comment("...") + 
						"\tEnd " + VBMethodType + "\n\n";
			}//next i

		}//endif has methods

		return ret;
	}

	// build out some useful common code structures
	buildExtraSamplesCode(){

		return 	"'Conditionals\nIf someVar==true Then\n\t'...\nElseIf otherVar>10 Then\n\t'...\nElse\n\t'."+
				"..\nEnd If\n\n'\"Select Case\" is like Switch in other languages\n'and will work with "+
				"strings and numbers\nDim number As Integer = 8\nSelect Case number\n    Case 1 To 5"+
				"\n        Debug.WriteLine(\"Between 1 and 5, inclusive\")\n        'The following is"+
				" the only Case clause that evaluates to True. \n    Case 6, 7, 8\n        Debug.Wr"+
				"iteLine(\"Between 6 and 8, inclusive\")\n    Case 9 To 10\n        Debug.WriteLine(\""+
				"Equal to 9 or 10\")\n    Case Else\n        Debug.WriteLine(\"Not between 1 and 10, "+
				"inclusive\")\nEnd Select\n\n'For loop with Integers (Step is optional)\nFor i As Inte"+
				"ger = 1 to 10 Step 1\n\t'...\nNext\n\n'For loop with floating point values\nFor number"+
				" As Double = 2 To 0 Step -0.25\n    '...\n    If SomeCondition Then\n    \tExit For\n"+
				"    Else\n    \tContinue For\n    End if\nNext\n\n'For Each loop\nDim items() As Intege"+
				"r = {1, 2, 3, 4, 5};\nFor Each itm As Integer In items\n\t'...\nNext\n\n'While loops\nW"+
				"hile index <= 10\n    '...\nEnd While\n\n'Do-while loops\nDo\n    '...\nLoop Until inde"+
				"x > 10"+
				"";
	}

}