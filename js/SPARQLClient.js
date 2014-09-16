function SPARQLClient() {
    this.rdfmgr = new RDFmgr();
    this.projectID = 'megurunbo';
}

SPARQLClient.prototype.setKomaQuery = function(koma) {
    this.sparql = 'select * where {' +
        '?s <http://linkdata.org/property/rdf1s1871i#koma> ?koma.' +
        'optional {?s <http://linkdata.org/property/rdf1s1871i#food> ?food.}' +
        'optional {?s <http://linkdata.org/property/rdf1s1871i#place> ?place.}' +
        'filter (?koma >= ' + koma['from'] + ' && ?koma <= ' + koma['to'] + ')' +
        '}';
    this.projectID = 'megurunbo';
};

SPARQLClient.prototype.setFoodQuery = function(array) {
    var tmp = "";
    for (var i = 0; i < array.length; i++) {
        tmp += '?food = "' + array[i] + '"@ja';
        if (i != array.length - 1) tmp += "||";
    }

    this.sparql = 'select * where {' +
        '?s rdfs:label ?label.' +
        '?s <http://linkdata.org/property/rdf1s1871i#food> ?food.' +
        'optional {?s dce:description ?des.}' +
        'filter(' + tmp + ')' +
        '}';

    this.projectID = 'megurunbo_food';
    console.log(this.sparql);
};

SPARQLClient.prototype.setPlaceQuery = function(array) {
    var tmp = "";
    for (var i = 0; i < array.length; i++) {
        tmp += '?place_name = "' + array[i] + '"@ja';
        if (i != array.length - 1) tmp += "||";
    }

    this.sparql = 'select * where {' +
        '?s rdfs:label ?label.' +
        '?s <http://linkdata.org/property/rdf1s1871i#place_name> ?place_name.' +
        'optional {?s dce:description ?des.}' +
        'filter(' + tmp + ')' +
        '}';

    this.projectID = 'megurunbo_food';
    console.log(this.sparql);
};

SPARQLClient.prototype.request = function(success) {
    this.rdfmgr.executeSparql({
        sparql: this.sparql,
        inference: false,
        projectID: this.projectID,
        success: success,
        error: function() {
            console.log('error');
        }
    });
};