/* sparqlEPCU のプロジェクトからめぐるんぼで使用するデータを取得するためのクライアントオブジェクト */
function SPARQLClient() {
    this.rdfmgr = new RDFmgr();
    this.projectID = 'megurunbo';
}

/**
 * 美味しんぼのコマに付随している情報を取得するためのSPARQLクエリの生成
 * @param {Object} koma どこからどこまでのコマを指定するのか
 */
SPARQLClient.prototype.setKomaQuery = function(komaFirstLast) {
    this.sparql = 'select * where {' +
        '?s <http://linkdata.org/property/rdf1s1871i#koma> ?koma.' +
        'optional {?s <http://linkdata.org/property/rdf1s1871i#food> ?food.}' +
        'optional {?s <http://linkdata.org/property/rdf1s1871i#place> ?place.}' +
        'filter (?koma >= ' + komaFirstLast['first'] + ' && ?koma <= ' + komaFirstLast['last'] + ')' +
        '}';
    this.projectID = 'megurunbo';
};

/**
 * 食べ物情報を取得するためのSPARQLクエリの生成
 * @param {Array} array コマに掲載されている食べ物の配列
 */
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

/**
 * 場所の情報を取得するためのSPARQLクエリの生成
 * @param {Array} array コマに掲載されている場所の配列
 */
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

/**
 * 生成したクエリと指定したプロジェクトでデータを取得
 * @param  {Method} success 成功時の処理を行う関数
 */
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