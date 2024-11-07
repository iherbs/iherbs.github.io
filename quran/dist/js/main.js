var xmlhttp,
  surah = 0, markno = "", zoomlevel = 0, trackrate = 1, trackmode = 'A', isAwake = false;
url = "https://raw.githubusercontent.com/iherbs/quran-json/main/";
let surah_list = {}, surah_data = [], doa_data = [], asma = [];
function _(id) {
  let el = {}, ismodal = false;
  if (id.substr(0, 1) == "#") {
    el = document.getElementById(id.substr(1, id.length));
    if (el != null) {
      if (el.classList.contains("modal")) {
        ismodal = true;
      }
    }
  } else if (id.substr(0, 1) == ".") {
    el = document.querySelectorAll(id);
  }

  if (ismodal) {
    el.modal = function (opt = "") {
      if (opt == "show") {
        el.style.display = "block";
        document
          .getElementsByTagName("body")[0]
          .style.overflow = "hidden";
      } else if (opt == "hide") {
        el.style.display = "none";
        document.getElementsByTagName("body")[0].style.overflow = null;
      }
    };
  }

  return el;
}

_(".modaloverlay").forEach((el) =>
  el.addEventListener("click", (event) => {
    event.target.parentNode.style.display = "none";
    let mop = true;
    for (m in _(".modaloverlay")) {
      if (!isNaN(m)) {
        if (_(".modaloverlay")[m].parentNode.style.display == "block") {
          mop = false;
        }
      }
    }
    if (mop) {
      document.getElementsByTagName("body")[0].style.overflow = null;
    }
  })
);

_(".modalclose").forEach((el) =>
  el.addEventListener("click", (event) => {
    event.target.parentNode.parentNode.style.display = "none";
    let mop = true;
    for (m in _(".modaloverlay")) {
      if (!isNaN(m)) {
        if (_(".modaloverlay")[m].parentNode.style.display == "block") {
          mop = false;
        }
      }
    }
    if (mop) {
      document.getElementsByTagName("body")[0].style.overflow = null;
    }
  })
);

_(".dropbtn").forEach((el) =>
  el.addEventListener("click", (event) => {
    // console.log(window.getComputedStyle(el.nextElementSibling).display == "none");
    if (window.getComputedStyle(el.nextElementSibling).display === "none") {
      el.nextElementSibling.style.display = "block";
    } else {
      el.nextElementSibling.style.display = "none";
    }
  })
);

function toast(txt = "") {
  var x = document.getElementById("toast");
  x.innerHTML = txt;
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
    x.innerHTML = "";
  }, 3000);
}

async function get(file = "") {
  return new Promise((resolve, _reject) => {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", file);
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        // console.log(xmlhttp.responseText);
        resolve(xmlhttp.responseText);
      }
    };
    xmlhttp.send();
  });
}

//==============================================================================

function openNav(m = '') {
  _("#sidenavoverlay").style.display = "block";
  document.getElementById("mySidenav").style.width = "250px";
  if (m != '') {
    _("#navjuzamma").style.display = "none";
  } else {
    _("#navjuzamma").style.display = "block";
  }
}

function closeNav() {
  _("#sidenavoverlay").style.display = "none";
  document.getElementById("mySidenav").style.width = "0";
}

function setTheme() {
  if (_("#btntheme").checked == true) {
    document.getElementsByTagName("body")[0].setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    document.querySelector("meta[name=theme-color]").setAttribute("content", "#1f2125");
  } else {
    document
      .getElementsByTagName("body")[0]
      .setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    document.querySelector("meta[name=theme-color]").setAttribute("content", "#007070");
  }
}

function setTransliteration() {
  if (_("#btntransliteration").checked == true) {
    localStorage.setItem("transliteration", "true");
    _(".artr").forEach(function (el) {
      el.style.display = "block";
    });
  } else {
    localStorage.setItem("transliteration", "false");
    _(".artr").forEach(function (el) {
      el.style.display = "none";
    });
  }
}

function setTranslate() {
  if (_("#btntranslate").checked == true) {
    localStorage.setItem("translate", "true");
    _(".arid").forEach(function (el) {
      el.style.display = "block";
    });
  } else {
    localStorage.setItem("translate", "false");
    _(".arid").forEach(function (el) {
      el.style.display = "none";
    });
  }
}

function setTajweed() {
  if (_("#btntajweed").checked == true) {
    localStorage.setItem("tajweed", "true");
  } else {
    localStorage.setItem("tajweed", "false");
  }

  if (surah != 0) {
    getsurah(surah);
  }
}

//==============================================================================

async function getqlist() {
  _("#list").innerHTML = `<div style="width:100%;height:150px;"><div class="loader"></div></div>`;
  let re = await get(url + "surah_list.json");
  re = JSON.parse(re);
  surah_list = re;
  // console.log(re);
  makeqlist();
}

function makeqlist(key = "") {
  let re = surah_list,
    table = "";

  let keyjuz = key.split(" ");
  keyjuz = keyjuz[1];

  for (i in re) {
    if (
      (key == "" ||
        re[i]["id"] == key ||
        re[i]["name"].toLowerCase().includes(key.toLowerCase()) ||
        re[i]["text_id"].toLowerCase().includes(key.toLowerCase()) ||
        re[i]["altername"].toLowerCase().includes(key.toLowerCase())) ||
      (key.toLowerCase() == "juz amma" && (parseInt(re[i]["id"]) == 1 || parseInt(re[i]["id"]) >= 78)) ||
      (key.toLowerCase().substring(0, 4) == "juz " && re[i]["juz"].includes(keyjuz))
    ) {
      // let juz = re[i]["juz"].toString().replaceAll(",", ", ");
      table += `<div class="row listitem" onclick="getsurah(${re[i]["id"]})">
            <div class="col listnum"><div class="star8" style="top:5px;" data-label="${re[i]["id"]}"></div></div>
            <div class="col">
                <span class="nmayah">${re[i]["name"]}</span>
                <small class="arti">(${re[i]["text_id"]})</small>
                <span class="type">${re[i]["type_id"] + ", " + re[i]["count"] + " Ayat"}</span>
            </div>
            <div class="col arabic" style="text-align:right;float:right;font-size:20px;white-space:nowrap;">${re[i]["text"]}</div>
        </div>`;
    }
  }
  _("#list").innerHTML = table;
}

function cari(qry = "") {
  carikata(qry);
}

