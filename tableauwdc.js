(function () {
    
    
    var myConnector = tableau.makeConnector();

    myConnector.init = function(initCallback) {
        initCallback();
        tableau.submit();
    };
    
    myConnector.getSchema = function (schemaCallback) {
      var cols = [{
          id: "id",
          dataType: tableau.dataTypeEnum.string
      }, {
          id: "mag",
          alias: "magnitude",
          dataType: tableau.dataTypeEnum.float
      }, {
          id: "title",
          alias: "title",
          dataType: tableau.dataTypeEnum.string
      }, {
          id: "location",
          dataType: tableau.dataTypeEnum.geometry
      }];

      var tableSchema = {
          id: "earthquakeFeed",
          alias: "Earthquakes with magnitude greater than 4.5 in the last seven days",
          columns: cols
      };

      schemaCallback([tableSchema]);
    };

    myConnector.getData = function (table, doneCallback) {
      $.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
          var feat = resp.features,
              tableData = [];

          // Iterate over the JSON object
          for (var i = 0, len = feat.length; i < len; i++) {
              tableData.push({
                  "id": feat[i].id,
                  "mag": feat[i].properties.mag,
                  "title": feat[i].properties.title,
                  "location": feat[i].geometry
              });
          }

          table.appendRows(tableData);
          doneCallback();
      });
    };

    tableau.registerConnector(myConnector);
})();


$(document).ready(function () {
    $("#submitButton").click(function () {
        var clientID='xellia';
        var clientToken='token';
        var userID='10002077';
        var authURL='https://xellia.plateau.com/learning/oauth-api/rest/v1/token';
        var dataURL="https://xellia.plateau.com/learning/odatav4/public/admin/user-service/v2/Users?$filter=targetUserID eq '10002077'";
        var authenticationString= clientID + ':' + clientToken;
        authenticationString= btoa(authenticationString);
        var header = {
            'Authorization' : authenticationString,
            'Content-Type' : 'application/json'
        };
        var body = {
            'grant_type':'client_credentials',
            'scope':{
                'userId':userID,
                'companyId':clientID,
                'userType':'admin',
                'resourceType':'learning_public_api'
            }
        };

        $.ajax({
            url: authURL,
            headers: {
                'Authorization' : authenticationString,
                'Content-Type' : 'application/json'
                },
            type: "POST", /* or type:"GET" or type:"PUT" */
            dataType: "json",
            data: {
                'grant_type':'client_credentials',
                'scope':{
                    'userId':userID,
                    'companyId':clientID,
                    'userType':'admin',
                    'resourceType':'learning_public_api'
                }
            },
            success: function (result) {
                document.getElementById("response").innerHTML += result;
            },
            error: function () {
                document.getElementById("response").innerHTML += error;
            } 
        });


    });
});
