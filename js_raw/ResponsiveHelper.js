class ResponsiveHelper{

	constructor(){

		//for scope resolution in call backs
		var me=this;

		//bind an event for when the window resizes
		$(document).ready(function(){
			$(window).resize( function(e){
				me.onResize(me, e);
			});

			me.onResize(me, null);
		});

	}

	//when the window resizes...
	onResize(me, e){

		//get windows width
		var width = $(window).width();

		//start with nothing
		$('#topTabsContainer').removeClass('smallMode mediumMode rowsMode');

		if(width<960)
			$('#topTabsContainer').addClass('rowsMode');
		
		if(width>=1390){
			//$('#topTabsContainer').removeClass('smallMode mediumMode');
			$('#topTabsContainer').removeClass('smallMode mediumMode rowsMode');
		}else if(width>=1180){
			$('#topTabsContainer').addClass('mediumMode');
		}else{
			$('#topTabsContainer').addClass('smallMode');
		}
	}	

}