class VBCodeGenerator extends CodeGenerator {

	constructor(DOM){
		super(DOM);	

		//so this resovles in all scopes:
		var me = this;

		//add an area to let the user pick between our three flavors of JS: Native, TypeScript, ES6
		//as well as containers for our childen elements
		this.DOM.html('<div class="GenHeader">' +
							'Visual Basic has multiple implementations, choose your flavor!<br>' +
							'<div class="options">' + 
								'<input type="radio" name="optFlavVB" id="opt01v" value="01" checked><label for="opt01v">VB.NET</label> ' + 
								'<input type="radio" name="optFlavVB" id="opt02v" value="02"><label for="opt02v">VB6</label> ' + 
							'</div>' +
						'</div>' +
						'<div id="SubTab_01" class="SubTab"></div>' + 
						'<div id="SubTab_02" class="SubTab" style="display:none;"></div>'); 
		
		//create generators for each type of JS
		this.codeGenerators = [];
		this.codeGenerators.push( new VBNetCodeGenerator(this.DOM.find('#SubTab_01')) );
		this.codeGenerators.push( new VB6CodeGenerator(this.DOM.find('#SubTab_02')) );
		
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

	//OVERRIDE the parents update method, so we can update all of our children!
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