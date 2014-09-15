function SPARQLClient() {
    this.rdfmgr = new RDFmgr();
}

SPARQLClient.prototype.setSPARQLQuery = function(query) {
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