import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Videos = new Mongo.Collection('videos');
const API_CLARIFAI_TOKEN = "MuQ9WIiflFN1xCyXXzZbvqmYDVs4r2";
const PROBABILITY_THRESHOLD = 0.01;

if (Meteor.isServer) {
  // This code only runs on the server
  console.log("publishing videos");
  Meteor.publish('videos', function videos() {
    return Videos.find();
  });
}

Meteor.methods({
  'videos.insert'(token, source)
  {
    Videos.insert({
      token: token,
      source: source,
      dateCreated: new Date(), // current time
    }, function(error, _id) {
      if (error) {
        console.log(error);
      } else {
        console.log("Inserted:" + _id);
        requestClarifai(_id, source);
      }
    });
  },
  'videos.remove'(id) {
    Videos.remove(id);
  },
  'videos.updateTag'(id, tag) {
    Videos.update(id, {
      $set: {
        tag: tag
      }
    }, function(error) {
      if (error) {
        console.log(error);
      } else {
        console.log("Video updated");
      }
    });
  }
});

function addVideoAnalysis(tag)
{
  // $('#container').append($(document.create))

  var data = new google.visualization.DataTable();
  data.addColumn('number', 'X');

  var rows = [];
  _.each(tag.classes, function(c, i) {
    var row = [0];
    _.each(c, function(value, key) {
      if (i == 0) {
        data.addColumn('number', key);
      }
      row.push(value * 100);
    })
    rows.push(row);
  });
  console.log(rows);
  data.addRows(rows);

  var options = {
    hAxis: {
      title: 'Time'
    },
    vAxis: {
      title: 'Percent'
    }
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

function requestClarifai(id, source)
{
  console.log('requestClarifai:', source);

  var url = "https://api.clarifai.com/v1/tag/";
  var options = {
    params: {
      url: source,
      select_concept_ids: "ai_mvRRZ5Mq,ai_PKkxSKJs,ai_Z5rkBk8S,ai_lhlzHN54,ai_fSjjbdsM,ai_RScKn5hr,ai_lm3v1c0c,ai_cFn62sKR,ai_Rdr2tMg8,ai_Gr3tRwKQ,ai_WK0nQhrJ,ai_ll8SBSSM,ai_n5VHkjF7,ai_9s2GpcKK,ai_4CRlSvbV,ai_m190WhTb,ai_DNfrgQlv,ai_1T9sBmW4,ai_4rqC2FcG,ai_mf4Js92p,ai_r2PnWjm8,ai_J8svGrmL,ai_xNm4Wzgr,ai_0W0TJWKj,ai_302k9XGn,ai_gzmK7wBZ,ai_2RLDBL2L,ai_llC6jxgG,ai_vLHz8KGj,ai_CdzB320r,ai_PGVgKZ0P,ai_qLS56qdQ,ai_KztvKkHd,ai_HH9bfksC,ai_j9g4WxsH,ai_Cr2KMSMJ,ai_CC1Mn0Ck,ai_PmgSwP0P,ai_Nb5XFSBx,ai_tRcM16cZ,ai_xWwbFGSM,ai_1NMjgGRm,ai_hQT1xv0H,ai_DqkHZlVW,ai_2z0hSvdb,ai_Z2P7Kk5t,ai_XBWnxP9B,ai_7wvggs4T,ai_fJd7H09d,ai_xShvKnDN,ai_r2PnWjm8,ai_LnWVGtDF,ai_bgVmZzBn"
    },
    headers: {
      Authorization: "Bearer " + API_CLARIFAI_TOKEN,
    }
  };
  HTTP.get(url, options, function(error, response)
  {
    if (error) {
      console.log(error);
    }
    else
    {
      console.log([response.statusCode
        , response.data.status_code
        , response.data.status_msg
      ].join(" "));

      // Get tags and filter out low probability ones
      var results = response.data.results[0].result.tag;
      var classes = [], timestamps = [];
      _.each(results.timestamps, function(timestamp, t)
      {
        timestamps.push(timestamp);
        var tempC = results.classes[t];
        var c = {};
        _.each(results.probs[t], function(probability, p)
        {
          var tempCP = tempC[p];
          console.log('prob:', probability, p);
          if (probability > PROBABILITY_THRESHOLD) {
            if (c[tempCP]) {
              if (c[tempCP] < probability) {
                c[tempCP] = probability;
              }
            } else {
              c[tempCP] = probability;
            }
          } else {
            c[tempCP] = 0;
          }
        });
        classes.push(c);
      });
      var tag = {
        classes: classes,
        timestamps: timestamps,
      };
      console.log(tag);

      // Update video and store tags
      addVideoAnalysis(tag);
      Meteor.call('videos.updateTag', tag);
    }
  });
}