async function carikata(qry = "") {
  xmlhttp.abort();
  qry = qry.toLowerCase().trim();
  let table = "";
  let kw = qry.split(" ");
  let transliteration = localStorage.getItem("transliteration");
  let translate = localStorage.getItem("translate");
  let tajweed = localStorage.getItem("tajweed");

  if (qry != "" && qry.substring(0, 4) != 'juz ') {
    let srlt = surah_list, adalist = false;
    _("#wload").innerHTML = `<div style="width:100%;height:150px;"><div class="loader"></div></div>`;
    for (let q = 1; q <= 114; q++) {
      let re = await get(url + "Surah/" + q + ".json");
      let arr = JSON.parse(re);

      for (r in arr) {
        let n = parseInt(r) + parseInt(1);
        // console.log(stem(arr[r]['text_id']));
        let ayat = arr[r]["text_id"].toLowerCase();
        let ada = 0;
        for (w in kw) {
          if (ayat.includes(kw[w])) {
            ada = ada + 1;
          }
        }
        if (ada == kw.length) {
          // console.log({ "no_surah": q, "no_ayah": n, "surah": surah_list[q], "ayah": arr[r] });
          table += `<tr onclick="getsurah(${q},${n})">
                            <td class="ayah">
                                <div style="color:var(--color-title-text);font-weight:bold;margin-bottom:5px;">
                                ${srlt[q]["name"] + " (" + q + ":" + n + ")"}
                                </div>
                                <div class="arabic" style="width:100%;text-align:right;font-size:27px;line-height:2.3;margin-bottom:10px;direction:rtl;">
                                    ${parseArabic(arr[r]["text_ayah"], tajweed)}
                                </div>
                                <span class="artr" style="display:${transliteration == "true" ? 'block' : 'none'}"><i>${arr[r]["transliteration"]}</i></span>
                                <span class="arid" style="display:${translate == "true" ? 'block' : 'none'}">${arr[r]["text_id"]}</span>
                            </td>
                        </tr>`;
        }
      }
    }

    for (i in srlt) {
      if (
        qry == "" ||
        srlt[i]["id"] == qry ||
        srlt[i]["name"].toLowerCase().includes(qry.toLowerCase()) ||
        srlt[i]["text_id"].toLowerCase().includes(qry.toLowerCase()) ||
        srlt[i]["altername"].toLowerCase().includes(qry.toLowerCase())
      ) {
        adalist = true;
      }
    }

    _("#wload").innerHTML = "";

    if (!adalist && table == "") {
      _("#list").innerHTML +=
        '<div style="width:100%;text-align:center;padding:20px;margin-top:20px;color:var(--color-title-text);">&bull; &bull; &bull; &bull;</div>';
    } else {
      _("#list").innerHTML +=
        '<table class="surah" style="overflow:hidden;border-bottom-left-radius:10px;border-bottom-right-radius:10px;">' +
        table +
        "</table>";
    }
  } else {
    _("#wload").innerHTML = "";
  }
}

async function getsurah(surat = 1, nayah = "") {
  surah = surat;
  window.location.hash = "#surah";
  let srh = surah_list[surah];
  _("#home").style.display = "none";
  _("#surah").style.display = "block";
  _("#surah").innerHTML = `<div class="loader"></div>`;
  _("#wrapmenu").style.display = "block";
  _("#tsurah").innerHTML = surah + ") " + srh["name"];

  let re = await get(url + "Surah/" + surah + ".json");
  re = JSON.parse(re);
  surah_data = re;
  // console.log(re);

  let ayah = "", gotono = "";
  let transliteration = localStorage.getItem("transliteration");
  let translate = localStorage.getItem("translate");
  let tajweed = localStorage.getItem("tajweed");

  ayah += '<div id="track0" style="display:none;">https://github.com/iherbs/quran-json/raw/main/Audio/001/001.mp3</div>';
  for (i in re) {
    let mark = surah + "_" + re[i]["no_ayah"];
    let dirs = (surat.toString().length == 1 ? '00' + surat : (surat.toString().length == 2 ? '0' + surat : surat));
    let dira = (re[i]["no_ayah"].toString().length == 1 ? '00' + re[i]["no_ayah"] : (re[i]["no_ayah"].toString().length == 2 ? '0' + re[i]["no_ayah"] : re[i]["no_ayah"]));
    ayah += `<tr id="n${re[i]["no_ayah"]}" style="scroll-margin:40px;">
            <td style="vertical-align:top;padding-top:15px;padding-bottom:15px;padding-left:15px;padding-right:15px;">
                <div id="track${re[i]["no_ayah"]}" class="tracks">https://github.com/iherbs/quran-json/raw/main/Audio/${dirs}/${dira}.mp3</div>
                <div class="bookmark" id="bm${mark}" onclick="addmdlBookmark('${mark}')" style="position:absolute;right:22px;margin-top:-15px;"></div>
                <label class="btnaudio play-button" id="bplps${re[i]["no_ayah"]}" onclick="audioPlay('${re[i]["no_ayah"]}')"></label>
                <label class="btnvoice voice-button" id="bvoice${re[i]["no_ayah"]}" onclick="GetSpeech('${re[i]["no_ayah"]}')"></label>
                <div onclick="moreOption(${surah},${re[i]["no_ayah"]})">
                  <div class="star8" style="cursor:pointer;position:relative;" data-label="${re[i]["no_ayah"]}" onclick="showtafsir(${re[i]["id"]})"></div>
                  <div class="arabic" style="width:100%;text-align:right;font-size:27px;line-height:2.3;margin-top:12px;margin-bottom:10px;direction:rtl;">
                      ${parseArabic(re[i]["text_ayah"], tajweed)}
                  </div>
                  <span class="artr" style="display:${transliteration == "true" ? 'block' : 'none'}"><i>${re[i]["transliteration"]}</i></span>
                  <span class="arid" style="display:${translate == "true" ? 'block' : 'none'}">${re[i]["text_id"].replaceAll("<sup>", `<sup class="fnote" onclick="showfnote(${i})">`)}</span>
                </div>
            </td>
        </tr>`;

    gotono += `<div class="listayah" onclick="gotoayah(${re[i]["no_ayah"]})">${re[i]["no_ayah"]}</div>`;
  }
  _("#gotoayah").innerHTML = gotono;

  let bismillah = "";
  if (surah != 1) {
    bismillah = '<tr><td colspan="3"><div class="arabic bismillah">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div></td></tr>';
  }

  _(
    "#surah"
  ).innerHTML = `<table style="width:100%;padding-bottom:10px;margin-top:10px;border-bottom:2px solid #8d6e63;">
    <tr>
        <td style="vertical-align:middle;text-align:center;font-size:24px;">
            <i class="fa-solid fa-house"></i>
        </td>
        <td style="padding:10px;">
            <span class="nmayah">${srh["id"]})&nbsp;${srh["name"]}</span>
            <small class="arti">(${srh["text_id"]})</small>
            <span class="type">${srh["type_id"] + ", " + srh["count"] + " Ayat"}</span>
        </td>
        <td style="vertical-align:middle;text-align:right;font-size:24px;padding:10px;">
            <div class="arabic">${srh["text"]}<div>
        </td>
    </tr>
</table>

<table class="surah">${bismillah + ayah}</table>`;
  window.scrollTo({ top: 0 });
  if (nayah != "") {
    gotoayah(nayah);
  }
}

