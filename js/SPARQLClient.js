function SPARQLClient() {
    this.rdfmgr = new RDFmgr();
}

SPARQLClient.prototype.selectSPARQLQuery = function(num) {
    var query;

    switch (num) {
        case 1:
            query = 'select * where {' +
                '?s rdfs:label ?label.' +
                '?s <http://linkdata.org/property/rdf1s1871i#food> ?food.' +
                'optional {?s dce:description ?des.}' +
                '}';
            break;
        case 2:
            query = 'select * where {' +
                '?s rdfs:label ?label.' +
                '?s <http://linkdata.org/property/rdf1s1871i#place_name> ?place_name.' +
                'optional {?s dce:description ?des.}' +
                '}';
            break;
        case 3:
            query = 'select * where {' +
                '?s rdfs:label ?label.' +
                'optional {?s <http://linkdata.org/property/rdf1s1871i#food> ?food.}' +
                'optional {?s <http://linkdata.org/property/rdf1s1871i#place> ?place.}' +
                '}';
            break;

        default:
            alert('Select Error');
            break;
    }
    this.sparql = query;
};

SPARQLClient.prototype.request = function(success, prjectID) {
    this.rdfmgr.executeSparql({
        sparql: this.sparql,
        inference: false,
        projectID: projectID,
        success: success,
        error: function() {
            console.log('error');
        }
    });
};