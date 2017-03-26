(function() {
	"use strict";

	angular.module("app")
		.factory('sources', SourcesService);

	SourcesService.$inject = ["misc", "monsters", "store"];

	function SourcesService(misc, monsters, store) {
		var customContent = [];
		var customContentKey = "5em-custom-content";

		store.get(customContentKey).then(function (data) {
			if ( !data ) {
				return;
			}

			customContent.length = 0;
			data.forEach(function (content) {
				customContent.push(content);
				monsters.loadSheet(content.id);
			});
		});

		function addCustomContent(name, url) {
			if ( !name || !url ) {
				console.log("No name or URL");
				return;
			}

			var idMatch = url.match(/\b([-a-z0-9_]{44})\b/i);

			if ( !idMatch ) {
				console.log("No id");
				return;
			}

			var id = idMatch[1];

			if ( customContent.some(function (content) { return content.id === id; }) ) {
				console.log("Duplicate ID");
				return;
			}

			monsters.loadSheet(id, true);
			customContent.push({
				name: name,
				id: id,
			});

			customContent.sort(function (a, b) {
				return (a.name < b.name) ? 1 : -1;
			});

			store.set(customContentKey, customContent);

			return true;
		}

		function removeCustomContent(id) {
			var contentIndex = null;

			customContent.some(function (content, index) {
				if ( content.id === id ) {
					contentIndex = index;
					return true;
				}
			});

			if ( contentIndex === null ) {
				return;
			}

			customContent.splice(contentIndex, 1);
			monsters.removeSheet(id);

			store.set(customContentKey, customContent);
		}

		return {
			all: misc.sources,
			customContent: customContent,
			filters: misc.sourceFilters,
			shortNames: misc.shortNames,
			addCustomContent: addCustomContent,
			removeCustomContent: removeCustomContent,
		};
	}
})();