async function getayah(surat = 1, nayah = 1) {
  window.location.hash = "#qs" + surat + "." + nayah;
  _("#home").style.display = "none";
  _("#surah").style.display = "block";
  _("#surah").innerHTML = `<div class="loader"></div>`;
  _("#tsurah").innerHTML = `<span id="tohome" onclick="history.replaceState(null, null, ' ');window.location.reload();" class="icon-home" style="position:relative;top:2px;margin-right:5px;cursor:pointer;"></span>`;
  _("#tsurah").removeAttribute("onclick");
  _("#wrapmenu").style.display = "block";
  _("#tohome").style.display = "none";
  _("#toayah").style.display = "none";
  _("#lnav").style.display = "none";
  _("#rnav").style.display = "none";

  let resl = await get(url + "surah_list.json");

  surah_list = JSON.parse(resl);
  let srh = surah_list[surat];

  let re = await get(url + "Surah/" + surat + ".json");
  re = JSON.parse(re);
  surah_data = re;
  // console.log(re);

  let ayah = `<tr id="n${re[nayah - 1]["no_ayah"]}" style="background:var(--color-content);">
              <td style="vertical-align:top;padding-top:15px;padding-bottom:15px;padding-left:15px;padding-right:15px;">
                  <div class="star8" data-label="${re[nayah - 1]["no_ayah"]}" onclick="showtafsir(${re[nayah - 1]["id"]})" style="cursor:pointer;"></div>
                  <div class="arabic" style="width:100%;text-align:right;font-size:27px;line-height:2.3;margin-top:12px;margin-bottom:10px;direction:rtl;">
                      ${parseArabic(re[nayah - 1]["text_ayah"])}
                  </div>
                  <span class="artr"><i>${re[nayah - 1]["transliteration"]}</i></span>
                  <span class="arid">
                  ${re[nayah - 1]["text_id"].replaceAll("<sup>", `<sup class="fnote" onclick="showfnote(${nayah - 1})">`)}
                  </span>
              </td>
          </tr>`;

  _("#surah").innerHTML = `<table style="width:100%;padding-bottom:10px;margin-top:10px;border-bottom:2px solid #8d6e63;">
      <tr>
          <td style="vertical-align:middle;text-align:center;font-size:24px;">
              <i class="fa-solid fa-house"></i>
          </td>
          <td style="padding:10px;">
              <span class="nmayah">${srh["id"]})&nbsp;${srh["name"]}</span>
              <small class="arti">(${srh["text_id"]})</small>
              <span class="type">${srh["type_id"] + ", " + srh["count"] + " Ayat"}</span>
          </td>
          <td style="vertical-align:middle;text-align:right;font-size:24px;padding:10px;">
              <div class="arabic">${srh["text"]}<div></td>
      </tr>
  </table>

  <table class="surah">${ayah}</table>`;
  window.scrollTo({ top: 0 });
}

async function getasmaulhusna() {
  closeNav();
  if (window.location.hash == '') {
    window.location.hash = "#asmaulhusna";
  } else {
    window.location.replace("#asmaulhusna");
  }
  _("#wrapmenu").style.display = "none";
  _("#home").style.display = "none";
  _("#surah").style.display = "block";
  _("#surah").innerHTML = `<div class="loader"></div>`;

  let reas = await get(url + "asmaul_husna.json");
  let as = JSON.parse(reas);
  asma = as;
  // console.log(as);

  let list = `<div class="titleq">Asmaul Husna</div>
          <table class="tablecont">`;
  for (i in as) {
    list += `<tr class="listitem" onclick="moreOption(${i},'asma')">
                <td style="width:30px;">
                  <span style="display:block;height:31.55px;color:var(--color-text);">${as[i]['no']}</span>
                </td>
                <td>
                    <span class="nmayah">${as[i]['transliteration']}</span>
                    <span class="type">${as[i]['text_id']}</span>
                    <div class="arabic" style="text-align:right;float:right;font-size:25px;padding-top:5px;">${as[i]['text_ayah']}</div>
                </td>
            </tr>`;
  }
  list += `</table>`;
  _("#surah").innerHTML = list;
}

async function doaharian() {
  closeNav();
  if (window.location.hash == '') {
    window.location.hash = "#doaharian";
  } else {
    window.location.replace("#doaharian");
  }
  _("#wrapmenu").style.display = "none";
  _("#home").style.display = "none";
  _("#surah").style.display = "block";
  _("#surah").innerHTML = `<div class="loader"></div>`;

  let list = `<div class="titleq">Doa Harian</div>
          <div style="padding:5px;">
              <div class="findfield">
                  <input type="text" id="caridoa" class="form-control txtfind" placeholder="Cari Doa" onkeyup="caridoa()" />
                  <div class="fndclear" id="clearsrcdoa" onclick="clearsrcdoa()">×</div>
              </div>
          </div>
          <div id="listdoa"><div class="loader"></div></div>`;
  _("#surah").innerHTML = list;
  listdoa();
}

async function listdoa(key = "") {
  let redoa = await get(url + "doa_harian.json");
  let doa = JSON.parse(redoa);
  doa_data = doa;
  // console.log(doa);

  let list = `<table class="tablecont">`;
  for (i in doa) {
    if (
      key == "" ||
      doa[i]['name'].toLowerCase().includes(key.toLowerCase()) ||
      doa[i]['transliteration'].toLowerCase().includes(key.toLowerCase()) ||
      doa[i]['text_id'].toLowerCase().includes(key.toLowerCase())
    ) {
      list += `<tr class="listitem">
                <td onclick="moreOption(${i},'doa')">
                    <span style="display:block;height:31.55px;color:var(--color-textstar);font-weight:bold;">
                      ${doa[i]['no'] + ". " + doa[i]['name']}
                    </span>
                    <div class="arabic" style="width:100%;text-align:right;font-size:27px;line-height:2.3;margin-top:12px;margin-bottom:10px;direction:rtl;">
                      ${doa[i]['text_ayah']}
                    </div>
                    <span class="artr"><i>${doa[i]['transliteration']}</i></span>
                    <span class="arid">${doa[i]['text_id']}</span>
                </td>
            </tr>`;
      // list += "]" + doa[i]['text_ayah'] + "<br><br>";
    }
  }
  list += `</table>`;
  _("#listdoa").innerHTML = list;
}

function caridoa() {
  let key = _("#caridoa").value;
  if (key != "") {
    _("#clearsrcdoa").style.display = "block";
  } else {
    _("#clearsrcdoa").style.display = "none";
  }
  listdoa(key);
}

function clearsrcdoa() {
  _("#caridoa").value = "";
  listdoa();
}

function imagemaker_show() {
  closeNav();
  closeTrack();

  let state = _("#state").innerHTML;
  let qs = JSON.parse(state);

  let txt = "";
  if (qs["ayah"] == "doa") {
    txt = '<div style="width:100%;line-height:2.3;padding:10px 18px;font-size:22px;">' + qs["name"] + '</div><div id="txtarabic" style="width:100%;line-height:2.3;padding:10px 18px;font-family:arabic;">' + qs["ayah_text"] +
      '</div>' + qs["text"];
  } else {
    txt = '<div id="txtarabic" style="width:100%;line-height:2.3;padding:10px 18px;font-family:arabic;">' + qs["ayah_text"] +
      '</div>' + qs["text"] +
      '<br>' + qs["name"];
  }

  _("#caption").innerHTML = txt;
  _("#imageker").style.display = "block";
  document.getElementsByTagName("body")[0].style.overflow = "hidden";
  document.getElementById("tsize").value = "18";
  setSize(18);
  resize(345, 110);
  repositionElement(50, 20, "%");
  closeOptions();
}

