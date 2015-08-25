/* 
    This is the main application class for our Class.Design web app.

*/
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClassDesignApp = (function () {
    function ClassDesignApp() {
        _classCallCheck(this, ClassDesignApp);

        //Create and Initialize our TabManager. It expects a reference to the tabs area
        this.TabMgr = new TabManager($('#divTabbedArea'));
    }

    _createClass(ClassDesignApp, [{
        key: "fuck",
        value: function fuck() {
            console.log("fuuucckk");
        }
    }]);

    return ClassDesignApp;
})();
/*
	This is the main class for our Tab Manger.

	The Tab Manager will be responsible for monitoring the events of the tabs,
	and updating the DOM / CSS as appropriate.
*/
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TabManager = (function () {
		function TabManager(TabDom) {
				_classCallCheck(this, TabManager);

				//even in ES6 still gotta resort to ugly closure hacks to make callbacks work..
				var me = this;

				//save referemce our tab DOM container
				this.DOM = TabDom;

				//associative array to store our tab page references
				this.tabs = {};

				//get each of the tabs and create a page for it (if one doesn't already exist)
				$('#topTabs li').each(function () {

						//extract the name / keyword id for this tab:
						var name = $(this).attr('id').split('_')[1];

						//check if a page for this one already exists..
						var tabCheck = $(this.DOM).find('#tabPage_' + name);

						//if it DOESNT exist, let's create it!
						if (!tabCheck.length > 0) {

								//create a new tab page
								me.tabs[name] = $('<div id="tabPage_' + name + '" class="tabPage">Tab page for ' + name + '!</div>');

								//append it to the dom:
								$(me.DOM).append(me.tabs[name]);

								//otherwise, there should only be one 0 save the reference and move on!
						} else if (tabCheck.length == 1) {
										me.tabs[name] = tabCheck[0];
								} else {
										Throw("TabManager found more than one tab sharing the ID: #tabPage_" + name);
								}
				});

				//Now that all the tab pages have been created lets cache a reference to their dom
				this.pagesDOM = this.DOM.find('.tabPage');

				//bind events for when a tab is clicked on...
				$('#topTabs li').click(function (e) {
						me.handleTabClick(me, this);
				});
		}

		//constructor()

		//When a tab is changed let's change which tab data is displayed:
		_createClass(TabManager, [{
				key: 'handleTabClick',
				value: function handleTabClick(me, elem) {

						//extract the name / keyword id for this tab:
						var name = $(elem).attr('id').split('_')[1];

						//hide all other tabs:
						me.pagesDOM.hide().removeClass('initialTabPage');

						//update the background
						me.DOM.removeClass().addClass('tabPage' + name + 'BG');

						//show just the tab we care about:
						me.tabs[name].show();
				}
		}]);

		return TabManager;
})();