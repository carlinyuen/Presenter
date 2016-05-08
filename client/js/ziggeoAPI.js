
const API_CLARIFAI_TOKEN = "MuQ9WIiflFN1xCyXXzZbvqmYDVs4r2";
ZiggeoApi.token = "f0d1895a228597dcf158bbb6328549aa";
ZiggeoApi.Config.webrtc = true;
ZiggeoApi.Events.on("submitted", function (data)
{
  console.log(data);
  var token = data.video.token;
  var source = ZiggeoApi.Videos.source(token);

  // Insert a video into the collection
  Meteor.call('videos.insert', token, source);

  // Testing
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
  HTTP.get(url, options, function(error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log(response);
    }
  });
});