function imagemaker_hide() {
  _("#caption").innerHTML = "Quran Word";
  _("#imageker").style.display = "none";
  document.getElementsByTagName("body")[0].style.overflow = "";
}

function getjuzamma() {
  _("#cari").value = "Juz Amma";
  _("#cari").dispatchEvent(new KeyboardEvent('keyup', { keyCode: 13 }));
  closeNav();
}

async function getjuz() {
  closeNav();
  _("#modalwidget").modal("show");
  _("#widgetcontent").innerHTML = '<div class="loader"></div>';
  let reas = await get(url + "juz_list.json");
  let juz = JSON.parse(reas);

  _("#widgetcontent").innerHTML = `<span class="widgettittle">JUZ</span>`;
  for (let i = 1; i <= 30; i++) {
    _("#widgetcontent").innerHTML += `<div class="listayah" style="text-align:left;padding:10px;" onclick="gotoBookmark('${juz[i]["start"]["no_surah"] + "_" + juz[i]["start"]["ayah"]}');_('#modalwidget').modal('hide');"><b>Juz ${i}</b><br>(${juz[i]["start"]["nm_surah"] + ", " + juz[i]["start"]["ayah"]} ~ ${juz[i]["end"]["nm_surah"] + ", " + juz[i]["end"]["ayah"]})</div>`;
  }
}

function gotoayah(i = 1, smoth = false) {
  _("#modalgotoayah").modal("hide");
  if (smoth) {
    _("#n" + i).scrollIntoView({ behavior: "smooth" });
  } else {
    _("#n" + i).scrollIntoView();
  }
}

function showfnote(i = 0) {
  _("#modalwidget").modal("show");
  _("#widgetcontent").innerHTML =
    `<span class="widgettittle">Catatan</span>` +
    surah_data[i]["text_fn"].replaceAll("</br>", "</br></br>");
}

async function showtafsir(id = 0) {
  if (id != 0) {
    _("#modalwidget").modal("show");
    _("#widgetcontent").innerHTML = '<div class="loader"></div>';
    let re = await get(url + "Tafsir/" + id + ".json");
    re = JSON.parse(re);
    _("#widgetcontent").innerHTML =
      `<span class="widgettittle">Tafsir Wajiz</span><div class="arabic" style="text-align:justify;text-justify:inter-word;">` +
      re["tafsir_wajiz"] +
      `</div><br><br><span class="widgettittle">Tafsir Tahlili</span><div class="arabic" style="text-align:justify;text-justify:inter-word;">` +
      re["tafsir_tahlili"] +
      `</div>`;
  }
}

function nextsurah() {
  closeTrack();
  closeOptions();
  closeRecog();
  surah = parseInt(surah) + parseInt(1);
  if (surah > 114) {
    surah = 1;
  }
  getsurah(surah);
}

function prevsurah() {
  closeTrack();
  closeOptions();
  closeRecog();
  surah = parseInt(surah) - parseInt(1);
  if (surah < 1) {
    surah = 114;
  }
  getsurah(surah);
}

function showtajweedinfo() {
  closeNav();
  _("#modalwidget").modal("show");
  _("#widgetcontent").innerHTML = `<div style="line-height:1.7;">
      <div style="font-weight:bold;font-size:20px;margin-bottom:5px;">Tajweed<hr></div>
      <label class="ghunnah">Ghunnah</label><br>
      <label class="madda">Maddah</label><br>
      <label class="qalqala">Qalqala</label><br>
      <label class="iqlab">Iqlab</label><br>
      <label class="ikhfa">Ikhfa</label><br>
      <label class="ikhfasya">Ikhfa Syafawi</label><br>
      <label class="idhgham">Idhgham</label><br>
      <label class="idhghammimi">Idhgham Mimi</label><br>
      <label class="idhghamnoghunnah">Idhgham Without Ghunnah</label>
    </div>`;
}

function pegon(me, t = "") {
  if (t == "l") {
    _("#txtar").value = latara(me.value);
  } else if (t == "a") {
    _("#txtla").value = aralat(me.value);
  }
}

function showpegon() {
  closeNav();
  _("#modalwidget").modal("show");
  _("#widgetcontent").innerHTML = `<span class="widgettittle">Pegon</span>
    <textarea placeholder="Teks latin" id="txtla" class="form-control" style="height:70px;font-size:16px;" onkeyup="pegon(this,'l')"></textarea>
    <textarea placeholder="Teks Arab" id="txtar" class="form-control" style="height:70px;font-size:16px;text-align:right;font-family:'Arabic';" onkeyup="pegon(this,'a')"></textarea>`;
}

function zoompage(num = 0) {
  if (num == 'r') {
    zoomlevel = 100;
  } else {
    zoomlevel = parseInt(zoomlevel) + parseInt(num);
  }
  localStorage.setItem("zoomlevel", zoomlevel);
  _("#zoomlevel").innerHTML = zoomlevel + "%";
  document.getElementsByTagName("body")[0].style.zoom = zoomlevel + "%";
}

let touchtime = 0;
function moreOption(surat = 1, ayat = 1) {
  if (_("#recognizer").style.display != "block") {
    if (touchtime == 0) {
      touchtime = new Date().getTime();
    } else {
      if (((new Date().getTime()) - touchtime) < 800) {
        touchtime = 0;
        let surah_text = "";
        let sayah = "";
        let sname = "";

        if (ayat == 'doa') {
          _("#btncopylink").style.display = "none";
          sayah = doa_data[surat]['text_ayah'];
          surah_text = doa_data[surat]['text_id'];
          sname = doa_data[surat]['name'];
        } else if (ayat == 'asma') {
          _("#btncopylink").style.display = "none";
          sayah = asma[surat]['text_ayah'];
          surah_text = asma[surat]['text_id'];
        } else {
          _("#btncopylink").style.display = "table-row";
          sayah = surah_data[ayat - 1]["text_ayah"];
          surah_text = surah_data[ayat - 1]["text_id"].replace(/<(.|\n)*?>*<(.|\n)*?>/g, '');
          sname = "(QS. " + surah_list[surat]["altername"] + " : " + ayat + ")";
        }

        _("#state").innerHTML = '{"surah":"' + surat + '","ayah":"' + ayat + '","ayah_text":"' + sayah + '","text":"' + surah_text + '","name":"' + sname + '"}';
        // _("#state").innerHTML = surat + '.' + ayat;
        _("#previewsurah").innerHTML = '<div class="previewsurah arabic">' + sayah + '</div>';
        _("#options").style.display = "block";
      } else {
        touchtime = new Date().getTime();
      }
    }
  }
}
function closeOptions() {
  _("#state").innerHTML = "";
  _("#previewsurah").innerHTML = "";
  _("#options").style.display = "none";
}
function closeRecog() {
  _("#voiceresponse").innerHTML = "";
  _("#recognizer").style.display = "none";

  txtrecogn = "";
  _(".onceauto")[0].checked = true;
  StopSpeech();
  closeTrack();
}

