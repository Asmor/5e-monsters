(function() {
	"use strict";

	angular.module("app")
		.factory("actionQueue", ActionQueueService);


	function ActionQueueService() {
		var actionQueue = {
				actions: [],
				currentInstruction: "",
				clear: function () {
					actionQueue.actions.length = 0;
					actionQueue.currentInstruction = "";
				},
				next: function ($state) {
					if ( actionQueue.actions.length ) {
						var current = actionQueue.actions.shift();
						actionQueue.currentInstruction = current.message || "";

						$state.go(current.state);
						return true;
					}

					return false;
				},
				queue: function (nextState, message) {
					actionQueue.actions.push({ state: nextState, message: message });
				},
				unshift: function (nextState, message) {
					// First check to make sure this state isn't already in the queue
					var i = 0;
					while ( i < actionQueue.actions.length ) {
						if ( actionQueue.actions[i].state === nextState ) {
							actionQueue.actions.splice(i, 1);
						} else {
							i++;
						}
					}

					actionQueue.actions.unshift({ state: nextState, message: message });
				}
		};

		return actionQueue;
	}
})();
