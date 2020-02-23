document.getElementById("word-submit").addEventListener("click", function(event) {
	
	event.preventDefault();
	const word = document.getElementById("word-input").value.toLowerCase();
	if (word === "")
		return;
	
	const url = "https://lingua-robot.p.rapidapi.com/language/v1/entries/en/" + word;	
	fetch(url, {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "lingua-robot.p.rapidapi.com",
			"x-rapidapi-key": "99410eb32emshba44d5d152d548cp19b9d4jsn9db3fc7a6f8b"
		}
	})
	.then(response => {
		return response.json();
	})
	.then(json => {		
		let entries = json.entries
		let results = "";
		
		//TODO: remove
		console.log(json);
		
		for(let i = 0; i < entries.length; i++) {
			results += "<div class='entry'>";
			results += "<h2 class='word'>" + entries[i].entry + "</h2>";
			
			// Pronunciations
			results += "<div class='pronunciations'><h3>Pronunciations</h3><p class='pronunciation-details'>";
			
			for (let j = 0; j < entries[i].pronunciations.length; j++) {
				let pronunciation = entries[i].pronunciations[j];
				if (pronunciation.transcriptions == null) {
					if (pronunciation.audio != null) {
						results += "<a class='audio' target='_blank' href='" + pronunciation.audio.url;
						results += "'>audio pronunciation</a>: (";
						for (let k = 0; k < pronunciation.context.regions.length; k++) {
							results += pronunciation.context.regions[k];
							if (k + 1 < pronunciation.context.regions.length)
								results += ", ";
						}
						results += ")<br />";
					}
					continue;
				}
				for (let k = 0; k < pronunciation.transcriptions.length; k++) {
					let transcription = pronunciation.transcriptions[k];
					results += transcription.transcription + ": (";
					for (let l = 0; l < pronunciation.context.regions.length; l++) {
						results += pronunciation.context.regions[l];
						if (l + 1 < pronunciation.context.regions.length)
							results += ", ";
					}
					results += ")<br />";
				}
			}
			results += "</p></div>";
			
			
			// Definitions
			results += "<div class='definitions'><h3>Definitions</h3>";
			for (let j = 0; j < entries[i].lexemes.length; j++) {
				let lexeme = entries[i].lexemes[j];
				results += "<div class='definition'><div class='definition-head'>";
				results += "<h4>" + lexeme.lemma + "</h4>";
				results += "<h5>" + lexeme.partOfSpeech + "</h5>";
				results += "</div>";
				for (let k = 0; k < lexeme.senses.length; k++) {
					let sense = lexeme.senses[k];
					results += "<p class='definition-details'>" + sense.definition + "<br />Labels: ";
					if (sense.labels == null)
						continue;
					for (let l = 0; l < sense.labels.length; l++) {
						results += sense.labels[l];
						if (l + 1 < sense.labels.length)
							results += ", ";
					}
					results += "</p>";
				}
				results += "</div>"
			}
			results += "</div>";
			
			results += "</div>";
		}
		
		document.getElementById("results").innerHTML = results;
	});
});