function copylink() {
  let state = _("#state").innerHTML;
  let qs = JSON.parse(state);
  navigator.clipboard.writeText(
    "https://iherbs.github.io/quran/#qs" +
    qs["surah"] + "." + qs["ayah"]
  );
  toast("Copied");
  closeOptions();
}

function copytext() {
  let state = _("#state").innerHTML;
  let qs = JSON.parse(state);
  let txt = "";

  if (qs["ayah"] == "doa") {
    txt = qs["name"] + "\n\n" + qs["ayah_text"] + "\n\n" +
      qs["text"];
  } else {
    txt = qs["ayah_text"] + "\n\n" +
      qs["text"] + "\n" + qs["name"];
  }
  navigator.clipboard.writeText(txt);
  toast("Copied");
  closeOptions();
}

let track = _("#track");
let mouseDownOnSlider = false;
let seekbar = _("#seekbar");
seekbar.addEventListener("change", () => {
  const pct = seekbar.value / 100;
  track.currentTime = (track.duration || 0) * pct;
});
seekbar.addEventListener("mousedown", () => {
  mouseDownOnSlider = true;
  track.pause();
});
seekbar.addEventListener("touchstart", () => {
  mouseDownOnSlider = true;
  track.pause();
});

seekbar.addEventListener("mouseup", () => {
  mouseDownOnSlider = false;
  track.play();
  _("#btnplayaudio").classList.remove("play-button");
  _("#btnplayaudio").classList.add("pause-button");
});
seekbar.addEventListener("touchend", () => {
  mouseDownOnSlider = false;
  track.play();
  _("#btnplayaudio").classList.remove("play-button");
  _("#btnplayaudio").classList.add("pause-button");
});

seekbar.oninput = function () {
  setslider();
};

function setslider() {
  var value = (seekbar.value - seekbar.min) / (seekbar.max - seekbar.min) * 100;
  seekbar.style.background = 'linear-gradient(to right, var(--color-mint) 0%, var(--color-mint) ' + value + '%, #ddd ' + value + '%, #ddd 100%)';
}

let timrsc = setTimeout(() => { }, 100);
let timrpl = setTimeout(() => { }, 100);
function audioPlay(id = "", recog = false) {
  let sound = _("#track" + id).innerHTML;
  // track.setAttribute("controls", "true");
  _("#player").style.display = "block";
  _("#notrack").innerHTML = id;

  for (m in _(".tracks")) {
    if (!isNaN(m)) {
      _(".btnaudio")[m].classList.remove("pause-button");
      _(".btnaudio")[m].classList.add("play-button");
    }
  }

  if (track.paused || track.src != sound) {
    track.src = sound;
    track.playbackRate = trackrate;
    if (!recog) {
      track.play();
      _("#btnplayaudio").classList.remove("play-button");
      _("#btnplayaudio").classList.add("pause-button");
      if (_("#bplps" + id) != null) {
        _("#bplps" + id).classList.remove("play-button");
        _("#bplps" + id).classList.add("pause-button");
      }
    }
  } else {
    track.pause();
    track.currentTime = 0;
    if (_("#bplps" + id) != null) {
      _("#bplps" + id).classList.remove("pause-button");
      _("#bplps" + id).classList.add("play-button");
    }
    _("#btnplayaudio").classList.remove("pause-button");
    _("#btnplayaudio").classList.add("play-button");
  }

  track.onplaying = function () {
    if (_("#bplps" + id) != null) {
      _("#bplps" + id).classList.remove("play-button");
      _("#bplps" + id).classList.add("pause-button");
      _("#btnplayaudio").classList.remove("play-button");
      _("#btnplayaudio").classList.add("pause-button");
    }
  };
  track.onpause = function () {
    if (_("#bplps" + id) != null) {
      _("#bplps" + id).classList.remove("pause-button");
      _("#bplps" + id).classList.add("play-button");
      _("#btnplayaudio").classList.remove("pause-button");
      _("#btnplayaudio").classList.add("play-button");
    }
  };

  track.onloadeddata = function () {
    _("#seekbar").value = 0;
    _("#currenttime").textContent = fmtTime(track.currentTime);
    _("#duration").textContent = fmtTime(track.duration);
    setslider();
  };

  track.ontimeupdate = function () {
    if (!mouseDownOnSlider) {
      _("#seekbar").value = (track.currentTime / track.duration * 100) || 0;
      _("#currenttime").textContent = fmtTime(track.currentTime);
      _("#duration").textContent = fmtTime(track.duration);
      setslider();
    }
  };

  track.ondurationchange = function () {
    _("#seekbar").value = 0;
    setslider();
  };

  track.onended = function () {
    if (!mouseDownOnSlider) {
      track.currentTime = 0;
      _("#seekbar").value = 0;
      _("#btnplayaudio").classList.remove("pause-button");
      _("#btnplayaudio").classList.add("play-button");
      setslider();
      // track.src = "";
      // track.removeAttribute("controls");
      if (_("#bplps" + id) != null) {
        _("#bplps" + id).classList.remove("pause-button");
        _("#bplps" + id).classList.add("play-button");
      }
      if (trackmode == 'A' || trackmode == 'O') {
        id = parseInt(id) + 1;
        if (id <= surah_data.length) {
          timrsc = setTimeout(() => {
            gotoayah(id, true);
          }, 1000);
          timrpl = setTimeout(() => {
            audioPlay(id);
          }, 2000);
        } else {
          id = surah_data.length;
          if (trackmode == 'O') {
            nextsurah();
            id = surah == 1 ? 1 : 0;
            timrpl = setTimeout(() => {
              audioPlay(id);
            }, 2000);
          }
        }
      }
    }
  };
}

function playaudio() {
  if (track.paused) {
    track.play();
    _("#btnplayaudio").classList.remove("play-button");
    _("#btnplayaudio").classList.add("pause-button");
  } else {
    track.pause();
    _("#btnplayaudio").classList.remove("pause-button");
    _("#btnplayaudio").classList.add("play-button");
  }
}
function playprev() {
  let notrack = parseInt(_("#notrack").innerHTML) - 1;
  if (notrack > 0) {
    audioPlay(notrack);
    gotoayah(notrack, true);
  }
}
function playnext() {
  let notrack = parseInt(_("#notrack").innerHTML) + 1;
  if (notrack <= surah_data.length) {
    audioPlay(notrack);
    gotoayah(notrack, true);
  }
}

function audiorate(rate = 1) {
  track.playbackRate = rate;
  trackrate = rate;
}

function onceauto(param = 'A') {
  trackmode = param;
}

