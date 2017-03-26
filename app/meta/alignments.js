(function() {
	"use strict";

	angular.module("app")
		.service("alignments", AlignmentsService);

	function AlignmentsService() {
		var i = 0,
			lg = Math.pow(2, i++),
			ng = Math.pow(2, i++),
			cg = Math.pow(2, i++),
			ln = Math.pow(2, i++),
			n  = Math.pow(2, i++),
			cn = Math.pow(2, i++),
			le = Math.pow(2, i++),
			ne = Math.pow(2, i++),
			ce = Math.pow(2, i++),
			unaligned = Math.pow(2, i++);
		var alignments = {
			any: {
				text: "any",
				flags: lg | ng | cg | ln | n | cn | le | ne | ce
			},
			any_chaotic: {
				text: "any chaotic",
				flags: cg | cn | ce
			},
			any_evil: {
				text: "any evil",
				flags: le | ne | ce
			},
			any_good: {
				text: "any good",
				flags: lg | ng | cg
			},
			any_lawful: {
				text: "any lawful",
				flags: lg | ln | le
			},
			any_neutral: {
				text: "any neutral",
				flags: ng | ln | n | cn | ne
			},
			non_chaotic: {
				text: "non-chaotic",
				flags: lg | ng | ln | n | le | ne | unaligned
			},
			non_evil: {
				text: "non-evil",
				flags: lg | ng | cg | ln | n | cn | unaligned
			},
			non_good: {
				text: "non-good",
				flags: ln | n | cn | le | ne | ce | unaligned
			},
			non_lawful: {
				text: "non-lawful",
				flags: ng | cg | n | cn | ne | ce | unaligned
			},
			unaligned: {
				text: "unaligned",
				flags: unaligned 
			},
			lg: { flags: lg, text: "lawful good" },
			ng: { flags: ng, text: "neutral good" },
			cg: { flags: cg, text: "chaotic good" },
			ln: { flags: ln, text: "lawful neutral" },
			n:  { flags: n,  text: "neutral" },
			cn: { flags: cn, text: "chaotic neutral" },
			le: { flags: le, text: "lawful evil" },
			ne: { flags: ne, text: "neutral evil" },
			ce: { flags: ce, text: "chaotic evil" },
		};

		Object.keys(alignments).forEach(function (alignmentKey) {
			var alignment = alignments[alignmentKey];
			alignment.regex = new RegExp(alignment.text.replace(/[- ]/, "[- ]?"), "i");
		});

		return alignments;
	}
})();
