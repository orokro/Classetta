class JSCodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//so this resovles in all scopes:
		var me = this;

		//add an area to let the user pick between our three flavors of JS: Native, TypeScript, ES6
		//as well as containers for our childen elements
		this.DOM.html('<div class="GenHeader">' +
							'JavaScript has multiple implementations, choose your flavor!<br>' +
							'<div class="options">' + 
								'<input type="radio" name="optFlavJS" id="opt01" value="01" checked><label for="opt01">Vanilla JS</label> ' + 
								'<input type="radio" name="optFlavJS" id="opt02" value="02"><label for="opt02">ES6 / Babel</label> ' + 
								'<input type="radio" name="optFlavJS" id="opt03" value="03"><label for="opt03">TypeScript</label> ' + 
							'</div>' +
						'</div>' +
						'<div id="SubTab_01" class="SubTab"></div>' + 
						'<div id="SubTab_02" class="SubTab" style="display:none;"></div>' + 
						'<div id="SubTab_03" class="SubTab" style="display:none;"></div>');
		
		//create generators for each type of JS
		this.codeGenerators = [];
		this.codeGenerators.push( new VanillaJSCodeGenerator(this.DOM.find('#SubTab_01')) );
		this.codeGenerators.push( new ES6CodeGenerator(this.DOM.find('#SubTab_02')) );
		this.codeGenerators.push( new TypeScriptCodeGenerator(this.DOM.find('#SubTab_03')) );
		
		//bind event for the option boxes to switch out the code.
		this.DOM.find("input").bind('click change', function(e){

			//get the ID
			var id = $(this).val();

			//hide all JS tabs
			me.DOM.find('.SubTab').hide();

			//show just the selected tab
			me.DOM.find('#SubTab_'+id).show();
		});
		this.DOM.find('label').mousemove(function(e){ e.preventDefault(); });

	}

	//takes a class item and rebuilds the appropriate source code based on the class item for this language
	update(item){

		//update each of the code generators!
        for(var g=0; g<this.codeGenerators.length; g++){

            //get the generator
            var generator = this.codeGenerators[g];

            //tell it to update it's class
            generator.update(item);

        }//next g

	}

}