function closeTrack() {
  clearTimeout(timrsc);
  clearTimeout(timrpl);
  track.pause();
  track.currentTime = 0;
  track.src = "";
  track.removeAttribute("controls");
  _("#seekbar").value = 0;
  _("#player").style.display = "none";
  _("#btnplayaudio").classList.remove("pause-button");
  _("#btnplayaudio").classList.add("play-button");
  for (m in _(".tracks")) {
    if (!isNaN(m)) {
      _(".btnaudio")[m].classList.remove("pause-button");
      _(".btnaudio")[m].classList.add("play-button");
    }
  }
}

const fmtTime = s => {
  const d = new Date(0);
  if (s > 0) {
    d.setSeconds(s % 60);
    d.setMinutes(s / 60);
  }
  return d.toISOString().slice(14, 19);
};
//==============================================================================

function addfrmBookmark() {
  _("#ttladdbook").innerHTML = "Tambah Bookmark";
  _("#grupbookmark").value = "";
  _("#addfrmbook").style.display = "none";
  _("#bookmarkfolder").style.display = "none";
  _("#terakhirbaca").style.display = "none";
  _("#bookmarkadd").style.display = "block";
}

function bataladdBookmark() {
  _("#ttladdbook").innerHTML = "Bookmark";
  _("#grupbookmark").value = "";
  _("#addfrmbook").style.display = "inline-block";
  _("#bookmarkfolder").style.display = "block";
  _("#terakhirbaca").style.display = "block";
  _("#bookmarkadd").style.display = "none";
  _("#grupbookmark").value = "";
}

function addmdlBookmark(mark = "") {
  markno = mark;
  _("#ttladdbook").innerHTML = "Bookmark";
  _("#grupbookmark").value = "";
  _("#bookmarkpage").modal("show");
  _("#addfrmbook").style.display = "inline-block";
  _("#bookmarkfolder").style.display = "block";
  _("#terakhirbaca").style.display = "block";
  _("#bookmarkadd").style.display = "none";
  _("#nomark").value = mark;
  let book = JSON.parse(localStorage.getItem("bookmark"));

  _(
    "#terakhirbaca"
  ).innerHTML = `<div class="listbooktitle nmayah" style="text-align:center;cursor:pointer;" onclick="setterakhirbaca('${mark}')">Tandai Terakhir Baca</div>`;

  if (book.length == 0) {
    _("#bookmarkfolder").innerHTML = "";
    // '<div style="text-align:center;color:var(--color-text);">Belum ada bookmark</div>';
  } else {
    let listbook = "";
    for (b in book) {
      listbook += `<div class="listbook" onclick="addBookmark('${book[b]}','${markno}')" style="padding:10px 10px 5px 10px;">
                    <div class="bookmark" style="display:inline-block;position:relative;width:16px;"></div>
                    <span class="nmayah" style="position:relative;display:inline-block;top:-6px;">${book[b]}</span>
                </div>`;
    }
    _("#bookmarkfolder").innerHTML = listbook;
  }
}

function setterakhirbaca(mark) {
  localStorage.setItem("terakhirbaca", mark);
  _("#bookmarkpage").modal("hide");
}

function newBookmark() {
  let ttladdbook = _("#ttladdbook").innerHTML;
  let name = _("#grupbookmark").value;
  let book = JSON.parse(localStorage.getItem("bookmark"));
  if (ttladdbook.includes("Rename Bookmark")) {
    let bmid = _("#bookmarkid").innerHTML;
    let bookidold = book[bmid];
    let bookold = localStorage.getItem(bookidold);

    book[bmid] = name;
    localStorage.setItem("bookmark", JSON.stringify(book));

    localStorage.setItem(name, bookold);
    localStorage.removeItem(bookidold);
    bataladdBookmark();
    dataBookmark();
  } else {
    if (localStorage.getItem(name) == null) {
      book.unshift(name);
      localStorage.setItem("bookmark", JSON.stringify(book));
      if (markno != "") {
        localStorage.setItem(name, '["' + markno + '"]');
        markno = "";
        _("#bookmarkpage").modal("hide");
      } else {
        localStorage.setItem(name, "[]");
        bataladdBookmark();
        dataBookmark();
      }
    } else {
      // bookmark sudah ada
      if (markno != "") {
        addmdlBookmark(markno);
      } else {
        bataladdBookmark();
        dataBookmark();
      }
    }
  }
  _("#grupbookmark").value = "";
}

function addBookmark(book = "", mark = "") {
  // console.log(book, mark);
  if (book != "" && mark != "") {
    let b = JSON.parse(localStorage.getItem(book));
    if (!b.includes(mark)) {
      b.unshift(mark);
      localStorage.setItem(book, JSON.stringify(b));
    }
  }
  _("#bookmarkpage").modal("hide");
  setterakhirbaca(mark);
}

function dataBookmark() {
  _("#ttladdbook").innerHTML = "Bookmark";
  _("#addfrmbook").style.display = "inline-block";
  _("#bookmarkfolder").style.display = "block";
  _("#terakhirbaca").style.display = "block";
  _("#bookmarkadd").style.display = "none";
  _("#bookmarkpage").modal("show");

  let trbaca = localStorage.getItem("terakhirbaca");
  _(
    "#terakhirbaca"
  ).innerHTML = `<div class="listbooktitle nmayah" style="text-align:center;cursor:pointer;" onclick="gotoBookmark('${trbaca}')">Terakhir Baca</div>`;

  let listbook = "";
  let book = JSON.parse(localStorage.getItem("bookmark"));
  for (g in book) {
    listbook += `<div style="margin-bottom:15px;">
            <div class="listbooktitle">
                <div class="bookmark" style="display:inline-block;position:relative;width:16px;"></div>
                <span class="nmayah" style="position:relative;display:inline-block;top:-6px;cursor:pointer;" onclick="renameBookmark(${g})">${book[g]}</span>
                <div class="delbook" style="float:right;" onclick="confdelBookmark('${book[g]}')">&times;</div>
            </div>`;
    let mark = JSON.parse(localStorage.getItem(book[g]));
    for (b in mark) {
      let bm = mark[b].split("_");
      listbook += `<div class="listbook" id="blist${mark[b]
        }" style="margin-left:25px;padding-bottom:2px;">
        <div class="delbook" style="float:right;" onclick="confdelBookmark('${book[g]
        }','${mark[b]}')">&times;</div>
        <div class="arabic" style="float:right;font-size:20px;">${surah_list[bm[0]]["text"]
        }</div>
        <div onclick="gotoBookmark('${mark[b]
        }')" style="width:100%;height:100%;">
            <span class="nmayah" style="display:block;">
                ${bm[0] + ") " + surah_list[bm[0]]["name"]}
            </span><small style="position:relative;top:-6px;">Ayat ${bm[1]
        }</small>
        </div>
    </div>`;
    }
    listbook += `</div>`;
  }

  _("#bookmarkfolder").innerHTML =
    listbook == ""
      ? '<div style="width:100%;text-align:center;padding:20px;margin-top:20px;color:var(--color-title-text);">&bull; &bull; &bull; &bull;</div>'
      : listbook;
}

