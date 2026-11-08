// CLDR 49 territoryInfo and likelySubtags. See atlas.html for the inclusion rules.
const atlasScripts = {
  "Arab": {"AE":["ar"],"AF":["fa","ps"],"BH":["ar"],"BN":["ms"],"DJ":["ar"],"DZ":["ar"],"EG":["ar"],"ER":["ar"],"IL":["ar"],"IQ":["ar"],"IR":["fa"],"JO":["ar"],"KM":["ar","wni","zdj"],"KW":["ar"],"LB":["ar"],"LY":["ar"],"MA":["ar"],"MR":["ar"],"OM":["ar"],"PK":["ur"],"QA":["ar"],"SA":["ar"],"SD":["ar"],"SO":["ar"],"SY":["ar"],"TD":["ar"],"TN":["ar"],"YE":["ar"]},
  "Armn": {"AM":["hy"]},
  "Beng": {"BD":["bn"]},
  "Cyrl": {"AZ":["az"],"BA":["bs","sr"],"BG":["bg"],"BY":["be","ru"],"KG":["ky","ru"],"KZ":["kk","ru"],"MK":["mk"],"MN":["mn"],"RS":["sr"],"RU":["ru"],"TJ":["tg"],"UA":["ru","uk"],"UZ":["uz"]},
  "Deva": {"FJ":["hif"],"IN":["hi"],"NP":["ne"]},
  "Ethi": {"ER":["ti"],"ET":["am"]},
  "Geor": {"GE":["ka"]},
  "Grek": {"CY":["el"],"GR":["el"]},
  "Hang": {"KP":["ko"],"KR":["ko"]},
  "Hans": {"CN":["zh"],"SG":["zh"]},
  "Hebr": {"IL":["he"]},
  "Jpan": {"JP":["ja"]},
  "Khmr": {"KH":["km"]},
  "Laoo": {"LA":["lo"]},
  "Latn": {"AD":["ca"],"AG":["en"],"AL":["sq"],"AO":["pt"],"AR":["es"],"AT":["de"],"AU":["en"],"AZ":["az"],"BA":["bs","hr","sr"],"BB":["en"],"BE":["de","fr","nl"],"BF":["fr"],"BI":["en","fr","rn"],"BJ":["fr"],"BN":["ms"],"BO":["ay","es","qu"],"BR":["pt"],"BS":["en"],"BW":["en","tn"],"BZ":["en"],"CA":["en","fr"],"CD":["fr"],"CF":["fr","sg"],"CG":["fr"],"CH":["de","fr","gsw","it"],"CI":["fr"],"CL":["es"],"CM":["en","fr"],"CO":["es"],"CR":["es"],"CU":["es"],"CV":["pt"],"CY":["tr"],"CZ":["cs"],"DE":["de"],"DJ":["fr"],"DK":["da"],"DM":["en"],"DO":["es"],"DZ":["fr"],"EC":["es","qu"],"EE":["et"],"ER":["en"],"ES":["es"],"FI":["fi","sv"],"FJ":["en","fj"],"FM":["en"],"FR":["fr"],"GA":["fr"],"GB":["en"],"GD":["en"],"GH":["en"],"GM":["en"],"GN":["fr"],"GQ":["es","fr","pt"],"GT":["es"],"GW":["pt"],"GY":["en"],"HN":["es"],"HR":["hr"],"HT":["fr","ht"],"HU":["hu"],"ID":["id"],"IE":["en","ga"],"IN":["en"],"IS":["is"],"IT":["it"],"JM":["en"],"KE":["en","sw"],"KI":["en","gil"],"KM":["fr"],"KN":["en"],"LC":["en"],"LI":["de","gsw"],"LR":["en"],"LS":["en","st"],"LT":["lt"],"LU":["de","fr","lb"],"LV":["lv"],"MA":["fr","tzm"],"MC":["fr"],"MD":["ro"],"ME":["sr"],"MG":["en","fr","mg"],"MH":["en","mh"],"ML":["fr"],"MT":["en","mt"],"MU":["en","fr"],"MW":["en","ny"],"MX":["es"],"MY":["ms"],"MZ":["pt"],"NA":["en"],"NE":["fr"],"NG":["en","yo"],"NI":["es"],"NL":["nl"],"NO":["nb","nn","no"],"NR":["en","na"],"NZ":["en","mi"],"PA":["es"],"PE":["es","qu"],"PG":["en","ho","tpi"],"PH":["en","fil"],"PK":["en"],"PL":["pl"],"PT":["pt"],"PW":["en","pau"],"PY":["es","gn"],"RO":["ro"],"RS":["sr"],"RW":["en","fr","rw"],"SB":["en"],"SC":["en","fr"],"SD":["en"],"SE":["sv"],"SG":["en","ms"],"SI":["sl"],"SK":["sk"],"SL":["en"],"SM":["it"],"SN":["fr","wo"],"SO":["so"],"SR":["nl"],"SS":["en"],"ST":["pt"],"SV":["es"],"SZ":["en","ss"],"TD":["fr"],"TG":["fr"],"TL":["pt","tet"],"TM":["tk"],"TN":["fr"],"TO":["en","to"],"TR":["tr"],"TT":["en"],"TV":["en","tvl"],"TZ":["en","sw"],"UG":["en","sw"],"US":["en"],"UY":["es"],"UZ":["uz"],"VC":["en"],"VE":["es"],"VN":["vi"],"VU":["bi","en","fr"],"WS":["en","sm"],"ZA":["en"],"ZM":["en"],"ZW":["en","nd","sn"]},
  "Mymr": {"MM":["my"]},
  "Sinh": {"LK":["si"]},
  "Taml": {"LK":["ta"],"SG":["ta"]},
  "Thaa": {"MV":["dv"]},
  "Thai": {"TH":["th"]},
  "Tibt": {"BT":["dz"]}
};
