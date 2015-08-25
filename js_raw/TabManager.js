/*
	This is the main class for our Tab Manger.

	The Tab Manager will be responsible for monitoring the events of the tabs,
	and updating the DOM / CSS as appropriate.
*/
class TabManager{

	constructor(TabDom){

		//even in ES6 still gotta resort to ugly closure hacks to make callbacks work..
		var me = this;

		//save referemce our tab DOM container
		this.DOM = TabDom;

		//associative array to store our tab page references
		this.tabs = {};

		//save refernce to the DOM elements that make up the tabs:
		this.tabsDOM = $('#topTabs li');

		//get each of the tabs and create a page for it (if one doesn't already exist)
		this.tabsDOM.each(function(){

			//extract the name / keyword id for this tab:
			var name = $(this).attr('id').split('_')[1];

			//check if a page for this one already exists..
			var tabCheck = $(this.DOM).find('#tabPage_'+name);

			//if it DOESNT exist, let's create it!
			if(! tabCheck.length>0){

				//create a new tab page
				me.tabs[name] = $('<div id="tabPage_'+name+'" class="tabPage">Tab page for '+name+'!</div>');

				//append it to the dom:
				$(me.DOM).append(me.tabs[name]);

			//otherwise, there should only be one 0 save the reference and move on!
			}else if(tabCheck.length==1){
				me.tabs[name] = tabCheck[0];
			}else{
				Throw ("TabManager found more than one tab sharing the ID: #tabPage_"+name);
			}

		});

		//Now that all the tab pages have been created lets cache a reference to their dom
		this.pagesDOM = this.DOM.find('.tabPage');

		//bind events for when a tab is clicked on...
		$('#topTabs li').click(	function(e){
									me.handleTabClick(me, this); 
								});
	}//constructor()

	//When a tab is changed let's change which tab data is displayed:
	handleTabClick(me, elem){

		//extract the name / keyword id for this tab:
		var name = $(elem).attr('id').split('_')[1];

		//hide all other tabs:
		me.pagesDOM.hide().removeClass('initialTabPage');

		//update the background
		me.DOM.removeClass().addClass('tabPage'+name+'BG');

		//update tab sytles:
		me.tabsDOM.removeClass('activeTab');
		$(elem).addClass('activeTab');
		
		//show just the tab we care about:
		me.tabs[name].show();
	}
}