function gotoBookmark(mark = "") {
  let m = mark.split("_");
  if (m.length == 2) {
    _("#bookmarkpage").modal("hide");
    getsurah(m[0], m[1]);
  }
}

function confdelBookmark(book = "", mark = "") {
  _("#confirmbox").modal("show");
  // console.log(mark);
  let bm = "",
    notif = "";
  if (mark != "") {
    bm = mark.split("_");
    notif = `bookmark <b>${book}, ${surah_list[bm[0]]["name"]
      }</b>, Ayat ${bm[1]}?`;
  } else {
    notif = `<b>${book}</b>?<br><small>(Menghapus nama bookmark akan menghapus seluruh daftar pada bookmark tersebut.)</small>`;
  }
  _("#confirmcontent").innerHTML = `<h3>Hapus Bookmark</h3><br>
        Yakin hapus bookmark ${notif}
        <br>
        <div style="margin-top:10px;">
            <button type="button" class="btn btn-theme" onclick="delBookmark('${book}','${mark}')">Hapus</button>
            <button type="button" class="btn btn-secondary" onclick="_('#confirmbox').modal('hide');">Batal</button>
        </div>`;
}

function delBookmark(book = "", mark = "") {
  if (book != "") {
    if (mark != "") {
      let b = JSON.parse(localStorage.getItem(book));
      var index = b.indexOf(mark);
      if (index >= 0) {
        b.splice(index, 1);
      }
      localStorage.setItem(book, JSON.stringify(b));
    } else {
      localStorage.removeItem(book);
      let b = JSON.parse(localStorage.getItem("bookmark"));
      var index = b.indexOf(book);
      if (index >= 0) {
        b.splice(index, 1);
      }
      localStorage.setItem("bookmark", JSON.stringify(b));
    }
    dataBookmark();
  }
  _("#confirmbox").modal("hide");
}


function renameBookmark(idx = 0) {
  let book = JSON.parse(localStorage.getItem("bookmark"));
  _("#ttladdbook").innerHTML = 'Rename Bookmark<div style="display:none;" id="bookmarkid">' + idx + '</div>';
  _("#grupbookmark").value = book[idx];
  _("#addfrmbook").style.display = "none";
  _("#bookmarkfolder").style.display = "none";
  _("#terakhirbaca").style.display = "none";
  _("#bookmarkadd").style.display = "block";
}

//==============================================================================

_("#scrolltop").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

_("#cari").addEventListener("keyup", () => {
  let key = _("#cari").value;
  if (key != "") {
    _("#clearsrc").style.display = "block";
  } else {
    _("#clearsrc").style.display = "none";
  }

  makeqlist(key);
  if (key.length > 2) {
    cari(key);
  }
});

_("#clearsrc").addEventListener("click", () => {
  _("#cari").value = "";
  _("#wload").innerHTML = "";
  _("#clearsrc").style.display = "none";
  xmlhttp.abort();
  makeqlist();
});

window.addEventListener("scroll", function () {
  // console.log(window.document.documentElement.scrollTop);
  if (window.document.documentElement.scrollTop > 100) {
    _("#scrolltop").style.display = "block";
  } else {
    _("#scrolltop").style.display = "none";
  }
});

window.onhashchange = function () {
  // console.log(window.location.hash);
  // history.replaceState(null, null, ' '); // remove hash
  closeTrack();
  closeOptions();
  imagemaker_hide();
  let pg = window.location.hash;
  if (pg == "") {
    history.replaceState(null, null, " ");
    surah = 0;
    markno = "";
    surah_data = [];
    _("#home").style.display = "block";
    _("#surah").style.display = "none";
    _("#surah").innerHTML = "";
    _("#tsurah").innerHTML = "";
    _("#wrapmenu").style.display = "none";
    _("#gotoayah").innerHTML = "";
    bataladdBookmark();

    document.getElementsByTagName("body")[0].style.overflow = null;
    for (m in _(".modal")) {
      if (!isNaN(m)) {
        _(".modal")[m].style.display = "none";
      }
    }
  }
};

window.onclick = function (event) {
  // Close the dropdown if the user clicks outside of it
  // console.log(event.target);
  if (!event.target.matches('.dropbtn') && !event.target.matches('.horizontal-dots') && !event.target.matches('.contentmark') && !event.target.matches('.radiospeed') && !event.target.matches('.checkmark') && !event.target.matches('.dropitem') && !event.target.matches('.onceauto') && !event.target.matches('.checklbl') && !event.target.matches('.markoa')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      dropdowns[i].style.display = "none";
    }
  }
  if (!isAwake) {
    isAwake = true;
    awakeEnable();
  }
};

if (localStorage.getItem("theme") == null) {
  localStorage.setItem("theme", "auto");
}
if (localStorage.getItem("transliteration") == null) {
  localStorage.setItem("transliteration", "true");
}
if (localStorage.getItem("translate") == null) {
  localStorage.setItem("translate", "true");
}
if (localStorage.getItem("tajweed") == null) {
  localStorage.setItem("tajweed", "true");
}
if (localStorage.getItem("terakhirbaca") == null) {
  localStorage.setItem("terakhirbaca", "1_1");
}
if (localStorage.getItem("bookmark") == null) {
  localStorage.setItem("bookmark", "[]");
}
if (localStorage.getItem("zoomlevel") == null) {
  localStorage.setItem("zoomlevel", 100);
}

let theme = localStorage.getItem("theme");
if (theme == "auto") {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.getElementsByTagName("body")[0].setAttribute("data-theme", "dark");
    document.querySelector("meta[name=theme-color]").setAttribute("content", "#1f2125");
    _("#btntheme").checked = true;
  } else {
    document.getElementsByTagName("body")[0].setAttribute("data-theme", "light");
    document.querySelector("meta[name=theme-color]").setAttribute("content", "#007070");
    _("#btntheme").checked = false;
  }
} else {
  document.getElementsByTagName("body")[0].setAttribute("data-theme", theme);
  if (theme == "dark") {
    document.querySelector("meta[name=theme-color]").setAttribute("content", "#1f2125");
    _("#btntheme").checked = true;
  } else {
    document.querySelector("meta[name=theme-color]").setAttribute("content", "#007070");
  }
}

if (localStorage.getItem("transliteration") == "true") {
  _("#btntransliteration").checked = true;
}
if (localStorage.getItem("translate") == "true") {
  _("#btntranslate").checked = true;
}
if (localStorage.getItem("tajweed") == "true") {
  _("#btntajweed").checked = true;
}

let pg = window.location.hash;
if (pg.substring(0, 3) == "#qs") {
  let qs = pg.substring(3, pg.length).split(".");
  getayah(qs[0], qs[1]);
} else if (pg == "#asmaulhusna") {
  getasmaulhusna();
} else if (pg == "#doaharian") {
  doaharian();
} else {
  zoompage(localStorage.getItem("zoomlevel"));
  getqlist();
}

// speech to text ======================================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition, recognizing = false, txtrecogn = "", recogprosen = 0;

function normDiacritic(text = "") {
  let harakat = ["\u0650", "\u0652", "\u0651", "\u064E", "\u0670", "\u064F", "\u06D9", "\u06D7", "\u08D6", "\u06D5", "\u06E4", "\u06DA", "\u06DB", "\u064B", "\u200D", "\u0653", "\u06DE", "\u06D6", "\u06E9", "\u0656", "\u0657", "\u064C", "\u06D8", "\u064D"];

  for (var i = 0; i < harakat.length; i++) {
    text = text.replaceAll(harakat[i], "").replaceAll("\u0629", "\u0647")
      .replaceAll("\u0644\u0648\u0647", "\u0644\u0627\u0647")
      .replaceAll("\u0649\u0655", "\u0626")
      .replaceAll("\u0621\u0627", "\u0627\u0627")
      .replaceAll("\u0641\u0649", "\u0641\u064A")
    // .replaceAll("\u0639\u0646", "\u0627\u0646")
    // .replaceAll("\u0645\u0639", "\u0645\u0627")
    // .replaceAll("\u0639\u0644\u0649", "\u0627\u0644\u0627")
    // .replaceAll("\u0644\u0648", "\u0644\u0627")
    // .replaceAll("\u064A", "\u0649") yak
  }
  return text;
};

function ssrecog() {
  if (recognizing || _("#btnvcmd").innerHTML == '<div class="lds-ripple"></div>') {
    StopSpeech();
    _("#voiceresponse").innerHTML = '<span style="color:var(--color-title-text);">✦</span>';
    _("#btnvcmd").innerHTML = '<div class="voice-button-recog"></div>';
  } else {
    let ayn = parseInt(_("#recayah").innerHTML);
    GetSpeech(ayn);
    _("#btnvcmd").innerHTML = '<div class="lds-ripple"></div>';
  }
}

function vcplayprev() {
  let notrack = parseInt(_("#recayah").innerHTML) - 1;
  if (notrack > 0) {
    gotoayah(notrack, true);
    GetSpeech(notrack);
  }
}
function vcplaynext() {
  let notrack = parseInt(_("#recayah").innerHTML) + 1;
  if (notrack <= surah_data.length) {
    gotoayah(notrack, true);
    GetSpeech(notrack);
  }
}

function StartSpeech() {
  if (!recognizing) {
    try {
      recognition.start();
    } catch (err) {
      setTimeout(() => {
        recognition.start();
      }, 1000);
    }
    recognizing = true;
  }
}

function StopSpeech() {
  recognition.stop();
  recognizing = false;
}

const GetSpeech = (ayat = 0) => {
  closeOptions();
  trackmode = '1';
  _(".onceauto")[2].checked = true;

  audioPlay(ayat, true);

  _("#recognizer").style.display = "block";
  _("#recayah").innerHTML = ayat;
  _("#voiceresponse").innerHTML = '<div class="dotwave"></div>';

  txtrecogn = "";
  let final_transcript = "";
  if (recognizing) {
    StopSpeech();
  }

  console.log("clicked microphone");

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'ar-AE';//'id-ID';//'ar-SA'

  recognition.onstart = () => {
    console.log("starting listening, speak in microphone");
    _("#btnvcmd").innerHTML = '<div class="lds-ripple"></div>';
  }
  recognition.onspeechend = () => {
    console.log("stopped listening");

    _("#btnvcmd").innerHTML = '<div class="voice-button-recog"></div>';
    StopSpeech();


    setTimeout(() => {
      if (recogprosen == 100) {
        StopSpeech();
      } else {
        StartSpeech();
      }
    }, 450);
  }
  recognition.onresult = (res) => {
    for (var t = "",
      n = res.resultIndex; n < res.results.length; ++n) {
      if (res.results[n].isFinal) {
        final_transcript += res.results[n][0].transcript;
      } else {
        t += res.results[n][0].transcript;
      }
    }

    if (recognition.continuous && recognition.interimResults) {
      txtrecogn = final_transcript + t;
    } else {
      txtrecogn = final_transcript;
    }

    console.log(txtrecogn);
    if (recognizing) {
      diffme(ayat);
    }

    // ================
    const current = res.resultIndex;
    let transcript = res.results[current][0].transcript;
    let mobileRepeatBug = (current == 1 && transcript == res.results[0][0].transcript);

    if (!mobileRepeatBug) {
      if (transcript === 'next' || transcript === ' next') {
        this.incrementStep();
        res.results = {};
      }

      if (transcript === 'back' || transcript === ' back') {
        this.decrementStep();
        res.results = {};
      }
    }
    setTimeout(() => {
      StartSpeech();
    }, 450);
  }

  setTimeout(() => {
    StartSpeech();
  }, 200);
}



function cleartxt(e) {
  var t = e.replace(/[.,!?;":\(\)]/g, " "),
    t = t.replace(/\s{2,}/g, " "),
    t = t.trim();
  return t
}

function diffme(ayat = 0) {
  let tr = cleartxt(txtrecogn);
  e = tr.split(" ");

  let o = cleartxt(normDiacritic(surah_data[ayat - 1]['text_ayah']));
  t = o.split(" ");

  var a = document.getElementById("voiceresponse"),
    r, i,
    idskip = [],
    c = "",
    s = e.length,
    d = t.length,
    u = 0,
    l = 0,
    g = !1;
  for (r = 0; d > r; r++) {
    g = !1;
    for (i = 0; s > i; i++) {
      if (e[i] !== undefined) {
        // remove double
        newe = "";
        for (w = 0; t[r].length > w; w++) {
          if (e[i][w] != undefined) {
            if (e[i][w].toLowerCase() == t[r][w].toLowerCase()) {
              newe += t[r][w].toLowerCase();
            } else {
              e[i] = e[i].substr(0, w - 1) + e[i].substr(w, e[i].length - 1);
              w--;
            }
          }
        }

        if (newe.toLowerCase() == t[r].toLowerCase()) {
          g = !0;
          l++;
          break;
        }
      }
    }
    if (e[r] !== undefined) {
      if (g) {
        c += '<span style="color:var(--color-title-text);">' + t[r] + '</span> ';
      } else {
        c += '<span style="color:#f1a;">' + e[s - 1] + '</span> ';
      }
    }
  }

  recogprosen = Math.round(100 * l / d);
  if (recogprosen == 100) {
    StopSpeech();
    ayat = parseInt(ayat) + 1;
    if (ayat <= surah_data.length) {
      setTimeout(() => {
        GetSpeech(ayat);
        gotoayah(ayat, true);
      }, 2000);
    }
  }

  // a.innerHTML = o + "<br><br>" + c + "<br><br>Percent of recognized words - " + prosen + "%"
  a.innerHTML = c.replaceAll('<span style="color:#f1a;"></span>', '').trim() == '' ? '<div class="dotwave"></div>' : c;
}


// ======================================================
window.onload = function () {
  recognition = new SpeechRecognition();
}